"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import axios from "axios";
// Define the UserPreferences type
interface UserPreferences {
    age_group: string;
    primary_condition: string;
    communication_style: string;
    literal_understanding: boolean;
    learning_style: string;
    attention_span: string;
    primary_support: string;
    interaction_pace: string;
    encouragement_style: string;
    correction_style: string;
    response_length: string;
    sensory_sensitivities: string[];
    sensory_seeking: string[];
    executive_challenges: string[];
    effective_strategies: string[];
    regulation_tools: string[];
    additional_notes: string;
}

export default function PreferencesForm() {
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<UserPreferences>({
        age_group: "",
        primary_condition: "",
        communication_style: "direct",
        literal_understanding: false,
        learning_style: "visual",
        attention_span: "medium",
        primary_support: "social_skills",
        interaction_pace: "normal",
        encouragement_style: "gentle",
        correction_style: "gentle",
        response_length: "balanced",
        sensory_sensitivities: [],
        sensory_seeking: [],
        executive_challenges: [],
        effective_strategies: [],
        regulation_tools: [],
        additional_notes: "",
    });

    const steps = [
        { title: "Core Identity", description: "Tell us about yourself." },
        { title: "Style", description: "Choose your preferred communication style." },
        { title: "Learning", description: "Select your learning style and support needs." },
        { title: "Interaction", description: "Set your interaction preferences." },
        { title: "Sensory", description: "Optional sensory information." },
    ];

    const handleChange = (field: keyof UserPreferences, value: any) =>
        setFormData((prev) => ({ ...prev, [field]: value }));

    const handleMultiSelectChange = (
        field: keyof UserPreferences,
        value: string,
        checked: boolean
    ) =>
        setFormData((prev) => {
        const currentValues = (prev[field] as string[]) || [];
        return {
            ...prev,
            [field]: checked
            ? [...currentValues, value]
            : currentValues.filter((v) => v !== value),
        };
});

    const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
    const prevStep = () => setStep((s) => Math.max(s - 1, 0));


const handleSubmit = async () => {
    try {
        // Make sure all multi-select values match backend literals
        const payload = {
        ...formData,
        sensory_sensitivities: formData.sensory_sensitivities.map(s =>
            s === "touch" ? "tactile" : s
        ),
        sensory_seeking: formData.sensory_seeking.map(s =>
            s === "visual" ? "visual_stimulation" : s
        ),
        };

        const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/process-preferences`,
        payload,
        {
            headers: { "Content-Type": "application/json" },
        }
        );

        if (response.data.success) {
        console.log("Submission successful:", response.data);
        router.push(`/chat?submission_id=${response.data.submission_id}`);
        }
    } catch (error: any) {
        if (error.response) {
        console.error("Backend validation errors:", error.response.data.detail);
        } else {
        console.error("Submission failed:", error);
        }
    }
};


    // Step Forms
    const renderStepForm = () => {
        switch (step) {
        case 0:
            return (
            <div className="grid gap-6">
                <div>
                <label className="block text-base font-semibold mb-3 text-gray-800">
                    Age Group <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.age_group}
                    onChange={(e) => handleChange("age_group", e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-800 bg-white"
                >
                    <option value="">Select Age Group</option>
                    <option value="6-8">6-8 years</option>
                    <option value="9-11">9-11 years</option>
                    <option value="12-14">12-14 years</option>
                    <option value="15-17">15-17 years</option>
                    <option value="18-21">18-21 years</option>
                    <option value="22+">22+ years</option>
                </select>
                </div>
                <div>
                <label className="block text-base font-semibold mb-3 text-gray-800">
                    Primary Condition <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.primary_condition}
                    onChange={(e) =>
                    handleChange("primary_condition", e.target.value)
                    }
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-800 bg-white"
                >
                    <option value="">Select Primary Condition</option>
                    <option value="ASD">ASD</option>
                    <option value="ADHD">ADHD</option>
                    <option value="Anxiety">Anxiety Disorder</option>
                    <option value="Learning Disability">Learning Disability</option>
                    <option value="Social Communication Disorder">
                    Social Communication Disorder
                    </option>
                </select>
                </div>
            </div>
            );
        case 1:
        return (
            <div className="grid gap-6">
                <div>
                <label className="block text-base font-semibold mb-3 text-gray-800">
                    Communication Style <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.communication_style}
                    onChange={(e) =>
                    handleChange("communication_style", e.target.value)
                    }
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-800 bg-white"
                >
                    <option value="">Choose Style</option>
                    <option value="direct">Direct and clear</option>
                    <option value="gentle">Gentle and supportive</option>
                    <option value="visual">Visual with examples</option>
                    <option value="structured">Structured and predictable</option>
                </select>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <label className="inline-flex items-center space-x-3 cursor-pointer">
                    <input
                    type="checkbox"
                    checked={formData.literal_understanding}
                    onChange={(e) =>
                        handleChange("literal_understanding", e.target.checked)
                    }
                    className="w-5 h-5 rounded border-2 border-gray-400 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-800 font-medium">Prefer literal language (no sarcasm/metaphors)</span>
                </label>
                </div>
            </div>
            );
        case 2:
            return (
            <div className="grid gap-6">
                <div>
                <label className="block text-base font-semibold mb-3 text-gray-800">
                    Learning Style <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.learning_style}
                    onChange={(e) =>
                    handleChange("learning_style", e.target.value)
                    }
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-800 bg-white"
                >
                    <option value="">Select Learning Style</option>
                    <option value="visual">Visual</option>
                    <option value="auditory">Auditory</option>
                    <option value="kinesthetic">Kinesthetic</option>
                    <option value="multisensory">Multisensory</option>
                </select>
                </div>
                <div>
                <label className="block text-base font-semibold mb-3 text-gray-800">
                    Attention Span <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.attention_span}
                    onChange={(e) =>
                    handleChange("attention_span", e.target.value)
                    }
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-800 bg-white"
                >
                    <option value="">Select Attention Span</option>
                    <option value="short">Short (5-10 min)</option>
                    <option value="medium">Medium (10-20 min)</option>
                    <option value="long">Long (20+ min)</option>
                    <option value="variable">Variable</option>
                </select>
                </div>
                <div>
                <label className="block text-base font-semibold mb-3 text-gray-800">
                    Primary Support Need <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.primary_support}
                    onChange={(e) =>
                    handleChange("primary_support", e.target.value)
                    }
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-800 bg-white"
                >
                    <option value="">Select Primary Support</option>
                    <option value="social_skills">Social Skills</option>
                    <option value="emotional_regulation">Emotional Regulation</option>
                    <option value="executive_functioning">Executive Functioning</option>
                    <option value="academic_support">Academic Support</option>
                </select>
                </div>
            </div>
            );
        case 3:
            return (
            <div className="grid gap-6">
                <div>
                <label className="block text-base font-semibold mb-3 text-gray-800">
                    Interaction Pace <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.interaction_pace}
                    onChange={(e) =>
                    handleChange("interaction_pace", e.target.value)
                    }
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-800 bg-white"
                >
                    <option value="">Select Interaction Pace</option>
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="brisk">Brisk</option>
                </select>
                </div>
                <div>
                <label className="block text-base font-semibold mb-3 text-gray-800">
                    Encouragement Style <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.encouragement_style}
                    onChange={(e) =>
                    handleChange("encouragement_style", e.target.value)
                    }
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-800 bg-white"
                >
                    <option value="">Select Encouragement Style</option>
                    <option value="gentle">Gentle</option>
                    <option value="enthusiastic">Enthusiastic</option>
                </select>
                </div>
                <div>
                <label className="block text-base font-semibold mb-3 text-gray-800">
                    Correction Style <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.correction_style}
                    onChange={(e) =>
                    handleChange("correction_style", e.target.value)
                    }
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-800 bg-white"
                >
                    <option value="">Select Correction Style</option>
                    <option value="gentle">Gentle</option>
                    <option value="direct">Direct</option>
                    <option value="visual">Visual</option>
                </select>
                </div>
                <div>
                <label className="block text-base font-semibold mb-3 text-gray-800">
                    Response Length <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.response_length}
                    onChange={(e) =>
                    handleChange("response_length", e.target.value)
                    }
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-800 bg-white"
                >
                    <option value="">Select Response Length</option>
                    <option value="short">Short</option>
                    <option value="balanced">Balanced</option>
                    <option value="detailed">Detailed</option>
                </select>
                </div>
            </div>
            );
        case 4:
            return (
            <div className="grid gap-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                <label className="block text-base font-semibold mb-3 text-gray-800">
                    Sensory Sensitivities (Optional)
                </label>
                <p className="text-sm text-gray-600 mb-3">Select any sensory sensitivities you have</p>
                <div className="flex flex-wrap gap-4">
                    {[
                    { value: "sounds", label: "Sounds/Loud Noises" },
                    { value: "lights", label: "Bright Lights/Visual Stimulation" },
                    { value: "touch", label: "Touch/Textures" },
                    { value: "smells", label: "Smells" },
                    { value: "tastes", label: "Tastes/Textures in Mouth" }
                    ].map((item) => (
                    <label key={item.value} className="inline-flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={formData.sensory_sensitivities.includes(item.value)}
                        onChange={(e) =>
                            handleMultiSelectChange(
                            "sensory_sensitivities",
                            item.value,
                            e.target.checked
                            )
                        }
                        className="w-5 h-5 rounded border-2 border-gray-400 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-800">{item.label}</span>
                    </label>
                    ))}
                </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                <label className="block text-base font-semibold mb-3 text-gray-800">
                    Sensory Preferences (Optional)
                </label>
                <p className="text-sm text-gray-600 mb-3">Select sensory activities you enjoy or seek</p>
                <div className="flex flex-wrap gap-4">
                    {[
                    { value: "movement", label: "Movement/Rocking" },
                    { value: "pressure", label: "Deep Pressure/Hugs" },
                    { value: "visual", label: "Visual Stimulation/Lights" },
                    { value: "rhythmic", label: "Rhythmic Activities" }
                    ].map((item) => (
                    <label key={item.value} className="inline-flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={formData.sensory_seeking.includes(item.value)}
                        onChange={(e) =>
                            handleMultiSelectChange("sensory_seeking", item.value, e.target.checked)
                        }
                        className="w-5 h-5 rounded border-2 border-gray-400 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-800">{item.label}</span>
                    </label>
                    ))}
                </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                <label className="block text-base font-semibold mb-3 text-gray-800">
                    Executive Challenges (Optional)
                </label>
                <p className="text-sm text-gray-600 mb-3">Areas where you might need extra support</p>
                <div className="flex flex-wrap gap-4">
                    {[
                    { value: "planning", label: "Planning and Organization" },
                    { value: "organization", label: "Staying Organized" },
                    { value: "starting", label: "Starting Tasks" },
                    { value: "time_management", label: "Time Management" }
                    ].map((item) => (
                    <label key={item.value} className="inline-flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={formData.executive_challenges.includes(item.value)}
                        onChange={(e) =>
                            handleMultiSelectChange("executive_challenges", item.value, e.target.checked)
                        }
                        className="w-5 h-5 rounded border-2 border-gray-400 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-800">{item.label}</span>
                    </label>
                    ))}
                </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                <label className="block text-base font-semibold mb-3 text-gray-800">
                    Helpful Strategies (Optional)
                </label>
                <p className="text-sm text-gray-600 mb-3">Strategies that work well for you</p>
                <div className="flex flex-wrap gap-4">
                    {[
                    { value: "visual_supports", label: "Visual Supports/Schedules" },
                    { value: "regular_breaks", label: "Regular Breaks" },
                    { value: "clear_expectations", label: "Clear Expectations" },
                    { value: "limited_choices", label: "Limited Choices" },
                    { value: "first_then", label: "First-Then Approach" },
                    { value: "visual_timers", label: "Visual Timers" },
                    { value: "social_stories", label: "Social Stories" },
                    { value: "positive_reinforcement", label: "Positive Reinforcement" }
                    ].map((item) => (
                    <label key={item.value} className="inline-flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={formData.effective_strategies.includes(item.value)}
                        onChange={(e) =>
                            handleMultiSelectChange("effective_strategies", item.value, e.target.checked)
                        }
                        className="w-5 h-5 rounded border-2 border-gray-400 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-800">{item.label}</span>
                    </label>
                    ))}
                </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                <label className="block text-base font-semibold mb-3 text-gray-800">
                    Calming Strategies (Optional)
                </label>
                <p className="text-sm text-gray-600 mb-3">What helps you feel calm and regulated?</p>
                <div className="flex flex-wrap gap-4">
                    {[
                    { value: "deep_breathing", label: "Deep Breathing" },
                    { value: "movement_breaks", label: "Movement Breaks" },
                    { value: "sensory_tools", label: "Sensory Tools (fidgets)" },
                    { value: "quiet_space", label: "Quiet Space" }
                    ].map((item) => (
                    <label key={item.value} className="inline-flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={formData.regulation_tools.includes(item.value)}
                        onChange={(e) =>
                            handleMultiSelectChange("regulation_tools", item.value, e.target.checked)
                        }
                        className="w-5 h-5 rounded border-2 border-gray-400 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-800">{item.label}</span>
                    </label>
                    ))}
                </div>
                </div>

                <div>
                <label className="block text-base font-semibold mb-3 text-gray-800">
                    Additional Information (Optional)
                </label>
                <textarea
                    value={formData.additional_notes}
                    onChange={(e) =>
                    handleChange("additional_notes", e.target.value)
                    }
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-800 bg-white"
                    rows={4}
                    placeholder="Any other information that might help customize your experience"
                />
                </div>
            </div>
            );
        default:
            return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-gray-300 px-6 py-5 flex items-center justify-between sticky top-0 z-10">
            <h1 className="text-2xl font-bold text-gray-900">
            Set Your Preferences
            </h1>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-base font-medium">
            Step {step + 1} of {steps.length}
            </div>
        </header>

        {/* Progress Bar */}
        <div className="w-full bg-white shadow-sm z-20 border-b border-gray-200">
            <div className="flex items-center justify-between max-w-6xl mx-auto px-4 sm:px-6 py-4">
            {steps.map((stepInfo, index) => (
                <div key={index} className="flex-1 flex flex-col items-center relative">
                <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 shadow-sm ${
                    index <= step
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-400 text-gray-500 bg-white"
                    }`}
                >
                    {index < step ? <CheckCircle className="w-5 h-5" /> : index + 1}
                </div>
                <span className={`text-sm font-semibold mt-2 text-center ${index <= step ? "text-blue-700" : "text-gray-600"}`}>
                    {stepInfo.title}
                </span>
                <span className="text-xs text-gray-500 mt-1 text-center hidden sm:block">
                    {stepInfo.description}
                </span>
                </div>
            ))}
            </div>
        </div>

        {/* Step Form */}
        <div className="px-6 py-8 flex-1">
            <div className="w-full max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                {steps[step].title}
            </h2>
            {renderStepForm()}
            </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between max-w-3xl mx-auto px-6 pb-8 mt-4">
            {step > 0 && (
            <button
                onClick={prevStep}
                className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl font-medium text-gray-800 transition-colors"
            >
                Back
            </button>
            )}
            {step < steps.length - 1 ? (
            <button
                onClick={nextStep}
                className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
                Next
            </button>
            ) : (
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="ml-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-70"
            >
                {isLoading ? "Saving..." : "Submit Preferences"}
            </button>
            )}
        </div>
        </div>
    );
}