import React from "react";
import {
	TextInput,
	Text,
	View,
	Image,
	TouchableOpacity,
	KeyboardAvoidingView,
	Alert,
} from "react-native";

import { loginStyles } from "./Styles";
import { getDataModel } from "./DataModel";

export class LoginScreen extends React.Component {
	constructor(props) {
		super(props);

		this.dataModel = getDataModel();

		this.state = {
			mode: "login",
			emailInput: "",
			passwordInput: "",
			passwordCheckInput: "",
		};
	}

	onCreateAccount = async () => {
		let users = this.dataModel.getUsers();
		for (let user of users) {
			if (user.email === this.state.emailInput) {
				Alert.alert(
					"Duplicate User",
					"User " + this.state.emailInput + " already exists.",
					[{ text: "OK", style: "OK" }]
				);
				return;
			}
		}
		let newUser = await this.dataModel.createUser(
			this.state.emailInput,
			this.state.passwordInput
		);
		this.props.navigation.navigate("Login", {
			currentUser: newUser,
		});
	};

	onLogin = () => {
		let users = this.dataModel.getUsers();
		let email = this.state.emailInput;
		let pass = this.state.passwordInput;
		for (let user of users) {
			if (user.email === email) {
				if (user.password === pass) {
					this.props.navigation.navigate("Gardens", {
						currentUser: user,
					});
					return;
				}
			}
		}

		Alert.alert("Login Failed", "No match found for this email and password.", [
			{ text: "OK", style: "OK" },
		]);
	};

	render() {
		return (
			<KeyboardAvoidingView
				style={loginStyles.container}
				behavior={"height"}
				keyboardVerticalOffset={10}
			>
				<View style={loginStyles.topView}>
					<Image
						source={require("./assets/bloom_logo.png")}
						style={loginStyles.logoImage}
					/>
				</View>
				<View style={loginStyles.middleView}>
					<View style={loginStyles.inputRow}>
						<Text style={loginStyles.inputLabel}>Email:</Text>
						<TextInput
							style={loginStyles.inputText}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
							autoCompleteType="email"
							textContentType="emailAddress"
							value={this.state.emailInput}
							onChangeText={(text) => {
								this.setState({ emailInput: text });
							}}
						/>
					</View>

					<View style={loginStyles.inputRow}>
						<Text style={loginStyles.inputLabel}>Password:</Text>
						<TextInput
							style={loginStyles.inputText}
							autoCapitalize="none"
							autoCorrect={false}
							textContentType="password"
							value={this.state.passwordInput}
							onChangeText={(text) => {
								this.setState({ passwordInput: text });
							}}
						/>
					</View>
				</View>
				{this.state.mode === "create" ? (
					<View style={loginStyles.inputRow}>
						<Text style={loginStyles.inputLabel}>Re-enter Password:</Text>
						<TextInput
							style={loginStyles.inputText}
							autoCapitalize="none"
							autoCorrect={false}
							textContentType="password"
							value={this.state.passwordCheckInput}
							onChangeText={(text) => {
								this.setState({ passwordCheckInput: text });
							}}
						/>
					</View>
				) : (
					<View />
				)}

				{this.state.mode === "login" ? (
					<View style={loginStyles.bottomView}>
						<TouchableOpacity
							style={loginStyles.buttonContainer}
							onPress={() => {
								this.setState({ mode: "create" });
							}}
						>
							<Text style={loginStyles.buttonText}>Create Account</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={loginStyles.buttonContainer}
							onPress={this.onLogin}
						>
							<Text style={loginStyles.buttonText}>Login</Text>
						</TouchableOpacity>
					</View>
				) : (
					<View style={loginStyles.bottomView}>
						<TouchableOpacity
							style={loginStyles.buttonContainer}
							onPress={() => {
								this.setState({ mode: "login" });
							}}
						>
							<Text style={loginStyles.buttonText}>Login</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={loginStyles.buttonContainer}
							onPress={this.onCreateAccount}
						>
							<Text style={loginStyles.buttonText}>Create</Text>
						</TouchableOpacity>
					</View>
				)}
			</KeyboardAvoidingView>
		);
	}
}
