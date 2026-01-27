import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
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


// ---------- LEADERBOARD PAGE LOGIC ----------
import { auth, database } from "./js/firebase-Config.js";

const leaderboardSection = document.getElementById("leaderboard-section");
const notLoggedInSection = document.getElementById("not-logged-in-section");
const navAuth = document.getElementById("nav-auth");
const navLinks = document.getElementById("nav-links");

function addLeaderboardNav() {
    // Prevent duplicate
    if (!document.getElementById("leaderboard-nav-item")) {
        const li = document.createElement("li");
        li.id = "leaderboard-nav-item";
        li.innerHTML = `<a href="leaderboard.html">Leaderboard</a>`;
        // Insert before nav-auth
        navLinks.insertBefore(li, navAuth);
    }
}

function removeLeaderboardNav() {
    const li = document.getElementById("leaderboard-nav-item");
    if (li) li.remove();
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        leaderboardSection.style.display = "";
        notLoggedInSection.style.display = "none";
        navAuth.innerHTML = `<li><a href="#" id="logout-btn" class="nav-login">Logout</a></li>`;
        document.getElementById("logout-btn").onclick = (e) => {
            e.preventDefault();
            signOut(auth).then(() => window.location.reload());
        };
        addLeaderboardNav();
        loadLeaderboard();
    } else {
        leaderboardSection.style.display = "none";
        notLoggedInSection.style.display = "";
        navAuth.innerHTML = `
            <li><a href="login.html" class="nav-login">Login</a></li>
            <li><a href="signup.html" class="nav-signup">Sign Up</a></li>
        `;
        removeLeaderboardNav();
    }
});

async function loadLeaderboard() {
    const leaderboardBody = document.getElementById("leaderboard-body");
    leaderboardBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-gray);padding:2rem;">Loading...</td></tr>`;
    try {
        const snapshot = await get(ref(database, "leaderboard"));
        if (!snapshot.exists()) {
            leaderboardBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-gray);padding:2rem;">No leaderboard data yet.</td></tr>`;
            return;
        }
        const data = snapshot.val();
        const rows = Object.values(data)
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return a.time - b.time;
            })
            .slice(0, 20);

        leaderboardBody.innerHTML = "";
        rows.forEach((entry, idx) => {
            leaderboardBody.innerHTML += `
                <tr style="background:${idx % 2 === 0 ? 'var(--bg-darker)' : 'var(--bg-dark)'};">
                    <td style="padding:1rem;">${idx + 1}</td>
                    <td style="padding:1rem;">${entry.username ? entry.username : "Anonymous"}</td>
                    <td style="padding:1rem;">${entry.score ?? "-"}</td>
                    <td style="padding:1rem;">${entry.time ?? "-"}</td>
                </tr>
            `;
        });
    } catch (e) {
        leaderboardBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--accent-orange);padding:2rem;">Error loading leaderboard.</td></tr>`;
    }
}