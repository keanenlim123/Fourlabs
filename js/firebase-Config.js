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

// --- NAVIGATION AUTH LOGIC (runs on every page) ---
function updateNavAuth(user) {
    const navAuth = document.getElementById("nav-auth");
    if (!navAuth) return;
    if (user) {
        navAuth.innerHTML = `<li><a href="#" id="logout-btn" class="nav-login">Logout</a></li>`;
        document.getElementById("logout-btn").onclick = (e) => {
            e.preventDefault();
            signOut(auth).then(() => window.location.reload());
        };
    } else {
        navAuth.innerHTML = `
            <li><a href="login.html" class="nav-login">Login</a></li>
            <li><a href="signup.html" class="nav-signup">Sign Up</a></li>
        `;
    }
}

onAuthStateChanged(auth, (user) => {
    updateNavAuth(user);

    // Only run leaderboard logic if those elements exist
    const leaderboardSection = document.getElementById("leaderboard-section");
    const notLoggedInSection = document.getElementById("not-logged-in-section");
    if (leaderboardSection && notLoggedInSection) {
        if (user) {
            leaderboardSection.style.display = "";
            notLoggedInSection.style.display = "none";
            loadLeaderboard();
        } else {
            leaderboardSection.style.display = "none";
            notLoggedInSection.style.display = "";
        }
    }
});

// --- LOGIN FORM ---
document.addEventListener("DOMContentLoaded", () => {
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

    // --- SIGN UP FORM ---
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("signupUsername").value;
            const email = document.getElementById("signupEmail").value;
            const password = document.getElementById("signupPassword").value;
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    await set(ref(database, "users/" + user.uid), {
                        username: username,
                        email: email,
                        createdAt: new Date().toISOString()
                    });
                    alert("Account created successfully!");
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    alert(error.message);
                });
        });
    }
});

// --- LEADERBOARD LOGIC ---
let leaderboardUnsubscribe = null; // Store the unsubscribe function

async function loadLeaderboard() {
    const leaderboardBody = document.getElementById("leaderboard-body");
    if (!leaderboardBody) return;
    
    leaderboardBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-gray);padding:2rem;">Loading...</td></tr>`;
    
    // Unsubscribe from previous listener if it exists
    if (leaderboardUnsubscribe) {
        leaderboardUnsubscribe();
    }
    
    // Set up real-time listener
    const usersRef = ref(database, "users");
    leaderboardUnsubscribe = onValue(usersRef, (snapshot) => {
        if (!snapshot.exists()) {
            leaderboardBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-gray);padding:2rem;">No leaderboard data yet.</td></tr>`;
            return;
        }
        
        const users = snapshot.val();
        const rows = Object.values(users)
            .map(user => ({
                username: user.username || "Anonymous",
                bestTime: user.userStats?.bestRecordedTime ?? null,
                timesPlayed: user.userStats?.timesPlayed ?? 0,
                badgeCount: user.userStats?.badges ? Object.keys(user.userStats.badges).length : 0 // Count badges
            }))
            .filter(entry => entry.bestTime !== null && entry.bestTime > 0)
            .sort((a, b) => a.bestTime - b.bestTime) // Sort by fastest time (lowest first)
            .slice(0, 5); // Get top 5

        if (rows.length === 0) {
            leaderboardBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-gray);padding:2rem;">No players have completed the game yet.</td></tr>`;
            return;
        }

        leaderboardBody.innerHTML = "";
        rows.forEach((entry, idx) => {
            const rankEmoji = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';
            leaderboardBody.innerHTML += `
                <tr style="background:${idx % 2 === 0 ? 'var(--bg-darker)' : 'var(--bg-dark)'};">
                    <td style="padding:1rem; font-size:1.2rem;">${rankEmoji} ${idx + 1}</td>
                    <td style="padding:1rem; font-weight:${idx < 3 ? 'bold' : 'normal'}; color:${idx < 3 ? 'var(--accent-yellow)' : 'var(--text-white)'};">${entry.username}</td>
                    <td style="padding:1rem; font-family:'Courier Prime', monospace; color:var(--accent-orange);">${entry.bestTime.toFixed(2)}s</td>
                    <td style="padding:1rem; color:var(--accent-yellow);">${entry.timesPlayed}</td>
                    <td style="padding:1rem; color:var(--accent-orange);">${entry.badgeCount}</td>
                </tr>
            `;
        });
    }, (error) => {
        console.error("Leaderboard error:", error);
        leaderboardBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--accent-orange);padding:2rem;">Error loading leaderboard.</td></tr>`;
    });
}