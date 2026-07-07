/**
 * Supabase Service (Mock/Stub for now)
 * Handles Auth, Storage, and Database.
 */

export const SupabaseService = {
  /**
   * Check if user is logged in
   */
  getUser: async () => {
    // Simulating no user logged in by default
    return null;
  },

  /**
   * Mock Sign In
   */
  signIn: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (!email) throw new Error("Email is required");
    
    return {
      id: "usr_" + Math.floor(Math.random() * 10000),
      email: email,
      name: email.split('@')[0]
    };
  },

  /**
   * Mock Upload Image to Storage
   */
  uploadImage: async (imageFile) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return "https://mock-supabase-storage.com/image_" + Date.now() + ".jpg";
  },

  /**
   * Mock Submit Report
   */
  submitReport: async (reportData) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      trackingId: `CIT-${Math.floor(Math.random() * 90000) + 10000}`,
      timestamp: new Date().toISOString()
    };
  }
};
