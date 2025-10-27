
export interface DetectionResult {
  isReal: boolean;
  confidenceScore: number;
  explanation: string;
}

// This is a mock function that simulates calling a backend service
export const detectFakeAccount = (
  platform: string,
  images: File[]
): Promise<DetectionResult> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // For demonstration purposes, generate a random result
      const randomScore = Math.floor(Math.random() * 100);
      const isReal = randomScore >= 50;
      
      const explanations = {
        real: [
          "The images show consistent lighting and environment patterns typically associated with genuine accounts.",
          "Facial features maintain consistency across different lighting conditions.",
          "The metadata of the images indicates they were taken with the same device over a realistic timeframe.",
          "Natural variations in appearance and background suggest authentic user content.",
          "The image quality and composition are consistent with genuine user-generated content."
        ],
        fake: [
          "Inconsistent lighting and shadows detected across the uploaded images suggest potential manipulation.",
          "Facial feature proportions show subtle inconsistencies often associated with AI-generated content.",
          "Unusual artifacts around the edges of features might indicate digital alteration.",
          "The metadata analysis shows patterns consistent with generated or manipulated images.",
          "Image quality inconsistencies suggest content from multiple sources or AI generation."
        ]
      };
      
      // Select a random explanation based on whether the account is deemed real or fake
      const explanationIndex = Math.floor(Math.random() * 5);
      const explanation = isReal 
        ? explanations.real[explanationIndex] 
        : explanations.fake[explanationIndex];
      
      resolve({
        isReal,
        confidenceScore: randomScore,
        explanation
      });
    }, 2000); // 2 second delay to simulate processing
  });
};
