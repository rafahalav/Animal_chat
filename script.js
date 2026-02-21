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
    capivara: `      \\    _..---.._     (       )  ] o o [  ) _  (\\ / _ _ \\\\`,
    gato: `      \\    /\\_/\\           \\ ( o.o )   > ^ <`,
    cachorro: `      \\   __      \\ _ / / \\ \\  ( o o ) \\ ( === ) \\  \\ _ /`,
    llama: `      \\    _\\n   \\\\ / \\\\ \\   | oo |   | -- |   |  |   | \\\\  \\\\   |___|/`,
    coruja: `      \\    , _ ,   \\ ( o,o )   /)_)   "-"`
};

// Monitor de autenticação
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

// Criar Conta / Login
document.getElementById('btnSignUp').onclick = () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, pass).then(() => alert("Conta criada!")).catch(e => alert(e.message));
};

document.getElementById('btnLogin').onclick = () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, pass).catch(e => alert(e.message));
};

// Enviar Mensagem
document.getElementById('btnSend').onclick = async () => {
    const messageText = document.getElementById('msgInput').value;
    const animalChoice = document.getElementById('animalChoice').value;

    if (messageText && auth.currentUser) {
        try {
            await addDoc(collection(db, "messages"), {
                user: auth.currentUser.displayName || auth.currentUser.email,
                text: messageText,
                animal: animalChoice,
                createdAt: serverTimestamp()
            });
            document.getElementById('msgInput').value = "";
        } catch (e) {
            console.error("Erro:", e);
        }
    }
};

// Atualizar Nome de Usuário
document.getElementById('btnUpdateName').onclick = async () => {
    const newName = document.getElementById('new-username').value;
    if (newName && auth.currentUser) {
        try {
            await updateProfile(auth.currentUser, { displayName: newName });
            alert("Apelido atualizado!");
            document.getElementById('new-username').value = "";
        } catch (e) {
            alert("Erro: " + e.message);
        }
    }
};

// Carregar Mensagens
function initChat() {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    onSnapshot(q, (snap) => {
        const chatWin = document.getElementById('chat-window');
        chatWin.innerHTML = '';
        snap.forEach(doc => {
            const d = doc.data();
            const pre = document.createElement('pre');
            const line = "_".repeat(d.text.length + 2);
            pre.textContent = `${d.user}:\n < ${d.text} >\n ${line}\n${arts[d.animal]}`;
            chatWin.appendChild(pre);
        });
        chatWin.scrollTop = chatWin.scrollHeight;
    });
}
