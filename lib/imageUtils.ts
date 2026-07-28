/**
 * Compresses an image file (File or Blob) using HTML5 Canvas before uploading.
 * Reduces file size significantly (70-90%) for faster platform performance.
 */
export async function compressImageFile(
    file: File,
    maxWidth: number = 1200,
    maxHeight: number = 1200,
    quality: number = 0.8
): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Calculate scaling maintaining aspect ratio
                if (width > maxWidth || height > maxHeight) {
                    if (width / height > maxWidth / maxHeight) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(e.target?.result as string);
                    return;
                }

                // Draw image to canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Export to webp or jpeg data url
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };

            img.onerror = (err) => reject(err);
            img.src = e.target?.result as string;
        };

        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
}
