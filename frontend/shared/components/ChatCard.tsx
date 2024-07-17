import { Avatar, Text } from "@rneui/base";
import { FC, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { palette } from "../palette";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import {
  ChatScreenNavigationProp,
  IButtonsList,
  IChatClient,
  IUserState,
} from "../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../core/store/store";
import { setMessages } from "../../core/reducers/messages";
import { setCurrentChat } from "../../core/reducers/currentChat";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format, isThisWeek, isToday, parseISO } from "date-fns";
import TextWithFont from "./TextWithFont";
import { FontAwesome5 } from "@expo/vector-icons";

interface IChatCartProps {
  chat: IChatClient;
}

const ChatCard: FC<IChatCartProps> = ({ chat }) => {
  const navigation = useNavigation<ChatScreenNavigationProp>();

  // Redux states and dispatch
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const { participants } = chat;
  const [oneRecipient, setOneRecipient] = useState<IUserState | null>(null);

  // Functions
  const handleRemoveChat = async () => {
    // const updatedChatArr: IChatClient[] = [];
    // const q = query(
    //   collection(database, "chats"),
    //   where("sender", "==", senderEmail)
    // );
    // const querySnapshot = await getDocs(q);
    // if (querySnapshot.empty) {
    //   Alert.alert("Chat not found in database");
    //   return;
    // } else {
    //   const document = querySnapshot.docs[0];
    //   const docRef = doc(database, "chats", document.id);
    //   await deleteDoc(docRef);
    //   console.log("Success removed!");
    // }
    // try {
    // } catch (e: any) {
    //   Alert.alert("Error during deleting a chat: ", e.message);
    // }
  };

  const formatMessageDate = (isoString: string): string => {
    const date = parseISO(isoString);

    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isThisWeek(date)) {
      return format(date, "EEE");
    } else {
      return format(date, "dd MMM");
    }
  };

  // Effects
  useEffect(() => {
    if (participants.length === 2) {
      const foundRecipient =
        chat.participants.find(
          (participant) => participant.email !== user.email
        ) || null;

      setOneRecipient(foundRecipient);
    }
  }, []);

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
      {oneRecipient ? (
        <Avatar
          size={48}
          rounded
          title={oneRecipient.firstName![0] + " " + oneRecipient.lastName![0]}
          containerStyle={{
            backgroundColor: palette.dark[100],
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.39,
            shadowRadius: 8.3,

            elevation: 13,
          }}
        ></Avatar>
      ) : (
        <FontAwesome5 name="users" size={38} color={palette.light[600]} />
      )}
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
          {participants
            .filter((participant) => participant.uid !== user.uid)
            .map(
              (participant) =>
                participant.firstName + " " + participant.lastName
            )
            .join(" ")
            .split("and")}
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
              {messages[messages.length - 1].sender === user.uid && (
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
    </TouchableOpacity>
  );
};

export default ChatCard;
