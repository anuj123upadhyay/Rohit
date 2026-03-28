import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { databases } from "../appwrite/appwriteConfig";
import { useAuth } from "../appwrite/auth";
import conf from "../config/conf";
import { Query } from "appwrite";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  createdAt: string;
  buyLink: string;
  awards?: string[];
}

const LoadingSkeleton = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="glass-card rounded-2xl overflow-hidden">
        <div className="skeleton aspect-[2/3] w-full" />
        <div className="p-6 space-y-3"><div className="skeleton h-5 w-3/4" /><div className="skeleton h-4 w-1/2" /></div>
      </div>
    ))}
  </div>
);

function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => { fetchBooks(); }, []);
  useEffect(() => { filterBooks(); }, [books, searchQuery, selectedCategory]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteBookCollectionId, [Query.orderDesc("$createdAt")]);
      setBooks(response.documents.map((doc: any) => ({
        id: doc.$id, title: doc.title, author: doc.author, description: doc.description,
        coverUrl: doc.coverUrl, createdAt: doc.$createdAt, buyLink: doc.buyLink, awards: doc.awards || [],
      })));
    } catch { setError("Failed to load books"); } finally { setLoading(false); }
  };

  const filterBooks = () => {
    let filtered = [...books];
    if (searchQuery) filtered = filtered.filter((b) => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedCategory !== "All") filtered = filtered.filter((b) => b.author === selectedCategory);
    setFilteredBooks(filtered);
  };

  const handleDelete = async (id: string) => {
    try {
      await databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteBookCollectionId, id);
      setBooks(books.filter((b) => b.id !== id));
    } catch { setError("Failed to delete the book"); }
  };

  const categories = ["All", ...new Set(books.map((b) => b.author))];
  const displayedBooks = searchQuery || selectedCategory !== "All" ? filteredBooks : books;

  return (
    <>
      <Helmet>
        <title>Books by Rohit Upadhyay — Buy Motivational & Inspirational Books | Indian Author</title>
        <meta name="title" content="Books by Rohit Upadhyay — Buy Motivational & Inspirational Books | Indian Author" />
        <meta name="description" content="Browse and buy books written by Rohit Upadhyay — Indian author of motivational and inspirational books on personal growth, healing, and transformation. Available online for purchase." />
        <meta name="keywords" content="Rohit Upadhyay books, books by Rohit Upadhyay, Rohit Upadhyay author books, buy Indian author books, motivational books India, inspirational books online, personal growth books, books on healing, Rohit Upadhyay publications, Indian author books online" />
        <meta name="author" content="Rohit Upadhyay" />
        <link rel="canonical" href="https://rohit.upadhyayji.me/books" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rohit.upadhyayji.me/books" />
        <meta property="og:title" content="Books by Rohit Upadhyay — Motivational & Inspirational Books" />
        <meta property="og:description" content="Browse books by Indian author Rohit Upadhyay on personal growth, healing, and transformation. Buy online." />
        <meta property="og:image" content="https://rohit.upadhyayji.me/rohit.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Rohit Upadhyay - Author" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@rohit5upadhyay" />
        <meta name="twitter:creator" content="@rohit5upadhyay" />
        <meta name="twitter:title" content="Books by Rohit Upadhyay — Motivational & Inspirational Books" />
        <meta name="twitter:description" content="Browse and buy books by Indian author Rohit Upadhyay on personal growth and healing." />
        <meta name="twitter:image" content="https://rohit.upadhyayji.me/rohit.webp" />
        
        {/* Structured Data — CollectionPage + BreadcrumbList */}
        <script type="application/ld+json">{`{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": "https://rohit.upadhyayji.me/books#collection",
              "name": "Books by Rohit Upadhyay",
              "url": "https://rohit.upadhyayji.me/books",
              "description": "A collection of motivational and inspirational books written by Indian author Rohit Upadhyay on personal growth, healing, and transformation.",
              "isPartOf": { "@id": "https://rohit.upadhyayji.me/#website" },
              "about": { "@id": "https://rohit.upadhyayji.me/#author" },
              "author": {
                "@type": "Person",
                "@id": "https://rohit.upadhyayji.me/#author",
                "name": "Rohit Upadhyay",
                "url": "https://rohit.upadhyayji.me"
              },
              "inLanguage": "en-IN"
            },
            {
              "@type": "BreadcrumbList",
              "@id": "https://rohit.upadhyayji.me/books#breadcrumb",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://rohit.upadhyayji.me/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Books",
                  "item": "https://rohit.upadhyayji.me/books"
                }
              ]
            }
          ]
        }`}</script>
      </Helmet>

      <section className="py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <p className="text-gold text-sm font-medium tracking-[0.3em] uppercase mb-2">Library</p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy">Books</h1>
            </div>
            {isAdmin() && (
              <Link to="/books/new"
                className="px-6 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Book
              </Link>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-4">
            <input
              type="text" placeholder="Search books..."
              className="w-full px-5 py-3 bg-white border border-navy/10 rounded-xl text-navy placeholder-slate/40
                       focus:ring-2 focus:ring-gold/20 focus:border-gold focus:outline-none transition-all duration-200 text-sm shadow-sm"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm ${selectedCategory === cat
                    ? "bg-navy text-white font-medium shadow-md"
                    : "bg-white text-slate hover:text-navy hover:bg-ivory-warm border border-navy/5"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {loading ? <LoadingSkeleton /> : error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 rounded-2xl p-8 max-w-md mx-auto border border-red-100"><p className="text-red-600">{error}</p></div>
            </div>
          ) : displayedBooks.length === 0 ? (
            <div className="text-center py-16"><p className="text-slate font-serif text-lg">No books found</p></div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedBooks.map((book, index) => (
                <motion.div key={book.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }} className="group"
                >
                  <div className="glass-card glass-card-hover rounded-2xl overflow-hidden">
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img src={book.coverUrl} alt={book.title} loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5 space-y-3">
                      <h2 className="font-serif text-lg font-bold text-navy group-hover:text-gold transition-colors duration-200 leading-tight">{book.title}</h2>
                      <p className="text-slate text-sm">{book.author}</p>
                      <p className="text-slate text-sm line-clamp-2 leading-relaxed">{book.description}</p>
                      {book.awards && book.awards.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-gold mb-1.5">Awards:</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {book.awards.map((award, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-gold-50 text-gold-700 rounded-full border border-gold/15">{award}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-3 border-t border-navy/5">
                        <span className="text-xs text-slate/60">{new Date(book.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-3">
                          <a href={book.buyLink} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:text-gold-dark transition-colors font-medium">Buy Now →</a>
                          {isAdmin() && (
                            <button onClick={() => { setBookToDelete(book.id); setShowDeleteModal(true); }} className="text-xs text-red-500 hover:text-red-600 transition-colors">Delete</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <AnimatePresence>
            {showDeleteModal && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-navy/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              >
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl shadow-navy/10 border border-navy/5"
                >
                  <h3 className="font-serif text-xl font-bold text-navy mb-4">Confirm Delete</h3>
                  <p className="text-slate mb-6 text-sm">Are you sure you want to delete this book? This action cannot be undone.</p>
                  <div className="flex justify-end gap-4">
                    <button onClick={() => setShowDeleteModal(false)} className="px-5 py-2.5 text-slate hover:text-navy transition-colors rounded-xl hover:bg-ivory-warm text-sm">Cancel</button>
                    <button onClick={() => { if (bookToDelete) { handleDelete(bookToDelete); setShowDeleteModal(false); } }}
                      className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-200 text-sm"
                    >Delete</button>
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

export default Books;
