import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PasswordCard({
  name,
  password,
  label,
  index,
  handleUpdateAfterDelete,
}: {
  name: string;
  password: string;
  label: string;
  index: number;
  handleUpdateAfterDelete: any;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleDeletePasswords = async () => {
    try {
      const savedPasswords = await AsyncStorage.getItem("passwords");
      const passwordsArray = savedPasswords ? JSON.parse(savedPasswords) : [];

      // Filter out the item at the specified index
      const updatedArray = passwordsArray.filter((_, i) => i !== index);

      // Save the updated array back to AsyncStorage
      await AsyncStorage.setItem("passwords", JSON.stringify(updatedArray));
      handleUpdateAfterDelete(updatedArray);
      console.log("Password deleted successfully!");
    } catch (error) {
      console.error("Failed to delete password:", error);
    }
  };

  return (
    <View className="border-2 border-gray-300 p-4 rounded-xl shadow-md mb-4">
      <Text className="text-xl font-semibold mb-2">{name}</Text>
      <Text className="text-sm text-gray-700 mb-2">{label}</Text>
      <Text className="text-lg mb-4">{showPassword ? password : "••••••"}</Text>

      <View className="flex flex-row gap-4">
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="px-4 py-2 bg-blue-500 rounded-lg text-white"
        >
          <Text>{showPassword ? "Hide" : "Show"}</Text>
        </TouchableOpacity>

        {/* Edit Button */}
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: "/add-password", params: { index } })
          }
          className="px-4 py-2 bg-yellow-500 rounded-lg text-white"
        >
          <Text>Edit</Text>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity
          onPress={handleDeletePasswords}
          className="px-4 py-2 bg-red-500 rounded-lg text-white"
        >
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
