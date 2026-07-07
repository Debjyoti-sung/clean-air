/**
 * Mistral Vision API Service (Mock/Stub for now)
 * Simulates analyzing an uploaded image to classify pollution.
 */

export const VisionService = {
  /**
   * Analyze an image to detect environmental pollution
   * @param {File | string} imageFile 
   */
  analyzeImage: async (imageFile) => {
    try {
      // 1. Convert Base64 back to Blob to send as multipart/form-data file
      let fileToUpload = imageFile;
      if (typeof imageFile === 'string' && imageFile.startsWith('data:image')) {
        const fetchResponse = await fetch(imageFile);
        fileToUpload = await fetchResponse.blob();
      }

      const formData = new FormData();
      formData.append('image', fileToUpload, 'upload.jpg');

      // 2. Send to backend AI Service
      const response = await fetch('http://localhost:5000/api/ai/analyze-image', {
        method: 'POST',
        body: formData // Note: Content-Type is set automatically by the browser with boundary
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image via backend');
      }

      const result = await response.json();

      if (!result.isPollution) {
        return {
          success: false,
          isPollution: false,
          message: result.explanation || "This image does not appear to contain pollution-related evidence. Please upload a valid environmental incident."
        };
      }

      return {
        success: true,
        isPollution: true,
        data: {
          pollutionType: result.pollutionType || "Unclassified Pollution",
          confidenceScore: result.confidenceScore || 85,
          explanation: result.explanation || `The AI detected visual signatures consistent with pollution.`,
          severitySuggestion: result.severitySuggestion || "Medium"
        }
      };

    } catch (error) {
      console.error("Vision Service Error:", error);
      // Fallback for demo purposes if backend is down
      return {
        success: false,
        isPollution: false,
        message: "Failed to connect to the AI Analysis server. Please try again."
      };
    }
  }
};
