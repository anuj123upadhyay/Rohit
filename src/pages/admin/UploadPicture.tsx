// pages/admin/UploadPicture.tsx
import { useState, FormEvent, useEffect, useRef, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { storages, databases } from '../../appwrite/appwriteConfig';
import { ID } from 'appwrite';
import conf from '../../config/conf';

interface ImageFile {
  file: File;
  preview: string;
}

function UploadPicture() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cleanup previews on unmount
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      const isValid = file.type.startsWith('image/');
      if (!isValid) setError(`${file.name} is not a valid image file`);
      return isValid;
    });

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
    setError(null);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].preview);
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setLoading(true);
    setError(null);
    const totalImages = images.length;
    let uploaded = 0;

    try {
      await Promise.all(images.map(async ({ file }) => {
        // Upload file to storages
        const fileUpload = await storages.createFile(
          conf.appwriteAuthorImageBucketId,
          ID.unique(),
          file
        );

        // Create database entry
        await databases.createDocument(
          conf.appwriteDatabaseId,
          conf.appwriteImageCollection,
          ID.unique(),
          {
            fileId: fileUpload.$id,
            title: file.name,
            category: 'gallery',
            date: new Date().toISOString()
          }
        );

        uploaded++;
        setUploadProgress((uploaded / totalImages) * 100);
      }));

      navigate('/pictures');
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload images. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-classic-blue mb-8">Upload Pictures</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        onDragEnter={handleDrag}
      >
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
        )}

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? 'border-classic-blue bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-classic-blue text-gold rounded-lg hover:bg-opacity-90"
          >
            Select Images
          </button>
          <p className="mt-2 text-gray-600">or drag and drop images here</p>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-classic-blue h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={images.length === 0 || loading}
          className={`w-full py-3 rounded-lg transition-colors ${
            images.length === 0 || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-classic-blue text-gold hover:bg-opacity-90'
          }`}
        >
          {loading 
            ? `Uploading... ${Math.round(uploadProgress)}%`
            : `Upload ${images.length} Image${images.length !== 1 ? 's' : ''}`
          }
        </button>
      </form>
    </div>
  );
}

export default UploadPicture;