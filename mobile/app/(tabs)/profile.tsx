import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/app/lib/supabase";
import React from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { session } = useAuth();

  const handleResetPassword = async () => {
    if (!session?.user?.email) {
      Alert.alert("Error", "Could not get user email.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(session.user.email);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "A password reset link has been sent to your email.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-6">
      <Text className="text-3xl font-bold text-gray-800 mb-6">Profile</Text>

      <View className="bg-white p-6 rounded-lg mb-6">
        <Text className="text-gray-500 mb-2">Email</Text>
        <Text className="text-lg font-semibold text-gray-800">{session?.user?.email}</Text>
      </View>

      <Pressable onPress={handleResetPassword} className="bg-blue-600 py-3 rounded-md">
        <Text className="text-center text-white font-semibold">Reset Password</Text>
      </Pressable>
    </SafeAreaView>
  );
}
