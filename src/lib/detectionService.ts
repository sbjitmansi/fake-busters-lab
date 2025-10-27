
import { toast } from "sonner";

export interface DetectionResult {
  isReal: boolean;
  confidenceScore: number;
  explanation: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  uploadId?: string;
}

// This function will handle the actual upload of images to your backend
export const uploadImages = async (
  platform: string,
  images: File[]
): Promise<UploadResponse> => {
  try {
    // Create a FormData object to send the images
    const formData = new FormData();
    formData.append("platform", platform);
    
    // Add each image to the FormData
    images.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });
    
    // Call the Flask API endpoint
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Server error');
    }
    
    const data = await response.json();
    
    return {
      success: data.success,
      message: data.message,
      uploadId: data.uploadId,
    };
  } catch (error) {
    console.error("Error uploading images:", error);
    toast.error("Failed to upload images. Please try again.");
    return {
      success: false,
      message: "Failed to upload images",
    };
  }
};

// This function will check the status of the detection process
export const checkDetectionStatus = async (
  uploadId: string
): Promise<{ complete: boolean; result?: DetectionResult }> => {
  try {
    // Call the Flask API endpoint to check status
    const response = await fetch(`/api/status/${uploadId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Server error');
    }
    
    const data = await response.json();
    
    return {
      complete: data.complete,
      result: data.result
    };
  } catch (error) {
    console.error("Error checking detection status:", error);
    return { complete: false };
  }
};

// This is the main function that will be used by the application
export const detectFakeAccount = async (
  platform: string,
  images: File[]
): Promise<DetectionResult> => {
  try {
    // Step 1: Upload the images
    const uploadResponse = await uploadImages(platform, images);
    
    if (!uploadResponse.success || !uploadResponse.uploadId) {
      throw new Error("Failed to upload images");
    }
    
    // Step 2: Poll for the detection result
    let complete = false;
    let result: DetectionResult | undefined;
    
    while (!complete) {
      const statusResponse = await checkDetectionStatus(uploadResponse.uploadId);
      complete = statusResponse.complete;
      result = statusResponse.result;
      
      if (!complete) {
        // Wait before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (!result) {
      throw new Error("Failed to get detection result");
    }
    
    return result;
  } catch (error) {
    console.error("Error in detection process:", error);
    toast.error("Detection failed. Please try again.");
    
    // Return a default result in case of error
    return {
      isReal: false,
      confidenceScore: 0,
      explanation: "We couldn't complete the detection due to an error. Please try again."
    };
  }
};
