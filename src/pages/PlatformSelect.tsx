
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';

const platforms = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200 dark:border-blue-900',
    hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-700',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-900/20',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
    color: 'bg-sky-500',
    textColor: 'text-sky-500',
    borderColor: 'border-sky-200 dark:border-sky-900',
    hoverBorder: 'hover:border-sky-400 dark:hover:border-sky-700',
    bgLight: 'bg-sky-50',
    bgDark: 'dark:bg-sky-900/20',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-pink-600',
    textColor: 'text-pink-600',
    borderColor: 'border-pink-200 dark:border-pink-900',
    hoverBorder: 'hover:border-pink-400 dark:hover:border-pink-700',
    bgLight: 'bg-pink-50',
    bgDark: 'dark:bg-pink-900/20',
  },
];

const PlatformSelect = () => {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const handleContinue = () => {
    if (selectedPlatform) {
      navigate(`/image-upload/${selectedPlatform}`);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className={`text-center space-y-4 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <span className="inline-block px-4 py-1.5 text-xs font-medium bg-fakebuster-50 dark:bg-fakebuster-900/50 text-fakebuster-700 dark:text-fakebuster-300 rounded-full">
            Step 1 of 3
          </span>
          <h1 className="text-3xl md:text-4xl font-bold">Select a Platform</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Choose the social media platform you want to verify an account from
          </p>
        </div>
        
        <div className={`mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 transition-all duration-700 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          {platforms.map((platform, index) => (
            <div
              key={platform.id}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-fakebuster-900/30 cursor-pointer ${
                selectedPlatform === platform.id
                  ? `border-${platform.id}-400 dark:border-${platform.id}-600 shadow-md`
                  : `${platform.borderColor} ${platform.hoverBorder}`
              }`}
              onClick={() => setSelectedPlatform(platform.id)}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {selectedPlatform === platform.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-fakebuster-600 flex items-center justify-center text-white text-xs">
                  ✓
                </div>
              )}
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 ${platform.bgLight} ${platform.bgDark} rounded-full flex items-center justify-center`}>
                  <platform.icon className={platform.textColor} size={32} />
                </div>
                <h3 className="text-xl font-semibold">{platform.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Verify {platform.name} accounts with our specialized detection algorithm
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className={`mt-12 flex justify-center transition-all duration-700 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <button
            onClick={handleContinue}
            disabled={!selectedPlatform}
            className={`flex items-center justify-center px-8 py-4 font-medium rounded-full transition-all duration-300 group ${
              selectedPlatform
                ? 'bg-fakebuster-600 hover:bg-fakebuster-700 text-white hover:shadow-lg hover:scale-105'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className="ml-2 transform transition-transform group-hover:translate-x-1" size={18} />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PlatformSelect;
