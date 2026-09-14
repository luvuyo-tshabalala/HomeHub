import { AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen({ navigation, onNavigateToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const handleGoToRegister = () => {
    if (navigation?.navigate) {
      navigation.navigate("Register");
    } else if (onNavigateToRegister) {
      onNavigateToRegister();
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient & Header Section */}
      <LinearGradient
        colors={["#F3E8FF", "#E9D5FF"]} // Light purple gradient
        style={styles.topBackground}
      >
        <SafeAreaView edges={["top", "left", "right"]}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subText}>Sign in to continue managing</Text>
            <Text style={styles.subText}>your family together.</Text>

            {/* Placeholder for your FamilyHub Logo */}
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>🏠 FamilyHub</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Bottom White Card Section */}
      <KeyboardAvoidingView
        style={styles.bottomCard}
        // Android often prefers 'height' or no behavior prop at all, while iOS needs 'padding'
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.formContainer}>
          {/* Email Input */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Feather
              name="mail"
              size={20}
              color="#7C3AED"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#A1A1AA"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.passwordLabelRow}>
            <Text style={styles.inputLabel}>Password</Text>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputWrapper}>
            <Feather
              name="lock"
              size={20}
              color="#7C3AED"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#A1A1AA"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color="#A1A1AA"
              />
            </TouchableOpacity>
          </View>

          {/* Remember Me Checkbox */}
          <View style={styles.rememberRow}>
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              style={styles.checkboxContainer}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              >
                {rememberMe && <Feather name="check" size={14} color="#FFF" />}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>
          </View>

          {/* Main Login Button */}
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton}>
              <AntDesign name="google" size={24} color="#DB4437" />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <AntDesign name="apple" size={24} color="#000" />
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome5 name="facebook" size={24} color="#4267B2" />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Footer */}

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleGoToRegister}>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topBackground: {
    flex: 0.35,
    paddingHorizontal: 25,
  },
  headerContent: {
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 22,
  },
  logoPlaceholder: {
    marginTop: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7C3AED",
  },
  bottomCard: {
    flex: 0.65,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    // Android Specific Shadow Properties
    elevation: 10,
    // iOS Specific Shadow Properties (Ignored by Android but good for cross-platform)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  formContainer: {
    padding: 25,
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    backgroundColor: "#FAFAFA",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
  },
  passwordLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#7C3AED",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 8,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#7C3AED",
  },
  rememberText: {
    fontSize: 14,
    color: "#4B5563",
  },
  loginButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 12,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E4E4E7",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#A1A1AA",
    fontSize: 14,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 12,
    paddingVertical: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  socialText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#757575",
  },
  registerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7C3AED",
  },
});
