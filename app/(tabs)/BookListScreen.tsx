import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Card, Button } from "react-native-paper";
import { useBooks } from "@/context/booksContext";
import { useTheme } from "@/context/themeContext";

export default function BookListScreen() {
  const { books = [], fetchBooks, deleteSupabaseBook, loading } = useBooks();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { theme } = useTheme();

  useEffect(() => {
    fetchBooks().catch((err) => console.log("Fetch books error:", err));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchBooks();
    } catch (err) {
      console.log("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  }, [fetchBooks]);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBook = ({ item }: { item: typeof books[0] }) => (
    <Card style={[styles.bookCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Text style={[styles.cardTitle, { color: theme.colors.onBackground }]}>{item.title}</Text>
        <Text style={[styles.cardAuthor, { color: theme.colors.onBackground }]}>{item.author}</Text>

        {item.genre && (
          <Text style={[styles.cardSub, { color: theme.colors.onBackground + "aa" }]}>
            Žanr: {item.genre}
          </Text>
        )}
        {item.notes && (
          <Text style={[styles.cardSub, { color: theme.colors.onBackground + "aa" }]}>
            Beleške: {item.notes}
          </Text>
        )}
      </Card.Content>

      <Card.Actions>
        <Button
          onPress={() => deleteSupabaseBook(item.id)}
          mode="text"
          textColor={theme.colors.error}
        >
          🗑️ Obriši
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: theme.colors.onBackground }]}>📚 Sve knjige</Text>

        <TextInput
          placeholder="Pretraži po naslovu ili autoru"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[
            styles.searchInput,
            {
              color: theme.colors.onBackground,
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline,
            },
          ]}
          placeholderTextColor={theme.colors.onSurface + "99"}
        />
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBook}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          !loading ? (
            <Text style={{ textAlign: "center", marginTop: 20, color: theme.colors.onBackground + "99" }}>
              Nema knjiga koje odgovaraju pretrazi.
            </Text>
          ) : null
        }
      />

      {loading && (
        <Text style={{ textAlign: "center", marginVertical: 20, color: theme.colors.onBackground }}>
          Učitavanje...
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  heading: {
    fontSize: 26,
    marginBottom: 10,
    fontWeight: "bold",
  },
  searchInput: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  bookCard: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  cardAuthor: {
    fontSize: 16,
    marginTop: 4,
  },
  cardSub: {
    fontSize: 14,
    marginTop: 4,
  },
});
