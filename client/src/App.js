import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, EmailAuthProvider, linkWithCredential, linkWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "./firebase";
import { GithubAuthProvider } from "firebase/auth";
import axios from "axios";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import HistoryPage from "./pages/HistoryPage";
import Syllabus from "./pages/Syllabus";
import PricingPage from "./pages/PricingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import ThinkingLoader from "./components/ThinkingLoader";
import SharedCodePage from "./pages/SharedCodePage";

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

            // ATTACH BACKEND DATA TO FIREBASE USER OBJECT
            currentUser.subscriptionPlan = syncResult.user.subscriptionPlan || 'free';
            currentUser.subscriptionStatus = syncResult.user.subscriptionStatus || 'active';
            currentUser.githubSyncUsage = syncResult.user.githubSyncUsage || 0;
            currentUser.mongoId = syncResult.user._id;
          }
        } catch (err) {
          console.error("SYNC_FAILED_USING_LOCAL_ROLE:", err);
        }

        // 3. Set State
        setUser(currentUser);
        // CRITICAL FIX: Do NOT overwrite the token here with currentUser.accessToken.
        // We want the token from syncUserWithBackend (Custom JWT) which contains the correct role/permissions.
        // if (currentUser.accessToken) {
        //   localStorage.setItem("token", currentUser.accessToken);
        // }

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

  // --- Redirect Result Handling (New) ---
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = null; // await getRedirectResult(auth);

        if (!result) return; // No redirect result, normal page load

        const user = result.user;
        console.log('Redirect Login Success:', user.email);

        // 1. Sync User with Backend
        console.log(">> SYNCING_WITH_BACKEND...");
        const syncData = await syncUserWithBackend(user);

        if (syncData && syncData.token) {
          console.log(">> BACKEND_TOKEN_RECEIVED");
          localStorage.setItem('token', syncData.token);
        }

        localStorage.setItem('email', user.email);

        // 2. Admin Check
        const isAdmin = user.email === ADMIN_EMAIL;

        if (isAdmin) {
          if (localStorage.getItem("role") === 'user') {
            localStorage.removeItem("role");
          }
          setRole('admin');
          setUser(user);
          localStorage.setItem("role", "admin");

          // Optional: Force reload or redirect if needed
          // window.location.href = "/admin"; 
        }

        // 3. GitHub Token Handling
        // Only if the *provider* of the result was GitHub
        const credential = GithubAuthProvider.credentialFromResult(result);
        if (credential && credential.accessToken) {
          setGithubToken(credential.accessToken);
          localStorage.setItem("github_token", credential.accessToken);
        }

      } catch (error) {
        console.error("REDIRECT_RESULT_ERROR:", error);
      }
    };

    handleRedirectResult();
  }, []);

  const syncUserWithBackend = async (firebaseUser) => {
    try {
      // ROBUST EMAIL HANDLING
      let email = firebaseUser.email;
      if (!email && firebaseUser.providerData && firebaseUser.providerData.length > 0) {
        email = firebaseUser.providerData[0].email;
        console.log(">> RECOVERED_EMAIL_FROM_PROVIDER_DATA:", email);
      }
      // Last resort fallback to allow sync to proceed (prevents 401)
      if (!email) {
        console.warn(">> WARNING: NO_EMAIL_FROM_PROVIDER. USING PLACEHOLDER.");
        email = `${firebaseUser.uid}@no-email.com`;
      }

      const providerId = firebaseUser.providerData.length > 0
        ? firebaseUser.providerData[0].providerId
        : 'password';

      // CHECK FOR PENDING TOKEN (Soft Link Flow)
      const pendingToken = localStorage.getItem("pending_github_token");
      const activeToken = firebaseUser.githubAccessToken || localStorage.getItem("github_token") || pendingToken;

      const response = await axios.post("http://localhost:5051/api/users/sync", {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || email.split("@")[0],
        email: email,
        photoURL: firebaseUser.photoURL || "",
        provider: providerId,
        githubAccessToken: activeToken
      });

      // Cleanup pending token if used
      if (pendingToken) {
        localStorage.removeItem("pending_github_token");
        localStorage.setItem("github_token", pendingToken); // Promote to permanent
      }

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // PERSISTENT GITHUB TOKEN RESTORATION
      const serverUser = response.data.user;
      if (serverUser && serverUser.githubAccessToken) {
        console.log(">> RESTORED_GITHUB_TOKEN_FROM_DB");
        setGithubToken(serverUser.githubAccessToken);
        localStorage.setItem("github_token", serverUser.githubAccessToken);
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
      // NOTE: linkWithPopup is also prone to COOP errors. 
      // For now we will keep popup for linking as redirect linking is complex (session persistence).
      // If this fails, we might need to refactor this too.
      // But verifyIdToken might be enough?
      const result = await signInWithPopup(auth, googleProvider); // Keeping Popup for linking/re-auth flow specifically.
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

      if (providerType !== 'github') {
        provider.setCustomParameters({ prompt: 'select_account' });
      }

      // SMART AUTH HANDLER: Link if logged in, Sign In if not
      let result;
      if (auth.currentUser && providerType === 'github') {
        console.log(">> LINKING_MODE: Attaching GitHub to existing session...");
        result = await linkWithPopup(auth.currentUser, provider);
        console.log(">> LINKING_SUCCESS: GitHub attached.");
      } else {
        result = await signInWithPopup(auth, provider);
      }

      const user = result.user;

      console.log('User Email from Provider:', user.email);

      // GitHub Token Handling if applicable
      if (providerType === 'github') {
        const credential = GithubAuthProvider.credentialFromResult(result);
        if (credential && credential.accessToken) {
          setGithubToken(credential.accessToken);
          localStorage.setItem("github_token", credential.accessToken);

          // FORCE SYNC (PERSISTENCE)
          const updatedUser = { ...user, githubAccessToken: credential.accessToken };
          await syncUserWithBackend(updatedUser);
        }
      }

      // onAuthStateChanged will handle the rest (sync, state update)

    } catch (error) {
      console.error("AUTH_FAILURE:", error);

      // --- SOFT LINK STRATEGY (Credential Already In Use) ---
      if (error.code === 'auth/credential-already-in-use' && providerType === 'github') {
        const confirmSwitch = window.confirm("This GitHub account is already used by another user. Do you want to merge its access token to this account? (This involves a quick re-login)");
        if (confirmSwitch) {
          try {
            // 1. Capture the GitHub Token by logging in directly
            console.log(">> SOFT_LINK: Switching to GitHub to capture token...");
            const ghResult = await signInWithPopup(auth, githubProvider);
            const credential = GithubAuthProvider.credentialFromResult(ghResult);
            const ghToken = credential.accessToken;

            if (ghToken) {
              console.log(">> SOFT_LINK: Token Captured. Saving temporarily.");
              localStorage.setItem("pending_github_token", ghToken);

              // 2. Re-login with Google to attach it
              await signOut(auth);
              console.log(">> SOFT_LINK: Re-authenticating with Google...");
              alert("GithHub Access Confirmed. Please sign in with Google again to finish the merge.");
              await signInWithPopup(auth, googleProvider); // Force re-login

              // 3. Sync will happen automatically via onAuthStateChanged or handleLogin success flow? 
              // handleLogin 'success' flow is basically here if we recursed, but we are in catch block.
              // The onAuthStateChanged listener will fire for the Google login. 
              // We need to ensure syncUserWithBackend picks up 'pending_github_token'.
            }
          } catch (innerErr) {
            console.error("SOFT_LINK_FAILURE:", innerErr);
          }
        }
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.warn("Auth popup closed by user.");
      } else {
        // alert("Login failed. Check console for details."); 
      }
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
      {/* Navbar handles its own guest/user state, pass user/role explicitly if needed, 
          but clearer to let it consume props or context. pass user={user} role={role} */}
      <Navbar user={user} onLogout={handleLogout} role={role} />

      <Routes>
        {/* PUBLIC ROOT: Compiler accessible to everyone */}
        <Route
          path="/"
          element={<UserDashboard githubToken={githubToken} user={user} role={role} onConnectGithub={() => {
            if (!user) {
              window.location.href = '/login';
            } else {
              handleLogin('github');
            }
          }} />}
        />

        {/* LOGIN PAGE: Only for guests. If logged in, go to home/dashboard */}
        <Route
          path="/login"
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
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* PROTECTED: User Dashboard (Explicit) - redirect to / if just viewing compiler, 
            but if we want to enforce auth for specific dashboard features we can keep it. 
            However, user requested "compiler accessible before login". 
            Let's keep /user as a protected alias for now or just redirect to / */}
        <Route
          path="/user"
          element={
            <Navigate to="/" replace />
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
          path="/syllabus"
          element={
            <ProtectedRoute roleRequired="user" currentRole={role}>
              <Syllabus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pricing"
          element={
            // Access to pricing page is public, but upgrading requires login (handled in page)
            <PricingPage />
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

        {/* SHARED CODE ROUTE */}
        <Route path="/s/:id" element={<SharedCodePage />} />
      </Routes>

      {/* Mobile Bottom Navigation - Only show if logged in */}
      {user && <BottomNav />}

    </BrowserRouter>
  );
}

export default App;
