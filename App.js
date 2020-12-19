import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "./LoginScreen";
import { CameraScreen } from "./CameraScreen";
import { GardensScreen } from "./GardensScreen";
import { GardenDetailsScreen } from "./GardenDetailsScreen";
import { GardenCreationScreen } from "./GardenCreationScreen";
import { PlantDetailsScreen } from "./PlantDetailsScreen";

const Stack = createStackNavigator();

function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Login"
				screenOptions={{
					headerShown: true,
				}}
			>
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="Camera" component={CameraScreen} />
				<Stack.Screen name="Gardens" component={GardensScreen} />
				<Stack.Screen name="Garden Creation" component={GardenCreationScreen} />
				<Stack.Screen name="Garden Details" component={GardenDetailsScreen} />
				<Stack.Screen name="Plant Details" component={PlantDetailsScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;
