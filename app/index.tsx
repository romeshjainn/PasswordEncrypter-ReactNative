import React, { useEffect, useState } from "react";
import { Platform, Alert, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

export default function Index() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Only authenticate if the platform is iOS or Android
    if (Platform.OS === "ios" || Platform.OS === "android") {
      handleAuthentication();
    } else {
      Alert.alert(
        "Biometric authentication is only available on mobile devices."
      );
    }
  }, []);

  const handleAuthentication = async () => {
    // Dynamically import expo-local-authentication only on supported platforms
    if (Platform.OS === "ios" || Platform.OS === "android") {
      const LocalAuthentication = await import("expo-local-authentication");

      // Check if biometric authentication is available
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert("Biometric authentication is not available on this device");
        return;
      }

      // Check if biometrics are enrolled
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert("No biometric authentication found");
        return;
      }

      // Authenticate with biometrics
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with fingerprint to access the app",
        fallbackLabel: "Use passcode",
      });

      if (result.success) {
        setAuthenticated(true);
      } else {
        Alert.alert("Authentication failed", "Please try again");
      }
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 py-6 px-4">
      <Text className="text-xl text-center mb-6 font-semibold text-gray-700">
        Please authenticate to continue
      </Text>

      <TouchableOpacity
        className="bg-blue-600 w-full p-4 rounded-lg shadow-lg"
        onPress={() => router.push("/home")}
      >
        <Text className="text-center text-2xl text-white font-semibold">
          Continue
        </Text>
      </TouchableOpacity>

      {/* Optionally, you can add a success or failure message depending on the authentication */}
      {authenticated && (
        <Text className="text-green-600 mt-4">Authentication successful!</Text>
      )}
    </View>
  );
}
