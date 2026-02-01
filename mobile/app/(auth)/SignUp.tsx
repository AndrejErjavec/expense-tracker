import { supabase } from "@/app/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !password) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    setLoading(false);

    if (error) {
      Alert.alert("Registration failed", error.message);
      return;
    }

    if (!session) {
      Alert.alert("Success", "Please check your email for a confirmation link.");
      router.replace("/(auth)/SignIn" as any);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-8 py-10">
            {/* Header */}
            <View className="items-center mb-12">
              <View className="w-16 h-16 bg-emerald-600 rounded-2xl items-center justify-center mb-6">
                <Ionicons name="person-add-outline" size={32} color="white" />
              </View>
              <Text className="text-3xl font-bold text-gray-900 mb-2">Create account</Text>
              <Text className="text-gray-500 text-base">Start managing your finances</Text>
            </View>

            {/* Form */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-700 mb-2">Full Name</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 border border-gray-200">
                <Ionicons name="person-outline" size={20} color="#6b7280" />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  className="flex-1 py-4 px-3 text-gray-900"
                  placeholder="John Doe"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 border border-gray-200">
                <Ionicons name="mail-outline" size={20} color="#6b7280" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 py-4 px-3 text-gray-900"
                  placeholder="you@example.com"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            <View className="mb-8">
              <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 border border-gray-200">
                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  className="flex-1 py-4 px-3 text-gray-900"
                  placeholder="Create a password"
                  placeholderTextColor="#9ca3af"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#6b7280" />
                </Pressable>
              </View>
            </View>

            {/* Sign Up Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className={`py-4 rounded-xl mb-4 ${loading ? "bg-gray-400" : "bg-emerald-600"}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base text-center">Create Account</Text>
              )}
            </Pressable>

            {/* Sign In Link */}
            <Pressable onPress={() => router.push("/(auth)/SignIn" as any)} disabled={loading} className="py-4">
              <Text className="text-center text-gray-600">
                Already have an account? <Text className="text-emerald-600 font-semibold">Sign In</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
