importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyCoZQsfuMIf6M8GOBqDC3aExvDtiMvhMfc",
    authDomain: "web-push-notification-7ca2b.firebaseapp.com",
    databaseURL: "https://web-push-notification-7ca2b.firebaseio.com",
    projectId: "web-push-notification-7ca2b",
    storageBucket: "web-push-notification-7ca2b.appspot.com",
    messagingSenderId: "204164476841",
    appId: "1:204164476841:web:f89fc19db348fabb0b1eb8",
    measurementId: "G-CPRNNER1V7"
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
    console.log('Handling background message ', payload);
    // Customize notification here
    return self.registration.showNotification(
        payload.data.title, {
        body: payload.data.body,
        icon: payload.data.icon,
        tag: payload.data.tag,
        data: payload.data.link
    });
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(self.clients.openWindow(event.notification.data));
});