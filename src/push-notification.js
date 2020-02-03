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
	// navigator.serviceWorker.register("./firebase-messages-ws.js").then(registration => {
	//     firebase.messaging().useServiceWorker(registration);
	// });
};

export const askForPermissionToReceiveNotifications = async (pdb) => {
	try {
		const messaging = firebase.messaging();
		await messaging.requestPermission();
		// const token = await messaging.getToken();
		// localStorage.getItem('notification-token', token);
		await messaging.getToken().then(async (currentToken) => {
			if (currentToken) {
				const { user: { metadata } } = pdb;
				let Id = metadata.name;
				// let Id = 2;
				let Token = currentToken;
				console.log(Id);
				console.log(Token);
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
						localStorage.setItem('notification-token', currentToken);
					})
					.catch(e => console.error(e))
			} else {
				// Show permission request
				console.log('No Instance ID token available. Request permission to generate one.');
				// Show permission UI
			}
		}).catch((err) => {
			console.error('An error occured while retrieving token. ', err);
		});

		// await messaging.onTokenRefresh(async () => {
		// 	messaging.getToken().then((refreshedToken) => {
		// 		console.log('Token refreshed.');
		// 		localStorage.setItem("notification-token", refreshedToken);
		// 		const { user: { metadata } } = usePouchDB();
		// 		let Id = metadata.name;
		// 		// let Id = 2;
		// 		let Token = refreshedToken;
		// 		console.log(Id);
		// 		console.log(Token);
		// 		fetch('http://192.168.180.67:9000/register', {
		// 			method: 'POST',
		// 			headers: { 'Content-type': 'application/json' },
		// 			body: JSON.stringify({
		// 				userName: Id,
		// 				registrationToken: refreshedToken,

		// 			})

		// 		})
		// 			.then(response => response.json())
		// 			.then(data => {
		// 				console.log(data)
		// 			})
		// 			.catch(e => console.log(e))
		// 	}).catch((err) => {
		// 		console.log('Unable to retrieve refreshed token ', err);

		// 	});
		// });

	} catch (error) {
		console.error(error);
	}
};