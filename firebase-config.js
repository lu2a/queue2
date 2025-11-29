// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIkmvExsamNR8gNAJh1IJEWT4TQByLhLs",
  authDomain: "queue2-3d5df.firebaseapp.com",
  databaseURL: "https://queue2-3d5df-default-rtdb.firebaseio.com",
  projectId: "queue2-3d5df",
  storageBucket: "queue2-3d5df.firebasestorage.app",
  messagingSenderId: "53999496018",
  appId: "1:53999496018:web:713c271b37cb4233e0a88b",
  measurementId: "G-RNJTFQ4CMD"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const firestore = firebase.firestore();
const storage = firebase.storage();

// Database References
const screensRef = database.ref('screens');
const clinicsRef = database.ref('clinics');
const queuesRef = database.ref('queues');
const settingsRef = database.ref('settings');
const doctorsRef = database.ref('doctors');
const appointmentsRef = database.ref('appointments');
const consultationsRef = database.ref('consultations');
const complaintsRef = database.ref('complaints');

// Firestore Collections
const doctorsCollection = firestore.collection('doctors');
const patientsCollection = firestore.collection('patients');
const appointmentsCollection = firestore.collection('appointments');
const consultationsCollection = firestore.collection('consultations');
const requestsCollection = firestore.collection('requests');

// Utility Functions
function convertToArabicNumbers(num) {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(digit => arabicNumbers[parseInt(digit)]).join('');
}

function formatArabicDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('ar-SA', options);
}

function playAudioSequence(clientNumber, clinicNumber) {
    const audio = new Audio();
    const sequence = [
        'audio/ding.mp3',
        `audio/${clientNumber}.mp3`,
        `audio/clinic${clinicNumber}.mp3`
    ];
    
    let currentIndex = 0;
    
    function playNext() {
        if (currentIndex < sequence.length) {
            audio.src = sequence[currentIndex];
            audio.play().then(() => {
                currentIndex++;
                audio.onended = playNext;
            }).catch(error => {
                console.log('Audio playback failed:', error);
                currentIndex++;
                playNext();
            });
        }
    }
    
    playNext();
}

// Authentication State Management
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User authenticated:', user.email);
        // User is signed in
    } else {
        console.log('User not authenticated');
        // User is signed out
    }
});

// Real-time Database Listeners
screensRef.on('value', (snapshot) => {
    const screens = snapshot.val();
    // Handle screens update
});

clinicsRef.on('value', (snapshot) => {
    const clinics = snapshot.val();
    // Handle clinics update
});

queuesRef.on('value', (snapshot) => {
    const queues = snapshot.val();
    // Handle queues update
});

// Export for use in other files
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDB = database;
window.firebaseFirestore = firestore;
window.firebaseStorage = storage;
window.convertToArabicNumbers = convertToArabicNumbers;
window.formatArabicDate = formatArabicDate;
window.playAudioSequence = playAudioSequence;
