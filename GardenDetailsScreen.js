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

import { gardensStyles } from "./Styles";
import { getDataModel } from "./DataModel";
import { Ionicons } from "@expo/vector-icons";
import { gardenStyles, loginStyles, gardenDetailsStyles } from "./Styles";

export class GardenDetailsScreen extends React.Component {
	constructor(props) {
		super(props);

		this.dataModel = getDataModel();
		this.currentUser = this.props.route.params.currentUser;
		this.garden = this.props.route.params.garden;

		this.state = {
			gardenName: this.garden.name,
			zone: this.garden.zone,
			trange: this.garden.trange,
			plants: [],
			plantsLoaded: false,
		};
	}

	componentDidMount() {
		this.subscribeToGardenDoc();
		this.subscribeToPlantsColl();
	}

	componentWillUnmount = () => {
		this.dataModel.unsubscribeFromGardenDoc();
		this.dataModel.unsubscribeFromPlantsColl();
	};

	subscribeToGardenDoc = () => {
		this.dataModel.subscribeToGardenDoc(
			this.currentUser,
			this.onGardenDocUpdate,
			this.garden
		);
	};

	subscribeToPlantsColl = () => {
		this.dataModel.subscribeToPlants(
			this.currentUser,
			this.onPlantCollUpdate,
			this.garden
		);
	};

	onGardenDocUpdate = () => {
		for (let gardenItem of this.currentUser.gardens) {
			if (gardenItem.key == this.garden.key) {
				(this.garden.name = gardenItem.name),
					(this.garden.zone = gardenItem.zone),
					(this.garden.trange = gardenItem.trange),
					this.setState({
						gardenName: gardenItem.name,
						zone: gardenItem.zone,
						trange: gardenItem.trange,
					});
			}
		}
	};

	onPlantCollUpdate = () => {
		if (this.garden.plants.length) {
			this.setState({ plants: this.garden.plants, plantsLoaded: true });
		}
	};

	addPlant = (plantKey) => {
		let plantExists = false;
		if (this.garden.plants.length) {
			for (let plant of this.garden.plants) {
				if (plant.key == plantKey) {
					plantExists = true;
					break;
				}
			}
		}
		if (!plantExists) {
			this.dataModel.addPlantToGarden(
				this.currentUser,
				plantKey,
				this.garden.key
			);
		}
	};

	onRemovePlant = (plantKey) => {
		if (this.garden.plants.length <= 1) {
			this.setState({ plants: [] });
		}

		this.dataModel.removePlantFromGarden(
			this.currentUser,
			plantKey,
			this.garden.key
		);
	};

	navigateToPlantPage = (item) => {
		this.props.navigation.navigate("Plant Details", {
			currentUser: this.currentUser,
			garden: this.garden,
			plant: item,
		});
	};

	compareValues = (a, b) => {
		// Use toUpperCase() to ignore character casing
		const valueA = a.common_name.toUpperCase();
		const valueB = b.common_name.toUpperCase();

		let comparison = 0;
		if (valueA > valueB) {
			comparison = 1;
		} else if (valueA < valueB) {
			comparison = -1;
		}
		return comparison;
	};

	render() {
		return (
			<SafeAreaView style={gardenStyles.container}>
				<View style={gardenStyles.wrapper}>
					<View style={gardenDetailsStyles.topView}>
						<Text style={gardenDetailsStyles.gardenHeading}>
							{this.state.gardenName}
						</Text>
						<Text
							style={gardenDetailsStyles.hardinessZoneText}
						>{`Hardiness zone ${this.state.zone}`}</Text>
						<Text style={gardenDetailsStyles.trangeText}>
							{`Average annual minimum winter temperature ranges from ${this.state.trange}`}
						</Text>
					</View>
					<TouchableOpacity
						style={gardenDetailsStyles.editGardenButton}
						onPress={() => {
							this.props.navigation.navigate("Garden Creation", {
								currentUser: this.currentUser,
								garden: this.garden,
								mode: "edit",
							});
						}}
					>
						<Text>Edit garden</Text>
					</TouchableOpacity>

					{this.state.plants && this.state.plants.length ? (
						<View style={gardenDetailsStyles.myPlantsView}>
							<Text style={gardenDetailsStyles.myPlantsHeading}>
								My garden's plants
							</Text>
							<FlatList
								data={this.state.plants.sort(this.compareValues)}
								style={gardenDetailsStyles.myPlantsList}
								renderItem={({ item }) => (
									<View style={gardenDetailsStyles.plantRow}>
										<TouchableOpacity
											onPress={() => this.navigateToPlantPage(item)}
										>
											<Text style={gardenDetailsStyles.plantTitle}>
												{item.common_name}
											</Text>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => this.onRemovePlant(item.gardenPlantRef)}
										>
											<Ionicons
												name="md-remove-circle-outline"
												size={24}
												color="black"
											/>
										</TouchableOpacity>
									</View>
								)}
							/>
						</View>
					) : (
						<Text>No plants have been added to your garden yet!</Text>
					)}
					<View style={gardenDetailsStyles.availablePlantsView}>
						<Text style={gardenDetailsStyles.myPlantsHeading}>
							Plants suited to hardiness zone {this.state.zone}
						</Text>
						<FlatList
							data={this.dataModel.masterPlantsList.sort(this.compareValues)}
							style={gardenDetailsStyles.myPlantsList}
							renderItem={({ item }) => {
								if (this.state.plantsLoaded && this.state.plants.length) {
									let plantExists = false;
									for (let plant of this.garden.plants) {
										if (plant.key == item.key) {
											plantExists = true;
											break;
										}
									}
									if (
										!plantExists &&
										item.hardiness_zones.includes(this.state.zone.slice(0, 1))
									) {
										return (
											<View style={gardenDetailsStyles.plantRow}>
												<TouchableOpacity>
													<Text style={gardenDetailsStyles.plantTitle}>
														{item.common_name}
													</Text>
												</TouchableOpacity>
												<TouchableOpacity
													onPress={() => this.addPlant(item.key)}
												>
													<Ionicons
														name="md-add-circle-outline"
														size={24}
														color="black"
													/>
												</TouchableOpacity>
											</View>
										);
									}
								} else if (
									item.hardiness_zones.includes(this.state.zone.slice(0, 1))
								) {
									return (
										<View style={gardenDetailsStyles.plantRow}>
											<TouchableOpacity>
												<Text style={gardenDetailsStyles.plantTitle}>
													{item.common_name}
												</Text>
											</TouchableOpacity>
											<TouchableOpacity onPress={() => this.addPlant(item.key)}>
												<Ionicons
													name="md-add-circle-outline"
													size={24}
													color="black"
												/>
											</TouchableOpacity>
										</View>
									);
								}
							}}
						/>
					</View>
				</View>
			</SafeAreaView>
		);
	}
}
