/**
 * Compresses an image file using HTML5 Canvas before uploading.
 * @param {File} file - The original image file.
 * @param {number} maxWidth - Maximum width of the compressed image.
 * @param {number} maxHeight - Maximum height of the compressed image.
 * @param {number} quality - JPEG/WebP quality (0 to 1).
 * @returns {Promise<File>} - A promise that resolves with the compressed File.
 */
export const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error("File is not an image"));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to Blob (WebP is smaller and supported in modern browsers, fallback to jpeg)
        canvas.toBlob((blob) => {
          if (!blob) {
            return reject(new Error("Canvas to Blob failed"));
          }
          // Create a new file object from the blob
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
            type: 'image/webp',
            lastModified: Date.now(),
          });
          
          console.log(`Original Size: ${(file.size / 1024).toFixed(2)} KB`);
          console.log(`Compressed Size: ${(compressedFile.size / 1024).toFixed(2)} KB`);
          
          resolve(compressedFile);
        }, 'image/webp', quality);
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
};
