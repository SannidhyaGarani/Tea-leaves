/**
 * Reusable Cloudinary Upload Helper for Vaarta Chai
 * Configured with Cloud Name: dcjn4y284 & Preset: vaarta
 */

export const CLOUDINARY_CONFIG = {
  cloudName: "dcjn4y284",
  uploadPreset: "vaarta",
  uploadUrl: "https://api.cloudinary.com/v1_1/dcjn4y284/image/upload",
  defaultFolder: "vaarta_chai",
  websiteName: "Vaarta Chai"
};

/**
 * Uploads a file to Cloudinary inside a designated folder for easy tracking
 * @param {File} file - File object to upload
 * @param {string} [subFolder="uploads"] - Optional subfolder name (e.g., "products", "avatars", "cms")
 * @returns {Promise<string>} - Resolves with the secure URL of the uploaded image
 */
export const uploadToCloudinary = async (file, subFolder = "uploads") => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  // Construct full folder path for Cloudinary tracking e.g. "vaarta_chai/products"
  const folderPath = subFolder.startsWith(CLOUDINARY_CONFIG.defaultFolder)
    ? subFolder
    : `${CLOUDINARY_CONFIG.defaultFolder}/${subFolder}`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
  formData.append("folder", folderPath);

  try {
    const response = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Cloudinary upload failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};
