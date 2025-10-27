
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, AlertTriangle, ArrowLeft, Info } from 'lucide-react';
import Layout from '@/components/Layout';
import { DetectionResult } from '@/lib/detectionService';

const Results = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [platform, setPlatform] = useState<string>('');
  
  useEffect(() => {
    // Trigger animation after component mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Get platform from session storage
    const storedPlatform = sessionStorage.getItem('uploadedPlatform') || '';
    setPlatform(storedPlatform);
    
    // Get the detection result from session storage
    const storedResult = sessionStorage.getItem('detectionResult');
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult) as DetectionResult;
        
        // Extract the correct confidence score from the explanation if needed
        const correctedResult = extractCorrectConfidenceScore(parsedResult);
        
        setResult(correctedResult);
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing detection result:', error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
      
    return () => clearTimeout(timer);
  }, []);
  
  // Extract the correct confidence score from explanation text
  const extractCorrectConfidenceScore = (result: DetectionResult): DetectionResult => {
    try {
      const scorePattern = /\*\*Confidence Score:\*\* (\d+)/;
      const match = result.explanation.match(scorePattern);
      
      if (match && match[1]) {
        const scoreFromText = parseInt(match[1], 10);
        if (!isNaN(scoreFromText)) {
          // Return a new object with the corrected score
          return {
            ...result,
            confidenceScore: scoreFromText
          };
        }
      }
    } catch (error) {
      console.error('Error extracting confidence score:', error);
    }
    
    // Return the original result if no score was found or if there was an error
    return result;
  };
  
  // Get platform display name
  const getPlatformName = () => {
    switch (platform) {
      case 'facebook': return 'Facebook';
      case 'twitter': return 'Twitter';
      case 'instagram': return 'Instagram';
      default: return platform;
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 50) return 'bg-amber-100 dark:bg-amber-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };
  
  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="text-green-600 dark:text-green-400" size={64} />;
    if (score >= 50) return <Info className="text-amber-600 dark:text-amber-400" size={64} />;
    return <AlertTriangle className="text-red-600 dark:text-red-400" size={64} />;
  };
  
  const getResultLabel = (isReal: boolean) => {
    return isReal ? 'Likely Real Account' : 'Likely Fake Account';
  };
  
  // Improved formatting function for the explanation text
   
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className={`text-center space-y-4 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <span className="inline-block px-4 py-1.5 text-xs font-medium bg-fakebuster-50 dark:bg-fakebuster-900/50 text-fakebuster-700 dark:text-fakebuster-300 rounded-full">
            Step 3 of 3
          </span>
          <h1 className="text-3xl md:text-4xl font-bold">Detection Results</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Here's what our AI analysis found about this {getPlatformName()} account
          </p>
        </div>
        
        <div className={`mt-12 transition-all duration-700 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          {isLoading ? (
            <div className="bg-white dark:bg-fakebuster-900/30 rounded-2xl p-12 flex flex-col items-center justify-center border border-border">
              <div className="w-24 h-24 relative">
                <div className="absolute inset-0 rounded-full border-t-4 border-fakebuster-600 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="text-fakebuster-500 dark:text-fakebuster-400" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mt-6">Analyzing Account</h3>
              <p className="text-muted-foreground mt-2">Our AI is processing your images...</p>
            </div>
          ) : result ? (
            <div className="bg-white dark:bg-fakebuster-900/30 rounded-2xl p-6 md:p-12 border border-border">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-shrink-0 flex flex-col items-center text-center">
                  {getScoreIcon(result.confidenceScore)}
                  <h3 className={`text-xl font-semibold mt-4 ${result.isReal ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {getResultLabel(result.isReal)}
                  </h3>
                </div>
                
                <div className="flex-grow space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Confidence Score</h3>
                    <div className="relative h-4 bg-secondary rounded-full overflow-hidden mb-2">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full ${result.isReal ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{ width: `${result.confidenceScore}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fake</span>
                      <span className={`font-medium ${getScoreColor(result.confidenceScore)}`}>
                        {result.confidenceScore}%
                      </span>
                      <span className="text-muted-foreground">Real</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Analysis Explanation</h3>
                    <div className={`p-4 rounded-xl ${getScoreBg(result.confidenceScore)}`}>
                      <div 
                        className="prose prose-sm dark:prose-invert max-w-none space-y-2"
                        dangerouslySetInnerHTML={{ __html: formatExplanation(result.explanation) }}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-2">What should you do?</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      {result.isReal ? (
                        <>
                          <li>This account appears to be authentic based on our analysis</li>
                          <li>Remember that no detection system is 100% accurate</li>
                          <li>Always maintain caution when interacting with accounts online</li>
                        </>
                      ) : (
                        <>
                          <li>Exercise caution when interacting with this account</li>
                          <li>Consider reporting the account to {getPlatformName()}</li>
                          <li>Do not share personal information with accounts that seem suspicious</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold">Error Processing Results</h3>
              <p className="mt-2">
                We encountered an issue while analyzing the account. Please try again.
              </p>
            </div>
          )}
        </div>
        
        <div className={`mt-12 flex justify-center transition-all duration-700 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <button
            onClick={() => navigate('/platform-select')}
            className="flex items-center justify-center px-8 py-4 font-medium bg-fakebuster-600 hover:bg-fakebuster-700 text-white rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 group"
          >
            <ArrowLeft className="mr-2 transform transition-transform group-hover:-translate-x-1" size={18} />
            <span>Check Another Account</span>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Results;
