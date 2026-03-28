import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaTwitter, FaLinkedinIn, FaHeart } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { databases } from '../appwrite/appwriteConfig';
import { useAuth } from '../appwrite/auth';
import conf from '../config/conf';
import { motion } from 'framer-motion';

interface BlogPostData {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string[];
  imageUrl: string;
  likes: number;
  likedBy: string[];
}

const categoryColors: { [key: string]: string } = {
  Technology: 'bg-blue-50 text-blue-700 border-blue-100',
  Lifestyle: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Travel: 'bg-purple-50 text-purple-700 border-purple-100',
  Education: 'bg-amber-50 text-amber-700 border-amber-100',
};

const LoadingSkeleton = () => (
  <div className="max-w-4xl mx-auto">
    <div className="skeleton h-8 w-32 mb-8 rounded-lg" />
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="skeleton h-[300px] md:h-[400px]" />
      <div className="p-8 space-y-4">
        <div className="skeleton h-4 w-24 rounded-full" />
        <div className="skeleton h-8 w-3/4" />
        <div className="skeleton h-4 w-32" />
        <div className="section-divider my-6" />
        <div className="space-y-3">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
        </div>
      </div>
    </div>
  </div>
);

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchPost(); }, [id]);

  useEffect(() => {
    if (post) {
      const guestLike = localStorage.getItem(`blog_like_${post.id}`);
      const userLike = user ? post.likedBy?.includes(user.$id) : false;
      setIsLiked(userLike || guestLike === 'true');
      setLikeCount(post.likes || 0);
    }
  }, [post, user]);

  const fetchPost = async () => {
    try {
      const response = await databases.getDocument(conf.appwriteDatabaseId, conf.appwriteBlogCollectionId, id!);
      setPost({
        id: response.$id, title: response.title, excerpt: response.excerpt, content: response.content,
        date: response.date, category: response.category, imageUrl: response.imageUrl,
        likes: response.likes || 0, likedBy: response.likedBy || [],
      });
    } catch {
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post || isLikeLoading) return;
    try {
      setIsLikeLoading(true);
      if (user) {
        if (isLiked) return;
        const updatedLikedBy = [...post.likedBy, user.$id];
        await databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteBlogCollectionId, post.id, { likes: post.likes + 1, likedBy: updatedLikedBy });
      } else {
        if (localStorage.getItem(`blog_like_${post.id}`) === 'true') return;
        await databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteBlogCollectionId, post.id, { likes: post.likes + 1, likedBy: post.likedBy });
        localStorage.setItem(`blog_like_${post.id}`, 'true');
      }
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
    } catch (error) {
      console.error('Error updating likes:', error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteBlogCollectionId, id!);
      navigate('/blog');
    } catch {
      setError('Failed to delete the blog post');
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (loading) return <section className="py-12 px-6"><LoadingSkeleton /></section>;
  if (error) return (
    <section className="py-16 px-6 text-center">
      <div className="bg-red-50 rounded-2xl p-8 max-w-md mx-auto border border-red-100">
        <p className="text-red-600">{error}</p>
      </div>
    </section>
  );
  if (!post) return (
    <section className="py-16 px-6 text-center">
      <p className="text-slate font-serif text-lg">Post not found</p>
    </section>
  );

  return (
    <section className="relative py-12 px-6 overflow-hidden">
      <Helmet>
        <title>{post.title} | Rohit Upadhyay — Indian Author Blog</title>
        <meta name="title" content={`${post.title} | Rohit Upadhyay — Indian Author Blog`} />
        <meta name="description" content={post.excerpt.length > 155 ? post.excerpt.slice(0, 152) + '...' : post.excerpt} />
        <meta name="keywords" content={`${post.title}, Rohit Upadhyay blog, Rohit Upadhyay article, ${post.category.join(', ')}, Indian author, motivational writing, personal growth`} />
        <meta name="author" content="Rohit Upadhyay" />
        <link rel="canonical" href={`https://rohit.upadhyayji.me/blog/${post.id}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://rohit.upadhyayji.me/blog/${post.id}`} />
        <meta property="og:title" content={`${post.title} | Rohit Upadhyay`} />
        <meta property="og:description" content={post.excerpt.slice(0, 200)} />
        <meta property="og:image" content={post.imageUrl || 'https://rohit.upadhyayji.me/rohit.webp'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={post.title} />
        <meta property="og:site_name" content="Rohit Upadhyay - Author" />
        <meta property="article:published_time" content={new Date(post.date).toISOString()} />
        <meta property="article:author" content="https://rohit.upadhyayji.me/about" />
        <meta property="article:section" content={post.category[0] || 'Blog'} />
        {post.category.map(cat => (
          <meta key={cat} property="article:tag" content={cat} />
        ))}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@rohit5upadhyay" />
        <meta name="twitter:creator" content="@rohit5upadhyay" />
        <meta name="twitter:title" content={`${post.title} | Rohit Upadhyay`} />
        <meta name="twitter:description" content={post.excerpt.slice(0, 200)} />
        <meta name="twitter:image" content={post.imageUrl || 'https://rohit.upadhyayji.me/rohit.webp'} />
        
        {/* Structured Data — Article + BreadcrumbList */}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Article',
              '@id': `https://rohit.upadhyayji.me/blog/${post.id}#article`,
              'headline': post.title,
              'description': post.excerpt.slice(0, 200),
              'image': {
                '@type': 'ImageObject',
                'url': post.imageUrl || 'https://rohit.upadhyayji.me/rohit.webp',
                'width': 1200,
                'height': 630
              },
              'datePublished': new Date(post.date).toISOString(),
              'dateModified': new Date(post.date).toISOString(),
              'author': {
                '@type': 'Person',
                '@id': 'https://rohit.upadhyayji.me/#author',
                'name': 'Rohit Upadhyay',
                'url': 'https://rohit.upadhyayji.me',
                'image': 'https://rohit.upadhyayji.me/rohit.webp'
              },
              'publisher': {
                '@type': 'Person',
                '@id': 'https://rohit.upadhyayji.me/#author',
                'name': 'Rohit Upadhyay',
                'logo': {
                  '@type': 'ImageObject',
                  'url': 'https://rohit.upadhyayji.me/favicon.webp'
                }
              },
              'mainEntityOfPage': {
                '@type': 'WebPage',
                '@id': `https://rohit.upadhyayji.me/blog/${post.id}`
              },
              'isPartOf': {
                '@id': 'https://rohit.upadhyayji.me/blog#blog'
              },
              'keywords': post.category.join(', '),
              'url': `https://rohit.upadhyayji.me/blog/${post.id}`,
              'inLanguage': 'en-IN',
              'articleSection': post.category[0] || 'Blog'
            },
            {
              '@type': 'BreadcrumbList',
              '@id': `https://rohit.upadhyayji.me/blog/${post.id}#breadcrumb`,
              'itemListElement': [
                {
                  '@type': 'ListItem',
                  'position': 1,
                  'name': 'Home',
                  'item': 'https://rohit.upadhyayji.me/'
                },
                {
                  '@type': 'ListItem',
                  'position': 2,
                  'name': 'Blog',
                  'item': 'https://rohit.upadhyayji.me/blog'
                },
                {
                  '@type': 'ListItem',
                  'position': 3,
                  'name': post.title,
                  'item': `https://rohit.upadhyayji.me/blog/${post.id}`
                }
              ]
            }
          ]
        })}</script>
      </Helmet>
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
        <span className="text-center text-navy/[0.02] text-6xl md:text-9xl font-serif font-bold tracking-widest rotate-[-30deg]">
          Rohit Upadhyay
        </span>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link to="/blog" className="inline-flex items-center text-slate hover:text-gold transition-colors duration-200 mb-8 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl overflow-hidden shadow-xl shadow-navy/5 border border-navy/5"
        >
          <div className="relative overflow-hidden">
            <img src={post.imageUrl} alt={post.title} loading="eager" className="w-full h-[300px] md:h-[400px] object-cover" />
          </div>

          <div className="p-6 md:p-10 leading-relaxed">
            <div className="flex flex-wrap gap-2 mb-6">
              {post.category.map(cat => (
                <span key={cat} className={`text-xs font-medium px-3 py-1 rounded-full border ${categoryColors[cat] || 'bg-ivory-warm text-navy border-navy/10'}`}>
                  {cat}
                </span>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy leading-tight">{post.title}</h1>
              <button
                onClick={handleLike}
                disabled={isLikeLoading || isLiked}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm flex-shrink-0 ${isLiked
                  ? 'bg-red-50 text-red-500 border border-red-100 cursor-default'
                  : 'bg-ivory-warm text-slate border border-navy/10 hover:bg-red-50 hover:text-red-500 hover:border-red-100'
                  }`}
              >
                <FaHeart className={isLiked ? 'animate-bounce' : ''} />
                <span>{likeCount}</span>
              </button>
            </div>

            <div className="flex items-center text-slate text-sm mb-6">
              <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            <div className="flex gap-3 mb-8">
              {[
                { icon: FaWhatsapp, color: 'text-green-600 hover:text-green-700', href: `https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " " + currentUrl)}`, label: 'WhatsApp' },
                { icon: FaTwitter, color: 'text-sky-600 hover:text-sky-700', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(post.title)}`, label: 'Twitter' },
                { icon: FaLinkedinIn, color: 'text-blue-600 hover:text-blue-700', href: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(post.title)}`, label: 'LinkedIn' },
              ].map(({ icon: Icon, color, href, label }) => (
                <a key={label} className={`flex items-center gap-1.5 ${color} transition-colors duration-200 text-sm`} href={href} target="_blank" rel="noopener noreferrer">
                  <Icon /> {label}
                </a>
              ))}
            </div>

            <div className="section-divider my-8" />

            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

            {isAdmin() && (
              <div className="mt-10 pt-6 border-t border-navy/5 flex justify-end gap-4">
                <Link to={`/blog/edit/${post.id}`} className="px-5 py-2.5 bg-gold-50 text-gold border border-gold/20 rounded-xl hover:bg-gold-100 transition-all text-sm">
                  Edit
                </Link>
                <button onClick={handleDelete} className="px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-all text-sm">
                  Delete
                </button>
              </div>
            )}
          </div>
        </motion.article>
      </div>
    </section>
  );
}

export default BlogPost;