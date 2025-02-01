import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
}

const ImageUpload = ({ onImagesSelected }: ImageUploadProps) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const compressImage = async (file: File): Promise<File> => {
    console.log('Starting image compression for:', file.name);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                console.log('Compression complete:', file.name);
                console.log('Original size:', file.size, 'Compressed size:', compressedFile.size);
                resolve(compressedFile);
              } else {
                console.log('Compression failed, using original file:', file.name);
                resolve(file);
              }
            },
            'image/jpeg',
            0.7
          );
        };
      };
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    console.log('Processing', files.length, 'images');
    
    const compressedFiles = await Promise.all(
      files.map(async (file) => {
        const compressed = await compressImage(file);
        return compressed;
      })
    );

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
    onImagesSelected(compressedFiles);
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview}
              alt={`Garden upload ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-garden-primary" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="border-2 border-dashed border-garden-secondary hover:border-garden-primary transition-colors"
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Garden Photos
        </Button>
        <input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default ImageUpload;