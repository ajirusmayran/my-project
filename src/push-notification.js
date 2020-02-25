import React from 'react';
import * as firebase from 'firebase';
import { usePouchDB } from './components/PouchDB/PouchDBProvider';

export const initializeFirebase = () => {
	const config = {
		apiKey: "AIzaSyCoZQsfuMIf6M8GOBqDC3aExvDtiMvhMfc",
		authDomain: "web-push-notification-7ca2b.firebaseapp.com",
		databaseURL: "https://web-push-notification-7ca2b.firebaseio.com",
		projectId: "web-push-notification-7ca2b",
		storageBucket: "web-push-notification-7ca2b.appspot.com",
		messagingSenderId: "204164476841",
		appId: "1:204164476841:web:f89fc19db348fabb0b1eb8",
		measurementId: "G-CPRNNER1V7"
	};

	firebase.initializeApp(config);

	if ('serviceWorker' in navigator) {
		window.addEventListener('load', async () => {
			const registration = await navigator.serviceWorker.register('/assets/firebase-messaging-sw.js');

			const messaging = firebase.messaging();
			messaging.useServiceWorker(registration);
			messaging.onMessage((payload) => {
				console.log('[firebase-messaging-sw.js] Received background message ', payload);
				// Customize notification here
				const notificationTitle = payload.data.title;
				const notificationOptions = {
					body: payload.data.body,
					icon: payload.data.icon,
					tag: payload.data.tag,
					data: payload.data.link
				};

				return registration.showNotification(notificationTitle,
					notificationOptions);
			});

		});
	}
};

export const askForPermissionToReceiveNotifications = async (pdb) => {
	try {
		const messaging = firebase.messaging();
		await messaging.requestPermission()
			.then(() => {
				console.log('Have Permission');
				navigator.geolocation.getCurrentPosition(function (position) {

				});
				return messaging.getToken();
			})
			.then(token => {
				console.log('FCM Token: ', token);
				const { user: { metadata } } = pdb;
				let Id = metadata.name;
				// let Id = 2;
				let Token = token;
				fetch('https://demo-bkkbn-notif.herokuapp.com/register', {
					method: 'POST',
					headers: { 'Content-type': 'application/json' },
					body: JSON.stringify({
						username: Id,
						registrationToken: Token,
					})
				})
					.then(response => {
						response.json()
					})
					.then(data => {
						localStorage.setItem('notification-token', token);
					})
					.catch(e => console.error(e))
			})
			.catch(error => {
				if (error.code === 'messaging/permission-blocked') {
					console.log('Please Unblock Notification Request Manually');
				} else {
					console.log(error);
				}
			});

	} catch (error) {
		console.error(error);
	}

};