import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const USERS_COLLECTION = 'users';

/**
 * User Model Structure in Firestore:
 * {
 *   uid: string (Firebase Auth UID),
 *   username: string,
 *   fullName: string,
 *   email: string,
 *   role: string ('admin' | 'user'),
 *   createdAt: Timestamp,
 *   updatedAt: Timestamp,
 *   lastLogin: Timestamp
 * }
 */

// ==================== SIGN UP ====================

/**
 * Register a new user with email and password
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.fullName - Full name
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @param {string} userData.role - User role (default: 'user')
 * @returns {Promise<Object>} User data with UID
 */
export const signUp = async (userData) => {
  try {
    const { username, fullName, email, password, role = 'user' } = userData;

    // Validate required fields
    if (!username || !fullName || !email || !password) {
      throw new Error('Semua field wajib diisi');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Format email tidak valid');
    }

    // Validate password length
    if (password.length < 6) {
      throw new Error('Password minimal 6 karakter');
    }

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name in Firebase Auth
    await updateProfile(user, {
      displayName: fullName
    });

    // Create user document in Firestore
    const userDoc = {
      uid: user.uid,
      username,
      fullName,
      email,
      role,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      lastLogin: Timestamp.now()
    };

    await setDoc(doc(db, USERS_COLLECTION, user.uid), userDoc);

    console.log('User registered successfully:', user.uid);

    return {
      uid: user.uid,
      username,
      fullName,
      email,
      role
    };
  } catch (error) {
    console.error('Error signing up:', error);
    
    // Handle Firebase Auth errors
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email sudah terdaftar');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Format email tidak valid');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password terlalu lemah');
    } else {
      throw error;
    }
  }
};

// ==================== LOGIN ====================

/**
 * Sign in user with email and password
 * @param {string} email - Email address
 * @param {string} password - Password
 * @returns {Promise<Object>} User data
 */
export const login = async (email, password) => {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email dan password wajib diisi');
    }

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user document from Firestore
    const userDocRef = doc(db, USERS_COLLECTION, user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error('Data pengguna tidak ditemukan');
    }

    const userData = userDocSnap.data();

    // Update last login time
    await updateDoc(userDocRef, {
      lastLogin: Timestamp.now()
    });

    console.log('User logged in successfully:', user.uid);

    return {
      uid: user.uid,
      username: userData.username,
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role
    };
  } catch (error) {
    console.error('Error logging in:', error);
    
    // Handle Firebase Auth errors
    if (error.code === 'auth/user-not-found') {
      throw new Error('Email tidak terdaftar');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Password salah');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Format email tidak valid');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Terlalu banyak percobaan login. Coba lagi nanti');
    } else {
      throw error;
    }
  }
};

// ==================== LOGOUT ====================

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await signOut(auth);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error('Gagal logout');
  }
};

// ==================== GET CURRENT USER ====================

/**
 * Get current authenticated user data
 * @returns {Promise<Object|null>} User data or null if not authenticated
 */
export const getCurrentUser = async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return null;
    }

    // Get user document from Firestore
    const userDocRef = doc(db, USERS_COLLECTION, user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return null;
    }

    const userData = userDocSnap.data();

    return {
      uid: user.uid,
      username: userData.username,
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role,
      emailVerified: user.emailVerified
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// ==================== AUTH STATE LISTENER ====================

/**
 * Listen to authentication state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      const userData = await getCurrentUser();
      callback(userData);
    } else {
      // User is signed out
      callback(null);
    }
  });
};

// ==================== UPDATE USER PROFILE ====================

/**
 * Update user profile data
 * @param {string} uid - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (uid, updates) => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });

    console.log('User profile updated:', uid);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Gagal memperbarui profil');
  }
};

export default {
  signUp,
  login,
  logout,
  getCurrentUser,
  onAuthStateChange,
  updateUserProfile
};
