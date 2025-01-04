

import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../appwrite/auth';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'admin';
}

function Signup() {
  const [formData, setFormData] = useState<SignupForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await signup(
        formData.email, 
        formData.password, 
        formData.name,
        formData.role
      );
      navigate('/verify-email');
    } catch (error: any) {
      setError(error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 hidden md:block">
            <img
              src="/login.jpg"
              alt="Signup Image"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form Section */}
          <div className="md:w-1/2 p-8 sm:p-10">
            <h2 className="text-center text-4xl font-bold text-gold mb-2">
              Create Account
            </h2>
            <p className="text-center text-gray-400 mb-6">Join our community today</p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-500 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                           text-white placeholder-gray-400 
                           focus:ring-2 focus:ring-gold/50 focus:border-transparent
                           transition-all duration-200"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                           text-white placeholder-gray-400 
                           focus:ring-2 focus:ring-gold/50 focus:border-transparent
                           transition-all duration-200"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gold mb-1">
                  Account Type
                </label>
                <select
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                           text-white appearance-none
                           focus:ring-2 focus:ring-gold/50 focus:border-transparent
                           transition-all duration-200"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
                >
                  <option value="user">User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                           text-white placeholder-gray-400 
                           focus:ring-2 focus:ring-gold/50 focus:border-transparent
                           transition-all duration-200"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gold mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                           text-white placeholder-gray-400 
                           focus:ring-2 focus:ring-gold/50 focus:border-transparent
                           transition-all duration-200"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-lg
                         text-sm font-medium transition-all duration-200
                         ${isLoading 
                           ? 'bg-gold/50 cursor-not-allowed' 
                           : 'bg-gold text-black hover:bg-gold/90 transform hover:-translate-y-0.5'
                         }`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">
                    Already have an account?
                  </span>
                </div>
              </div>

              <Link
                to="/login"
                className="mt-6 block w-full py-3 px-4 rounded-lg border border-white/10
                         text-center text-sm font-medium text-white hover:bg-white/5
                         transition-all duration-200"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;