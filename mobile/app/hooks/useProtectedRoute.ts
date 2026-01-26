import { useAuth } from "@/app/context/AuthContext";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export function useProtectedRoute() {
  const { session } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (session && inAuthGroup) {
      router.replace("/(tabs)");
    } else if (!session && !inAuthGroup) {
      router.replace("/(auth)/SignIn");
    }
  }, [session, segments]);
}
