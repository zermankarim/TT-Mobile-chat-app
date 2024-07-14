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
  onSnapshot,
  or,
  query,
  where,
} from "firebase/firestore";
import { database } from "../core/firebase/firebase";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import BottomSheetComponent from "../shared/components/BottomSheet";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import { ChatScreenNavigationProp, IChat, IUserState } from "../shared/types";
import { useNavigation } from "@react-navigation/native";
import { setMessages } from "../core/reducers/messages";
import { setCurrentChat } from "../core/reducers/currentChat";
import uuid from "react-native-uuid";
import { Button } from "@rneui/base";
import TextWithFont from "../shared/components/TextWithFont";

const CreateChat: FC = () => {
  // Redux states and dispatch
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const navigation = useNavigation<ChatScreenNavigationProp>();

  // States
  const [usersEmails, setUsersEmails] = useState<string[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  // Effects
  useEffect(() => {
    const q = query(
      collection(database, "users"),
      where("general.email", "!=", user.general.email)
    );

    const updateUsersEmailsState = async () => {
      const unsubscribe = onSnapshot(q, (snapshot: any) => {
        const newUsers: string[] = [];
        snapshot.forEach((doc: any) => {
          const useFromDB: IUserState = doc.data() as IUserState;
          newUsers.push(useFromDB.general.email!);
        });
        setUsersEmails(newUsers);
      });
      return unsubscribe;
    };

    try {
      updateUsersEmailsState();
      setSearchLoading(false);
    } catch (e: any) {
      Alert.alert("Error during getting all users: ", e.message);
      setSearchLoading(false);
    }
  }, []);

  //Functions
  const handleCreateChatWithUser = async (userEmailForNewChat: string) => {
    const q = query(
      collection(database, "chats"),
      and(
        or(
          where("senderEmail", "==", userEmailForNewChat),
          where("recipientEmail", "==", userEmailForNewChat)
        ),
        or(
          where("senderEmail", "==", user.general.email),
          where("recipientEmail", "==", user.general.email)
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
          createdBy: user.general.email!,
          messages: [],
          senderEmail: user.general.email!,
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

  const updateSearchUsers = async (searchReq: string) => {
    setSearchLoading(true);
    setSearch(searchReq);
    const q = query(
      collection(database, "users"),
      and(
        or(
          where("general.email", ">", searchReq.toLocaleLowerCase()),
          where("general.email", "==", searchReq.toLocaleLowerCase())
        ),
        where("general.email", "!=", user.general.email)
      )
    );

    try {
      const newUsersEmails: string[] = [];
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const userData: IUserState = doc.data() as IUserState;
          newUsersEmails.push(userData.general.email!);
        });

        setUsersEmails(newUsersEmails);
      } else {
        setUsersEmails([]);
      }
      setSearchLoading(false);
    } catch (error: any) {
      Alert.alert("Error during finding user: ", error.message);
      setSearchLoading(false);
    }
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        backgroundColor: palette.dark[700],
      }}
    >
      <SearchBarComponent
        updateSearchFunction={updateSearchUsers}
        search={search}
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
            marginTop: 36,
            paddingTop: 24,
            paddingLeft: 24,
            paddingRight: 24,
            backgroundColor: palette.dark[600],
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
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
          {usersEmails.length ? (
            usersEmails.map((userEmail) => (
              <Button
                key={userEmail + "-userContainer"}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 12,
                }}
                buttonStyle={{
                  backgroundColor: "transparent",
                }}
              >
                <FontAwesome
                  key={userEmail + "-userImage"}
                  name="user-circle-o"
                  size={48}
                  color={palette.light[600]}
                />
                <TextWithFont
                  styleProps={{
                    color: palette.light[800],
                    fontSize: 16,
                    flex: 1,
                    marginLeft: 12,
                  }}
                >
                  {userEmail}
                </TextWithFont>
                <BottomSheetComponent
                  key={userEmail + "-userBottomSheet"}
                  name="CreateNewChat"
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
                    ]
                  }
                ></BottomSheetComponent>
              </Button>
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
              <TextWithFont styleProps={{ color: palette.light[800] }}>
                Users not found
              </TextWithFont>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default CreateChat;
