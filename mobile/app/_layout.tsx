import { AuthProvider } from "@/app/context/AuthContext";
import { useProtectedRoute } from "@/app/hooks/useProtectedRoute";
import { Stack } from "expo-router";
import "./globals.css";

function RootLayoutNav() {
  useProtectedRoute();

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
