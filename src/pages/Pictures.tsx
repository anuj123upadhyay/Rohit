

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases, storages } from '../appwrite/appwriteConfig';
import { useAuth } from '../appwrite/auth';
import conf from '../config/conf';
import { Query } from 'appwrite';

interface Image {
  id: string;
  fileId: string;
  url: string;
  title: string;
  category: string;
  date: string;
}

function Pictures() {
  const [images, setImages] = useState<Image[]>([]);
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    filterImages();
  }, [images, activeCategory]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteImageCollection,
        [Query.orderDesc('$createdAt')]
      );

      const fetchedImages = await Promise.all(response.documents.map(async (doc: any) => {
        if (!doc.fileId) return null;

        try {
          const imageUrl = storages.getFileView(
            conf.appwriteAuthorImageBucketId,
            doc.fileId
          );

          return {
            id: doc.$id,
            fileId: doc.fileId,
            url: imageUrl,
            title: doc.title,
            category: doc.category,
            date: doc.date
          };
        } catch (error) {
          console.error(`Error getting image URL for fileId ${doc.fileId}:`, error);
          return null;
        }
      }));

      setImages(fetchedImages.filter((img): img is Image => img !== null));
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const filterImages = () => {
    const filtered = activeCategory === 'All'
      ? images
      : images.filter(image => image.category === activeCategory);
    setFilteredImages(filtered);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  const categories = ['All', ...new Set(images.map(image => image.category))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111] to-black py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-bold text-gold mb-2">Gallery</h1>
            <p className="text-gray-400">Explore our collection of memories</p>
          </div>
          
          {isAdmin() && (
            <Link 
              to="/pictures/upload"
              className="group px-6 py-3 bg-classic-blue text-gold rounded-lg 
                       hover:bg-opacity-90 transition-all duration-300 
                       flex items-center gap-3 shadow-lg hover:shadow-xl
                       transform hover:-translate-y-0.5"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a 1 1 0 11-2 0v-5H4a 1 1 0 110-2h5V4a 1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Upload Picture</span>
            </Link>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-3 mb-12">
          <div className="bg-gray-900/50 p-2 rounded-xl flex flex-wrap gap-2 backdrop-blur-sm">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-lg transition-all duration-300 font-medium
                  ${activeCategory === category
                    ? 'bg-classic-blue text-gold shadow-lg scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gold'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-800 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-xl">{error}</div>
          </div>
        ) : (
          /* Image Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredImages.map((image) => (
              <div key={image.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl shadow-lg aspect-square 
                              backdrop-blur-sm bg-gray-900/20 transition-transform 
                              duration-500 hover:scale-[1.02]">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform 
                             duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      console.error(`Failed to load image: ${image.title}`);
                      e.currentTarget.src = '/fallback-image.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 
                                  group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-gray-300 text-sm">
                        {new Date(image.date).toLocaleDateString()}
                      </p>
                      <span className="inline-block mt-3 px-3 py-1 bg-classic-blue/80 
                                     text-gold text-sm rounded-full">
                        {image.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Pictures;