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
import TextWithFont from "../shared/components/TextWithFont";

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
      senderEmail: user.general.email!,
      recipientEmail:
        user.general.email === senderEmail ? recipientEmail : senderEmail,
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
              key={message._id + "-messageRow"}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent:
                  message.senderEmail === user.general.email
                    ? "flex-end"
                    : "flex-start",
                width: "100%",
              }}
            >
              <View // Container for message
                key={message._id + "-message"}
                style={{
                  maxWidth: "70%",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  borderBottomLeftRadius:
                    message.senderEmail === user.general.email ? 12 : 0,
                  borderBottomRightRadius:
                    message.senderEmail === user.general.email ? 0 : 12,
                  padding: 12,
                  backgroundColor:
                    message.senderEmail === user.general.email
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
                  key={message._id + "-messageText"}
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
