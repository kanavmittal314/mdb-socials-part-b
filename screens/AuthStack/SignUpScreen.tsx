import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import firebase from "firebase";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignUpScreen">;
}

export default function SignUpScreen({ navigation }: Props) {
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign In Button (goes to Sign In Screen)
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/

    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/start
  */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbarVisible, setSnackbarVisibility] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Content title="Create an Account"></Appbar.Content>
      </Appbar.Header>
    );
  };

  const signUpUser = () => {
    setLoading(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        setLoading(false);
        return { user };
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        setLoading(false);
        setSnackbarText(errorMessage);
        setSnackbarVisibility(true);
      });
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Bar />
        <TextInput
          label="Email"
          value={email}
          onChangeText={(email) => setEmail(email)}
          style={{ backgroundColor: "white", marginBottom: 10 }}
        />
        <TextInput
          secureTextEntry={true}
          label="Password"
          value={password}
          onChangeText={(password) => setPassword(password)}
          style={{ backgroundColor: "white", marginBottom: 10 }}
        />
        <Button
          loading={loading}
          mode="contained"
          onPress={() => signUpUser()}
          style={{ marginTop: 20 }}
        >
          Create an Account
        </Button>
        <Button
          mode="text"
          onPress={() => navigation.navigate("SignInScreen")}
          style={{ marginTop: 20 }}
        >
          Or, Sign In Instead
        </Button>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisibility(false)}
        >
          {snackbarText}
        </Snackbar>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: "#ffffff",
  },
});
