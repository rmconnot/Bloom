import firebase from "firebase";
import "@firebase/firestore";
import "@firebase/storage";
import { firebaseConfig } from "./Secrets";

class DataModel {
	constructor() {
		if (firebase.apps.length === 0) {
			// aka !firebase.apps.length
			firebase.initializeApp(firebaseConfig);
		}
		this.usersRef = firebase.firestore().collection("users");
		this.storageRef = firebase.storage().ref();
		this.users = [];
		this.gardens = [];
		this.masterPlantsList = [];
		this.asyncInit();
	}

	asyncInit = async () => {
		this.loadUsers();
		this.loadPlants();
		// this.loadZipcodes();
	};

	loadUsers = async () => {
		let querySnap = await this.usersRef.get();
		querySnap.forEach((qDocSnap) => {
			let key = qDocSnap.id;
			let data = qDocSnap.data();
			data.key = key;
			this.users.push(data);
		});
	};

	loadPlants = async () => {
		let querySnap = await firebase.firestore().collection("plants").get();
		querySnap.forEach((qDocSnap) => {
			let key = qDocSnap.id;
			let data = qDocSnap.data();
			data.key = key;
			this.masterPlantsList.push(data);
		});
	};

	getUsers = () => {
		return this.users;
	};

	createUser = async (email, pass) => {
		// assemble the data structure
		let newUser = {
			email: email,
			password: pass,
		};

		// add the data to Firebase (user collection)
		let newUserDocRef = await this.usersRef.add(newUser);

		// get the new Firebase ID and save it as the local "key"
		let key = newUserDocRef.id;
		newUser.key = key;
		this.users.push(newUser);
		return newUser;
	};

	getZone = async (zipcode) => {
		let zipcodeData = await firebase
			.firestore()
			.collection("zipcodes")
			.doc(zipcode)
			.get()
			.then((doc) => doc.data());

		return zipcodeData;
	};

	getGardens = async (currentUser) => {
		if (this.gardens.length == 0) {
			await this.loadGardens(currentUser);
		}
		return this.gardens;
	};

	loadGardens = async (currentUser) => {
		let querySnap = await this.usersRef
			.doc(currentUser)
			.collection("gardens")
			.get();
		querySnap.forEach(async (qDocSnap) => {
			let data = qDocSnap.data();
			data.key = qDocSnap.id;
			this.gardens.push(data);
		});
	};

	subscribeToGardens = (currentUser, onUpdateFunc) => {
		this.gardensSnapshotUnsub = this.usersRef
			.doc(currentUser.key)
			.collection("gardens")
			.orderBy("date")
			.onSnapshot((querySnap) => {
				currentUser.gardens = [];
				querySnap.forEach((qDocSnap) => {
					let gardenObj = qDocSnap.data();
					gardenObj.key = qDocSnap.id;
					currentUser.gardens.push(gardenObj);
				});
				onUpdateFunc();
			});
	};

	unsubscribeFromGardens = () => {
		if (this.gardensSnapshotUnsub) {
			this.gardensSnapshotUnsub();
		}
	};

	unsubscribeFromPlantsColl = () => {
		if (this.plantsCollSnapshotUnsub) {
			this.plantsCollSnapshotUnsub();
		}
	};

	subscribeToGardenDoc = (currentUser, onUpdateFunc, garden) => {
		this.gardenDocSnapshotUnsub = this.usersRef
			.doc(currentUser.key)
			.collection("gardens")
			.doc(garden.key)
			.onSnapshot((querySnap) => {
				let queriedGarden = querySnap.data();
				for (let gardenItem of currentUser.gardens) {
					if (gardenItem.key == queriedGarden.key) {
						gardenItem.name = queriedGarden.name;
						gardenItem.zone = queriedGarden.zone;
						gardenItem.trange = queriedGarden.trange;
					}
				}

				onUpdateFunc();
			});
	};

	unsubscribeFromGardenDoc = () => {
		if (this.gardenDocSnapshotUnsub) {
			this.gardenDocSnapshotUnsub();
		}
	};

	retrievePlantObj = async (plantObj) => {
		let dummyPlant;
		await plantObj.plantRef.get().then((plantData) => {
			let plant = plantData.data();
			plant.key = plantData.id;
			dummyPlant = plant;
		});
		return dummyPlant;
	};

