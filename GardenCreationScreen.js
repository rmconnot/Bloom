import React from "react";
import {
	TextInput,
	Text,
	View,
	Image,
	TouchableOpacity,
	KeyboardAvoidingView,
	Alert,
	SafeAreaView,
} from "react-native";

import { loginStyles, gardenCreationStyles, gardenStyles } from "./Styles";
import { getDataModel } from "./DataModel";

export class GardenCreationScreen extends React.Component {
	constructor(props) {
		super(props);

		this.dataModel = getDataModel();
		this.currentUser = this.props.route.params.currentUser;
		this.mode = this.props.route.params.mode;

		this.garden = this.props.route.params.garden
			? this.props.route.params.garden
			: "";

		this.state = {
			gardenName: this.garden ? this.garden.name : "",
			zipcode: this.garden ? this.garden.zipcode : "",
		};
	}

	handleGardenCreation = async () => {
		let zoneData = await this.dataModel.getZone(this.state.zipcode);
		let newGarden = {
			name: this.state.gardenName,
			zipcode: this.state.zipcode,
			zone: zoneData.zone,
			trange: zoneData.trange,
		};
		this.dataModel.createGarden(this.currentUser, newGarden);
		this.props.navigation.goBack({ currentUser: this.currentUser });
	};

	handleGardenEdit = async () => {
		let zoneData = await this.dataModel.getZone(this.state.zipcode);
		let updatedGarden = {
			name: this.state.gardenName,
			zipcode: this.state.zipcode,
			zone: zoneData.zone,
			trange: zoneData.trange,
			key: this.garden.key,
		};
		this.dataModel.editGarden(this.currentUser, updatedGarden);
		this.props.navigation.goBack({
			currentUser: this.currentUser,
			garden: this.garden,
		});
	};

	render() {
		return (
			<SafeAreaView style={loginStyles.container}>
				<View style={gardenStyles.wrapper}>
					<View style={gardenCreationStyles.inputRow}>
						<Text style={gardenCreationStyles.inputLabel}>Garden name:</Text>
						<TextInput
							value={this.state.gardenName}
							style={gardenCreationStyles.inputText}
							onChangeText={(inputText) => {
								this.setState({ gardenName: inputText });
							}}
						/>
					</View>
					<View style={gardenCreationStyles.inputRow}>
						<Text style={gardenCreationStyles.inputLabel}>Zipcode:</Text>
						<TextInput
							value={this.state.zipcode}
							style={gardenCreationStyles.inputText}
							onChangeText={(inputText) => {
								this.setState({ zipcode: inputText });
							}}
						/>
					</View>
					<TouchableOpacity
						style={gardenCreationStyles.buttonContainer}
						onPress={
							this.mode == "create"
								? this.handleGardenCreation
								: this.handleGardenEdit
						}
					>
						<Text style={loginStyles.buttonText}>Submit</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		);
	}
}
