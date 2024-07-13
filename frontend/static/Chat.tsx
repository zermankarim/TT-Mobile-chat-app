import { Button, Text } from "@rneui/base";
import { FC, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  ActivityIndicator,
} from "react-native";
import { palette } from "../shared/palette";
import { Input } from "@rneui/themed";
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
import { IChat, IMessage } from "../shared/types";
import { setCurrentChat } from "../core/reducers/currentChat";

const Chat: FC = () => {
  // Redux states and dispatch
  const currentChat = useSelector((state: RootState) => state.currentChat);
  const user = useSelector((state: RootState) => state.user);
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
    const { senderEmail, recipientEmail } = currentChat;
    const q = query(
      collection(database, "chats"),
      where("senderEmail", "==", senderEmail),
      where("recipientEmail", "==", recipientEmail)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const document = querySnapshot.docs[0];
        const updatedChat: IChat = document.data() as IChat;
        dispatch(setCurrentChat(updatedChat));
      } else {
        console.log("No documents found");
      }
      setChatLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Functions
  const onSend = async () => {
    const { recipientEmail, senderEmail } = currentChat;
    const newMessage: IMessage = {
      _id: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      senderEmail: user.email!,
      recipientEmail: user.email === senderEmail ? recipientEmail : senderEmail,
      text: messageText,
    };
    try {
      // Updating document (add a new message)
      const q = query(
        collection(database, "chats"),
        where("senderEmail", "==", currentChat.senderEmail),
        where("recipientEmail", "==", currentChat.recipientEmail)
      );

      let querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const document = querySnapshot.docs[0];
        const foundChat: IChat = document.data() as IChat;
        const newMessages: IMessage[] = [...foundChat.messages, newMessage];
        setMessageText("");

        await updateDoc(doc(database, "chats", document.id), {
          messages: newMessages,
        });
        scrollToBottom();
      } else {
        console.log("No documents found");
        return;
      }
    } catch (error) {
      console.error("Error updating document:", error);
    } finally {
      setMessageText("");
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
        {currentChat.messages.map((message) => (
          <View // Container for message row
            key={message._id + "-messageRow"}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent:
                message.senderEmail === user.email ? "flex-end" : "flex-start",
              width: "100%",
            }}
          >
            <View // Container for message
              key={message._id + "-message"}
              style={{
                maxWidth: "70%",
                borderRadius: 8,
                padding: 8,
                backgroundColor:
                  message.senderEmail === user.email
                    ? palette.blue[300]
                    : palette.dark[300],
                marginBottom: 12,
              }}
            >
              <Text // Container for message text
                key={message._id + "-messageText"}
                style={{
                  color: palette.light[800],
                }}
              >
                {message.text}
              </Text>
            </View>
          </View>
        )).reverse()}
      </ScrollView>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          borderTopWidth: 1,
          borderTopColor: palette.dark[500],
          paddingVertical: 12,
          backgroundColor: palette.dark[800],
        }}
      >
        <Input
          placeholder="Enter Your message.."
          onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) =>
            setMessageText(e.nativeEvent.text)
          }
          value={messageText}
          containerStyle={{ width: "85%" }}
          inputStyle={{
            borderWidth: 1,
            borderRadius: 5,
            borderColor: palette.dark[600],
            padding: 4,
            fontSize: 14,
            color: palette.light[600],
          }}
        />
        <Button
          onPress={onSend}
          containerStyle={{ flex: 1 }}
          buttonStyle={{ backgroundColor: palette.blue[200] }}
        >
          <Ionicons name="send-sharp" size={24} color="white" />
        </Button>
      </View>
    </View>
  );
};

export default Chat;
