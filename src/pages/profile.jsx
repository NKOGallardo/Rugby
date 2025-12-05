import { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import "./profile.css";
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithCustomToken, 
    signInAnonymously 
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc 
} from 'firebase/firestore';
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from 'firebase/storage';

// --- Global Context Variables (Mandatory for Canvas Environment) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : '1:853215209706:web:f7c191c1376a0afd168f93';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
// -----------------------------------------------------------------

// Initialize Firebase services outside the component for memoization, 
// but ensure we handle the configuration check.
const app = firebaseConfig ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const storage = app ? getStorage(app) : null;

export default function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    
    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
        phoneNumber: '',
        location: '',
        photoURL: ''
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // 1. Firebase Initialization and Authentication Listener
    useEffect(() => {
        if (!auth || !db || !storage) {
            console.error("Firebase services failed to initialize. Check config.");
            setLoading(false);
            return;
        }

        const handleAuth = async () => {
            try {
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    // Fallback to anonymous sign-in if no custom token is provided
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Firebase initial sign-in failed:", error);
            }
        };

        handleAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setIsAuthReady(true);
            // Loading remains true until data is fetched in the next effect
        });

        return () => unsubscribe();
    }, []); // Run only once on mount

    // Helper to get the correct document reference path for user-specific private data
    const getUserProfileDocRef = useCallback((uid) => {
        if (!db) return null;
        // Path: /artifacts/{appId}/users/{userId}/profileData/data
        const path = `artifacts/${appId}/users/${uid}/profileData`;
        return doc(db, path, 'data');
    }, [db]);


    // 2. Load Profile Data after Authentication is Ready
    useEffect(() => {
        if (!isAuthReady || !currentUser) {
            // Wait for auth to be ready, or if no user is signed in, stop loading.
            if (isAuthReady && !currentUser) {
                setLoading(false);
            }
            return;
        }

        const loadUserProfile = async () => {
            const uid = currentUser.uid;
            try {
                const docRef = getUserProfileDocRef(uid);
                if (!docRef) return;

                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        displayName: data.displayName || '',
                        bio: data.bio || '',
                        phoneNumber: data.phoneNumber || '',
                        location: data.location || '',
                        photoURL: data.photoURL || ''
                    });
                    if (data.photoURL) {
                        setImagePreview(data.photoURL);
                    }
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                setMessage('Error loading profile data');
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, [isAuthReady, currentUser, getUserProfileDocRef]); // Re-run when auth state changes


    // --- Handlers ---

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (uid, file) => {
        if (!storage) throw new Error("Storage not initialized.");

        // Storage path is fine as is
        const imageRef = ref(storage, `profileImages/${uid}/${file.name}-${Date.now()}`);
        await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(imageRef);
        return downloadURL;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            setMessage('Please sign in to save your profile.');
            return;
        }

        setSaving(true);
        setMessage('');

        try {
            let photoURL = formData.photoURL;
            
            if (imageFile) {
                // 1. Upload new image if a file is selected
                photoURL = await uploadImage(currentUser.uid, imageFile);
            }

            // 2. Prepare data for Firestore
            const profileData = {
                ...formData,
                photoURL,
                email: currentUser.email,
                updatedAt: new Date().toISOString()
            };

            // 3. Save to Firestore
            const docRef = getUserProfileDocRef(currentUser.uid);
            if (!docRef) throw new Error("Firestore document reference could not be created.");
            
            // Using setDoc with merge: true to create the document if it doesn't exist 
            // and only update specified fields if it does.
            await setDoc(docRef, profileData, { merge: true });
            
            setMessage('Profile saved successfully!');
            setImageFile(null); // Clear file input state after successful upload
            // Update photoURL in formData to reflect the new URL
            setFormData(prev => ({ ...prev, photoURL })); 
        } catch (error) {
            console.error('Error saving profile:', error);
            setMessage(`Error saving profile: ${error.message || 'Please try again.'}`);
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        if (!auth) return;
        try {
            await auth.signOut();
            // Auth listener handles resetting state
        } catch (error) {
            console.error('Error signing out:', error);
            setMessage('Error signing out. Check console.');
        }
    };

       
    // Loading State
    if (loading || !isAuthReady) {
        return (
            <div style={{ ...styles.pageContainer, ...styles.flexCenter, backgroundColor: '#eef2ff' }}>
                <div style={styles.loadingBox}>
                    <svg className="animate-spin" style={{ display: 'inline-block', marginRight: '0.75rem', height: '1.25rem', width: '1.25rem', color: '#4f46e5' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting to Firebase...
                </div>
            </div>
        );
    }

    // Not Signed In State
    if (!currentUser) {
        return (
            <div style={{ ...styles.pageContainer, ...styles.flexCenter, backgroundColor: '#eef2ff' }}>
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxWidth: '24rem', width: '100%', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>Profile Unavailable</h2>
                    <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>You are not currently signed in.</p>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>The Canvas environment handles automatic sign-in. If this persists, please try refreshing the page.</p>
                </div>
            </div>
        );
    }
    
    // Main Content
    return (
        <div style={styles.pageContainer}>
            <div style={styles.maxWContainer}>
                <div style={styles.card}>
                    <div style={styles.headerFlex}>
                        <h1 style={styles.title}>User Profile</h1>
                        <button
                            onClick={handleSignOut}
                            style={styles.signOutButton}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem' }} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h5a1 1 0 000-2H4V4h4a1 1 0 100-2H3zm12 3a1 1 0 011 1v6a1 1 0 11-2 0V7a1 1 0 011-1zm-4.707 5.293a1 1 0 000 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 12.586V7a1 1 0 00-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Sign Out</span>
                        </button>
                    </div>

                    <div style={styles.infoBox}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#4338ca', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Authenticated User ID</p>
                        <p style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: '#3730a3', wordBreak: 'break-all', marginTop: '0.25rem' }}>{currentUser.uid}</p>
                    </div>

                    {message && (
                        <div style={styles.messageBox(message.includes('Error'))}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Profile Photo Upload */}
                        <div style={styles.profileImageContainer}>
                            <div style={styles.imageCircle}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/128x128/ccc/333?text=Load+Error"; }}
                                    />
                                ) : (
                                    <div style={styles.imagePlaceholder}>
                                        <svg style={{ width: '4rem', height: '4rem' }} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <label style={styles.uploadLabel}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                {imageFile ? 'Change Photo' : 'Upload Photo'}
                            </label>
                        </div>

                        {/* Display Name */}
                        <div style={styles.formGroup}>
                            <label htmlFor="displayName" style={styles.label}>Display Name</label>
                            <input
                                type="text"
                                id="displayName"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleInputChange}
                                style={styles.inputField}
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Bio */}
                        <div style={styles.formGroup}>
                            <label htmlFor="bio" style={styles.label}>Bio</label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows="4"
                                style={{ ...styles.inputField, resize: 'none' }}
                                placeholder="Tell us about yourself in a few sentences"
                            />
                        </div>

                        {/* Phone Number */}
                        <div style={styles.formGroup}>
                            <label htmlFor="phoneNumber" style={styles.label}>Phone Number</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                style={styles.inputField}
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>

                        {/* Location */}
                        <div style={styles.formGroup}>
                            <label htmlFor="location" style={styles.label}>Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                style={styles.inputField}
                                placeholder="City, Country"
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            type="submit"
                            disabled={saving}
                            style={saving ? { ...styles.submitButton, ...styles.disabledButton } : styles.submitButton}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                {saving ? (
                                    <>
                                        <svg className="animate-spin" style={{ height: '1.25rem', width: '1.25rem', color: 'white' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <span>Save Profile</span>
                                )}
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}