importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyCS6s1M8v2sTTLw9R4o3XNUUo1PGENvRdE",
    authDomain: "firstproject-b67bf.firebaseapp.com",
    databaseURL: "https://firstproject-b67bf.firebaseio.com",
    projectId: "firstproject-b67bf",
    storageBucket: "firstproject-b67bf.appspot.com",
    messagingSenderId: "657590055033",
    appId: "1:657590055033:web:08ec48725779731d60a4a8",
    measurementId: "G-3E7NXBNBZ2"
});

const messaging = firebase.messaging(); messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: './logo.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});
self.addEventListener('notificationclick', function (event) {
    // do what you want
    // ...
});