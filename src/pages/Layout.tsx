
import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import { useAuth } from "../appwrite/auth";
import { useNewsletter } from "../hooks/useNewsletter";
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTwitter, FaLinkedin, FaInstagram, FaFacebook, FaEnvelope } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';

const BANNER_MAPPING: Record<string, string> = {
  "/": "/home.webp",
  "/about": "/about.webp",
  "/blog": "/blogs.webp",
  "/contact": "/contact.webp",
  "/pictures": "/pictures.webp",
  "/books": "/book.webp",
};

const PAGE_TITLES: Record<string, string> = {
  "/": "Rohit Upadhyay",
  "/about": "About",
  "/blog": "Blog",
  "/contact": "Contact",
  "/pictures": "Story Board",
  "/books": "Books",
};

const NAV_LINKS = [
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blogs" },
  { to: "/books", label: "Books" },
  { to: "/pictures", label: "Story Board" },
  { to: "/contact", label: "Contact" },
];

function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(BANNER_MAPPING["/"]);
  const [isChangingBanner, setIsChangingBanner] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isNewsletterVisible, setIsNewsletterVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState("");

  const { isSubscribing, subscribe } = useNewsletter();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setIsChangingBanner(true);
    const newBanner =
      BANNER_MAPPING[location.pathname as keyof typeof BANNER_MAPPING] ||
      BANNER_MAPPING["/"];
    setTimeout(() => {
      setCurrentBanner(newBanner);
      setIsChangingBanner(false);
    }, 300);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const hasSeenNewsletter = sessionStorage.getItem("newsletter_dismissed");
    if (!hasSeenNewsletter) {
      const timer = setTimeout(() => setIsNewsletterVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoutClick = () => setShowLogoutConfirm(true);

  const handleConfirmLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:");
    }
    setShowLogoutConfirm(false);
  };

  const handleNewsletterDismiss = () => {
    setIsNewsletterVisible(false);
    sessionStorage.setItem("newsletter_dismissed", "true");
  };

  const handleSubscribe = async () => {
    try {
      if (!email || !email.includes('@')) {
        toast.error('Please enter a valid email address');
        return;
      }
      const success = await subscribe(email);
      if (success) {
        handleNewsletterDismiss();
        setEmail('');
        toast.success('Successfully subscribed!');
      }
    } catch (error) {
      console.error('Newsletter subscription failed:');
      toast.error('Failed to subscribe. Please try again later.');
    }
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <div className="min-h-screen bg-ivory text-navy flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          success: { style: { background: '#F0FAF4', color: '#166534', border: '1px solid #BBF7D0' } },
          error: { style: { background: '#FFF1F2', color: '#9F1239', border: '1px solid #FECDD3' } },
          duration: 3000,
        }}
      />

      {/* ─── Magazine-style Header Banner ─── */}
      <header className="relative">
        <div className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden bg-ivory">
          <img
            src={currentBanner}
            alt="Page Banner"
            loading="eager"
            fetchPriority="high"
            className={`w-full h-full object-cover transition-transform duration-1000 ${isChangingBanner ? "scale-105 opacity-80" : "scale-100 opacity-100"
              }`}
          />

          {/* Soft light overlay that blends into the page */}
          <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/40 to-transparent" />

          {/* Subtle top vignette to frame the image */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-navy/10 to-transparent" />

          {/* Typography positioned bottom-left like an editorial spread */}
          <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 pb-8 md:pb-12 max-w-7xl mx-auto flex items-end justify-between">
            <div className="max-w-2xl">
              <motion.div
                key={location.pathname + "-line"}
                initial={{ width: 0 }}
                animate={{ width: "3rem" }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="h-px bg-gold mb-4"
              />
              <motion.h2
                key={location.pathname + "-title"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="font-serif text-4xl md:text-5xl lg:text-6xl text-navy font-bold leading-none tracking-tight"
              >
                {PAGE_TITLES[location.pathname] || "Rohit Upadhyay"}
              </motion.h2>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Navigation ─── */}
      <nav className={`sticky top-0 z-40 transition-all duration-500 ${isScrolled
        ? "bg-white/95 backdrop-blur-xl shadow-md shadow-navy/5 border-b border-gold/10"
        : "bg-ivory-warm/90 backdrop-blur-md"
        }`}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <NavLink to="/" className="font-serif text-xl md:text-2xl text-navy font-bold tracking-wide">
              Rohit Upadhyay
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `relative text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${isActive ? "text-gold" : "text-slate hover:text-gold"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && (
                        <motion.div
                          layoutId="nav-underline"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-gold-dark rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}

              {user ? (
                <button
                  onClick={handleLogoutClick}
                  className="text-sm font-medium tracking-wide uppercase text-slate hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className="px-5 py-2 text-sm font-medium bg-navy text-white rounded-full hover:bg-navy-light transition-all duration-300"
                >
                  Login
                </NavLink>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-navy hover:text-gold transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-gold/10"
            >
              <div className="px-4 py-4 space-y-1 bg-white/95 backdrop-blur-xl">
                {NAV_LINKS.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `block py-3 px-4 rounded-lg text-sm font-medium tracking-wide uppercase transition-all duration-200 ${isActive
                        ? "text-gold bg-gold-50"
                        : "text-slate hover:text-gold hover:bg-ivory-warm"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                {user ? (
                  <button
                    onClick={handleLogoutClick}
                    className="block w-full text-left py-3 px-4 rounded-lg text-sm font-medium tracking-wide uppercase text-slate hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    Logout
                  </button>
                ) : (
                  <NavLink
                    to="/login"
                    className="block py-3 px-4 rounded-lg text-sm font-medium tracking-wide uppercase text-navy bg-navy/5"
                  >
                    Login
                  </NavLink>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── Newsletter Modal ─── */}
      <AnimatePresence>
        {isNewsletterVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          >
            <div className="fixed inset-0 bg-navy/30 backdrop-blur-sm" onClick={handleNewsletterDismiss} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-white rounded-2xl w-[90%] md:w-[450px] p-8 md:p-10 text-center shadow-2xl shadow-navy/10 border border-gold/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleNewsletterDismiss}
                className="absolute right-4 top-4 p-2 text-slate hover:text-red-500 transition-colors duration-200"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="space-y-5">
                <div className="w-12 h-12 mx-auto rounded-full bg-gold-50 flex items-center justify-center">
                  <FaEnvelope className="text-gold text-xl" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy">
                  Join Rohit's Inner Circle
                </h2>
                <p className="text-slate text-sm md:text-base leading-relaxed">
                  Get exclusive stories, writing insights, and early access to new works — delivered to your inbox.
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3 rounded-xl bg-ivory-warm border border-navy/10 text-navy placeholder-slate/50
                             focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubscribing}
                  />
                  <button
                    className={`px-6 py-3 bg-gradient-to-r from-gold to-gold-dark text-white font-semibold
                              rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all duration-300
                              ${isSubscribing ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleSubscribe}
                    disabled={isSubscribing}
                  >
                    {isSubscribing ? "..." : "Subscribe"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Page Content ─── */}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-grow"
      >
        <Outlet />
      </motion.main>

      {/* ─── Logout Confirmation ─── */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="fixed inset-0 bg-navy/30 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl shadow-navy/10 border border-navy/5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <h2 className="font-serif text-xl font-bold text-navy mb-4">Confirm Logout</h2>
                <p className="text-slate mb-6">Are you sure you want to logout?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-6 py-2.5 text-slate hover:text-navy transition-colors rounded-xl hover:bg-ivory-warm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmLogout}
                    className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-200"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Footer ─── */}
      <footer className="relative mt-auto overflow-hidden">
        {/* Mobile: Logo image background */}
        <img
          src="/footer.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-20 md:hidden grayscale mix-blend-screen"
        />

        {/* Desktop: animated GIF signature background */}
        <img
          src="/rohit-signature.gif"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 hidden md:block"
        />

        {/* Rich dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C1829]/90 via-[#101E36]/85 to-[#0A1525]/95" />

        {/* Top gold ornamental line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent z-10" />

        {/* Footer content on top */}
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div className="space-y-4">
                {/* <h3 className="font-serif text-2xl font-bold text-gold-light">"Every life tells a story. Let yours inspire the world."</h3> */}
                <p className="text-white/50 text-sm leading-relaxed italic font-serif">
                  "Every life tells a story. Let yours inspire the world."
                </p>
                <div className="relative w-14 h-14 rounded-xl overflow-hidden group border border-white/10">
                  <img
                    src="/footer.webp"
                    alt="Rohit Upadhyay Logo"
                    width={281}
                    height={350}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-serif text-lg text-gold-light font-semibold">Explore</h4>
                <div className="grid grid-cols-2 gap-2">
                  {NAV_LINKS.map(({ to, label }) => (
                    <NavLink key={to} to={to} className="text-sm text-white/50 hover:text-gold-light transition-colors duration-200">
                      {label}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-serif text-lg text-gold-light font-semibold">Connect</h4>
                <div className="flex gap-3">
                  {[
                    { icon: FaTwitter, href: "https://twitter.com/rohit5upadhyay", label: "Twitter" },
                    { icon: FaLinkedin, href: "https://linkedin.com/in/rohit5upadhyay", label: "LinkedIn" },
                    { icon: FaInstagram, href: "https://instagram.com/imrohi05", label: "Instagram" },
                    { icon: FaEnvelope, href: "mailto:upadhyayr8171@gmail.com", label: "Email" },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("mailto") ? undefined : "_blank"}
                      rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-gold-light hover:border-gold/25 hover:bg-gold/5 transition-all duration-300"
                      aria-label={label}
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mt-10 mb-5" />
            <p className="text-center text-xs text-white/30">
              &copy; {new Date().getFullYear()} Rohit Upadhyay. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;