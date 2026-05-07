import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import CustomInput from "@/components/ui/customInput";
import CustomButton from "@/components/ui/customButton";
import { shared } from "@/components/ui/styles";

export default function LoginForm({
  onLogin,
}: {
  onLogin?: (u: string, p: string) => void;
}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function submit() {

    try {

      const response = await fetch(
        "http://192.168.0.194:8000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      // LOGIN FAILED
      if (!response.ok) {

        alert(data.message || "Login failed");

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

      alert("Could not connect to backend");
    }
  }

  return (
    <View style={shared.form}>

      <Text style={shared.label}>Email</Text>

      <CustomInput
        placeholder="example@gmail.com"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={shared.label}>Password</Text>

      <CustomInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

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