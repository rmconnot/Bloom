import React from "react";
import {
	TextInput,
	Text,
	View,
	Image,
	TouchableOpacity,
	FlatList,
	SafeAreaView,
} from "react-native";

import { plantStyles, loginStyles, gardenStyles } from "./Styles";
import { getDataModel } from "./DataModel";
import { Ionicons } from "@expo/vector-icons";

export class PlantDetailsScreen extends React.Component {
	constructor(props) {
		super(props);

		this.dataModel = getDataModel();
		this.currentUser = this.props.route.params.currentUser;
		this.garden = this.props.route.params.garden;
		this.plant = this.props.route.params.plant;

		this.state = {
			notes: this.plant.notes ? this.plant.notes : [],
			pendingNote: "",
			addingNote: false,
			image: null,
		};
	}

	componentDidMount = () => {
		this.subscribeToNotes();
	};

	componentWillUnmount = () => {
		this.dataModel.unsubscribeFromNotes();
	};

	subscribeToNotes = () => {
		this.dataModel.subscribeToNotes(
			this.plant,
			this.onUpdateNotes,
			this.currentUser,
			this.garden
		);
	};

	onUpdateNotes = () => {
		this.setState({ notes: this.plant.notes });
	};

	onAddNote = () => {
		this.dataModel.addNote(
			this.currentUser,
			this.garden.key,
			this.plant,
			this.state.pendingNote,
			this.state.image
		);
		this.setState({ addingNote: false, pendingNote: "", image: null });
	};

	updateImage = (picData) => {
		this.setState({ image: picData });
	};

	onDeleteNote = (noteKey) => {
		this.dataModel.deleteNote(
			this.currentUser,
			this.garden.key,
			this.plant.gardenPlantRef,
			noteKey
		);
	};

	compareValues = (a, b) => {
		// Use toUpperCase() to ignore character casing
		const valueA = a.datetime;
		const valueB = b.datetime;

		let comparison = 0;
		if (valueA > valueB) {
			comparison = -1;
		} else if (valueA < valueB) {
			comparison = 1;
		}
		return comparison;
	};

	render() {
		return (
			<SafeAreaView style={loginStyles.container}>
				<View style={gardenStyles.wrapper}>
					<View style={plantStyles.topView}>
						<View style={plantStyles.headingView}>
							<Text style={plantStyles.plantHeading}>
								{this.plant.common_name}
							</Text>
						</View>
						<Text style={plantStyles.infoText}>
							Botanical name:{" "}
							{this.plant.botanical_name ? this.plant.botanical_name : "N/A"}
						</Text>
						<Text style={plantStyles.infoText}>
							Plant type:{" "}
							{this.plant.plant_type ? this.plant.plant_type : "N/A"}
						</Text>
						<Text style={plantStyles.infoText}>
							Sun exposure:{" "}
							{this.plant.sun_exposure ? this.plant.sun_exposure : "N/A"}
						</Text>
						<Text style={plantStyles.infoText}>
							Soil type: {this.plant.soil_type ? this.plant.soil_type : "N/A"}
						</Text>
						<Text style={plantStyles.infoText}>
							Soil pH: {this.plant.soil_pH ? this.plant.soil_pH : "N/A"}
						</Text>
						<Text style={plantStyles.infoText}>
							Bloom time:{" "}
							{this.plant.bloom_time ? this.plant.bloom_time : "N/A"}
						</Text>
						<Text style={plantStyles.infoText}>
							Flower color:{" "}
							{this.plant.flower_color ? this.plant.flower_color : "N/A"}
						</Text>
						<Text style={plantStyles.infoText}>
							Hardiness Zones: {this.plant.hardiness_zones[0]} -{" "}
							{
								this.plant.hardiness_zones[
									this.plant.hardiness_zones.length - 1
								]
							}
						</Text>
						<Text style={plantStyles.infoText}>
							Special features:{" "}
							{this.plant.special_features
								? this.plant.special_features
								: "N/A"}
						</Text>
					</View>
					<View style={plantStyles.middleView}>
						<Text style={plantStyles.notesHeading}>Notes</Text>
						{this.state.addingNote ? (
							<View style={plantStyles.addingNoteView}>
								{this.state.image ? (
									<Image
										style={{
											width: 200,
											height: 200,
										}}
										source={this.state.image}
									/>
								) : (
									<View />
								)}
								<TextInput
									style={plantStyles.addingNoteInput}
									onChangeText={(note) => this.setState({ pendingNote: note })}
								></TextInput>
								<View style={plantStyles.buttonView}>
									<TouchableOpacity
										onPress={() =>
											this.props.navigation.navigate("Camera", {
												currentUser: this.currentUser,
												plant: this.plant,
												updateImage: this.updateImage,
											})
										}
									>
										<Ionicons name="ios-camera" size={44} color="black" />
									</TouchableOpacity>
									<View style={plantStyles.miniButtonView}>
										<TouchableOpacity onPress={() => this.onAddNote()}>
											<Text style={plantStyles.noteTakingButtonText}>
												Enter
											</Text>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() =>
												this.setState({
													addingNote: false,
													image: null,
													pendingNote: "",
												})
											}
										>
											<Text style={plantStyles.noteTakingButtonText}>
												Cancel
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						) : (
							<View>
								<TouchableOpacity
									style={plantStyles.addNote}
									onPress={() => this.setState({ addingNote: true })}
								>
									<Ionicons
										name="md-add-circle-outline"
										size={30}
										color="black"
									/>
								</TouchableOpacity>
							</View>
						)}
					</View>
					<View style={plantStyles.bottomView}>
						<FlatList
							data={this.state.notes.sort(this.compareValues)}
							renderItem={({ item }) => (
								<View style={plantStyles.noteRow}>
									<View style={plantStyles.noteContentLeft}>
										<Text style={plantStyles.noteDate}>
											{this.dataModel.formatDateDay(item.datetime)}
										</Text>
										{item.image ? (
											<Image
												style={{
													width: 200,
													height: 200,
												}}
												source={{ uri: item.image }}
											/>
										) : (
											<View />
										)}
										<Text>{item.text}</Text>
									</View>
									<View style={plantStyles.noteContentLeft}>
										<TouchableOpacity
											onPress={() => this.onDeleteNote(item.key)}
										>
											<Ionicons name="md-trash" size={24} color="black" />
										</TouchableOpacity>
									</View>
								</View>
							)}
						/>
					</View>
				</View>
			</SafeAreaView>
		);
	}
}
