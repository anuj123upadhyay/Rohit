import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { databases } from "../appwrite/appwriteConfig";
import { useAuth } from "../appwrite/auth";
import { FaHeart } from "react-icons/fa";
import conf from "../config/conf";
import { Query } from "appwrite";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string[];
  imageUrl: string;
  likes: number;
}

const LikeCount = ({ count }: { count: number }) => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-500 border border-red-100">
    <FaHeart className="text-xs" />
    <span className="text-xs font-medium">{count}</span>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-12">
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row">
      <div className="w-full md:w-2/3 aspect-[16/9] skeleton" />
      <div className="w-full md:w-1/3 p-8 space-y-4">
        <div className="skeleton h-4 w-20 rounded-full" />
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
      </div>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass-card rounded-2xl overflow-hidden">
          <div className="aspect-[16/9] skeleton" />
          <div className="p-6 space-y-3">
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => { fetchPosts(); }, []);

  const calculateReadingTime = (content: string): string => {
    const words = content.trim().split(/\s+/).length;
    return `${Math.ceil(words / 200)} min read`;
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteBlogCollectionId,
        [Query.orderDesc("date")]
      );
      setPosts(
        response.documents.map((doc: any) => ({
          id: doc.$id, title: doc.title, excerpt: doc.excerpt, content: doc.content,
          date: doc.date, category: doc.category, imageUrl: doc.imageUrl, likes: doc.likes || 0,
        }))
      );
    } catch {
      setError("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteBlogCollectionId, id);
      setPosts(posts.filter((post) => post.id !== id));
    } catch {
      setError("Failed to delete the blog post");
    }
  };

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <>
      <Helmet>
        <title>Blog by Rohit Upadhyay — Articles on Life, Growth & Storytelling | Indian Author</title>
        <meta name="title" content="Blog by Rohit Upadhyay — Articles on Life, Growth & Storytelling | Indian Author" />
        <meta name="description" content="Read blog posts by Rohit Upadhyay — an Indian author writing about personal growth, healing, storytelling, motivation, and creative writing. New inspiring articles published regularly." />
        <meta name="keywords" content="Rohit Upadhyay blog, blog by Rohit Upadhyay, Rohit Upadhyay articles, author blog India, motivational blog, personal growth articles, storytelling blog, creative writing tips, healing through writing, inspirational articles, Indian author blog, Rohit Upadhyay writings" />
        <meta name="author" content="Rohit Upadhyay" />
        <link rel="canonical" href="https://rohit.upadhyayji.me/blog" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rohit.upadhyayji.me/blog" />
        <meta property="og:title" content="Blog by Rohit Upadhyay — Writings on Life, Growth & Storytelling" />
        <meta property="og:description" content="Explore inspiring blog posts by Indian author Rohit Upadhyay on personal growth, healing, motivation, and creative storytelling." />
        <meta property="og:image" content="https://rohit.upadhyayji.me/rohit.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Rohit Upadhyay - Author" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@rohit5upadhyay" />
        <meta name="twitter:creator" content="@rohit5upadhyay" />
        <meta name="twitter:title" content="Blog by Rohit Upadhyay — Writings on Life & Growth" />
        <meta name="twitter:description" content="Inspiring articles on personal growth, healing, and storytelling by Indian author Rohit Upadhyay." />
        <meta name="twitter:image" content="https://rohit.upadhyayji.me/rohit.webp" />
        
        {/* Structured Data — Blog + BreadcrumbList */}
        <script type="application/ld+json">{`{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Blog",
              "@id": "https://rohit.upadhyayji.me/blog#blog",
              "name": "Rohit Upadhyay Blog",
              "url": "https://rohit.upadhyayji.me/blog",
              "description": "Blog by Indian author Rohit Upadhyay featuring articles on personal growth, healing, storytelling, and motivation.",
              "inLanguage": "en-IN",
              "isPartOf": { "@id": "https://rohit.upadhyayji.me/#website" },
              "author": {
                "@type": "Person",
                "@id": "https://rohit.upadhyayji.me/#author",
                "name": "Rohit Upadhyay",
                "url": "https://rohit.upadhyayji.me"
              },
              "publisher": {
                "@type": "Person",
                "@id": "https://rohit.upadhyayji.me/#author",
                "name": "Rohit Upadhyay",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://rohit.upadhyayji.me/favicon.webp"
                }
              }
            },
            {
              "@type": "BreadcrumbList",
              "@id": "https://rohit.upadhyayji.me/blog#breadcrumb",
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
                  "name": "Blog",
                  "item": "https://rohit.upadhyayji.me/blog"
                }
              ]
            }
          ]
        }`}</script>
      </Helmet>

      <section className="py-12 md:py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12"
          >
            <div>
              <p className="text-gold text-sm font-medium tracking-[0.3em] uppercase mb-2">Writings & Reflections</p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy">Blog</h1>
            </div>
            {isAdmin() && (
              <Link
                to="/blog/new"
                className="px-6 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Post
              </Link>
            )}
          </motion.div>

          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 rounded-2xl p-8 max-w-md mx-auto border border-red-100">
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
                <p className="text-slate font-serif text-lg">No stories yet. Check back soon.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {featuredPost && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Link to={`/blog/${featuredPost.id}`}>
                    <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col md:flex-row">
                      <div className="w-full md:w-2/3 relative overflow-hidden">
                        <img
                          src={featuredPost.imageUrl}
                          alt={featuredPost.title}
                          loading="eager"
                          className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover transition-transform duration-700 hover:scale-105"
                        />
                      </div>
                      <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {featuredPost.category.map((cat) => (
                              <span key={cat} className="text-xs text-gold bg-gold-50 px-3 py-1 rounded-full border border-gold/15 font-medium">
                                {cat}
                              </span>
                            ))}
                          </div>
                          <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy mb-4 leading-tight">
                            {featuredPost.title}
                          </h2>
                          <p className="text-slate mb-4 line-clamp-3 leading-relaxed">{featuredPost.excerpt}</p>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate/60 pt-4 border-t border-navy/5">
                          <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                          <div className="flex items-center gap-3">
                            <LikeCount count={featuredPost.likes} />
                            <span>{calculateReadingTime(featuredPost.content)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="group"
                  >
                    <Link to={`/blog/${post.id}`} className="block">
                      <div className="glass-card glass-card-hover rounded-2xl overflow-hidden">
                        <div className="relative w-full aspect-[16/9] overflow-hidden">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            {post.category.map((cat) => (
                              <span key={cat} className="text-xs text-navy bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-navy/5 font-medium">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-5 md:p-6">
                          <h2 className="font-serif text-lg md:text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors duration-300 line-clamp-2 leading-tight">
                            {post.title}
                          </h2>
                          <p className="text-slate mb-4 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                          <div className="flex justify-between items-center text-xs text-slate/60 pt-3 border-t border-navy/5">
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                            <div className="flex items-center gap-3">
                              <LikeCount count={post.likes} />
                              <span>{calculateReadingTime(post.content)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {isAdmin() && (
                      <div className="mt-3 pt-3 border-t border-navy/5 flex justify-end gap-4">
                        <Link to={`/blog/edit/${post.id}`} className="text-xs text-gold hover:text-gold-dark transition-colors">Edit</Link>
                        <button onClick={() => handleDelete(post.id)} className="text-xs text-red-500 hover:text-red-600 transition-colors">Delete</button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Blog;