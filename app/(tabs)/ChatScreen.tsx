import React, { useState } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useChat } from "@/context/chatContext";
import { useAuth } from "@/context/authContext";
import MessageItem from "@/components/MessageItem";
import { useTheme } from "@/context/themeContext";

export default function ChatScreen() {
  const { messages, sendMessage, deleteMessage } = useChat();
  const { session } = useAuth();
  const { theme } = useTheme();

  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!text.trim() || !session) return;
    await sendMessage(text, session.user.id);
    setText("");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <FlatList
        style={{ flex: 1 }}
        data={messages}
        inverted
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MessageItem
            item={item}
            mine={item.user_id === session?.user.id}
            onDelete={deleteMessage}
          />
        )}
        contentContainerStyle={{ padding: 10 }}
      />

      <View style={[styles.inputRow, { backgroundColor: theme.colors.surface }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          mode="outlined"
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.onSurface,
            },
          ]}
          placeholderTextColor={theme.colors.onSurface + "99"}
        />
        <Button
          mode="contained"
          onPress={handleSend}
          style={styles.sendBtn}
          buttonColor={theme.colors.primary}
        >
          Send
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    marginRight: 8,
    borderRadius: 25,
  },
  sendBtn: {
    alignSelf: "center",
    borderRadius: 25,
    paddingHorizontal: 16,
  },
});
