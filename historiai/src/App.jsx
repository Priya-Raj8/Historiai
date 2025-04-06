import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import TopicDetailPage from './pages/TopicDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import './index.css';

// ScrollToTop component to handle scrolling to top on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  // Track loading state for the entire app
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Simulate initial app loading
  useEffect(() => {
    // Preload essential resources
    const preloadResources = async () => {
      try {
        // You could preload images, fonts, or initial data here
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
        setIsAppLoading(false);
      } catch (error) {
        console.error('Error preloading resources:', error);
        setIsAppLoading(false);
      }
    };

    preloadResources();
  }, []);

  // Show a loading screen while the app is initializing
  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-primary mx-auto"></div>
          <h1 className="text-2xl font-bold text-white mt-6">AI History Tutor</h1>
          <p className="text-gray-400 mt-2">Loading your learning experience...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="category/:categoryName" element={<CategoryPage />} />
          <Route path="topic/:id" element={<TopicDetailPage />} />
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
