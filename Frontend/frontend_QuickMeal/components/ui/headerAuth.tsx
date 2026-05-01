import {
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";

export default function HeaderAuth({ children }: any) {
  return (
    <View>
      {/* Header Image */}
      <Image
        source={require("../../assets/images/logo.jpg")}
        style={styles.image}
      />

      {/* Title Area */}
      <View style={styles.content}>
        <Text style={styles.title}>QuickMeal</Text>

        <Text style={styles.subtitle}>
          Temukan makanan cepat dan sempurna untuk Anda
        </Text>

        {/* children will render form fields or other content */}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 250,
  },

  content: {
    backgroundColor: "#F5EFE8",
    marginTop: -40,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 30,
    alignItems: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#5B3528",
    marginBottom: 10,
  },

  subtitle: {
    color: "#9A6C55",
    textAlign: "center",
  },
});