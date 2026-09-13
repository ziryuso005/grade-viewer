import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyChjnz0oga2nPPku2V8cHm5F1dFwcfNaBk",
  authDomain: "grade-viewer-4f129.firebaseapp.com",
  projectId: "grade-viewer-4f129",
  storageBucket: "grade-viewer-4f129.firebasestorage.app",
  messagingSenderId: "421597163492",
  appId: "1:421597163492:web:96befcc30eb74db3d821f1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginSection = document.getElementById("login-section");
const gradeSection = document.getElementById("grades-section");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const loginError = document.getElementById("login-error");

loginBtn.addEventListener("click", () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            loginError.textContent = "";
        })
        .catch((error) => {
            loginError.textContent = "Login failed: " + error.message;
        });
});

logoutBtn.addEventListener("click", () => {
    signOut(auth);
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.style.display = "none";
        gradeSection.style.display = "block";
        loadStudentGrades(user.uid);
    } else {
        loginSection.style.display = "block";
        gradeSection.style.display = "none";
    }
});

async function loadStudentGrades(uid) {
    const docRef = doc(db, "students", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const studentData = docSnap.data();
        renderGrades(studentData.subjects);
    } else {
        loginError.textContent = "No grade data found for this account.";
    }
}

function calculateAverage(term1, term2, term3) {
    return ((term1 + term2 + term3) / 3).toFixed(1);
}

function renderGrades(subjects) {
    const tbody = document.getElementById("grades-body");
    tbody.innerHTML = "";

    const ec = subjects.find(subject => subject.name === "Effective Communication");
    const mk = subjects.find(subject => subject.name === "Mabisang Komunikasyon");

    if (ec && mk) {
        const ecAverage = calculateAverage(ec.term1, ec.term2, ec.term3);
        const mkAverage = calculateAverage(mk.term1, mk.term2, mk.term3);
        const combinedAverage = ((Number(ecAverage) + Number(mkAverage)) / 2).toFixed(1);
        const term1Average = ((ec.term1 + mk.term1) / 2).toFixed(1);
        const term2Average = ((ec.term2 + mk.term2) / 2).toFixed(1);
        const term3Average = ((ec.term3 + mk.term3) / 2).toFixed(1);

        const combinedRow = `
            <tr>
                <td>Effective Communication/Mabisang Komunikasyon</td>
                <td>${term1Average}</td>
                <td>${term2Average}</td>
                <td>${term3Average}</td>
                <td>${combinedAverage}</td>
            </tr>
        `;
        tbody.innerHTML += combinedRow;
    }

    subjects.forEach(subject => {
        const average = calculateAverage(subject.term1, subject.term2, subject.term3);
        const row = `
            <tr>
                <td>${subject.name}</td>
                <td>${subject.term1}</td>
                <td>${subject.term2}</td>
                <td>${subject.term3}</td>
                <td class="${Number(average) >= 75 ? 'passing' : 'failing'}">${average}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}
