/**
 * Gemini Vision API Service
 * Sends uploaded images to the backend for Gemini AI pollution analysis.
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
      console.log('[VisionService] Sending image to backend...');
      const response = await fetch('https://clean-air-w252.onrender.com/api/ai/analyze-image', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[VisionService] Backend error:', response.status, errorText);
        throw new Error(`Backend returned ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('[VisionService] Gemini response:', result);

      if (!result.isPollution) {
        return {
          success: true,
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
          explanation: result.explanation || "The AI detected visual signatures consistent with pollution.",
          severitySuggestion: result.severitySuggestion || "Medium"
        }
      };

    } catch (error) {
      console.error("[VisionService] Error:", error);
      throw error; // Let the component handle the error state
    }
  }
};
