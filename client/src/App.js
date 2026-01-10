import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, EmailAuthProvider, linkWithCredential } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "./firebase";
import { GithubAuthProvider } from "firebase/auth";
import axios from "axios";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import HistoryPage from "./pages/HistoryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ThinkingLoader from "./components/ThinkingLoader";

// 1. SINGLE SOURCE OF TRUTH FOR ADMIN EMAIL
const ADMIN_EMAIL = "n.kavishiksuryavarma@gmail.com";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  // SINGLE Source of Truth for "Ready to Render"
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [githubToken, setGithubToken] = useState(localStorage.getItem("github_token") || null);
  const [loadingAction, setLoadingAction] = useState(false); // For manual actions like login/click

  useEffect(() => {
    // Core Auth Listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Logged in user email:', currentUser ? currentUser.email : "NO_USER");

      if (currentUser) {
        // 1. Strict Admin Check Immediately (Hardcoded as requested)
        if (currentUser.email === 'n.kavishiksuryavarma@gmail.com') {
          // FORCE ADMIN ROLE
          console.log(">> CRITICAL: ADMIN DETECTED (HARDCODED). FORCING ROLE.");
          setRole('admin');
          localStorage.setItem("role", "admin");
        } else {
          // If not admin email, ensure checking local storage or defaulting
          if (localStorage.getItem("role") !== 'admin') {
            // Only set to user if we aren't already admin (prevents race condition flicker)
            // But since we just checked email, we know if they should be admin or not.
            // If they aren't the hardcoded email, they are a USER.
            setRole('user');
          }
        }


        // 2. Sync with Backend
        try {
          const syncResult = await syncUserWithBackend(currentUser);
          if (syncResult && syncResult.user && syncResult.user.role) {
            let determinedRole = syncResult.user.role;

            // Double check: if explicit admin email, FAILSAFE to admin
            if (currentUser.email === ADMIN_EMAIL) determinedRole = 'admin';

            setRole(determinedRole);
            localStorage.setItem("role", determinedRole);
            console.log("ROLE_CONFIRMED_BY_BACKEND:", determinedRole);
          }
        } catch (err) {
          console.error("SYNC_FAILED_USING_LOCAL_ROLE:", err);
        }

        // 3. Set State
        setUser(currentUser);
        if (currentUser.accessToken) {
          localStorage.setItem("token", currentUser.accessToken);
        }

      } else {
        // Logout / No Session
        setUser(null);
        setRole(null);
        localStorage.clear();
      }

      // 4. MARK APP AS READY
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const syncUserWithBackend = async (firebaseUser) => {
    try {
      if (!firebaseUser.email) return null;

      const providerId = firebaseUser.providerData.length > 0
        ? firebaseUser.providerData[0].providerId
        : 'password';

      const response = await axios.post("http://localhost:5051/api/users/sync", {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || "",
        provider: providerId
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return response.data; // Return full data including role
    } catch (error) {
      console.error("SYNC_FAILURE:", error);
      return null;
    }
  };

  // --- Auth Handlers ---

  const handleManualSignup = async (email, password) => {
    setLoadingAction(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return null; // Success
    } catch (error) {
      console.error("MANUAL_SIGNUP_FAILURE:", error);
      return error.code; // Return code for smart handling
    } finally {
      setLoadingAction(false);
    }
  };

  const handleManualLogin = async (email, password) => {
    setLoadingAction(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return null;
    } catch (error) {
      console.error("MANUAL_AUTH_FAILURE:", error);
      return error.code;
    } finally {
      setLoadingAction(false);
    }
  };

  const handlePasswordReset = async (email) => {
    setLoadingAction(true);
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: "RESET_LINK_SENT: CHECK_INBOX" };
    } catch (error) {
      return { success: false, message: error.code };
    } finally {
      setLoadingAction(false);
    }
  };

  const handleAccountLinking = async (email, password) => {
    setLoadingAction(true);
    try {
      // 1. Ask user to sign in with Google first to prove ownership
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 2. Create credentials for the manual account they wanted
      const credential = EmailAuthProvider.credential(email, password);

      // 3. Link them!
      await linkWithCredential(user, credential);

      console.log("ACCOUNT_LINKING_SUCCESS");
      return { success: true, message: "ACCOUNTS_LINKED_SUCCESSFULLY" };

    } catch (error) {
      console.error("LINKING_FAILURE:", error);
      let msg = "LINKING_FAILED";
      if (error.code === 'auth/credential-already-in-use') msg = "PASSWORD_ALREADY_LINKED";
      return { success: false, message: msg };
    } finally {
      setLoadingAction(false);
    }
  };

  const handleLogin = async (providerType) => {
    setLoadingAction(true);
    try {
      const provider = providerType === 'github' ? githubProvider : googleProvider;

      // Explicitly ensuring parameters again just in case
      if (providerType !== 'github') {
        provider.setCustomParameters({ prompt: 'select_account' });
      }

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('User Email from Google:', user.email);

      if (!user.email) {
        console.error(">> AUTH_DATA_MISSING: EMAIL_NOT_FOUND");
        return;
      }

      // 1. Sync User with Backend IMMEDIATELY to get the TOKEN
      // We must do this BEFORE redirecting, or the dashboard will be 401
      console.log(">> SYNCING_WITH_BACKEND...");
      const syncData = await syncUserWithBackend(user);

      if (syncData && syncData.token) {
        console.log(">> BACKEND_TOKEN_RECEIVED");
        localStorage.setItem('token', syncData.token);
      } else {
        console.error(">> TOKEN_GENERATION_FAILED");
      }

      // Save email immediately
      localStorage.setItem('email', user.email);

      // 2. IMMEDIATE ADMIN CHECK & REDIRECT
      // Now that we have the token, we can safely redirect
      const isAdmin = user.email === ADMIN_EMAIL;
      console.log('ADMIN_DETECTED:', user.email, '| IS_ADMIN:', isAdmin);

      if (isAdmin) {
        console.log("ADMIN_IDENTITY_VERIFIED_LOCALLY: FORCING_REDIRECT");
        // Clear any stale state
        if (localStorage.getItem("role") === 'user') {
          localStorage.removeItem("role");
        }

        setRole('admin');
        setUser(user);
        localStorage.setItem("role", "admin");

        window.location.href = "/admin";
        return;
      }

      if (providerType === 'github') {
        const credential = GithubAuthProvider.credentialFromResult(result);
        if (credential && credential.accessToken) {
          setGithubToken(credential.accessToken);
          localStorage.setItem("github_token", credential.accessToken);
        }
      }
    } catch (error) {
      console.error("AUTH_FAILURE:", error);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    setUser(null);
    setRole(null);
    window.location.href = "/";
  };

  // --- Rendering ---

  // CRITICAL: Stop everything until we are 100% sure of Auth State
  if (!isAuthReady) {
    return <ThinkingLoader />;
  }

  return (
    <BrowserRouter>
      {user && <Navbar user={user} onLogout={handleLogout} role={role} />}

      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <Login
                onLogin={handleLogin}
                onManualLogin={handleManualLogin}
                onManualSignup={handleManualSignup}
                onPasswordReset={handlePasswordReset}
                onAccountLinking={handleAccountLinking}
                loading={loadingAction}
              />
            ) : role === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/user" replace />
            )
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute roleRequired="user" currentRole={role}>
              <UserDashboard githubToken={githubToken} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute roleRequired="user" currentRole={role}>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="admin" currentRole={role}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
