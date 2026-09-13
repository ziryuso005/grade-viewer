import { setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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

const loginSection = document.getElementById("admin-login-section");
const panelSection = document.getElementById("admin-panel-section");
const emailInput = document.getElementById("admin-email");
const passwordInput = document.getElementById("admin-password");
const loginBtn = document.getElementById("admin-login-btn");
const logoutBtn = document.getElementById("admin-logout-btn");
const loginError = document.getElementById("admin-login-error");
const adminStatus = document.getElementById("admin-status");

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

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const adminDocRef = doc(db, "admins", user.uid);
        const adminDocSnap = await getDoc(adminDocRef);

        if (adminDocSnap.exists()) {
            loginSection.style.display = "none";
            panelSection.style.display = "block";
            adminStatus.textContent = "Logged in as admin.";
        } else {
            adminStatus.textContent = "This account does not have admin access.";
            signOut(auth);
        }
    } else {
        loginSection.style.display = "block";
        panelSection.style.display = "none";
    }
});


const uidInput = document.getElementById("student-uid-input");
const loadBtn = document.getElementById("load-student-btn");
const loadStatus = document.getElementById("load-status");
const formSection = document.getElementById("grade-form-section");
const editingName = document.getElementById("editing-student-name");
const nameInput = document.getElementById("student-name-input");
const subjectsForm = document.getElementById("subjects-form");
const addSubjectBtn = document.getElementById("add-subject-btn");
const saveBtn = document.getElementById("save-grades-btn");
const saveStatus = document.getElementById("save-status");

let currentUid = null;

function addSubjectRow(name = "", term1 = "", term2 = "", term3 = "") {
    const row = document.createElement("div");
    row.className = "subject-row";
    row.innerHTML = `
        <input type="text" class="subj-name" placeholder="Subject name" value="${name}">
        <input type="number" class="subj-term1" placeholder="Term 1" value="${term1}">
        <input type="number" class="subj-term2" placeholder="Term 2" value="${term2}">
        <input type="number" class="subj-term3" placeholder="Term 3" value="${term3}">
        <button type="button" class="remove-row-btn">Remove</button>
    `;
    row.querySelector(".remove-row-btn").addEventListener("click", () => row.remove());
    subjectsForm.appendChild(row);
}

addSubjectBtn.addEventListener("click", () => addSubjectRow());

loadBtn.addEventListener("click", async () => {
    const uid = uidInput.value.trim();
    if (!uid) return;

    currentUid = uid;
    const studentRef = doc(db, "students", uid);
    const studentSnap = await getDoc(studentRef);

    subjectsForm.innerHTML = "";

    if (studentSnap.exists()) {
        const data = studentSnap.data();
        nameInput.value = data.name || "";
        editingName.textContent = data.name || uid;
        (data.subjects || []).forEach(s => addSubjectRow(s.name, s.term1, s.term2, s.term3));
        loadStatus.textContent = "Existing student loaded.";
    } else {
        nameInput.value = "";
        editingName.textContent = "(new student)";
        loadStatus.textContent = "No existing data — you can create a new record.";
    }

    formSection.style.display = "block";
});

saveBtn.addEventListener("click", async () => {
    if (!currentUid) return;

    const subjects = [];
    document.querySelectorAll(".subject-row").forEach(row => {
        subjects.push({
            name: row.querySelector(".subj-name").value,
            term1: Number(row.querySelector(".subj-term1").value),
            term2: Number(row.querySelector(".subj-term2").value),
            term3: Number(row.querySelector(".subj-term3").value)
        });
    });

    const studentRef = doc(db, "students", currentUid);
    try {
        await setDoc(studentRef, {
            name: nameInput.value,
            subjects: subjects
        });
        saveStatus.textContent = "Saved successfully!";
    } catch (error) {
        saveStatus.textContent = "Save failed: " + error.message;
    }
});