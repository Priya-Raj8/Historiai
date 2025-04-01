import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">About AI History Tutor</h1>
          <div className="h-1 w-24 bg-accent-primary mb-8"></div>
        </div>

        <div className="bg-[#1E1E1E] rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-300 mb-4">
            AI History Tutor is designed to make learning history interactive, engaging, and accessible to everyone. 
            We believe that understanding our past is crucial for shaping our future, and we're committed to providing 
            a platform that makes historical knowledge come alive.
          </p>
          <p className="text-gray-300">
            Using advanced AI technology and drawing from reliable sources like Wikipedia, we offer a comprehensive 
            learning experience that adapts to your interests and learning style.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1E1E1E] rounded-lg p-6">
            <div className="text-accent-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Comprehensive Content</h3>
            <p className="text-gray-300">
              Explore a vast library of historical topics, from ancient civilizations to modern events, 
              all presented in an engaging and interactive format.
            </p>
          </div>

          <div className="bg-[#1E1E1E] rounded-lg p-6">
            <div className="text-accent-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Interactive Learning</h3>
            <p className="text-gray-300">
              Engage with history through interactive timelines, quizzes, maps, and multimedia content 
              that brings historical events to life.
            </p>
          </div>

          <div className="bg-[#1E1E1E] rounded-lg p-6">
            <div className="text-accent-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI-Powered Assistance</h3>
            <p className="text-gray-300">
              Get personalized learning experiences with our AI tutor that can answer questions, 
              provide explanations, and guide you through complex historical concepts.
            </p>
          </div>

          <div className="bg-[#1E1E1E] rounded-lg p-6">
            <div className="text-accent-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Accessible Design</h3>
            <p className="text-gray-300">
              Our platform is designed to be accessible to all users, with features like dark mode, 
              responsive design, and intuitive navigation.
            </p>
          </div>
        </div>

        <div className="bg-[#1E1E1E] rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How We Use Wikipedia</h2>
          <p className="text-gray-300 mb-4">
            AI History Tutor leverages Wikipedia's vast knowledge base to provide accurate and comprehensive 
            historical information. We process and enhance this content to create interactive learning experiences, 
            while always maintaining attribution and respect for Wikipedia's open-source principles.
          </p>
          <p className="text-gray-300">
            While we strive for accuracy, we encourage users to verify information through multiple sources 
            and develop critical thinking skills when studying history.
          </p>
        </div>

        <div className="bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Start Your Historical Journey Today</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Whether you're a student, teacher, history enthusiast, or just curious about the past, 
            AI History Tutor has something for you. Begin exploring our vast collection of historical topics now.
          </p>
          <Link to="/" className="bg-accent-primary hover:bg-accent-primary/90 text-white py-3 px-8 rounded-full text-lg font-medium transition-all duration-300 inline-block">
            Explore Topics
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
