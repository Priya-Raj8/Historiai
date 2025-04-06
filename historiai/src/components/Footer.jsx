import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1E1E1E] py-8 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              <span className="text-accent-primary">Historia</span>AI
            </h3>
            <p className="text-gray-400">
              An interactive learning platform that brings history to life through engaging
              storytelling, multimedia content, and an AI-powered tutor.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/category/ancient-civilizations" className="text-gray-400 hover:text-accent-primary transition-colors">
                  Ancient Civilizations
                </Link>
              </li>
              <li>
                <Link to="/category/medieval-period" className="text-gray-400 hover:text-accent-primary transition-colors">
                  Medieval Period
                </Link>
              </li>
              <li>
                <Link to="/category/modern-history" className="text-gray-400 hover:text-accent-primary transition-colors">
                  Modern History
                </Link>
              </li>
              <li>
                <Link to="/category/wars" className="text-gray-400 hover:text-accent-primary transition-colors">
                  Wars
                </Link>
              </li>
              <li>
                <Link to="/category/famous-leaders" className="text-gray-400 hover:text-accent-primary transition-colors">
                  Famous Leaders
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-accent-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-accent-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-accent-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="https://en.wikipedia.org/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent-primary transition-colors">
                  Wikipedia
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p> {new Date().getFullYear()} AI History Tutor. All rights reserved.</p>
          <p className="mt-2">DEVELOPED BY Priya Raj | UID: 12307363</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
