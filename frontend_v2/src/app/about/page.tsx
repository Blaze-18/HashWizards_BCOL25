"use client";
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Sentio</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            An AI-powered support platform designed to assist neurotypical children in developing emotional intelligence, social skills, and academic resilience.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Mission Statement */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Sentio represents an innovative approach to child development support, leveraging artificial intelligence 
                to provide personalized guidance for neurotypical children facing common developmental challenges. Our 
                platform addresses the growing need for accessible, individualized support systems that can complement 
                traditional educational and therapeutic approaches.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We recognize that each child's developmental journey is unique, requiring tailored interventions that 
                respect individual learning styles, emotional needs, and social contexts. Through evidence-based AI 
                interactions, we aim to foster resilience, self-awareness, and adaptive coping strategies in children 
                aged 6-16 years.
              </p>
            </section>

            {/* Research Foundation */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Theoretical Framework</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our approach is grounded in several key developmental theories and research paradigms:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li><strong>Social Cognitive Theory:</strong> Emphasizing the role of observational learning and self-efficacy in child development</li>
                <li><strong>Emotional Intelligence Framework:</strong> Building competencies in emotional awareness, regulation, and social skills</li>
                <li><strong>Positive Psychology Principles:</strong> Focusing on strengths-based interventions and resilience building</li>
                <li><strong>Cognitive-Behavioral Approaches:</strong> Helping children understand the connection between thoughts, feelings, and behaviors</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                These theoretical foundations inform our AI's conversational strategies, ensuring that interactions are 
                not merely responsive but therapeutically informed and developmentally appropriate.
              </p>
            </section>

            {/* Goals and Objectives */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Primary Objectives</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Emotional Development</h3>
                  <p className="text-gray-700 text-sm">
                    Enhance emotional literacy through guided reflection, helping children identify, understand, 
                    and appropriately express their emotions in various contexts.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Social Competence</h3>
                  <p className="text-gray-700 text-sm">
                    Develop interpersonal skills, empathy, and perspective-taking abilities through scenario-based 
                    learning and social problem-solving exercises.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Resilience</h3>
                  <p className="text-gray-700 text-sm">
                    Foster growth mindset, study strategies, and stress management techniques to support academic 
                    achievement and reduce performance anxiety.
                  </p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Self-Advocacy Skills</h3>
                  <p className="text-gray-700 text-sm">
                    Empower children to articulate their needs, seek appropriate help, and develop independence 
                    in problem-solving and decision-making.
                  </p>
                </div>
              </div>
            </section>

            {/* Methodology */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Methodological Approach</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Sentio employs a multi-modal intervention strategy that combines conversational AI with structured 
                learning scenarios. Our methodology incorporates:
              </p>
              <ol className="list-decimal pl-6 space-y-3 text-gray-700 mb-4">
                <li>
                  <strong>Personalized Assessment:</strong> Initial preference mapping to understand individual 
                  learning styles, interests, and developmental needs
                </li>
                <li>
                  <strong>Adaptive Dialogue Systems:</strong> AI-driven conversations that adjust complexity, 
                  tone, and content based on child's responses and progress
                </li>
                <li>
                  <strong>Scenario-Based Learning:</strong> Interactive situations that allow children to practice 
                  skills in safe, controlled environments
                </li>
                <li>
                  <strong>Progress Tracking:</strong> Continuous assessment of developmental gains and areas 
                  requiring additional support
                </li>
              </ol>
            </section>

            {/* Ethical Considerations */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ethical Framework</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Working with children requires the highest standards of ethical practice. Our platform adheres to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Strict data privacy and protection protocols for minor users</li>
                <li>Transparent AI decision-making processes appropriate for child comprehension</li>
                <li>Collaboration with parents, educators, and mental health professionals</li>
                <li>Regular assessment of AI interactions for appropriateness and effectiveness</li>
                <li>Clear boundaries between AI support and professional therapeutic intervention</li>
              </ul>
            </section>

            {/* Future Directions */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Future Developments</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our research and development roadmap includes several key areas of expansion:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Integration with educational curricula and school-based support systems</li>
                <li>Development of parent and educator dashboards for collaborative support</li>
                <li>Expansion of cultural and linguistic diversity in AI interactions</li>
                <li>Implementation of predictive analytics for early intervention identification</li>
                <li>Longitudinal studies to assess long-term developmental outcomes</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Research & Development Team</h3>
          <p className="text-gray-600 mb-4">
            For academic collaborations, research inquiries, or professional partnerships, please contact our development team.
          </p>
          <div className="text-sm text-gray-500">
            © 2025 Sentio AI Platform. Committed to ethical AI development for child welfare.
          </div>
        </div>
      </div>
    </div>
  );
}