import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomInput from "@/components/ui/customInput";
import CustomButton from "@/components/ui/customButton";

export default function LoginForm({ onLogin }: { onLogin?: (u: string, p: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function submit() {
    // simple validation
    if (!username || !password) {
      // in real app show toast / error UI
      console.warn("username or password empty");
      return;
    }

    if (onLogin) onLogin(username, password);
    else console.log("Login attempt", { username, password });
  }

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Username</Text>
      <CustomInput placeholder="St mutmainnah" value={username} onChangeText={setUsername} />

      <Text style={styles.label}>Password</Text>
      <CustomInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <CustomButton title="Login" onPress={submit} />

      <View style={styles.row}>
        <TouchableOpacity>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.link}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
    marginTop: 20,
  },

  label: {
    marginBottom: 8,
    color: "#5B3528",
    fontWeight: "600",
  },

  row: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  link: {
    color: "#5B3528",
  },
});
