
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-fakebuster-100 dark:bg-fakebuster-900/50 rounded-full flex items-center justify-center text-fakebuster-600 dark:text-fakebuster-400 mx-auto">
            <span className="text-5xl font-bold">404</span>
          </div>
          <h1 className="text-3xl font-bold">Page Not Found</h1>
          <p className="text-lg text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center px-8 py-4 font-medium bg-fakebuster-600 hover:bg-fakebuster-700 text-white rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 mx-auto group"
        >
          <ArrowLeft className="mr-2 transform transition-transform group-hover:-translate-x-1" size={18} />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
