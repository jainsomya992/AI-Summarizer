import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword
} from 'firebase/auth';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA561oIv2rlwDZ-xNEb9zi0-c36mN1WY1I",
  authDomain: "ai-summarizer-3fce0.firebaseapp.com",
  projectId: "ai-summarizer-3fce0",
  storageBucket: "ai-summarizer-3fce0.appspot.com",
  messagingSenderId: "275199101838",
  appId: "1:275199101838:web:64caf6f0d837ca081d32df",
  measurementId: "G-GE598S8DLB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function for email/password sign-in
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in with email and password:", error);
    throw error;
  }
};

// Function for email/password sign-up
export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up with email and password:", error);
    throw error;
  }
};

// Function for Google sign-in using redirect
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google (redirect):", error);
    throw error;
  }
};

// Function for signing out
export const signOutUser = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Function to handle redirect result (call this in a useEffect)
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      console.log("Google sign-in redirect successful:", result.user);
      return result.user;
    }
    return null;
  } catch (error) {
    console.error("Error handling redirect result:", error);
    throw error;
  }
};

// Exports
export { auth };
export default app;
