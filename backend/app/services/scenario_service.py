import json
import numpy as np
from typing import List, Optional
from pathlib import Path
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import pickle

from ..models.scenario import Scenario, ScenarioDatabase
from ..models.preferences import UserPreferences


class ScenarioService:
    def __init__(self, scenarios_file: str = "scenarios.json"):
        # File paths
        self.scenarios_file = Path(__file__).parent.parent / scenarios_file
        self.embeddings_file = Path(__file__).parent.parent / "scenario_embeddings.pkl"

        # Load embedding model
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

        # Load scenarios
        self.scenarios = self._load_scenarios()

        # Load or create embeddings
        self.scenario_embeddings = self._load_or_create_embeddings()

    # ------------------- Loading Scenarios ------------------- #
    def _load_scenarios(self) -> List[Scenario]:
        """Load scenarios from JSON file"""
        try:
            if not self.scenarios_file.exists():
                raise FileNotFoundError(f"Scenario file not found: {self.scenarios_file}")

            with open(self.scenarios_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            scenario_db = ScenarioDatabase(**data)
            return scenario_db.scenarios

        except Exception as e:
            print(f"[ScenarioService] Error loading scenarios: {str(e)}")
            return []

    # ------------------- Embeddings ------------------- #
    def _load_or_create_embeddings(self) -> np.ndarray:
        """Load existing embeddings or create new ones"""
        try:
            if self.embeddings_file.exists():
                with open(self.embeddings_file, 'rb') as f:
                    embeddings = pickle.load(f)
                    if len(embeddings) == len(self.scenarios):
                        return embeddings
        except Exception as e:
            print(f"[ScenarioService] Warning: Could not load embeddings: {str(e)}")

        return self._create_embeddings()

    def _create_embeddings(self) -> np.ndarray:
        """Generate embeddings for all scenarios"""
        if not self.scenarios:
            return np.array([])

        scenario_texts = []
        for scenario in self.scenarios:
            scenario_texts.append(
                f"Title: {scenario.title}\n"
                f"Description: {scenario.description}\n"
                f"Content: {scenario.content}\n"
                f"Type: {scenario.scenario_type}\n"
                f"Strategies: {', '.join(scenario.suggested_strategies)}\n"
                f"Conditions: {', '.join(scenario.primary_conditions)}"
            )

        embeddings = self.model.encode(scenario_texts, convert_to_numpy=True)

        # Save embeddings
        try:
            with open(self.embeddings_file, 'wb') as f:
                pickle.dump(embeddings, f)
        except Exception as e:
            print(f"[ScenarioService] Warning: Could not save embeddings: {str(e)}")

        return embeddings

    # ------------------- Filtering ------------------- #
    def _apply_preference_filters(self, scenario: Scenario, user_prefs: UserPreferences) -> bool:
        """Hard filters to reject unsuitable scenarios"""
        # Primary condition match
        if user_prefs.primary_condition not in scenario.primary_conditions:
            return False

        # Age group match
        if user_prefs.age_group not in scenario.target_age_groups:
            return False

        # Sensory triggers
        if user_prefs.sensory_sensitivities:
            if any(sens in scenario.sensory_considerations for sens in user_prefs.sensory_sensitivities):
                return False

        # Attention span
        if not self._check_attention_compatibility(scenario.attention_span, user_prefs.attention_span):
            return False

        return True

    def _check_attention_compatibility(self, scenario_span: str, user_span: str) -> bool:
        """Map attention spans to numeric levels for comparison"""
        levels = {"short": 1, "medium": 2, "long": 3, "variable": 2}
        return levels.get(scenario_span, 2) <= levels.get(user_span, 2)

    # ------------------- Semantic Search ------------------- #
    def find_matching_scenarios(self, user_prefs: UserPreferences, query: Optional[str] = None, max_results: int = 5) -> List[Scenario]:
        """Return top scenarios based on semantic similarity + preference filters"""
        if not self.scenarios or len(self.scenario_embeddings) == 0:
            return []

        if query is None:
            query = f"scenarios for {user_prefs.primary_support} and {user_prefs.primary_condition}"

        # Encode query
        query_embedding = self.model.encode([query], convert_to_numpy=True)
        similarity_scores = cosine_similarity(query_embedding, self.scenario_embeddings)[0]

        scored_scenarios = []
        for score, scenario in zip(similarity_scores, self.scenarios):
            if self._apply_preference_filters(scenario, user_prefs):
                bonus = self._calculate_preference_bonus(scenario, user_prefs)
                scored_scenarios.append((score + bonus, scenario))

        # Sort and pick top
        scored_scenarios.sort(key=lambda x: x[0], reverse=True)
        return [s for _, s in scored_scenarios[:max_results]]

    def _calculate_preference_bonus(self, scenario: Scenario, user_prefs: UserPreferences) -> float:
        """Soft bonuses for matching preferences"""
        bonus = 0.0

        # Communication style
        if user_prefs.communication_style in scenario.communication_style:
            bonus += 0.2

        # Effective strategies
        if user_prefs.effective_strategies:
            if any(strategy in scenario.suggested_strategies for strategy in user_prefs.effective_strategies):
                bonus += 0.15

        # Regulation tools
        if user_prefs.regulation_tools:
            if any(tool in scenario.suggested_strategies for tool in user_prefs.regulation_tools):
                bonus += 0.1

        return bonus

    # ------------------- Access ------------------- #
    def get_scenario_by_id(self, scenario_id: str) -> Optional[Scenario]:
        for scenario in self.scenarios:
            if scenario.id == scenario_id:
                return scenario
        return None

    def get_all_scenarios(self) -> List[Scenario]:
        return self.scenarios
