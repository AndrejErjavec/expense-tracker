import ExpenseListItem from "@/app/components/ExpenseListItem";
import { supabase } from "@/app/lib/supabase";
import { Expense } from "@/app/types/database";
import { isAfter, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExpenseBarChart from "../components/ExpenseBarChart";

type Period = "week" | "month" | "year";

export default function DashboardScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("month");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("expenses")
      .select("*, categories(*)")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setExpenses(data as any);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [fetchExpenses]),
  );

  const periods: { label: string; value: Period }[] = [
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" },
  ];

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (selectedPeriod) {
      case "week":
        startDate = startOfWeek(now);
        break;
      case "month":
        startDate = startOfMonth(now);
        break;
      case "year":
        startDate = startOfYear(now);
        break;
      default:
        startDate = startOfMonth(now);
    }

    return expenses.filter((expense) => isAfter(new Date(expense.created_at), startDate));
  }, [expenses, selectedPeriod]);

  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  const expensesByCategory = useMemo(() => {
    return filteredExpenses.reduce(
      (acc, expense) => {
        const categoryName = expense.categories?.name ?? "Other";
        if (!acc[categoryName]) {
          acc[categoryName] = 0;
        }
        acc[categoryName] += expense.amount;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [filteredExpenses]);

  const colorScale = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF"];

  const pieData = useMemo(() => {
    return Object.entries(expensesByCategory).map(([name, amount], index) => ({
      value: amount,
      color: colorScale[index % colorScale.length],
      text: name,
    }));
  }, [expensesByCategory]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-bold text-gray-800">Dashboard</Text>
        </View>

        {/* Period Filter */}
        <View className="flex-row bg-white rounded-lg p-1 mb-6">
          {periods.map((period) => (
            <Pressable
              key={period.value}
              onPress={() => setSelectedPeriod(period.value)}
              className={`flex-1 py-2 rounded-md ${selectedPeriod === period.value ? "bg-blue-600" : ""}`}
            >
              <Text
                className={`text-center font-semibold ${selectedPeriod === period.value ? "text-white" : "text-gray-600"}`}
              >
                {period.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Total Expenses */}
        <View className="bg-white p-6 rounded-lg mb-6">
          <Text className="text-gray-500 mb-2">Total Expenses</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#3b82f6" />
          ) : (
            <Text className="text-4xl font-bold text-gray-800">${totalExpenses.toFixed(2)}</Text>
          )}
          {error && <Text className="text-red-500 mt-2">{error}</Text>}
        </View>

        {/* Expenses by Category Chart */}
        <View className="bg-white p-6 rounded-lg mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Expenses by Category</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#3b82f6" />
          ) : pieData.length > 0 ? (
            <View>
              <View className="items-center justify-center">
                <ExpenseBarChart />
              </View>
              <View className="flex-row flex-wrap mt-4">
                {pieData.map((item, index) => {
                  const percentage = ((item.value / totalExpenses) * 100).toFixed(1);
                  return (
                    <View key={index} className="flex-row items-center w-1/2 mb-2">
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: item.color,
                          marginRight: 8,
                        }}
                      />
                      <Text className="text-gray-600 text-sm">
                        {item.text}: ${item.value.toFixed(2)} ({percentage}%)
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : (
            <View className="h-64 items-center justify-center bg-gray-100 rounded-lg">
              <Text className="text-gray-500">No data to display</Text>
            </View>
          )}
        </View>

        {/* Recent Transactions */}
        <View className="bg-white p-6 rounded-lg">
          <Text className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#3b82f6" />
          ) : (
            <FlatList
              data={filteredExpenses.slice(0, 5)}
              renderItem={({ item }) => <ExpenseListItem expense={item} />}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={
                <View className="items-center justify-center">
                  <Text className="text-gray-500">No recent transactions yet.</Text>
                </View>
              }
              scrollEnabled={false} // The outer ScrollView handles scrolling
            />
          )}
        </View>
      </ScrollView>
      <Link href="/add-expense" asChild>
        <Pressable className="absolute bottom-8 right-8 bg-blue-600 w-16 h-16 rounded-full items-center justify-center shadow-lg">
          <Text className="text-white text-3xl">+</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}
