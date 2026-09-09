/**
 * Image processing utilities for client-side compression and device file uploads.
 * Downscales images onto an HTML5 Canvas to keep Base64 strings ~15-30KB,
 * preventing localStorage quota limits while preserving crisp avatars.
 */

export function compressImageFile(file, maxWidth = 256, maxHeight = 256, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Tidak ada file gambar yang dipilih.'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('File yang dipilih harus berupa format gambar (JPEG, PNG, WebP, dll).'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onload = () => {
        // Calculate square aspect-fill / center crop
        const canvas = document.createElement('canvas');
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        const ctx = canvas.getContext('2d');

        // Center crop math
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;

        if (img.width > img.height) {
          sourceWidth = img.height;
          sourceX = (img.width - img.height) / 2;
        } else if (img.height > img.width) {
          sourceHeight = img.width;
          sourceY = (img.height - img.width) / 2;
        }

        // Draw cropped and scaled image onto canvas
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          maxWidth,
          maxHeight
        );

        // Convert to lightweight JPEG data URL
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        reject(new Error('Gagal memuat gambar dari perangkat. Silakan coba file lain.'));
      };

      img.src = readerEvent.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca file gambar dari perangkat.'));
    };

    reader.readAsDataURL(file);
  });
}
