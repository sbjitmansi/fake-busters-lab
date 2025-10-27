
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

export const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initialize dark mode based on user preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 md:px-12 py-4 ${
        isScrolled || !isHomePage
          ? 'bg-white/80 dark:bg-fakebuster-950/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 transition-transform hover:scale-105 duration-300"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fakebuster-500 to-fakebuster-700 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">FB</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-fakebuster-900 dark:text-white">
            Fake<span className="text-fakebuster-600 dark:text-fakebuster-400">Busters</span>
          </span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-secondary text-foreground hover:bg-accent transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {!isHomePage && (
            <Link
              to="/"
              className="px-4 py-2 rounded-full text-sm font-medium text-fakebuster-700 dark:text-fakebuster-300 hover:text-fakebuster-900 dark:hover:text-white transition-colors"
            >
              Home
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
