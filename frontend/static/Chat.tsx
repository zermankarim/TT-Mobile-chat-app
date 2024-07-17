import { Button, Text } from "@rneui/base";
import { FC, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { palette } from "../shared/palette";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "../core/firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import { Ionicons } from "@expo/vector-icons";
import { IChatClient, IChatDB, IMessage } from "../shared/types";
import { setCurrentChat } from "../core/reducers/currentChat";
import TextWithFont from "../shared/components/TextWithFont";
import uuid from "react-native-uuid";
import { addMessage, setMessages } from "../core/reducers/messages";

const Chat: FC = () => {
  // Redux states and dispatch
  const currentChat: IChatClient = useSelector(
    (state: RootState) => state.currentChat
  );
  const user = useSelector((state: RootState) => state.user);
  const messages = useSelector((state: RootState) => state.messages);
  const dispatch = useDispatch();

  //States
  const [messageText, setMessageText] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(true);

  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll when user send a new message
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  // Effects
  useEffect(() => {
    if (currentChat) {
      const q = query(
        collection(database, "chats"),
        where("id", "==", currentChat.id)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        try {
          if (!querySnapshot.empty) {
            const document = querySnapshot.docs[0];
            const updatedChat: IChatDB = document.data() as IChatDB;
            dispatch(
              setCurrentChat({
                ...currentChat,
                messages: updatedChat.messages,
              })
            );
          }
          setChatLoading(false);
        } catch (error) {
          console.error("Error on chat snapshot: ", error);
          setChatLoading(false);
        }
      });

      return () => unsubscribe();
    }
  }, []);

  // Functions
  const onSend = async () => {
    setMessageText("");

    const newMessage: IMessage = {
      createdAt: new Date().toISOString(),
      sender: user.uid!,
      text: messageText,
    };

    try {
      // Updating document (add a new message)
      const chatDocRef = doc(database, "chats", currentChat.id);
      await updateDoc(chatDocRef, {
        messages: [...currentChat.messages, newMessage],
      });

      scrollToBottom();
      dispatch(setMessages([...currentChat.messages, newMessage]));
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  if (chatLoading) {
    return (
      <ActivityIndicator
        size={"large"}
        color={palette.light[100]}
        style={{
          flex: 1,
          backgroundColor: palette.dark[700],
        }}
      ></ActivityIndicator>
    );
  }

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        flex: 1,
        backgroundColor: palette.dark[700],
        padding: 24,
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        style={{
          display: "flex",
          padding: 8,
        }}
        contentContainerStyle={{
          flex: 1,
          flexDirection: "column-reverse",
        }}
      >
        {currentChat.messages
          .map((message) => (
            <View // Container for message row
              key={uuid.v4() + "-messageRow"}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent:
                  message.sender === user.uid ? "flex-end" : "flex-start",
                width: "100%",
              }}
            >
              <View // Container for message
                key={uuid.v4() + "-message"}
                style={{
                  maxWidth: "70%",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  borderBottomLeftRadius: message.sender === user.uid ? 12 : 0,
                  borderBottomRightRadius: message.sender === user.uid ? 0 : 12,
                  padding: 12,
                  backgroundColor:
                    message.sender === user.uid
                      ? palette.blue[300]
                      : palette.dark[300],
                  marginBottom: 12,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.39,
                  shadowRadius: 8.3,

                  elevation: 13,
                }}
              >
                <TextWithFont
                  key={uuid.v4() + "-messageText"}
                  styleProps={{
                    color: palette.light[1000],
                  }}
                >
                  {message.text}
                </TextWithFont>
              </View>
            </View>
          ))
          .reverse()}
      </ScrollView>
      <View // Container for entering and sending message
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: 12,
          backgroundColor: palette.dark[600],
          borderRadius: 24,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.39,
          shadowRadius: 8.3,

          elevation: 13,
        }}
      >
        <TextInput
          placeholder="Enter Your message"
          placeholderTextColor={palette.light[100]}
          value={messageText}
          onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) =>
            setMessageText(e.nativeEvent.text)
          }
          style={{
            display: "flex",
            width: "85%",
            color: palette.light[800],
          }}
        ></TextInput>
        <Button
          onPress={onSend}
          containerStyle={{ flex: 1 }}
          buttonStyle={{ backgroundColor: "transparent" }}
        >
          <Ionicons name="send-sharp" size={24} color="white" />
        </Button>
      </View>
    </View>
  );
};

export default Chat;
