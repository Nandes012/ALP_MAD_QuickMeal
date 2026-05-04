import { StyleSheet } from "react-native";

export const colors = {
  primary: "#5B3528",
  accent: "#9A6C55",
  cream: "#F5EFE8",
  button: "#9C5B36",
  inputBorder: "#EDE3DD",
};

export const shared = StyleSheet.create({
  form: {
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
    marginTop: 20,
  },

  buttonWrap: {
    marginTop: 14,
    width: "100%",
  },

  label: {
    marginBottom: 8,
    color: colors.primary,
    fontWeight: "600",
  },

  row: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  link: {
    color: colors.primary,
  },

  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 80,
  },
});

export default shared;
