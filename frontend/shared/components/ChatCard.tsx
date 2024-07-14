import { Text } from "@rneui/base";
import { FC } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { palette } from "../palette";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { ChatScreenNavigationProp, IButtonsList, IChat } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../core/store/store";
import { setMessages } from "../../core/reducers/messages";
import { setCurrentChat } from "../../core/reducers/currentChat";
import BottomSheetComponent from "./BottomSheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  and,
  collection,
  deleteDoc,
  doc,
  getDocs,
  or,
  query,
  where,
} from "firebase/firestore";
import { database } from "../../core/firebase/firebase";
import { setChats } from "../../core/reducers/chats";
import { format, isThisWeek, isToday, parseISO } from "date-fns";
import TextWithFont from "./TextWithFont";

interface IChatCartProps {
  chat: IChat;
}

const ChatCard: FC<IChatCartProps> = ({ chat }) => {
  const navigation = useNavigation<ChatScreenNavigationProp>();

  // Redux states and dispatch
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  // Functions
  const handleRemoveChat = async () => {
    const updatedChatArr: IChat[] = [];
    const { senderEmail, recipientEmail } = chat;

    const q = query(
      collection(database, "chats"),
      and(
        or(
          where("senderEmail", "==", senderEmail),
          where("recipientEmail", "==", senderEmail)
        ),
        or(
          where("senderEmail", "==", recipientEmail),
          where("recipientEmail", "==", recipientEmail)
        )
      )
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      Alert.alert("Chat not found in database");
      return;
    } else {
      const document = querySnapshot.docs[0];
      const docRef = doc(database, "chats", document.id);
      await deleteDoc(docRef);
      console.log("Success removed!");
    }
    try {
    } catch (e: any) {
      Alert.alert("Error during deleting a chat: ", e.message);
    }
  };

  const formatMessageDate = (isoString: string): string => {
    const date = parseISO(isoString);

    if (isToday(date)) {
      return format(date, "HH:mm"); // Сегодня, показываем время
    } else if (isThisWeek(date)) {
      return format(date, "EEE"); // На этой неделе, показываем день недели
    } else {
      return format(date, "dd MMM"); // Больше недели, показываем дату
    }
  };

  // Buttons list
  const buttonsList: IButtonsList[] = [
    {
      title: "Remove chat",
      icon: (
        <MaterialCommunityIcons
          name="chat-remove"
          size={24}
          color={palette.light[800]}
        />
      ),
      onPress: () => handleRemoveChat(),
    },
  ];

  const { messages } = chat;
  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(setMessages(chat.messages));
        dispatch(setCurrentChat(chat));
        navigation.navigate("Chat");
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 12,
        backgroundColor: palette.dark[600],
        borderRadius: 5,
        marginTop: 10,
        padding: 8,
      }}
    >
      <FontAwesome name="user-circle-o" size={48} color={palette.light[600]} />
      <View // Container for email and message
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
        }}
      >
        <TextWithFont // Chat title field
          styleProps={{
            color: palette.blue[200],
            fontSize: 16,
          }}
        >
          {user.general.email === chat.senderEmail
            ? chat.recipientEmail
            : chat.senderEmail}
        </TextWithFont>
        <View
          style={{
            display: "flex",
            maxWidth: "90%",
            flexDirection: "row",
            gap: 4,
          }}
        >
          {messages.length ? (
            <>
              {messages[messages.length - 1].senderEmail ===
                user.general.email && (
                <TextWithFont
                  styleProps={{
                    color: palette.dark[100],
                  }}
                >
                  You:
                </TextWithFont>
              )}
              <TextWithFont // Chat text field
                numberOfLines={1}
                styleProps={{
                  color: palette.light[600],
                }}
              >
                {messages[messages.length - 1].text}
              </TextWithFont>
            </>
          ) : (
            <TextWithFont // Chat text field
              numberOfLines={1}
              styleProps={{
                color: palette.light[200],
                flex: 1,
              }}
            >
              Enter first message!
            </TextWithFont>
          )}
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <TextWithFont
          styleProps={{
            color: palette.light[100],
            flex: 1,
          }}
        >
          {formatMessageDate(chat.createdAt)}
        </TextWithFont>
      </View>
      {/* {chat.createdBy === user.general.email && (
        <BottomSheetComponent buttonsList={buttonsList}></BottomSheetComponent>
      )} */}
    </TouchableOpacity>
  );
};

export default ChatCard;
