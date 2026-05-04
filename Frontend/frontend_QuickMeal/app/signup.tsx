import React from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import HeaderAuth from "@/components/ui/headerAuth";
import SignupForm from "@/components/auth/SignupForm";

export default function Signup() {
	return (
		<SafeAreaView style={styles.page}>
			<ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
				<HeaderAuth title="Create Account" subtitle="Sign up to get started">
					<SignupForm />
				</HeaderAuth>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	page: { flex: 1, backgroundColor: "#fff" },
	scrollContainer: { flexGrow: 1, alignItems: "center", paddingBottom: 80 },
});

