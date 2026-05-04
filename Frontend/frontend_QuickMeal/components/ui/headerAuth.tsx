import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { colors } from "@/components/ui/styles";

export default function HeaderAuth({ children, title, subtitle, titleStyle, subtitleStyle }: any) {
  return (
    <View style={styles.container}>
      {/* Header Image */}
      <Image
        source={require("../../assets/images/logo.jpg")}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Title Area */}
      <View style={styles.content}>
        <Text style={[styles.title, titleStyle]}>{title ?? "QuickMeal"}</Text>

        <Text style={[styles.subtitle, subtitleStyle]}>
          {subtitle ?? "Temukan makanan cepat dan sempurna untuk Anda"}
        </Text>

        {/* children will render form fields or other content */}
        {children}
      </View>
    </View>
  );
}

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 250,
    alignSelf: "stretch",
  },

  container: {
    width: "100%",
    flex: 1,
  },

  content: {
    backgroundColor: colors.cream,
    marginTop: -40,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 30,
    alignItems: "center",
    flex: 1,
    width: "100%",
    minHeight: windowHeight - 210,
  },

  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },

  subtitle: {
    color: colors.accent,
    textAlign: "center",
  },
});