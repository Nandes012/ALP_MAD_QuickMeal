import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import CustomInput from "@/components/ui/customInput";
import CustomButton from "@/components/ui/customButton";
import { shared } from "@/components/ui/styles";

export default function LoginForm({ onLogin }: { onLogin?: (u: string, p: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  function submit() {
    // accept any username/password (no strict validation in dev)
    if (onLogin) onLogin(username, password);
    else console.log("Login attempt", { username, password });

    // navigate to app home (replace so back doesn't return to login)
    // use the tabs root so user lands on the main Home tab
    router.replace('/(tabs)');
  }

  return (
    <View style={shared.form}>
      <Text style={shared.label}>Username</Text>
      <CustomInput placeholder="St mutmainnah" value={username} onChangeText={setUsername} />

      <Text style={shared.label}>Password</Text>
      <CustomInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <View style={shared.buttonWrap}>
        <CustomButton title="Login" onPress={submit} fullWidth />
      </View>

      <View style={shared.row}>
        <TouchableOpacity>
          <Text style={shared.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/signup") }>
          <Text style={shared.link}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// styles moved to shared styles
