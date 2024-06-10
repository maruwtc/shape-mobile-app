import Header from "@/components/Header";
import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Appbar,
  Text,
} from "react-native-paper";
import { View } from "react-native";
import { Login, Register, Logout } from "@/api/firebase";
import { auth } from "@/config/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import * as Location from 'expo-location';

const Account = () => {
  const [email, setEmail] = useState<string>("");
  const [lastLogin, setLastLogin] = useState<string>("");
  const [locationLastLogin, setLocationLastLogin] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const getLocationAndSetTime = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        const timezoneOffset = new Date().getTimezoneOffset() * 60000;
        const localTime = new Date(new Date(user!.metadata.lastSignInTime!).getTime() - timezoneOffset);
        const reverseGeocode = await Location.reverseGeocodeAsync(location.coords);
        const { city, region, country } = reverseGeocode[0];
        setLocation(`${city}, ${region}, ${country}`);
        setLocationLastLogin(localTime.toString());
      };
      if (user) {
        setEmail(user.email!);
        setLastLogin(user.metadata.lastSignInTime!);
        setLocationLastLogin(locationLastLogin);
        getLocationAndSetTime();
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, [locationLastLogin]);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await Login(email, password);
      setLoading(false);
      setPassword("");
      setIsLoggedIn(true);
    } catch (err: any) {
      setLoading(false);
      setError(err.code === "auth/user-not-found" || err.code === "auth/invalid-email" || err.code === "auth/wrong-password" || err.code === "auth/invalid-password" || err.code === "auth/missing-password" || err.code === "auth/invalid-credential"
        ? "Invalid credentials"
        : "An error occurred. Please try again later."
      );
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await Register(email, password);
      setLoading(false);
      setError("Registration successful!");
      setIsRegistering(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.code === "auth/email-already-in-use"
        ? "Email already in use"
        : err.code === "auth/invalid-email"
          ? "Invalid email"
          : err.code === "auth/weak-password"
            ? "Password is too weak"
            : "An error occurred. Please try again later."
      );
    }
  };

  const handleLogout = async () => {
    try {
      await Logout();
      setIsLoggedIn(false);
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <Appbar.Header>
          {isRegistering ? <Appbar.BackAction onPress={() => { setIsRegistering(false); setError(null) }} /> : null}
          <Appbar.Content title={isRegistering ? "Register" : "Login"} />
        </Appbar.Header>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="w-full h-full justify-center px-6 space-y-4">
              <TextInput
                mode="outlined"
                className="mx-2"
                label="Email"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                mode="outlined"
                className="mx-2"
                label="Password"
                value={password}
                secureTextEntry={secureText}
                right={<TextInput.Icon icon={secureText ? "eye" : "eye-off"} onPress={() => setSecureText(!secureText)} />}
                onChangeText={setPassword}
              />
              {isRegistering && (
                <TextInput
                  mode="outlined"
                  className="mx-2 my-4"
                  label="Confirm Password"
                  value={confirmPassword}
                  secureTextEntry={secureText}
                  right={<TextInput.Icon icon={secureText ? "eye" : "eye-off"} onPress={() => setSecureText(!secureText)} />}
                  onChangeText={setConfirmPassword}
                />
              )}
              {error && <Text className="text-rose-500 mt-2">{error}</Text>}
              <View className="flex-row justify-center">
                <Button
                  style={{ flex: 1, margin: 8 }}
                  mode="contained"
                  onPress={isRegistering ? handleRegister : handleLogin}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator size="small" color="#ffffff" /> : isRegistering ? "Register" : "Login"}
                </Button>
              </View>
              {!isRegistering && (
                <>
                  <Text className="p-4 text-center">Not yet registered?</Text>
                  <Button
                    className="mx-4"
                    mode="outlined"
                    onPress={() => { setIsRegistering(true); setError(null) }}
                  >
                    Register
                  </Button>
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </>
    );
  } else {
    return (
      <>
        <Header title="Account" />
        <View className="flex-1 items-center justify-center">
          <Card className="w-4/5 p-4">
            <Card.Title title="Account" />
            <Card.Content className="">
              <Text>Email:</Text>
              <Text>{email}</Text>
              <Text>Last Login (Server time):</Text>
              <Text>{lastLogin}</Text>
              <Text>Last Login (Local time):</Text>
              <Text>{locationLastLogin}</Text>
              <Text>Location:</Text>
              <Text>{location}</Text>
              <Button mode="outlined" className="mt-6" onPress={handleLogout}>Logout</Button>
            </Card.Content>
          </Card>
        </View>
      </>
    );
  }
}

export default Account;
