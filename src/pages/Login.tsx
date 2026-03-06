import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../appwrite/auth";
import { FcGoogle } from 'react-icons/fc';
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      setError(null);
    } catch {
      // handled silently
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Rohit Upadhyay</title>
        <meta name="description" content="Login to your account on Rohit Upadhyay's website." />
        <meta property="og:title" content="Login - Rohit Upadhyay" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rohit.upadhyayji.me/login" />
        <link rel="canonical" href="https://rohit.upadhyayji.me/login" />
      </Helmet>

      <div className="min-h-screen bg-ivory flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl w-full bg-white rounded-2xl shadow-xl shadow-navy/8 overflow-hidden border border-navy/5"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-1/2 hidden md:block relative">
              <img
                src="/login.webp"
                alt="Login"
                loading="eager"
                fetchPriority="high"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
            </div>

            {/* Form Section */}
            <div className="md:w-1/2 p-8 sm:p-10">
              <h2 className="text-center font-serif text-4xl font-bold text-navy mb-2">
                Welcome Back
              </h2>
              <p className="text-center text-slate mb-6">
                Sign in to continue
              </p>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-navy mb-1.5">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-ivory-warm text-navy border border-navy/10 rounded-xl
                             placeholder-slate/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold
                             transition-all duration-200"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-navy mb-1.5">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 bg-ivory-warm text-navy border border-navy/10 rounded-xl
                             placeholder-slate/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold
                             transition-all duration-200"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-gold hover:text-gold-dark transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${isLoading
                    ? "bg-navy/40 text-white cursor-not-allowed"
                    : "bg-navy text-white hover:bg-navy-light hover:shadow-lg hover:shadow-navy/10"
                    }`}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-navy/8" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-slate">Or continue with</span>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4
                             border border-navy/10 rounded-xl bg-ivory-warm
                             text-sm font-medium text-navy
                             hover:bg-ivory-dark hover:border-navy/15 transition-all duration-200"
                  >
                    <FcGoogle className="h-5 w-5" />
                    Sign in with Google
                  </button>
                </div>
              </div>

              {/* Signup Link */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-navy/8" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-slate">New here?</span>
                  </div>
                </div>

                <div className="mt-5">
                  <Link
                    to="/signup"
                    className="w-full inline-flex justify-center py-3 px-4 border-2 border-gold
                             rounded-xl text-sm font-semibold text-gold
                             hover:bg-gold-50 transition-all duration-200"
                  >
                    Create new account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default Login;
