import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { Audio } from "expo-av";
import MessageItem from "../components/MessageItem";
import ChatInput from "../components/ChatInput";



const BACKEND_URL = "https://buddy-avatar-ai.onrender.com";


export default function ChatScreen({ navigation, route }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttons, setButtons] = useState([]);
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  
  
  
  // Load sounds
  const sendSound = require("../assets/sound/message.mp3");
  const receiveSound = require("../assets/sound/message.mp3");

  // Helper to play sounds
  const playSound = async (soundFile) => {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) sound.unloadAsync();
      });
    } catch (err) {
      console.error("Sound error:", err);
    }
  };

  // Cleanup sound
  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  // --- Initial bot message ---
useEffect(() => {
  const fetchInitialMessage = async () => {
    try {
      setLoading(true);

      // Get name and status from route params
      const { name = "Friend", status = "friend" } = route.params || {};

      // Send INIT message with user info
      const response = await axios.post(`${BACKEND_URL}/openai`, {
        message: "INIT",
        name,
        status,
      });

      const { replies, buttons: botButtons } = response.data;

      const newMessages = replies.map((text, i) => ({
        id: `init-${i}`,
        text,
        sender: "bot",
      }));

      setMessages(newMessages);
      setButtons(botButtons || []);
      if (newMessages.length > 0) playSound(receiveSound); // 👈 bot greeting sound
    } catch (err) {
      console.error("Initial bot error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchInitialMessage();
}, [route.params]);


  const handleSendText = async (userInput) => {
  if (!userInput.trim()) return;

  setInput("");
  setButtons([]);

  const { name = "Friend", status = "friend" } = route.params || {};

  const userMessage = { id: Date.now().toString(), text: userInput, sender: "user" };
  const typingId = Date.now().toString() + "-typing";

  // Add user message + typing bubble together
  setMessages((prev) => [
    ...prev,
    userMessage,
    { id: typingId, text: "Buddy is typing...", sender: "bot", isTyping: true },
  ]);

  playSound(sendSound); //  sound when user sends

  setLoading(true);

  try {
    const response = await axios.post(`${BACKEND_URL}/openai`, {
      message: userInput,
      name,
      status,
    });

    const { replies, buttons: botButtons } = response.data;

    // Remove typing bubble
    setMessages((prev) => prev.filter((msg) => msg.id !== typingId));

    // Add bot replies
    const newBotMessages = replies.map((text, i) => ({
      id: `${Date.now()}-${i}`,
      text,
      sender: "bot",
    }));
    setMessages((prev) => [...prev, ...newBotMessages]);
    
    if (newBotMessages.length > 0) playSound(receiveSound); //  bot reply sound
    setButtons(botButtons || []);
  } catch (err) {
    console.error("Chat Error:", err.response?.data || err.message);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === typingId
          ? { id: Date.now().toString(), text: "⚠️ Buddy couldn’t respond.", sender: "bot" }
          : msg
      )
    );
  } finally {
    setLoading(false);
  }
};

  const handleButtonPress = (value) => handleSendText(value);

  
  // --- Recording ---
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      // Show user voice message
      const userMessage = { id: Date.now().toString(), audio: uri, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);
      playSound(sendSound); // sound when user sends voice

      // Show bot thinking bubble for voice response
      const thinkingId = Date.now().toString() + "-thinking";
      setMessages((prev) => [
        ...prev,
        { id: thinkingId, text: "Buddy is thinking...", sender: "bot", isTyping: true },
      ]);

      // Upload to backend
      const formData = new FormData();

      if (Platform.OS === "web") {
  const blob = await fetch(uri).then(r => r.blob());
  formData.append("file", new File([blob], `recording-${Date.now()}.m4a`, { type: "audio/m4a" }));
} else {
  formData.append("file", { uri, name: `recording-${Date.now()}.m4a`, type: "audio/m4a" });
}

const response = await axios.post(`${BACKEND_URL}/upload-audio`, formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
      // formData.append("file", { uri, name: `recording-${Date.now()}.m4a`, type: "audio/m4a" });

      // const response = await axios.post(`${BACKEND_URL}/upload-audio`, formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      // Remove thinking bubble
      setMessages((prev) => prev.filter((msg) => msg.id !== thinkingId));

      // Show bot audio reply
      const { audioUrl } = response.data;
      if (audioUrl) {
        const botMessage = { id: Date.now().toString(), audio: audioUrl, sender: "bot" };
        setMessages((prev) => [...prev, botMessage]);
        playSound(receiveSound); //  sound when bot replies with audio
      }
    } catch (err) {
      console.error("Stop recording error:", err);
    }
  };

  // --- Play audio ---
  const togglePlay = async (uri, id) => {
    if (!uri) return;

    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      if (playingId === id) {
        setPlayingId(null);
        return;
      }
    }

    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    setSound(newSound);
    setPlayingId(id);
    await newSound.playAsync();

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) setPlayingId(null);
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={{ fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Buddy</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <MessageItem
            item={item}
            togglePlay={togglePlay}
            playingId={playingId}
            styles={styles}
          />
  )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        style={{ flex: 1 }}
      />

      {buttons.length > 0 && (
        <View style={styles.buttonsContainer}>
          {buttons.map((btn) => (
            <TouchableOpacity key={btn} style={styles.button} onPress={() => handleButtonPress(btn)}>
              <Text style={styles.buttonText}>{btn}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      
      <ChatInput
      input={input}
      setInput={setInput}
      handleSendText={handleSendText}
      recording={recording}
      startRecording={startRecording}
      stopRecording={stopRecording}
      loading={loading}
      styles={styles}
    />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#00025cff" 
      //backgroundColor: '#300364cf',
    },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#fff", 
    padding: 10 },
  backButton: { 
    marginRight: 10 
  },
  headerText: { 
    fontSize: 20, 
    fontWeight: "bold"
  },
  inputContainer: {
     flexDirection: "row", 
     padding: 10, backgroundColor: "#fff", 
     alignItems: "center" 
    },
  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: "#ddd", 
    borderRadius: 20, 
    fontSize: 15,
    paddingHorizontal: 15 },
  sendButton: { 
    marginLeft: 10, 
   // backgroundColor: '#c597fdff',
    backgroundColor: "#0078fe", 
    borderRadius: 20, 
    padding: 10 },
  micButton: { 
    marginLeft: 10, 
    backgroundColor: "tomato", 
    borderRadius: 20, 
    padding: 10 },
  messageBubble: { 
    padding: 10, 
    marginVertical: 5, 
    borderRadius: 10, 
    fontSize: 25,
    maxWidth: "75%" 
  },
  userBubble: { 
    backgroundColor: "#0078fe", 
    alignSelf: "flex-end",
    fontSize: 20, 
  },
  botBubble: { 
    backgroundColor: "#e5e5ea", 
    alignSelf: "flex-start" 
  },
  messageText: { 
    color: "#000",
    fontSize: 16,
    fontFamily: "Poppins-Regular"
   },
  buttonsContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    padding: 10, 
    justifyContent: "center" },
  button: { 
    backgroundColor: "#0078fe", 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 20, margin: 5 },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold" },
  audioContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    borderRadius: 10, 
    backgroundColor: "rgba(0,0,0,0.1)" },
  audioText: { 
    marginLeft: 8, 
    fontSize: 16 
  },
});
















