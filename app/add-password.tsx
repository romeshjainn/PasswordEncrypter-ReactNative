import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function AddPassword() {
  const [details, setDetails] = useState({
    name: "",
    password: "",
    label: "",
  });

  const labels = ["All", "Banks", "Social Medias", "Email", "Games"];
  const { index } = useLocalSearchParams();

  const handleInput = (value: string, label: string) => {
    setDetails((prev) => ({ ...prev, [label]: value }));
  };

  const getPasswords = async () => {
    try {
      const savedPasswords = await AsyncStorage.getItem("passwords");
      const passwordsArray = savedPasswords ? JSON.parse(savedPasswords) : [];

      if (index && passwordsArray.length) {
        setDetails(passwordsArray[index]);
      }
      console.log(passwordsArray);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    if (
      !details.name.length ||
      !details.password.length ||
      !details.label.length
    ) {
      console.log("Some fields are empty!");
      return;
    }

    try {
      await getPasswords();
      const savedPassword = await AsyncStorage.getItem("passwords");
      const passwordsArray = savedPassword ? JSON.parse(savedPassword) : [];

      if (index !== undefined && index !== null) {
        passwordsArray[index] = details;
      } else {
        passwordsArray.push(details);
      }

      await AsyncStorage.setItem("passwords", JSON.stringify(passwordsArray));
      console.log("Password saved successfully!");
      router.push("home");
    } catch (error) {
      console.error("Failed to save password:", error);
    }
  };

  useEffect(() => {
    getPasswords();
  }, []);

  return (
    <View className="flex-1 p-6 bg-gray-100">
      <Text className="text-3xl font-bold text-center text-blue-600 mb-6">
        {index ? "Edit" : "Add"} Password
      </Text>

      <TextInput
        value={details.name}
        placeholder="Name"
        className="border-2 border-gray-300 p-4 rounded-lg mb-4 bg-white"
        onChangeText={(text) => handleInput(text, "name")}
      />

      <TextInput
        value={details.password}
        placeholder="Password"
        secureTextEntry
        className="border-2 border-gray-300 p-4 rounded-lg mb-4 bg-white"
        onChangeText={(text) => handleInput(text, "password")}
      />

      <Picker
        selectedValue={details.label}
        onValueChange={(itemValue) => handleInput(itemValue, "label")}
        className="border-2 border-gray-300 p-3 rounded-lg mb-4 bg-white outline-none"

        // style={{
        //   height: 50,
        //   borderWidth: 1,
        //   borderColor: "#ccc",
        //   borderRadius: 10,
        // }}
      >
        {labels.map((item, index) => (
          <Picker.Item key={index} label={item} value={item} />
        ))}
      </Picker>
      {/* <TextInput
        value={details.label}
        placeholder="Label"
        className="border-2 border-gray-300 p-4 rounded-lg mb-6 bg-white"
        onChangeText={(text) => handleInput(text, "label")}
      /> */}

      <TouchableOpacity
        onPress={handleSave}
        className="bg-blue-600 p-2 rounded-lg justify-center items-center"
      >
        <Text className="text-white text-lg">Save</Text>
      </TouchableOpacity>
    </View>
  );
}
