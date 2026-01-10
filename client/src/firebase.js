import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD3dulyTgOBYikzKlRZldQKt_e5WHJeDho",
    authDomain: "reactor-io.firebaseapp.com",
    projectId: "reactor-io",
    storageBucket: "reactor-io.firebasestorage.app",
    messagingSenderId: "217781803154",
    appId: "1:217781803154:web:d7afbf085faad1feecae4b",
    measurementId: "G-3FRB64PHW1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
googleProvider.addScope('email');
googleProvider.addScope('profile');
const githubProvider = new GithubAuthProvider();

// Request access to repositories for Neural Uplink
githubProvider.addScope('repo');

export { auth, googleProvider, githubProvider };
