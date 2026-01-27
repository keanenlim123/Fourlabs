import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

export const firebaseConfig = {
  apiKey: "AIzaSyA5dEQc4DUZZcwUmJ4g_aTfg_zUYXo-_lg",
  authDomain: "behind-closed-doors-95834.firebaseapp.com",
  databaseURL: "https://behind-closed-doors-95834-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "behind-closed-doors-95834",
  storageBucket: "behind-closed-doors-95834.firebasestorage.app",
  messagingSenderId: "422614522456",
  appId: "1:422614522456:web:487bf0edcc5c15c07cc82d",
  measurementId: "G-TZNK6F0PBX"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {

  // ---------- LOGIN ----------
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          alert("Logged in successfully!");
          window.location.href = "index.html";
        })
        .catch((error) => {
          alert(error.message);
        });
    });
  }

  // ---------- SIGN UP ----------
  const signupForm = document.getElementById("signupForm");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("signupUsername").value;
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          set(ref(database, "users/" + user.uid), {
            username: username,
            email: email,
            createdAt: new Date().toISOString()
          });

          alert("Account created successfully!");
        })
        .catch((error) => {
          alert(error.message);
        });
    });
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.uid);
  } else {
    console.log("No user logged in");
  }
});

