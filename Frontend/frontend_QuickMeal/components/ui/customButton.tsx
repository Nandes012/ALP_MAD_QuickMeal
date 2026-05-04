import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { colors } from "@/components/ui/styles";

export default function CustomButton({ title, onPress, fullWidth }: any) {
  return (
    <TouchableOpacity
      style={[styles.button, fullWidth ? styles.fullWidth : null]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.button,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  text: {
    color: "#fff",
    fontWeight: "bold",
  },
  fullWidth: {
    width: "100%",
  },
});