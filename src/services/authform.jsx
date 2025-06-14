import React, { useState, useEffect } from 'react';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  handleRedirectResult
} from '../services/firebase'; // adjust the path as needed

const AuthForm = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle redirect result on mount
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const user = await handleRedirectResult();
        if (user) {
          alert(`Signed in successfully via Google as ${user.email}`);
        }
      } catch (err) {
        console.error('Redirect sign-in error:', err);
        setError(err.message);
      }
    };

    checkRedirectResult();
  }, []);

  // Email/Password form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        alert('Logged in successfully!');
      } else {
        await signUpWithEmail(email, password);
        alert('Account created successfully!');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Google Sign-In button handler (via redirect)
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle(); // triggers redirect
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full border border-gray-300 rounded-lg p-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full border border-gray-300 rounded-lg p-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <button
        onClick={handleGoogleSignIn}
        className="w-full mt-3 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
      >
        Continue with Google
      </button>

      <p className="mt-4 text-center text-sm">
        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="text-blue-600 ml-1 underline"
        >
          {mode === 'login' ? 'Sign up' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
