import { useState, useEffect } from "react";
import AuthForm from './services/authform';  
import './App.css';
import Hero from './components/Hero';
import Demo from './components/Demo';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, signOutUser } from './services/firebase';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleLogout = async () => {
    await signOutUser();
    alert('Logged out!');
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User signed in:', user);
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };

  return (
    <main>
      <div className='main'>
        <div className='gradient' />

        <div className="w-full flex justify-end items-center p-4 max-w-7xl mx-auto z-20 relative">
          <button
            onClick={toggleDarkMode}
            className="border px-4 py-2 rounded text-sm text-current hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>

          {user && (
            <button
              onClick={handleLogout}
              className="border px-4 py-2 rounded text-sm text-current hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          )}
        </div>

        <div className="w-full flex justify-center items-center mt-5">
          <h1 className={`text-4xl font-extrabold drop-shadow-sm text-center ${darkMode ? 'text-white' : 'text-black'}`}>
            AI Article Summarizer
          </h1>
        </div>

        {!user ? (
          <div className="mt-8">
            <AuthForm onGoogleSignIn={handleGoogleSignIn} />
          </div>
        ) : (
          <div className='app'>
            <Hero />
            <Demo language={language} setLanguage={setLanguage} />
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
