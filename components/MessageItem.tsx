import React from "react";
import { Alert, StyleSheet } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { Message } from "@/context/chatContext";
import { useUser } from "@/hooks/useUser";

interface Props {
  item: Message;
  mine: boolean;
  onDelete: (id: number) => void;
}

export default function MessageItem({ item, mine, onDelete }: Props) {
  const theme = useTheme();

  const handleLongPress = () => {
    Alert.alert("Delete Message", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete(item.id) },
    ]);
  };

  return (
    <Card
      onLongPress={handleLongPress}
      style={[
        styles.card,
        {
          alignSelf: mine ? "flex-end" : "flex-start",
          backgroundColor: mine
            ? theme.colors.primaryContainer
            : theme.colors.surfaceVariant,
        },
      ]}
    >
      <Card.Content style={styles.content}>
        {(
          <Text style={[styles.userId, { color: theme.colors.onSurfaceVariant }]}>
            {item.user_id}
          </Text>
        )}
        <Text style={{ color: theme.colors.onSurface }}>{item.text}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    maxWidth: "75%",
    borderRadius: 20,
    elevation: 2,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  content: {
    padding: 0,
  },
  userId: {
    marginBottom: 4,
    fontWeight: "600",
  },
});
