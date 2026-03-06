import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../appwrite/auth';
import { motion } from 'framer-motion';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <h2 className="text-center font-serif text-3xl font-bold text-navy mb-2">
          Reset your password
        </h2>
        <p className="text-center text-slate text-sm mb-8">
          Enter your email and we'll send you reset instructions
        </p>

        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-navy/8 rounded-2xl border border-navy/5">
          {success ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm">
                Check your email for password reset instructions.
              </div>
              <Link to="/login" className="text-gold hover:text-gold-dark font-medium transition-colors text-sm">
                Return to login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${isLoading
                      ? 'bg-navy/40 text-white cursor-not-allowed'
                      : 'bg-navy text-white hover:bg-navy-light hover:shadow-lg hover:shadow-navy/10'
                    }`}
                >
                  {isLoading ? 'Sending...' : 'Send reset instructions'}
                </button>
              </form>

              <div className="mt-5 text-center">
                <Link to="/login" className="text-gold hover:text-gold-dark font-medium transition-colors text-sm">
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;