import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { colors } from "@/components/ui/styles";

interface ToastProps {
  visible: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  onDismiss: () => void;
}

const Toast = ({ visible, message, type, duration = 3000, onDismiss }: ToastProps) => {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onDismiss());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, opacity, onDismiss]);

  if (!visible) return null;

  const backgroundColor = {
    success: "#4CAF50",
    error: "#f44336",
    info: "#2196F3",
    warning: "#ff9800",
  }[type];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          backgroundColor,
        },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    zIndex: 1000,
  },
  message: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default Toast;
