import { StyleSheet } from "react-native";

export const colors = {
	primary: "#038236", // MD Amber 500
	primaryDark: "#303F9F", // MD Brown 300
	primaryLight: "#E8EAF6", // MD Amber 200
	outline: "#BDBDBD", // MD Gray 400
};

export const loginStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 20,
	},

	topView: {
		flex: 0.3,
		alignItems: "center",
		justifyContent: "flex-end",
		width: "100%",
	},

	loginFormView: {
		alignItems: "center",
		justifyContent: "center",
	},

	loginTextInput: {
		borderWidth: 2,
		borderStyle: "solid",
	},

	logoImage: {
		alignItems: "center",
		justifyContent: "center",
		width: "70%",
		height: "70%",
		resizeMode: "contain",
	},

	middleView: {
		flex: 0.2,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		//backgroundColor: 'lightgreen'
	},

	inputRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		paddingVertical: 15,
		marginLeft: -40,
	},
	inputLabel: {
		flex: 0.3,
		justifyContent: "flex-end",
		paddingRight: 5,
		textAlign: "right",
		fontSize: 10,
	},

	inputText: {
		flex: 0.5,
		borderColor: colors.outline,
		paddingLeft: 5,
		borderBottomWidth: 1,
		fontSize: 18,
	},

	bottomView: {
		flex: 0.3,
		flexDirection: "row",
		width: "100%",
		justifyContent: "center",
		alignItems: "flex-start",
	},
	buttonContainer: {
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: colors.outline,
		borderRadius: 6,
		backgroundColor: colors.primary,
		width: 100,
		height: 50,
	},
	buttonText: {
		textAlign: "center",
		color: "white",
	},
});

export const gardenStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 20,
	},

	wrapper: {
		width: "90%",
		margin: "auto",
		justifyContent: "center",
		flex: 1,
	},

	topView: {
		flex: 0.7,
		justifyContent: "flex-end",
		width: "100%",
		borderColor: colors.primary,
		borderBottomWidth: 2,
	},

	gardenHeading: {
		fontSize: 26,
		borderBottomWidth: 2,
		borderColor: colors.outline,
	},

	gardenList: {
		marginTop: 30,
		flexGrow: 0.8,
		width: "90%",
	},

	gardenRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: "5%",
		borderBottomColor: "grey",
		borderBottomWidth: 0.5,
		paddingBottom: "5%",
	},

	gardenTitle: {
		fontSize: 16,
		fontWeight: "500",
	},

	bottomView: {
		flexGrow: 3,
	},

	buttonText: {
		textAlign: "center",
		color: "white",
		fontSize: 22,
	},

	buttonContainer: {
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: colors.outline,
		borderRadius: 6,
		backgroundColor: colors.primary,
		height: 50,
	},
});

export const gardenDetailsStyles = StyleSheet.create({
	topView: {
		flex: 0.3,
		justifyContent: "flex-end",
		width: "100%",
		borderColor: colors.primary,
		borderBottomWidth: 2,
	},

	gardenHeading: {
		fontSize: 26,
	},

	hardinessZoneText: {
		fontWeight: "500",
	},

	trangeText: {
		fontStyle: "italic",
	},

	editGardenButton: {
		alignSelf: "flex-end",
		marginTop: "2.5%",
	},

	myPlantsView: {
		flex: 1,
		width: "90%",
	},

	myPlantsList: {
		marginTop: 30,
		// flexGrow: 0.8,

		flex: 0.1,
	},

	myPlantsHeading: {
		fontSize: 20,
		fontWeight: "500",
	},

	plantRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: "5%",
	},

	plantTitle: {
		fontSize: 16,
	},

	availablePlantsView: {
		// flexGrow: 0.8,
		width: "90%",
		flex: 1,
	},
});

export const gardenCreationStyles = StyleSheet.create({
	inputRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		paddingVertical: 15,
		marginLeft: -40,
	},
	inputLabel: {
		flex: 0.3,
		justifyContent: "flex-end",
		paddingRight: 5,
		textAlign: "right",
		fontSize: 14,
	},

	inputText: {
		flex: 0.5,
		borderColor: colors.outline,
		paddingLeft: 5,
		borderBottomWidth: 1,
		fontSize: 18,
	},

	buttonContainer: {
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
		borderWidth: 1,
		borderColor: colors.outline,
		borderRadius: 6,
		backgroundColor: colors.primary,
		height: 50,
		width: "100%",
		marginTop: 40,
	},
});

export const plantStyles = StyleSheet.create({
	topView: {
		flex: 1,
	},

	bottomView: {
		flex: 2,
	},

	plantHeading: {
		fontSize: 26,
	},

	notesHeading: {
		fontSize: 20,
	},

	headingView: {
		flex: 0.7,
		justifyContent: "flex-end",
		width: "100%",
		borderColor: colors.primary,
		borderBottomWidth: 2,
		marginBottom: 15,
	},

	addNote: {
		alignSelf: "center",
		marginTop: "5%",
		marginBottom: "5%",
	},

	noteRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: "5%",
	},

	addingNoteView: {
		backgroundColor: "#D3D3D3",
		borderRadius: 15,
		justifyContent: "flex-end",
		marginBottom: 30,
	},

	addingNoteInput: {
		height: 100,
	},

	noteDate: {
		fontWeight: "500",
	},

	buttonView: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "baseline",
	},

	miniButtonView: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "baseline",
		width: 100,
	},

	noteTakingButtonText: {
		fontWeight: "600",
	},
});
