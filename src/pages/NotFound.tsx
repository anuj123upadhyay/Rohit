import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card rounded-2xl p-10 md:p-14 max-w-md w-full text-center"
      >
        <h1 className="font-serif text-7xl md:text-8xl font-bold gold-gradient-text mb-4">404</h1>
        <p className="text-xl text-navy mb-3 font-serif">Page not found</p>
        <p className="text-slate mb-8 text-sm leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light hover:shadow-lg transition-all duration-300 text-sm"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;