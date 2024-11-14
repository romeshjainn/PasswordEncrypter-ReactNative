import PasswordCard from "@/components/PasswordCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState, useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Type definitions for passwords
type Password = {
  name: string;
  password: string;
  label: string;
};

export default function Home() {
  const labels = ["All", "Banks", "Social Medias", "Email", "Games"];
  const [selectedLabel, setSelectedLabel] = useState<string>("All");
  const [passwords, setPasswords] = useState<Password[]>([]);
  const router = useRouter();

  // Fetch saved passwords from AsyncStorage
  const getPasswords = async () => {
    try {
      const savedPasswords = await AsyncStorage.getItem("passwords");
      const passwordsArray: Password[] = savedPasswords
        ? JSON.parse(savedPasswords)
        : [];
      setPasswords(passwordsArray);
    } catch (error) {
      console.log("Error fetching passwords:", error);
    }
  };

  useEffect(() => {
    getPasswords();
  }, []);

  // Update passwords list after deletion
  const handleUpdateAfterDelete = (updatedArray: Password[]) => {
    setPasswords(updatedArray);
  };

  // Memoized filtered passwords based on the selected label
  const filteredPasswords = useMemo(() => {
    return passwords.filter(
      (item) => selectedLabel === "All" || item.label === selectedLabel
    );
  }, [passwords, selectedLabel]);

  return (
    <View className="relative flex-1 flex-col justify-between p-4 items-center gap-4 bg-gray-50">
      {/* App Header */}
      <Text className="text-3xl font-bold text-center text-blue-600">
        Encrypter
      </Text>
      {/* Labels Navigation */}
      <View className="w-full h-full">
        <View className="w-full border-b-2 border-gray-300 flex flex-row py-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {labels.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setSelectedLabel(item)}
              >
                <Text
                  style={{
                    backgroundColor:
                      selectedLabel === item ? "gray" : "transparent",
                  }}
                  className="p-2 text-lg rounded-lg px-4 mx-1 font-medium text-gray-700"
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Password Cards List */}
        <ScrollView className="mt-4 space-y-4">
          {filteredPasswords.length > 0 ? (
            filteredPasswords.map((item, index) => (
              <PasswordCard
                index={index}
                key={index}
                name={item.name}
                password={item.password}
                label={item.label}
                handleUpdateAfterDelete={handleUpdateAfterDelete}
              />
            ))
          ) : (
            <Text className="text-gray-500 text-lg flex items-end justify-center h-[35vh]">
              No passwords available
            </Text>
          )}
        </ScrollView>
      </View>

      {/* Add Password Button */}
      <TouchableOpacity
        onPress={() => router.push("/add-password")}
        className="absolute bottom-10 bg-red-500 px-6 py-3 font-semibold text-[2rem] rounded-xl shadow-lg"
      >
        <Text className="text-white">Add Password</Text>
      </TouchableOpacity>
    </View>
  );
}
