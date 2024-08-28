import { initializeApp } from "firebase/app";
import {
	getAuth,
	GoogleAuthProvider,
	FacebookAuthProvider,
	signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyBH9zPUlJkP6l92helxMGLmcslDKK6aRWQ",
	authDomain: "movie-database-project-c228a.firebaseapp.com",
	projectId: "movie-database-project-c228a",
	storageBucket: "movie-database-project-c228a.appspot.com",
	messagingSenderId: "719203954830",
	appId: "1:719203954830:web:e8fd85fee101ac4ccad9df",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
	let user = null;
	await signInWithPopup(auth, googleProvider)
		.then((res) => {
			user = res.user;
		})
		.catch((err) => console.log(err));
	return user;
};

export const authWithFacebook = async () => {
	let user = null;
	await signInWithPopup(auth, facebookProvider)
		.then((res) => {

			// This gives you a Facebook Access Token. You can use it to access the Facebook API.
			const credential = FacebookAuthProvider.credentialFromResult(res);
			res.user.facebookAccessToken = credential.accessToken;

			user = res.user;
		})
		.catch((err) => console.log(err));
	return user;
};
