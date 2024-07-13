import { Text } from "@rneui/themed";
import { FC, useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { palette } from "../shared/palette";
import SearchBarComponent from "../shared/components/SearchBar";
import {
  addDoc,
  and,
  collection,
  getDocs,
  or,
  query,
  where,
} from "firebase/firestore";
import { database } from "../core/firebase/firebase";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import BottomSheetComponent from "../shared/components/BottomSheet";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import { ChatScreenNavigationProp, IChat } from "../shared/types";
import { useNavigation } from "@react-navigation/native";
import { setMessages } from "../core/reducers/messages";
import { setCurrentChat } from "../core/reducers/currentChat";
import uuid from "react-native-uuid";

const CreateChat: FC = () => {
  // Redux states and dispatch
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const navigation = useNavigation<ChatScreenNavigationProp>();

  // States
  const [usersEmails, setUsersEmails] = useState<string[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(true);

  // Effects
  useEffect(() => {
    const newUsers: string[] = [];
    const getAllUsersEmails = async () => {
      const q = query(
        collection(database, "users"),
        where("email", "!=", user.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const userFromDB = doc.data().email;
        newUsers.push(userFromDB);
      });
      setUsersEmails(newUsers);
    };
    try {
      getAllUsersEmails();
      setSearchLoading(false);
    } catch (e: any) {
      Alert.alert("Error during getting all users: ", e.message);
      setSearchLoading(false);
    }
  }, []);

  const handleCreateChatWithUser = async (userEmailForNewChat: string) => {
    const q = query(
      collection(database, "chats"),
      and(
        or(
          where("senderEmail", "==", userEmailForNewChat),
          where("recipientEmail", "==", userEmailForNewChat)
        ),
        or(
          where("senderEmail", "==", user.email),
          where("recipientEmail", "==", user.email)
        )
      )
    );

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert("Chat between You and this user already created.");
        return;
      } else {
        const newChat: IChat = {
          _id: uuid.v4().toString(),
          createdAt: new Date().toISOString(),
          createdBy: user.email!,
          messages: [],
          senderEmail: user.email!,
          recipientEmail: userEmailForNewChat,
        };
        await addDoc(collection(database, "chats"), newChat);
        dispatch(setMessages(newChat.messages));
        dispatch(setCurrentChat(newChat));
        navigation.navigate("Chat");
      }
    } catch (error: any) {
      Alert.alert("Error dureng finding user: ", error.message);
    }
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        backgroundColor: palette.dark[700],
        padding: 8,
      }}
    >
      <SearchBarComponent
        setUsersEmails={setUsersEmails}
        setSearchLoading={setSearchLoading}
      ></SearchBarComponent>
      {searchLoading ? (
        <ActivityIndicator
          size={"large"}
          color={palette.light[100]}
          style={{
            flex: 1,
            backgroundColor: palette.dark[700],
          }}
        ></ActivityIndicator>
      ) : (
        <View // Container for users emails and avatar
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            flex: 1,
            marginTop: 12,
          }}
        >
          {usersEmails.length ? (
            usersEmails.map((userEmail) => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  backgroundColor: palette.dark[600],
                  borderWidth: 1,
                  borderColor: palette.dark[300],
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <FontAwesome
                  name="user-circle-o"
                  size={48}
                  color={palette.light[600]}
                />
                <Text
                  style={{ color: palette.light[800], fontSize: 16, flex: 1 }}
                >
                  {userEmail}
                </Text>
                <BottomSheetComponent
                  buttonsList={
                    // Buttons list created here because i need to get userEmail
                    [
                      {
                        title: "Create chat with user",
                        icon: (
                          <Ionicons
                            name="create"
                            size={24}
                            color={palette.light[800]}
                          />
                        ),
                        onPress: () => handleCreateChatWithUser(userEmail),
                      },
                      {
                        title: "Cancel",
                        icon: null,
                        onPress: () => {},
                      },
                    ]
                  }
                ></BottomSheetComponent>
              </View>
            ))
          ) : (
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text style={{ color: palette.light[800] }}>Users not found</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default CreateChat;
