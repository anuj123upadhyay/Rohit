import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../appwrite/auth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'admin';
}

function Signup() {
  const [formData, setFormData] = useState<SignupForm>({
    name: '', email: '', password: '', confirmPassword: '', role: 'user',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup, loginWithGoogleOnSignUpPage } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    setIsLoading(true);
    try {
      await signup(formData.email, formData.password, formData.name, formData.role);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      await loginWithGoogleOnSignUpPage();
    } catch {
      setError("Google sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 bg-ivory-warm text-navy border border-navy/10 rounded-xl
    placeholder-slate/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold
    transition-all duration-200`;

  return (
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
              alt="Signup"
              loading="eager"
              fetchPriority="high"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
          </div>

          {/* Form Section */}
          <div className="md:w-1/2 p-8 sm:p-10">
            <h2 className="text-center font-serif text-4xl font-bold text-navy mb-2">
              Create Account
            </h2>
            <p className="text-center text-slate mb-6">Join our community today</p>

            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Full Name</label>
                <input
                  type="text" required className={inputClass}
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Email Address</label>
                <input
                  type="email" required className={inputClass}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Account Type</label>
                <select
                  className={`${inputClass} appearance-none`}
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
                >
                  <option value="user">User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required autoComplete="new-password" className={inputClass}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-gold transition-colors duration-200"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required autoComplete="new-password" className={inputClass}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-gold transition-colors duration-200"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${isLoading
                    ? 'bg-navy/40 text-white cursor-not-allowed'
                    : 'bg-navy text-white hover:bg-navy-light hover:shadow-lg hover:shadow-navy/10'
                  }`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Login link */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-navy/8" /></div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-slate">Already have an account?</span>
                </div>
              </div>

              <Link
                to="/login"
                className="mt-5 block w-full py-3 px-4 rounded-xl border-2 border-gold
                         text-center text-sm font-semibold text-gold hover:bg-gold-50
                         transition-all duration-200"
              >
                Sign in with Email
              </Link>
            </div>

            {/* Google login */}
            <div className="mt-5">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-navy/8" /></div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-slate">Or continue with</span>
                </div>
              </div>

              <div className="mt-5">
                <button
                  onClick={handleGoogleLogin} disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4
                           border border-navy/10 rounded-xl bg-ivory-warm
                           text-sm font-medium text-navy
                           hover:bg-ivory-dark hover:border-navy/15 transition-all duration-200"
                >
                  <FcGoogle className="h-5 w-5" />
                  Sign up with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;