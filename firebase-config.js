// Firebase configuration for JackSoundWorks Guest Book and Newsletter
// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Your Firebase configuration
// You'll need to replace these with your actual Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyBYx1zW651Ti1CO2YsE383oGxsumIe_bQ8",
    authDomain: "webseite-jackboyman.firebaseapp.com",
    projectId: "webseite-jackboyman",
    storageBucket: "webseite-jackboyman.firebasestorage.app",
    messagingSenderId: "65288888345",
    appId: "1:65288888345:web:540d3597c12e7c77e0ca88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export for use in other files
window.db = db;
window.collection = collection;
window.addDoc = addDoc;
window.getDocs = getDocs;
window.orderBy = orderBy;
window.query = query;
window.serverTimestamp = serverTimestamp;
window.where = where; 