import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { databases, storages } from "../appwrite/appwriteConfig";
import { useAuth } from "../appwrite/auth";
import conf from "../config/conf";
import { Query } from "appwrite";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";

interface Image {
  id: string;
  fileId: string;
  url: string;
  title: string;
  category: string;
  date: string;
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="rounded-2xl overflow-hidden"><div className="skeleton aspect-square" /></div>
    ))}
  </div>
);

function Pictures() {
  const [images, setImages] = useState<Image[]>([]);
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => { fetchImages(); }, []);
  useEffect(() => { filterImages(); }, [images, activeCategory]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedImage(null); };
    if (selectedImage) { document.addEventListener("keydown", handleEsc); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", handleEsc); document.body.style.overflow = "unset"; };
  }, [selectedImage]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteImageCollection, [Query.orderDesc("$createdAt")]);
      const fetchedImages = await Promise.all(
        response.documents.map(async (doc: any) => {
          if (!doc.fileId) return null;
          try {
            const imageUrl = storages.getFileView(conf.appwriteAuthorImageBucketId, doc.fileId);
            return { id: doc.$id, fileId: doc.fileId, url: imageUrl, title: doc.title, category: doc.category, date: doc.date };
          } catch { return null; }
        })
      );
      setImages(fetchedImages.filter((img): img is Image => img !== null));
    } catch { setError("Failed to load images"); } finally { setLoading(false); }
  };

  const filterImages = () => {
    setFilteredImages(activeCategory === "All" ? images : images.filter((img) => img.category === activeCategory));
  };

  const deleteImage = async (imageId: string, fileId: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      setDeletingId(imageId);
      await databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteImageCollection, imageId);
      await storages.deleteFile(conf.appwriteAuthorImageBucketId, fileId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch { setError("Failed to delete image"); } finally { setDeletingId(null); }
  };

  const categories = ["All", ...new Set(images.map((img) => img.category))];

  return (
    <>
      <Helmet>
        <title>Story Board — Photo Gallery by Rohit Upadhyay | Visual Narratives</title>
        <meta name="description" content="Explore Rohit Upadhyay's visual story board — a curated photo gallery of moments, memories, and visual narratives from the life and journey of the Indian author and storyteller." />
        <meta name="keywords" content="Rohit Upadhyay gallery, author photo gallery, visual narratives, story board, Rohit Upadhyay pictures, Indian author photos, storyteller images" />
        <link rel="canonical" href="https://rohit.upadhyayji.me/pictures" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rohit.upadhyayji.me/pictures" />
        <meta property="og:title" content="Story Board — Photo Gallery by Rohit Upadhyay" />
        <meta property="og:description" content="A curated visual story board — moments and memories from the life and journey of Indian author Rohit Upadhyay." />
        <meta property="og:image" content="https://rohit.upadhyayji.me/rohit.webp" />
        <meta property="og:site_name" content="Rohit Upadhyay" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@rohit5upadhyay" />
        <meta name="twitter:title" content="Story Board — Photo Gallery by Rohit Upadhyay" />
        <meta name="twitter:description" content="Curated photo gallery from Indian author Rohit Upadhyay's life and journey." />
        <meta name="twitter:image" content="https://rohit.upadhyayji.me/rohit.webp" />
        {/* Structured Data — ImageGallery */}
        <script type="application/ld+json">{`{
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          "name": "Rohit Upadhyay — Story Board",
          "url": "https://rohit.upadhyayji.me/pictures",
          "description": "Visual narratives and photo gallery from the life of Indian author Rohit Upadhyay.",
          "author": {
            "@type": "Person",
            "name": "Rohit Upadhyay",
            "url": "https://rohit.upadhyayji.me"
          }
        }`}</script>
      </Helmet>

      <section className="py-12 md:py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4"
          >
            <div className="text-center md:text-left">
              <p className="text-gold text-sm font-medium tracking-[0.3em] uppercase mb-2">Visual Narratives</p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy">Story Board</h1>
            </div>
            {isAdmin() && (
              <Link to="/pictures/upload"
                className="px-6 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Upload
              </Link>
            )}
          </motion.div>

          {/* Categories */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex justify-center mb-10">
            <div className="bg-white rounded-xl p-2 flex flex-wrap gap-2 border border-navy/5 shadow-sm">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium ${activeCategory === cat
                    ? "bg-navy text-white shadow-md"
                    : "text-slate hover:text-navy hover:bg-ivory-warm"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Gallery */}
          {loading ? <LoadingSkeleton /> : error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 rounded-2xl p-8 max-w-md mx-auto border border-red-100"><p className="text-red-600">{error}</p></div>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-16"><p className="text-slate font-serif text-lg">No images found</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group relative cursor-pointer"
                  onClick={() => { setSelectedImage(image); setIsImageLoading(true); }}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-square glass-card glass-card-hover">
                    {isAdmin() && (
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteImage(image.id, image.fileId); }}
                        disabled={deletingId === image.id}
                        className="absolute top-3 right-3 z-10 w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center
                                 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:bg-slate"
                      >
                        {deletingId === image.id ? (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    )}
                    <img src={image.url} alt={image.title} loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { e.currentTarget.src = "/fallback-image.jpg"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent
                                  opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white/80 text-sm">{new Date(image.date).toLocaleDateString()}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">{image.category}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Image Modal */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-md"
                onClick={() => setSelectedImage(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative max-w-7xl w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button onClick={() => setSelectedImage(null)}
                    className="absolute -top-12 right-0 p-3 text-white/60 hover:text-white transition-all rounded-full hover:bg-white/10"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl">
                    {isImageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-ivory">
                        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
                      </div>
                    )}
                    <img src={selectedImage.url} alt={selectedImage.title} loading="eager"
                      className={`w-full h-full object-contain max-h-[85vh] transition-opacity duration-300 ${isImageLoading ? "opacity-0" : "opacity-100"}`}
                      onLoad={() => setIsImageLoading(false)}
                      onLoadStart={() => setIsImageLoading(true)}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy/80 to-transparent">
                      <div className="p-6 flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm">{selectedImage.category}</span>
                        <time className="text-white/60 text-sm">{new Date(selectedImage.date).toLocaleDateString()}</time>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

export default Pictures;