	subscribeToPlants = (currentUser, onUpdateFunc, garden) => {
		this.plantsCollSnapshotUnsub = this.usersRef
			.doc(currentUser.key)
			.collection("gardens")
			.doc(garden.key)
			.collection("plants")
			.onSnapshot((querySnap) => {
				garden.plants = [];
				querySnap.forEach(async (qDocSnap) => {
					let plantObj = qDocSnap.data();
					let dummyPlant = await this.retrievePlantObj(plantObj);
					dummyPlant.gardenPlantRef = qDocSnap.id;
					garden.plants.push(dummyPlant);
					onUpdateFunc();
				});
			});
	};

	createGarden = async (currentUser, garden) => {
		let newGarden = {
			name: garden.name,
			zipcode: garden.zipcode,
			date: Date.now(),
			zone: garden.zone,
			trange: garden.trange,
		};

		await this.usersRef
			.doc(currentUser.key)
			.collection("gardens")
			.add(newGarden);
	};

	deleteGarden = (currentUser, gardenKey) => {
		this.usersRef
			.doc(currentUser.key)
			.collection("gardens")
			.doc(gardenKey)
			.delete();
	};

	editGarden = async (currentUser, garden) => {
		let updatedGarden = {
			name: garden.name,
			zipcode: garden.zipcode,
			zone: garden.zone,
			trange: garden.trange,
		};

		await this.usersRef
			.doc(currentUser.key)
			.collection("gardens")
			.doc(garden.key)
			.set(updatedGarden, { merge: true });
	};

	addPlantToGarden = (currentUser, plantKey, gardenKey) => {
		let newPlant = {
			plantRef: firebase.firestore().collection("plants").doc(plantKey),
		};

		this.usersRef
			.doc(currentUser.key)
			.collection("gardens")
			.doc(gardenKey)
			.collection("plants")
			.add(newPlant);
	};

	removePlantFromGarden = (currentUser, plantKey, gardenKey) => {
		this.usersRef
			.doc(currentUser.key)
			.collection("gardens")
			.doc(gardenKey)
			.collection("plants")
			.doc(plantKey)
			.delete();
	};

	subscribeToNotes = (plant, onUpdateFunc, currentUser, garden) => {
		this.notesCollSnapshotUnsub = this.usersRef
			.doc(currentUser.key)
			.collection("gardens")
			.doc(garden.key)
			.collection("plants")
			.doc(plant.gardenPlantRef)
			.collection("notes")
			.onSnapshot((querySnap) => {
				plant.notes = [];
				querySnap.forEach(async (qDocSnap) => {
					let rawNote = qDocSnap.data();
					rawNote.key = qDocSnap.id;

					plant.notes.push(rawNote);
				});
				onUpdateFunc();
			});
	};

	unsubscribeFromNotes = () => {
		if (this.notesCollSnapshotUnsub) {
			this.notesCollSnapshotUnsub();
		}
	};

	addImageToStorage = async (pendingImage) => {
		let fileName = "" + Date.now();
		let imageRef = this.storageRef.child(fileName);

		// fetch the image object from the local filesystem
		let response = await fetch(pendingImage.uri);
		let imageBlob = await response.blob();

		// then upload it to Firebase Storage
		await imageRef.put(imageBlob);
		let downloadURL = await imageRef.getDownloadURL();

		return downloadURL;
	};

	addNote = async (
		currentUser,
		gardenKey,
		plant,
		pendingNote,
		pendingImage
	) => {
		let storedImage = "";
		if (pendingImage) {
			storedImage = await this.addImageToStorage(pendingImage);
		}

		let note = {
			text: pendingNote,
			datetime: Date.now(),
			image: storedImage,
		};

		this.usersRef
			.doc(currentUser.key)
			.collection("gardens")
			.doc(gardenKey)
			.collection("plants")
			.doc(plant.gardenPlantRef)
			.collection("notes")
			.add(note);
	};

	deleteNote = (currentUser, gardenKey, plantKey, noteKey) => {
		this.usersRef
			.doc(currentUser.key)
			.collection("gardens")
			.doc(gardenKey)
			.collection("plants")
			.doc(plantKey)
			.collection("notes")
			.doc(noteKey)
			.delete();
	};

	formatDate = (rawDateString) => {
		let dateString = new Date(rawDateString).toISOString();
		let month = dateString.slice(5, 7);
		let year = dateString.slice(0, 4);

		return month + "/" + year;
	};

	formatDateDay = (rawDateString) => {
		let dateString = new Date(rawDateString).toISOString();
		let month = dateString.slice(5, 7);
		let year = dateString.slice(0, 4);
		let day = dateString.slice(8, 10);

		return day + "/" + month + "/" + year;
	};
}

let theDataModel = undefined;

export function getDataModel() {
	if (!theDataModel) {
		theDataModel = new DataModel();
	}
	return theDataModel;
}
