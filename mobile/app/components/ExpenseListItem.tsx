import { Expense } from "@/app/types/database";
import { format } from "date-fns";
import React from "react";
import { Text, View } from "react-native";

type ExpenseListItemProps = {
  expense: Expense;
};

export default function ExpenseListItem({ expense }: ExpenseListItemProps) {
  return (
    <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
      <View className="flex-1">
        <Text className="text-lg font-semibold">{expense.description || "No description"}</Text>
        <Text className="text-sm text-gray-500">{expense.categories?.name}</Text>
      </View>
      <View className="items-end">
        <Text className="text-lg font-bold text-red-500">-${expense.amount.toFixed(2)}</Text>
        <Text className="text-sm text-gray-500">{format(new Date(expense.created_at), "MMM dd, yyyy")}</Text>
      </View>
    </View>
  );
}
