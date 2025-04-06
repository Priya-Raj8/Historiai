import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { searchWikipedia } from '../services/wikipediaService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      const results = await searchWikipedia(searchQuery, 5);
      setSearchResults(results);
      setShowResults(true);
      setIsSearching(false);
    } catch (error) {
      console.error('Error searching Wikipedia:', error);
      setIsSearching(false);
    }
  };

  const handleResultClick = (pageId) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(`/topic/${pageId}`);
  };

  const categories = [
    { name: 'Ancient Civilizations', path: '/category/ancient-civilizations' },
    { name: 'Medieval Period', path: '/category/medieval-period' },
    { name: 'Modern History', path: '/category/modern-history' },
    { name: 'Wars', path: '/category/wars' },
    { name: 'Famous Leaders', path: '/category/famous-leaders' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#1E1E1E] shadow-md">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl font-poppins font-bold text-white">
              <span className="text-accent-primary">Historia</span>AI
            </span>
            <span className="hidden md:inline-block text-xs text-gray-400">
              DEVELOPED BY Priya Raj | UID: 12307363
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-accent-primary transition-colors">
              Home
            </Link>
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="text-white hover:text-accent-primary transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search for historical events, figures, or periods..."
              className="w-full py-3 px-4 pl-12 bg-[#2A2A2A] text-white rounded-full focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
            />
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-accent-primary hover:bg-accent-primary/90 text-white px-4 py-1 rounded-full"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-50 mt-2 w-full bg-[#2A2A2A] rounded-lg shadow-lg overflow-hidden">
              <ul>
                {searchResults.map((result) => (
                  <li 
                    key={result.pageid}
                    className="border-b border-gray-700 last:border-b-0"
                  >
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-[#3A3A3A] transition-colors"
                      onClick={() => handleResultClick(result.pageid)}
                    >
                      <h4 className="text-white font-medium">{result.title}</h4>
                      <p 
                        className="text-gray-400 text-sm mt-1"
                        dangerouslySetInnerHTML={{ __html: result.snippet }}
                      ></p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-[#2A2A2A] rounded-lg p-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-white hover:text-accent-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.path}
                  to={category.path}
                  className="text-white hover:text-accent-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
