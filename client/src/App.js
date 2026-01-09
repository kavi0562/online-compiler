import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "./firebase";
import { GithubAuthProvider } from "firebase/auth";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import HistoryPage from "./pages/HistoryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ThinkingLoader from "./components/ThinkingLoader";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [githubToken, setGithubToken] = useState(localStorage.getItem("github_token") || null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Persist basic role for compatibility with legacy ProtectedRoute if needed
        localStorage.setItem("role", "user");
      } else {
        localStorage.removeItem("role");
        localStorage.removeItem("github_token");
        setGithubToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (providerType) => {
    setLoading(true);
    try {
      const provider = providerType === 'github' ? githubProvider : googleProvider;
      const result = await signInWithPopup(auth, provider);

      // Capture GitHub Access Token for Neural Uplink
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
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
  };

  if (loading) {
    return <ThinkingLoader />;
  }

  return (
    <BrowserRouter>
      {/* Sci-Fi Navbar Overlay */}
      {user && <Navbar user={user} onLogout={handleLogout} />}

      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/user" /> : <Login onLogin={handleLogin} loading={loading} />}
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute roleRequired="user">
              <UserDashboard githubToken={githubToken} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute roleRequired="user">
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
