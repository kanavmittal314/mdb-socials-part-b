import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, ScrollView, Text } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import firebase from "firebase";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignInScreen">;
}

export default function SignInScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbarVisible, setSnackbarVisibility] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign Up Button (goes to Sign Up screen)
      - Reset Password Button
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/

    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/starts
  */

  const snackbarMessage = (message: any) => {
    setSnackbarText(message);
    setSnackbarVisibility(true);
  }
  const signInUser = async () => {
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoading(false);
        return { user };
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoading(false);
        console.log(errorMessage);
        snackbarMessage(errorMessage);
      });
  };

  const sendEmailWithPassword = async () => {
    // TODO: When user click on button, your app should send a reset password to the user's email
    if (!email){
      snackbarMessage("Please enter an email to reset your password.")
    }
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        console.log('Password reset email sent')
        snackbarMessage("A password reset link has been sent to your email.")
        return {}
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log('error message')
        snackbarMessage(errorMessage)
      })
  }

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Content title="Sign In"></Appbar.Content>
      </Appbar.Header>
    );
  };
  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <Bar />
        <TextInput
          label="Email"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          secureTextEntry={true}
          label="Password"
          value={password}
          onChangeText={(password) => setPassword(password)}
        />
        <Button loading = {loading} mode="contained" onPress={() => signInUser()}>
          Sign In
        </Button>
        <Button mode="text" onPress={() => navigation.navigate("SignUpScreen")}>
          Sign Up
        </Button>
        <Button mode="text" onPress = {() => sendEmailWithPassword()}>Reset Password</Button>
        <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisibility(false)} action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisibility(false),
        }}>
          {snackbarText}
        </Snackbar>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: "#ffffff",
  },
});
