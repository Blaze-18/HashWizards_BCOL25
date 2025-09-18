"use client";
import React, { useState, useEffect } from 'react';
import { Brain, MessageCircle, BookOpen, Users, ChevronRight, Star, Heart, Lightbulb, Target, BarChart3, Link } from 'lucide-react';
import Image from 'next/image';
import Logo from '@/assets/logo.png';
export default function SentioHomepage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "AI Assistant",
      description: "Personalized support tailored to your unique needs and preferences",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Scenario Learning",
      description: "Interactive scenarios to build emotional intelligence and social skills",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Social Stories",
      description: "Comprehensive library of stories to navigate social situations",
      color: "from-orange-500 to-red-600"
    }
  ];

  const benefits = [
    { icon: <Heart />, text: "Empathetic AI support" },
    { icon: <Lightbulb />, text: "Personalized learning" },
    { icon: <Users />, text: "Social skill development" },
    { icon: <BarChart3 />, text: "Progress tracking" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Image
                src={Logo}
              alt="App Logo"
              width={80}
              height={70}
              className="mx-auto mb-3"
              />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                About
              </a>
              <a href="/auth/login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Login
              </a>
              <a href="/auth/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  Empowering
                </span>
                <br />
                <span className="text-gray-800">Young Minds</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                AI-powered support for children and teenagers, helping them navigate emotions, 
                build social skills, and thrive in their daily lives
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => window.location.href = "/auth/register"}
                    >
                  Get Started Today
                  <ChevronRight className="inline w-5 h-5 ml-2" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-teal-200 rounded-full opacity-20 animate-ping"></div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Our Core Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three powerful tools working together to support growth and development
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100 overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className={`relative w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                
                {/* Content */}
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                </div>
                
                {/* Hover indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>
                
                {/* Bottom border accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Why Choose Sentio?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with care, designed for growth, powered by AI
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <p className="text-gray-700 font-semibold">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Interaction */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              See Sentio in Action
            </h2>
            <p className="text-xl text-gray-600">
              Experience how our AI assistant provides personalized support
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
            <div className="space-y-6">
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-2xl rounded-br-sm px-6 py-4 max-w-md">
                  <p>&quot;I&apos;m feeling overwhelmed about my presentation tomorrow. Can you help?&quot;</p>
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="bg-white border-2 border-gray-200 rounded-2xl rounded-bl-sm px-6 py-4 max-w-md shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-600">Sentio AI</span>
                  </div>
                  <p className='text-black'>&quot;I understand that feeling! Let&apos;s break this down together. What specifically about the presentation is making you feel overwhelmed? Is it the content, speaking in front of others, or something else?&quot;</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full">
                  💭 Personalized responses based on your preferences and needs
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of young people who are building confidence and skills with Sentio
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Start Your Free Trial
            <ChevronRight className="inline w-5 h-5 ml-2" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <Image
                src={Logo}
                alt="Sentio Logo"
                width={80}
                height={40}
                className="rounded-full"
              />
            </div>
            <div className="text-gray-400">
              <p>&copy; 2025 Sentio. Empowering young minds with AI.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}