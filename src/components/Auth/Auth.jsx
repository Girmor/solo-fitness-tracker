import React, { useState } from 'react';

const Auth = ({ onSignIn, onSignUp, onGoogleSignIn, syncEnabled }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!syncEnabled) {
    return (
      <div className="border-2 border-yellow-500 p-6 bg-yellow-900/10 text-center">
        <h3 className="text-yellow-500 font-bold mb-2">☁️ Cloud Sync Not Configured</h3>
        <p className="text-sm text-gray-400 mb-4">
          To enable cloud sync, set up Supabase:
        </p>
        <ol className="text-xs text-left text-gray-400 space-y-1 mb-4">
          <li>1. Create account at supabase.com (free)</li>
          <li>2. Create new project</li>
          <li>3. Get URL and anon key from Settings → API</li>
          <li>4. Create .env file with your keys</li>
          <li>5. Run SQL in Supabase SQL Editor (see src/config/supabase.js)</li>
        </ol>
        <p className="text-xs text-gray-500">Your data is still saved locally</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = isSignUp
        ? await onSignUp(email, password)
        : await onSignIn(email, password);

      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await onGoogleSignIn();
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-neon-blue p-6 bg-system-darker">
      <h3 className="text-neon-blue font-bold text-lg mb-4 text-center">
        ☁️ Cloud Sync
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-600 px-4 py-2 text-white"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-gray-800 border border-gray-600 px-4 py-2 text-white"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-neon-blue hover:bg-neon-cyan text-black px-6 py-3 font-bold transition disabled:opacity-50"
        >
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-sm text-gray-400 hover:text-neon-blue"
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-system-darker text-gray-400">OR</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white hover:bg-gray-100 text-black px-6 py-3 font-bold transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Your data will sync across all your devices</p>
        <p className="mt-1">Local data is still available offline</p>
      </div>
    </div>
  );
};

export default Auth;
