import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import CustomInput from "@/components/ui/customInput";
import CustomButton from "@/components/ui/customButton";
import { shared, colors } from "@/components/ui/styles";

// Consolidated small components inside this file for simpler structure
function FormField({ label, error, ...inputProps }: any) {
  return (
    <View style={localStyles.fieldWrap}>
      <Text style={localStyles.label}>{label}</Text>
      <CustomInput {...inputProps} />
      {error ? <Text style={localStyles.errorText}>{error}</Text> : null}
    </View>
  );
}

function SignupFooter() {
  const router = useRouter();
  return (
    <View style={localStyles.rowCenter}>
      <Text>Already have an account? </Text>
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={localStyles.link}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SignupForm({ onSignup }: Readonly<{ onSignup?: (data: any) => void }>) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const router = useRouter();

  const clearErrors = () => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  async function submit() {
    clearErrors();

    if (!name || !email || !password || !confirmPassword) {
      if (!name) setNameError("Nama harus diisi");
      if (!email) setEmailError("Email harus diisi");
      if (!password) setPasswordError("Password harus diisi");
      if (!confirmPassword) setConfirmPasswordError("Konfirmasi password harus diisi");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Password tidak cocok");
      return;
    }

    setIsLoading(true);

    try {
      const getApiHost = () => {
        if (Platform.OS === "web") return "http://localhost:8000";
        const expoConfig = (Constants as any).expoConfig || {};
        const hostUri = expoConfig?.hostUri || "";
        const hostFromUri = hostUri ? hostUri.split(":")[0] : null;
        const fallbackHost = "192.168.18.28"; // replace if needed
        const host = hostFromUri || fallbackHost;
        return `http://${host}:8000`;
      };

      const url = `${getApiHost()}/api/auth/register`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      let data: any = null;
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log("SIGNUP NON-JSON RESPONSE:", response.status, text);
        setEmailError(`Server error: ${response.status}`);
        setIsLoading(false);
        return;
      }

      console.log("SIGNUP RESPONSE:", data);

      // SIGNUP FAILED
      if (!response.ok) {
        // Check if it's a validation error (has errors object)
        if (data.errors) {
          if (data.errors.name) {
            setNameError(data.errors.name[0]);
          }
          if (data.errors.email) {
            setEmailError("Email atau password tidak valid");
          }
          if (data.errors.password) {
            setPasswordError(data.errors.password[0]);
          }
        }
        setIsLoading(false);
        return;
      }

      // OPTIONAL CALLBACK
      if (onSignup) {
        onSignup({ name, email, password });
      }

      // SUCCESS
      console.log("TOKEN:", data.token);
      console.log("USER:", data.user);

      setIsLoading(false);

      // Navigate to home
      router.replace("/(tabs)");

    } catch (error) {
      console.log("SIGNUP ERROR:", error);
      setEmailError("Tidak bisa terhubung ke server");
      setIsLoading(false);
    }
  }

  return (
    <View style={[shared.form, { paddingHorizontal: 0 }]}>

      <FormField 
        label="Name" 
        placeholder="St mutmainnah" 
        value={name} 
        onChangeText={(text: string) => {
          setName(text);
          setNameError("");
        }}
        error={nameError}
      />

      <FormField 
        label="Email" 
        placeholder="smutmainnah@..." 
        value={email} 
        onChangeText={(text: string) => {
          setEmail(text);
          setEmailError("");
        }}
        keyboardType="email-address"
        error={emailError}
      />

      <FormField 
        label="Password" 
        placeholder="Gowa020627" 
        value={password} 
        onChangeText={(text: string) => {
          setPassword(text);
          setPasswordError("");
        }}
        secureTextEntry 
        error={passwordError}
      />

      <FormField 
        label="Confirm Password" 
        placeholder="Gowa020627" 
        value={confirmPassword} 
        onChangeText={(text: string) => {
          setConfirmPassword(text);
          setConfirmPasswordError("");
        }}
        secureTextEntry 
        error={confirmPasswordError}
      />

      <View style={shared.buttonWrap}>
        <CustomButton title={isLoading ? "Signing Up..." : "Sign Up"} onPress={submit} fullWidth disabled={isLoading} />
      </View>

      <SignupFooter />
    </View>
  );
}

// form styles moved to shared styles

const localStyles = StyleSheet.create({
  // keep spacing consistent with LoginForm: CustomInput already adds bottom margin,
  // so avoid duplicating it here.
  fieldWrap: { marginBottom: 0 },
  label: {
    marginBottom: 8,
    color: colors.primary,
    fontWeight: "600",
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
  },
  rowCenter: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: colors.primary,
    fontWeight: "600",
  },
});


