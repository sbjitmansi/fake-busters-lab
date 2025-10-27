
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Lock, Filter } from 'lucide-react';
import Layout from '@/components/Layout';

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout className="overflow-hidden">
      <div className="hero-gradient">
        <div className="max-w-7xl mx-auto py-12 md:py-24">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row items-center space-y-12 lg:space-y-0 lg:space-x-12">
            <div className={`w-full lg:w-1/2 space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
              <div className="space-y-2">
                <span className="inline-block px-4 py-1.5 text-xs font-medium bg-fakebuster-50 dark:bg-fakebuster-900/50 text-fakebuster-700 dark:text-fakebuster-300 rounded-full">
                  AI-Powered Detection
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Unmask Fake Accounts <span className="gradient-text">Instantly!</span>
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-xl">
                Our cutting-edge AI technology helps you identify fake social media accounts with unprecedented accuracy. Protect yourself and your community from deception.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => navigate('/platform-select')}
                  className="flex items-center justify-center px-8 py-4 font-medium bg-fakebuster-600 hover:bg-fakebuster-700 text-white rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 group"
                >
                  <span>Detect Your Account</span>
                  <ArrowRight className="ml-2 transform transition-transform group-hover:translate-x-1" size={18} />
                </button>
                <button className="flex items-center justify-center px-8 py-4 font-medium bg-secondary hover:bg-accent text-foreground rounded-full transition-all duration-300">
                  Learn How It Works
                </button>
              </div>
            </div>
            
            <div className={`w-full lg:w-1/2 flex justify-center transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
              <div className="relative w-full max-w-lg">
                <div className="absolute top-0 left-0 w-72 h-72 bg-fakebuster-300/20 dark:bg-fakebuster-700/20 rounded-full blur-3xl -z-10 animate-float"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-fakebuster-400/20 dark:bg-fakebuster-600/20 rounded-full blur-3xl -z-10"></div>
                
                <div className="relative glassmorphism p-6 rounded-3xl shadow-xl">
                  <div className="absolute -top-16 right-12 w-32 h-32 bg-gradient-to-br from-fakebuster-500 to-fakebuster-700 rounded-full flex items-center justify-center shadow-lg animate-float">
                    <Shield className="text-white" size={48} />
                  </div>
                  
                  <div className="py-4 space-y-6">
                    <div className="flex space-x-4 items-center">
                      <div className="w-12 h-12 rounded-full bg-fakebuster-50 dark:bg-fakebuster-900 flex items-center justify-center">
                        <Lock className="text-fakebuster-600 dark:text-fakebuster-400" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Secure Scanning</h3>
                        <p className="text-sm text-muted-foreground">Upload images without privacy concerns</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4 items-center">
                      <div className="w-12 h-12 rounded-full bg-fakebuster-50 dark:bg-fakebuster-900 flex items-center justify-center">
                        <Filter className="text-fakebuster-600 dark:text-fakebuster-400" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Advanced Analysis</h3>
                        <p className="text-sm text-muted-foreground">AI detection with 97% accuracy rate</p>
                      </div>
                    </div>
                    
                    <div className="pt-8 pb-4">
                      <div className="h-4 bg-fakebuster-50 dark:bg-fakebuster-900/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-fakebuster-400 to-fakebuster-600 w-3/4 rounded-full"></div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs">
                        <span>Scanning in progress...</span>
                        <span>75%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div className={`mt-32 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">How FakeBusters Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our advanced technology analyzes multiple factors to determine if an account is genuine
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Select Platform",
                  description: "Choose from Facebook, Twitter, or Instagram to begin the verification process.",
                  icon: "🌐",
                  delay: 0
                },
                {
                  title: "Upload Images",
                  description: "Provide three images from the account you want to verify for our AI to analyze.",
                  icon: "🖼️",
                  delay: 150
                },
                {
                  title: "Get Results",
                  description: "Receive a detailed report with confidence score and explanation in seconds.",
                  icon: "📊",
                  delay: 300
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className={`bg-white dark:bg-fakebuster-900/30 p-8 rounded-3xl shadow-sm border border-border transition-all duration-500 hover:shadow-md hover:border-fakebuster-200 dark:hover:border-fakebuster-800`}
                  style={{ 
                    transitionDelay: `${feature.delay}ms`,
                    animation: `fade-in 0.5s ease-out forwards ${feature.delay + 500}ms`
                  }}
                >
                  <div className="h-12 w-12 bg-fakebuster-50 dark:bg-fakebuster-900 rounded-2xl flex items-center justify-center text-2xl mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA */}
          <div className={`mt-32 text-center transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="max-w-3xl mx-auto p-8 md:p-12 bg-gradient-to-br from-fakebuster-50 to-white dark:from-fakebuster-900/50 dark:to-fakebuster-950 rounded-3xl shadow-sm border border-border">
              <h2 className="text-3xl font-bold mb-4">Ready to Verify an Account?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start the detection process in seconds and get instant results.
              </p>
              <button 
                onClick={() => navigate('/platform-select')}
                className="flex items-center justify-center px-8 py-4 font-medium bg-fakebuster-600 hover:bg-fakebuster-700 text-white rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 mx-auto group"
              >
                <span>Detect Your Account</span>
                <ArrowRight className="ml-2 transform transition-transform group-hover:translate-x-1" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
