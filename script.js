import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// SUBSTITUA PELOS SEUS DADOS DO CONSOLE DO FIREBASE

const firebaseConfig = {
  apiKey: "AIzaSyAWv6cNgaQvLmGfRPL2TpbkGX9PvwJV17k",
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
    capivara: `      \\   _.._..,_,_\n         (          )\n          ]  o  o  [\n          )    _   (\n         /  _  _  _ \\`,
    gato: `      \\    /\\_/\\\n       \\  ( o.o )\n           > ^ <`,
    cachorro: `      \\       __\n       \\  / \\/  \\\n         (  o  o )\n         ( ===  )\n          \\____/`,
    llama: `      \\    __\n       \\  /  \\ \n         | oo |\n         | -- |  __\n         |    | /  \\\n         |____|/    \\`,
    coruja: `      \\   ,___,\n       \\  (O,O)\n          /)__)\n          -"--"-`
};

// Monitor de autenticação
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('chat-screen').classList.remove('hidden');
        document.getElementById('chat-screen').style.display = 'flex';
        initChat();
    }
});

// Ações de Login e Cadastro
document.getElementById('btnLogin').onclick = () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, pass).catch(e => alert(e.message));
};

document.getElementById('btnSignUp').onclick = () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, pass).then(() => alert("Conta criada!")).catch(e => alert(e.message));
};

// Enviar Mensagem
document.getElementById('btnSend').onclick = async () => {
    const text = document.getElementById('msgInput').value;
    const animal = document.getElementById('animalChoice').value;
    if(!text) return;

    await addDoc(collection(db, "messages"), {
        text, animal, user: auth.currentUser.email, createdAt: serverTimestamp()
    });
    document.getElementById('msgInput').value = '';
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
            pre.textContent = `${d.user}:\n  ${line}\n < ${d.text} >\n  ${"-".repeat(d.text.length + 2)}\n${arts[d.animal]}`;
            chatWin.appendChild(pre);
        });
        chatWin.scrollTop = chatWin.scrollHeight;
    });
}
