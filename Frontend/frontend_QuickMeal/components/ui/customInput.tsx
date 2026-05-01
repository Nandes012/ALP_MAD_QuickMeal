import { TextInput, StyleSheet } from "react-native";

export default function CustomInput(props: any) {
  return (
    <TextInput
      {...props}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
});