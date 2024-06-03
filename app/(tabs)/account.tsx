import { View } from "@/components/Themed";
import Header from "@/components/Header";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Snackbar,
} from "react-native-paper";
import { Login, Register } from "@/api/firebase.auth";

const Account = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = () => {
    setError(null);
    setLoading(true);
    Login(email, password)
      .then(() => {
        setLoading(false);
        setError("Login successful!");
      })
      .catch((err) => {
        setLoading(false);
        if (err.code === "auth/user-not-found" || err.code === "auth/invalid-email" || err.code === "auth/wrong-password" || err.code === "auth/invalid-password" || err.code === "auth/missing-password" || err.code === "auth/invalid-credential") {
          setError("Invalid credentials");
        } else {
          setError("An error occurred. Please try again later.");
        }
      });
  };

  const handleRegister = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    setLoading(true);
    Register(email, password)
      .then(() => {
        setLoading(false);
        setError("Registration successful!");
        setIsRegistering(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.code === "auth/email-already-in-use") {
          setError("Email already in use");
        } else if (err.code === "auth/invalid-email") {
          setError("Invalid email");
        } else if (err.code === "auth/weak-password") {
          setError("Password is too weak");
        } else {
          setError("An error occurred. Please try again later.");
        }
      });
  };

  return (
    <>
      <Header title="Account" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 items-center justify-center">
            <Card style={styles.card}>
              <Card.Title
                title={isRegistering ? "Register" : "Login"}
                titleStyle={styles.cardTitle}
              />
              <Card.Content style={styles.textInput}>
                <TextInput
                  mode="outlined"
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  style={{ marginBottom: 16 }}
                />
                <TextInput
                  mode="outlined"
                  label="Password"
                  value={password}
                  secureTextEntry={secureText}
                  right={<TextInput.Icon icon={secureText ? "eye" : "eye-off"} onPress={() => setSecureText(!secureText)} />}
                  onChangeText={setPassword}
                  style={{ marginBottom: 16 }}
                />
                {isRegistering && (
                  <TextInput
                    mode="outlined"
                    label="Confirm Password"
                    value={confirmPassword}
                    secureTextEntry={secureText}
                    right={<TextInput.Icon icon={secureText ? "eye" : "eye-off"} onPress={() => setSecureText(!secureText)} />}
                    onChangeText={setConfirmPassword}
                    style={{ marginBottom: 16 }}
                  />
                )}
                {error && <Text style={styles.errorText}>{error}</Text>}
              </Card.Content>
              <Card.Actions style={styles.buttonContainer}>
                <Button
                  style={[styles.button, { marginLeft: 8 }]}
                  mode="outlined"
                  onPress={() => setIsRegistering(!isRegistering)}
                >
                  {isRegistering ? "Login" : "Register"}
                </Button>
                <Button
                  style={[styles.button, { marginRight: 8 }]}
                  mode="contained"
                  onPress={isRegistering ? handleRegister : handleLogin}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator size="small" color="#ffffff" /> : isRegistering ? "Register" : "Login"}
                </Button>
              </Card.Actions>
            </Card>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: '80%',
  },
  cardTitle: {
    textAlign: 'center',
  },
  textInput: {
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    marginVertical: 8,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
  },
});
