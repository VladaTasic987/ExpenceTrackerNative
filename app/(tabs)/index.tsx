import React, { useState } from "react";
import { ScrollView, Alert, Text, StyleSheet, View, Keyboard, TouchableWithoutFeedback } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { useBooks } from "@/context/booksContext";
import { useTheme } from "@/context/themeContext";

export default function HomeScreen() {
  const { localBooks, addLocalBook, submitBookToSupabase, deleteLocalBook } = useBooks();
  const { theme } = useTheme(); 

  
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background, minHeight: "100%" },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        
        <Card style={[styles.inputCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.heading, { color: theme.colors.onBackground }]}>
              📚 Dodaj knjigu
            </Text>

            <TextInput
              label="Naslov"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
              theme={{
                colors: {
                  text: theme.colors.onBackground,
                  primary: theme.colors.primary,
                  background: theme.colors.surface,
                },
              }}
            />
            <TextInput
              label="Autor"
              value={author}
              onChangeText={setAuthor}
              mode="outlined"
              style={styles.input}
              theme={{
                colors: {
                  text: theme.colors.onBackground,
                  primary: theme.colors.primary,
                  background: theme.colors.surface,
                },
              }}
            />
            <TextInput
              label="Žanr (opciono)"
              value={genre}
              onChangeText={setGenre}
              mode="outlined"
              style={styles.input}
              theme={{
                colors: {
                  text: theme.colors.onBackground,
                  primary: theme.colors.primary,
                  background: theme.colors.surface,
                },
              }}
            />
            <TextInput
              label="Beleške"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              multiline
              style={styles.input}
              theme={{
                colors: {
                  text: theme.colors.onBackground,
                  primary: theme.colors.primary,
                  background: theme.colors.surface,
                },
              }}
            />

            <Button
              mode="contained"
              onPress={() => {
                
                Keyboard.dismiss();

                if (!title || !author) {
                  Alert.alert("⚠️", "Naslov i autor su obavezni.");
                  return;
                }

                addLocalBook(title, author, genre, notes);
                setTitle("");
                setAuthor("");
                setGenre("");
                setNotes("");
              }}
              style={styles.addButton}
            >
              Dodaj lokalno
            </Button>
          </Card.Content>
        </Card>

        
        {localBooks.map((book) => (
          <Card
            key={book.id}
            style={[styles.bookCard, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text style={[styles.bookTitle, { color: theme.colors.onBackground }]}>
                {book.title}
              </Text>
              <Text style={[styles.bookAuthor, { color: theme.colors.onBackground }]}>
                {book.author}
              </Text>
              {book.genre && (
                <Text style={[styles.bookInfo, { color: theme.colors.onBackground + "aa" }]}>
                  Žanr: {book.genre}
                </Text>
              )}
              {book.notes && (
                <Text style={[styles.bookInfo, { color: theme.colors.onBackground + "aa" }]}>
                  Beleške: {book.notes}
                </Text>
              )}
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={async () => await submitBookToSupabase(book)}
              >
                Pošalji u Supabase
              </Button>
              <Button
                mode="outlined"
                onPress={() =>
                  Alert.alert("Obriši knjigu", "Da li želite da obrišete ovu knjigu?", [
                    { text: "Otkaži", style: "cancel" },
                    { text: "Obriši", style: "destructive", onPress: () => deleteLocalBook(book.id) },
                  ])
                }
                style={{ marginLeft: 8 }}
              >
                Obriši
              </Button>
            </Card.Actions>
          </Card>
        ))}

        
        {localBooks.length === 0 && <View style={{ flex: 1 }} />}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1, 
  },
  inputCard: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    marginBottom: 10,
  },
  addButton: {
    marginTop: 10,
  },
  bookCard: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bookAuthor: {
    fontSize: 16,
    marginBottom: 4,
  },
  bookInfo: {
    fontSize: 14,
  },
});
