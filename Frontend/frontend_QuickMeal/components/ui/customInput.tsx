import { TextInput, StyleSheet } from "react-native";
import { colors } from "@/components/ui/styles";

export default function CustomInput(props: any) {
  return (
    <TextInput
      {...props}
      style={[styles.input, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
});