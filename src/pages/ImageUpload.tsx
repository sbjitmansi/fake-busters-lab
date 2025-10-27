
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadCloud, X, Image, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { detectFakeAccount } from '@/lib/detectionService';

const ImageUpload = () => {
  const { platform } = useParams<{ platform: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const requiredImages = 3;
  
  useEffect(() => {
    if (!platform) {
      navigate('/platform-select');
    }
    
    // Trigger animation after component mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => {
      clearTimeout(timer);
      // Clean up any preview URLs to avoid memory leaks
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, []);
  
  // Handle file selection
  const handleFiles = useCallback((files: FileList) => {
    const newFiles = Array.from(files);
    
    // Filter for images only
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error('Please upload valid image files');
      return;
    }
    
    // Limit to the number of required images
    const availableSlots = requiredImages - images.length;
    const filesToAdd = imageFiles.slice(0, availableSlots);
    
    if (filesToAdd.length > 0) {
      // Create preview URLs
      const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
      
      setImages(prev => [...prev, ...filesToAdd]);
      setPreviews(prev => [...prev, ...newPreviews]);
    }
    
    if (imageFiles.length > availableSlots) {
      toast.warning(`Only ${requiredImages} images are required. Additional images were ignored.`);
    }
  }, [images, requiredImages]);
  
  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);
  
  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);
  
  // Remove an image
  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  // Continue to results
  const handleContinue = async () => {
    if (images.length === requiredImages) {
      setIsLoading(true);
      
      try {
        // Store platform for access in results page
        sessionStorage.setItem('uploadedPlatform', platform || '');
        
        // Call the detection service with the actual images
        const result = await detectFakeAccount(platform || '', images);
        
        // Store the result in session storage for the results page
        sessionStorage.setItem('detectionResult', JSON.stringify(result));
        
        // Navigate to results page
        navigate('/results');
      } catch (error) {
        console.error('Error processing images:', error);
        toast.error('Failed to process images. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className={`text-center space-y-4 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <span className="inline-block px-4 py-1.5 text-xs font-medium bg-fakebuster-50 dark:bg-fakebuster-900/50 text-fakebuster-700 dark:text-fakebuster-300 rounded-full">
            Step 2 of 3
          </span>
          <h1 className="text-3xl md:text-4xl font-bold">Upload Images</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Please upload 3 images from the {getPlatformName()} account you want to verify
          </p>
        </div>
        
        <div className={`mt-12 transition-all duration-700 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div 
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              dragging 
                ? 'border-fakebuster-500 bg-fakebuster-50/50 dark:bg-fakebuster-900/20' 
                : 'border-border bg-secondary/30'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-fakebuster-100 dark:bg-fakebuster-900/50 rounded-full flex items-center justify-center text-fakebuster-600 dark:text-fakebuster-400">
                <UploadCloud size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Drag and drop images or</h3>
                <label className="inline-block px-6 py-2.5 bg-fakebuster-600 hover:bg-fakebuster-700 text-white rounded-full cursor-pointer transition-colors">
                  Browse Files
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    disabled={images.length >= requiredImages}
                  />
                </label>
              </div>
              <p className="text-sm text-muted-foreground">
                Supported formats: JPG, PNG, GIF (Max 5MB each)
              </p>
            </div>
          </div>
          
          {/* Image preview section */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">
              Uploaded Images ({images.length}/{requiredImages})
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {Array.from({ length: requiredImages }).map((_, index) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-xl border-2 overflow-hidden ${
                    previews[index]
                      ? 'border-border'
                      : 'border-dashed border-border bg-secondary/30 flex items-center justify-center'
                  }`}
                >
                  {previews[index] ? (
                    <>
                      <img
                        src={previews[index]}
                        alt={`Uploaded image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <Image className="mx-auto text-muted-foreground/50" size={48} />
                      <p className="text-sm text-muted-foreground mt-2">Image {index + 1}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {images.length > 0 && images.length < requiredImages && (
              <div className="mt-4 flex items-center p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-lg">
                <AlertCircle className="mr-2 flex-shrink-0" size={20} />
                <p className="text-sm">
                  Please upload {requiredImages - images.length} more image{requiredImages - images.length > 1 ? 's' : ''} to continue
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className={`mt-12 flex justify-center transition-all duration-700 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <button
            onClick={handleContinue}
            disabled={images.length < requiredImages || isLoading}
            className={`flex items-center justify-center px-8 py-4 font-medium rounded-full transition-all duration-300 ${
              images.length === requiredImages && !isLoading
                ? 'bg-fakebuster-600 hover:bg-fakebuster-700 text-white hover:shadow-lg hover:scale-105'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={18} />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Analyze Images</span>
                <ArrowRight className="ml-2" size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ImageUpload;
