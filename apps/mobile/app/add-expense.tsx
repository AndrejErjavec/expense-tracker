import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/app/lib/supabase";
import { Category } from "@/app/types/database";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddExpenseScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      Alert.alert("Error", "Failed to fetch categories.");
    } else {
      setCategories(data);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function handleSave() {
    if (!amount || !selectedCategory) {
      Alert.alert("Missing Fields", "Please enter amount and select a category.");
      return;
    }

    if (!session?.user?.id) {
      Alert.alert("Error", "You must be logged in to add an expense.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("expenses").insert([
      {
        amount: parseFloat(amount),
        description,
        category_id: selectedCategory,
        user_id: session.user.id,
      },
    ]);

    setLoading(false);

    if (error) {
      Alert.alert("Error", "Failed to save expense.");
    } else {
      router.back();
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-bold text-gray-800">Add Expense</Text>
          <Pressable onPress={() => router.back()} disabled={loading}>
            <Text className="text-blue-600 text-lg">Cancel</Text>
          </Pressable>
        </View>

        {/* Amount */}
        <Text className="text-sm text-gray-600 mb-1">Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          className="border border-gray-200 rounded-md px-3 py-4 mb-4 bg-white text-2xl"
          placeholder="$0.00"
        />

        {/* Description */}
        <Text className="text-sm text-gray-600 mb-1">Description (Optional)</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          className="border border-gray-200 rounded-md px-3 py-2 mb-4 bg-white"
          placeholder="e.g., Lunch with a client"
        />

        {/* Category */}
        <Text className="text-sm text-gray-600 mb-2">Category</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === category.id ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"
              }`}
            >
              <Text className={`font-semibold ${selectedCategory === category.id ? "text-white" : "text-gray-600"}`}>
                {category.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable className="bg-blue-600 py-4 rounded-md" onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-white font-semibold text-lg">Save Expense</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
