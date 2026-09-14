import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export default function RegisterScreen({ navigation, onNavigateToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'All fields are required.');
      return false;
    }
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      // creates account in firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      //explicitly writes user details to cloud firestore "users" collection
      await setDoc(doc(db, 'users', user.uid), {
        userID: user.uid,
        fullName: name.trim(),
        email: user.email,
        role:'Admin',
        familyID: null,
        createAt: serverTimestamp(),
      });

      Alert.alert(
        'Success',
        `Account created successfully for ${userCredential.user.email}!`,
        [
          {
            text: 'OK',
            onPress: () => handleGoToLogin(),
          },
        ]
      );

    } catch (error) {
      let friendlyMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email is already registered. Please log in.';
      } else if (error.code === 'auth/invalid-email') {
        friendlyMessage = 'The email address format is invalid.';
      } else if (error.code === 'auth/weak-password') {
        friendlyMessage = 'The password is too weak.';
      }
      Alert.alert('Registration Failed', friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    if (navigation?.navigate) {
      navigation.navigate('Login');
    } else if (onNavigateToLogin) {
      onNavigateToLogin();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <LinearGradient colors={['#EDE7F6', '#D1C4E9']} style={styles.topHeader}>
          <SafeAreaView style={styles.headerSafe}>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>
              Join HomeHub to start organizing your household.
            </Text>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.bottomCard}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <Feather name="user" size={18} color="#757575" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. John Doe"
              value={name}
              onChangeText={setName}
            />
          </View>

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputContainer}>
            <Feather name="mail" size={18} color="#757575" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="name@family.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Feather name="lock" size={18} color="#757575" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Minimum 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={showPassword ? 'eye' : 'eye-off'}
                size={18}
                color="#757575"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <Feather name="check-circle" size={18} color="#757575" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>Register</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleGoToLogin}>
              <Text style={styles.linkText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D1C4E9' },
  scrollContent: { flexGrow: 1 },
  topHeader: { minHeight: 180, justifyContent: 'center', paddingHorizontal: 24 },
  headerSafe: { flex: 1, justifyContent: 'center', paddingVertical: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E1B4B', marginBottom: 6 },
  headerSubtitle: { fontSize: 13, color: '#4C1D95' },
  bottomCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    elevation: 8,
  },
  label: { fontSize: 12, fontWeight: '600', color: '#212121', marginTop: 12, marginBottom: 6 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: '#212121' },
  registerButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  buttonDisabled: { opacity: 0.7 },
  registerButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 20,
  },
  footerText: { fontSize: 13, color: '#757575' },
  linkText: { fontSize: 13, color: '#2E7D32', fontWeight: 'bold' },
});