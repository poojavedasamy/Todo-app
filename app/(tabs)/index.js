import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, TextInput, ScrollView } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  const [userInfo, setUserInfo] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '289576671551-t16to93e6kg7uvv6lmgebippmeukdv90.apps.googleusercontent.com',
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const getUserData = async () => {
        const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${response.authentication.accessToken}` },
        });
        const data = await res.json();
        setUserInfo(data);
      };
      getUserData();
    }
  }, [response]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { text: newTodo, done: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (index) => {
    const updated = [...todos];
    updated[index].done = !updated[index].done;
    setTodos(updated);
  };

  const deleteTodo = (index) => {
    const updated = todos.filter((_, i) => i !== index);
    setTodos(updated);
  };

  return (
    <ScrollView contentContainerStyle={{
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      paddingBottom: 40, // Increased padding at the bottom
      backgroundColor: '#ffffff',
    }}>
      {!userInfo ? (
        <>
          <Text
            style={{
              fontSize: 26,
              marginBottom: 20,
              color: '#000000',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            🚀 Welcome to Todo App
          </Text>
          <Button title="Sign in with Google" disabled={!request} onPress={() => promptAsync()} />
        </>
      ) : (
        <>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            marginBottom: 20,
            justifyContent: 'center' // Center the whole row
          }}>
            <Image
              source={{ uri: userInfo.picture }}
              style={{ width: 100, height: 100, borderRadius: 50, marginRight: 15 }}
            />
            <View>
              <Text style={{ fontSize: 20, marginBottom: 5, color: '#000000', fontWeight: 'bold' }}>
                👋 Hello, {userInfo.name}
              </Text>
              <Text style={{ color: '#000000' }}>
                Email: {userInfo.email}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', width: '60%', marginBottom: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
            <TextInput
              value={newTodo}
              onChangeText={setNewTodo}
              placeholder="Add a new task"
              placeholderTextColor="#999"
              style={{
                borderWidth: 1,
                padding: 8,
                flex: 1, // changed from 0.7 to 1
                borderRadius: 5,
                borderColor: '#ccc',
                marginRight: 10,
                backgroundColor: '#fff',
                fontSize: 14,
              }}
            />
            <Button title="Add Todo" onPress={addTodo} />
          </View>

          <Text style={{ fontSize: 18, marginVertical: 20, color: '#000000', alignSelf: 'center' }}>📝 Your Tasks</Text>
          {todos.length === 0 ? (
            <Text style={{ color: '#888', alignSelf: 'center' }}>No tasks yet.</Text>
          ) : (
            <View style={{ width: '60%', alignSelf: 'center' }}>
              {todos.map((todo, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginBottom: 10,
                    backgroundColor: '#f9f9f9',
                    padding: 10,
                    borderRadius: 5,
                    elevation: 2, // subtle shadow for Android
                    shadowColor: '#000', // subtle shadow for iOS
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                  }}
                >
                  <Text
                    style={{
                      textDecorationLine: todo.done ? 'line-through' : 'none',
                      color: todo.done ? '#888' : '#000', // better done/undone visibility
                      flex: 1,
                    }}
                  >
                    {todo.text}
                  </Text>
                  <Button
                    title={todo.done ? "Undo" : "Done"}
                    onPress={() => toggleTodo(index)}
                    color={todo.done ? undefined : 'green'} // green for "Done", default for "Undo"
                  />
                  <View style={{ width: 10 }} />
                  <View style={{ paddingLeft: 10 }}>
                    <Button title="Delete" color="red" onPress={() => deleteTodo(index)} />
                  </View>
                </View>
              ))}
            </View>
          )}
          {userInfo && (
            <View style={{ marginTop: 20 }}>
              <Button
                title="Logout"
                color="orange"
                onPress={() => setUserInfo(null)}
                style={{ marginBottom: 20 }}
              />
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
} 

