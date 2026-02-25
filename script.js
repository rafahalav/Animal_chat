import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwV6cNgaQvLmGfRPL2TpbkGX9PvwJV17k",
  authDomain: "animal-chat-a461f.firebaseapp.com",
  projectId: "animal-chat-a461f",
  storageBucket: "animal-chat-a461f.firebasestorage.app",
  messagingSenderId: "617539469606",
  appId: "1:617539469606:web:46cf36c3b2b1bd3b80c1e7",
  measurementId: "G-SX3F7D5N3K"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const arts = {
    capivara: `      \\    _..---.._ \n     (       ) \n  ] o o [  ) \n _  (\\ / _ _ \\\\`,
    gato: `      \\    /\\_/\\ \n           \\ ( o.o ) \n            > ^ <`,
    cachorro: `      \\   __      \\ _ / \n / \\ \\  ( o o ) \n \\ ( === ) \\  \\ _ /`,
    llama: `      \\    _\\n   \\\\ / \\\\ \\ \n   | oo | \n  | -- | \n  |  | \n  | \\\\  \\\\ \n  |___|/`,
    coruja: `      \\    , _ , \n   \\ ( o,o ) \n   /)_) \n   "-"`
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('chat-screen').classList.remove('hidden');
        initChat();
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('chat-screen').classList.add('hidden');
    }
});

document.getElementById('btnSignUp').onclick = () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, pass).catch(e => alert(e.message));
};

document.getElementById('btnLogin').onclick = () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, pass).catch(e => alert(e.message));
};

document.getElementById('btnSend').onclick = async () => {
    const msgInput = document.getElementById('msgInput');
    const animalChoice = document.getElementById('animalChoice');
    if (msgInput.value && auth.currentUser) {
        try {
            await addDoc(collection(db, "messages"), {
                user: auth.currentUser.displayName || auth.currentUser.email,
                text: msgInput.value,
                animal: animalChoice.value,
                createdAt: serverTimestamp()
            });
            msgInput.value = "";
        } catch (e) { console.error(e); }
    }
};

document.getElementById('btnUpdateName').onclick = async () => {
    const newName = document.getElementById('new-username').value;
    if (newName && auth.currentUser) {
        try {
            await updateProfile(auth.currentUser, { displayName: newName });
            alert("Apelido salvo!");
        } catch (e) { alert(e.message); }
    }
};

function initChat() {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    onSnapshot(q, (snap) => {
        const chatWin = document.getElementById('chat-window');
        chatWin.innerHTML = '';
        snap.forEach(doc => {
            const d = doc.data();
            const pre = document.createElement('pre');
            pre.textContent = `${d.user}:\n < ${d.text} >\n${arts[d.animal] || ''}`;
            chatWin.appendChild(pre);
        });
        chatWin.scrollTop = chatWin.scrollHeight;
    });
}
