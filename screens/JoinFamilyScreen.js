import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebase/firebaseConfig";

export default function CreateJoinFamilyScreen({
  navigation,
  onNavigateBack,
  onCompleteOnboarding,
}) {
  const [mode, setMode] = useState("create"); // 'create' or 'join'
  const [familyName, setFamilyName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper to generate a clean 6-character alphanumeric household invite code
  const generateFamilyCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleFinish = () => {
    if (navigation?.navigate) {
      navigation.navigate("Dashboard");
    } else if (onCompleteOnboarding) {
      onCompleteOnboarding();
    }
  };

  const handleCreateFamily = async () => {
    if (!familyName.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter a family or household name.",
      );
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user)
        throw new Error("User session not found. Please log in again.");

      const familyId = generateFamilyCode();

      // 1. Create the new FamilyAccount document
      await setDoc(doc(db, "FamilyAccount", familyId), {
        familyId: familyId,
        familyName: familyName.trim(),
        createdBy: user.uid,
        dateCreated: serverTimestamp(),
      });

      // 2. Update the User profile with FamilyID and Admin role
      await updateDoc(doc(db, "users", user.uid), {
        familyId: familyId,
        role: "Admin",
      });

      Alert.alert(
        "Household Created!",
        `Your household code is: ${familyId}\nShare this code with your family members so they can join.`,
        [{ text: "Continue to Dashboard", onPress: handleFinish }],
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinFamily = async () => {
    const formattedCode = joinCode.trim().toUpperCase();
    if (!formattedCode) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid family invite code.",
      );
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user)
        throw new Error("User session not found. Please log in again.");

      // 1. Verify that the FamilyAccount exists
      const familyDocRef = doc(db, "FamilyAccount", formattedCode);
      const familyDocSnap = await getDoc(familyDocRef);

      if (!familyDocSnap.exists()) {
        Alert.alert("Not Found", "No household exists with that invite code.");
        setLoading(false);
        return;
      }

      // 2. Link user to the family as a Member
      await updateDoc(doc(db, "users", user.uid), {
        familyId: formattedCode,
        role: "Member",
      });

      const data = familyDocSnap.data();
      Alert.alert(
        "Welcome!",
        `You have successfully joined the "${data.familyName}" household.`,
        [{ text: "Continue to Dashboard", onPress: handleFinish }],
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <LinearGradient
          colors={["#EDE7F6", "#D1C4E9"]}
          style={styles.topHeader}
        >
          <SafeAreaView style={styles.headerSafe}>
            <Text style={styles.headerTitle}>Household Setup</Text>
            <Text style={styles.headerSubtitle}>
              Create a new household space or join an existing one.
            </Text>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.bottomCard}>
          {/* Toggle Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                mode === "create" && styles.tabButtonActive,
              ]}
              onPress={() => setMode("create")}
            >
              <Text
                style={[
                  styles.tabText,
                  mode === "create" && styles.tabTextActive,
                ]}
              >
                Create Family
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                mode === "join" && styles.tabButtonActive,
              ]}
              onPress={() => setMode("join")}
            >
              <Text
                style={[
                  styles.tabText,
                  mode === "join" && styles.tabTextActive,
                ]}
              >
                Join Family
              </Text>
            </TouchableOpacity>
          </View>

          {mode === "create" ? (
            <View>
              <Text style={styles.label}>Family / Household Name</Text>
              <View style={styles.inputContainer}>
                <Feather
                  name="home"
                  size={18}
                  color="#757575"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. The Smith Household"
                  value={familyName}
                  onChangeText={setFamilyName}
                />
              </View>
              <Text style={styles.hintText}>
                As creator, you will receive Admin rights to manage budgets and
                chores.
              </Text>

              <TouchableOpacity
                style={[styles.actionButton, loading && styles.buttonDisabled]}
                onPress={handleCreateFamily}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Create Household</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.label}>Family Invite Code</Text>
              <View style={styles.inputContainer}>
                <Feather
                  name="key"
                  size={18}
                  color="#757575"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 8K2M9X"
                  value={joinCode}
                  onChangeText={setJoinCode}
                  autoCapitalize="characters"
                />
              </View>
              <Text style={styles.hintText}>
                Ask your household Admin for their unique 6-character code.
              </Text>

              <TouchableOpacity
                style={[styles.actionButton, loading && styles.buttonDisabled]}
                onPress={handleJoinFamily}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Join Household</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D1C4E9" },
  scrollContent: { flexGrow: 1 },
  topHeader: {
    minHeight: 160,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  headerSafe: { flex: 1, justifyContent: "center", paddingVertical: 16 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E1B4B",
    marginBottom: 6,
  },
  headerSubtitle: { fontSize: 13, color: "#4C1D95" },
  bottomCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    elevation: 8,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },
  tabText: { fontSize: 14, color: "#757575", fontWeight: "500" },
  tabTextActive: { color: "#2E7D32", fontWeight: "bold" },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#212121",
    marginTop: 10,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: "#212121" },
  hintText: { fontSize: 12, color: "#757575", marginTop: 6, marginBottom: 20 },
  actionButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 10,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
});
