import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

export default function CustomButton({ title, onPress }: any) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#9C5B36",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});