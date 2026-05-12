import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";

import CustomInput from "@/components/ui/customInput";
import CustomButton from "@/components/ui/customButton";
import { shared, colors } from "@/components/ui/styles";

type LoginFormProps = Readonly<{
  onLogin?: (u: string, p: string) => void;
}>;

export default function LoginForm({ onLogin }: LoginFormProps) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();

  async function submit() {

    try {
      // Clear previous errors
      setPasswordError("");

      const getApiHost = () => {
        if (Platform.OS === "web") return "http://localhost:8000";
        const expoConfig = (Constants as any).expoConfig || {};
        const hostUri = expoConfig?.hostUri || "";
        const hostFromUri = hostUri ? hostUri.split(":")[0] : null;
        const fallbackHost = "192.168.18.28"; // replace if needed
        const host = hostFromUri || fallbackHost;
        return `http://${host}:8000`;
      };

      const url = `${getApiHost()}/api/auth/login`;

      const response = await fetch(url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      let data: any = null;
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log("LOGIN NON-JSON RESPONSE:", response.status, text);
        setPasswordError(`Server error: ${response.status}`);
        return;
      }

      console.log("LOGIN RESPONSE:", data);

      // LOGIN FAILED
      if (!response.ok) {

        setPasswordError("Email atau password tidak valid");

        return;
      }

      // OPTIONAL CALLBACK
      if (onLogin) {
        onLogin(email, password);
      }

      // SUCCESS
      console.log("TOKEN:", data.token);

      console.log("USER:", data.user);

      // Navigate to home
      router.replace("/(tabs)");

    } catch (error) {

      console.log("LOGIN ERROR:", error);

      setPasswordError("Tidak bisa terhubung ke server");
    }
  }

  return (
    <View style={shared.form}>

      <Text style={shared.label}>Email</Text>

      <CustomInput
        placeholder="example@gmail.com"
        value={email}
        onChangeText={(text: string) => {
          setEmail(text);
          setPasswordError("");
        }}
      />

      <Text style={shared.label}>Password</Text>

      <CustomInput
        placeholder="Password"
        value={password}
        onChangeText={(text: string) => {
          setPassword(text);
          setPasswordError("");
        }}
        secureTextEntry
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <View style={shared.buttonWrap}>
        <CustomButton
          title="Login"
          onPress={submit}
          fullWidth
        />
      </View>

      <View style={shared.row}>

        <TouchableOpacity>
          <Text style={shared.link}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/signup")}
        >
          <Text style={shared.link}>
            Sign Up
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
  },
});