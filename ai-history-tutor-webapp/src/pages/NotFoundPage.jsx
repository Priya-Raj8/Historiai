import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        <div className="mb-8">
          <span className="text-9xl font-bold text-accent-primary">404</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-gray-400 text-lg mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="bg-accent-primary hover:bg-accent-primary/90 text-white py-3 px-8 rounded-full transition-all duration-300"
          >
            Back to Home
          </Link>
          
          <Link 
            to="/search" 
            className="border border-accent-primary text-accent-primary hover:bg-accent-primary/10 py-3 px-8 rounded-full transition-all duration-300"
          >
            Search Topics
          </Link>
        </div>
        
        <div className="mt-12 p-6 bg-[#1E1E1E] rounded-lg">
          <h2 className="text-xl font-bold mb-4">Looking for something specific?</h2>
          <p className="text-gray-400 mb-6">
            Try exploring our categories or using the search function to find what you're looking for.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link 
              to="/category/ancient-history" 
              className="bg-[#2A2A2A] hover:bg-[#333333] p-3 rounded-lg transition-colors duration-300"
            >
              Ancient History
            </Link>
            <Link 
              to="/category/medieval-history" 
              className="bg-[#2A2A2A] hover:bg-[#333333] p-3 rounded-lg transition-colors duration-300"
            >
              Medieval History
            </Link>
            <Link 
              to="/category/modern-history" 
              className="bg-[#2A2A2A] hover:bg-[#333333] p-3 rounded-lg transition-colors duration-300"
            >
              Modern History
            </Link>
            <Link 
              to="/category/world-wars" 
              className="bg-[#2A2A2A] hover:bg-[#333333] p-3 rounded-lg transition-colors duration-300"
            >
              World Wars
            </Link>
            <Link 
              to="/category/cultural-history" 
              className="bg-[#2A2A2A] hover:bg-[#333333] p-3 rounded-lg transition-colors duration-300"
            >
              Cultural History
            </Link>
            <Link 
              to="/category/scientific-history" 
              className="bg-[#2A2A2A] hover:bg-[#333333] p-3 rounded-lg transition-colors duration-300"
            >
              Scientific History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
