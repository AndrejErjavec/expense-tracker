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
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !password) {
      Alert.alert("Missing fields", "Please enter email and password.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Login failed", error.message);
      return;
    }

    router.replace("/" as any);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-1 justify-center px-8">
          {/* Header */}
          <View className="items-center mb-12">
            <View className="w-16 h-16 bg-indigo-600 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="wallet-outline" size={32} color="white" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome back</Text>
            <Text className="text-gray-500 text-base">Sign in to your account</Text>
          </View>

          {/* Form */}
          <View className="mb-6">
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
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#6b7280" />
              </Pressable>
            </View>
          </View>

          {/* Sign In Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            className={`py-4 rounded-xl mb-4 ${loading ? "bg-gray-400" : "bg-indigo-600"}`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-base text-center">Sign In</Text>
            )}
          </Pressable>

          {/* Sign Up Link */}
          <Pressable onPress={() => router.push("/(auth)/SignUp" as any)} disabled={loading} className="py-4">
            <Text className="text-center text-gray-600">
              Don&apos;t have an account? <Text className="text-indigo-600 font-semibold">Sign Up</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
