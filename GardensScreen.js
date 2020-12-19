import React from "react";
import {
	TextInput,
	Text,
	View,
	Image,
	TouchableOpacity,
	KeyboardAvoidingView,
	Alert,
	FlatList,
	SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gardensStyles } from "./Styles";
import { getDataModel } from "./DataModel";

import { gardenStyles, loginStyles } from "./Styles";

export class GardensScreen extends React.Component {
	constructor(props) {
		super(props);

		this.dataModel = getDataModel();
		this.currentUser = this.props.route.params.currentUser;

		this.state = {
			gardens: [],
		};
	}

	componentDidMount() {
		this.subscribeToGardens();
	}

	componentWillUnmount = () => {
		this.dataModel.unsubscribeFromGardens();
	};

	subscribeToGardens = async () => {
		this.dataModel.subscribeToGardens(this.currentUser, this.onGardensUpdate);
	};

	onGardensUpdate = () => {
		this.setState({ gardens: this.currentUser.gardens });
	};

	onDelete = (itemKey) => {
		this.dataModel.deleteGarden(this.currentUser, itemKey);
	};

	render() {
		return (
			<SafeAreaView style={gardenStyles.container}>
				<View style={gardenStyles.wrapper}>
					<View style={gardenStyles.topView}>
						<Text style={gardenStyles.gardenHeading}>My Gardens</Text>
					</View>
					<FlatList
						data={this.state.gardens}
						style={gardenStyles.gardenList}
						renderItem={({ item }) => (
							<View key={item.key} style={gardenStyles.gardenRow}>
								<TouchableOpacity
									// style={gardenStyles.gardenButton}
									onPress={() => {
										this.props.navigation.navigate("Garden Details", {
											currentUser: this.currentUser,
											garden: item,
											mode: "edit",
										});
									}}
								>
									<Text style={gardenStyles.gardenTitle}>{item.name}</Text>
									<Text>
										{"Created " + this.dataModel.formatDate(item.date)}
									</Text>
								</TouchableOpacity>
								<Ionicons
									name="md-trash"
									size={24}
									color="black"
									onPress={() => {
										this.onDelete(item.key);
									}}
								/>
							</View>
						)}
					/>
					<View style={gardenStyles.bottomView}>
						<TouchableOpacity
							style={gardenStyles.buttonContainer}
							onPress={() => {
								this.props.navigation.navigate("Garden Creation", {
									currentUser: this.currentUser,
									mode: "create",
								});
							}}
						>
							<Text style={gardenStyles.buttonText}>Create Garden</Text>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		);
	}
}
