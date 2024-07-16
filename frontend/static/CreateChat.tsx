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
  query,
  where,
} from "firebase/firestore";
import { database } from "../core/firebase/firebase";
import { Ionicons } from "@expo/vector-icons";
import BottomSheetComponent from "../shared/components/BottomSheet";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import { ChatScreenNavigationProp, IChat, IUserState } from "../shared/types";
import { useNavigation } from "@react-navigation/native";
import { setCurrentChat } from "../core/reducers/currentChat";
import { Avatar, Button } from "@rneui/base";
import TextWithFont from "../shared/components/TextWithFont";
import UserCardInSearch from "../shared/components/UserCardInSearch";

const CreateChat: FC = () => {
  // Redux states and dispatch
  const user = useSelector((state: RootState) => state.user);

  // States
  const [usersForChat, setUsersForChat] = useState<IUserState[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  //Functions

  const updateUsersForChatState = async (q: any) => {
    setSearchLoading(true);
    const unsubscribe = onSnapshot(q, async (snapshot: any) => {
      const newUsers: IUserState[] = [];
      for (const doc of snapshot.docs) {
        const userForChat: IUserState = doc.data() as IUserState;
        const q = query(
          collection(database, "chats"),
          where("participants", "array-contains", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const chatExists = querySnapshot.docs.some((chatDoc) => {
          const participants = chatDoc.data().participants;
          return participants.includes(userForChat.uid);
        });
        // Push only users for creating new chat
        if (!chatExists) {
          newUsers.push(userForChat);
        }
      }
      setUsersForChat(newUsers);
      setSearchLoading(false);
    });
    return unsubscribe;
  };

  const updateSearchUsers = async (searchReq: string) => {
    setSearchLoading(true);
    setSearch(searchReq);
    let q;
    if (!searchReq) {
      q = query(collection(database, "users"), where("uid", "!=", user.uid));
    } else {
      q = query(
        collection(database, "users"),
        and(
          where("email", "==", searchReq.toLocaleLowerCase()),
          where("uid", "!=", user.uid)
        )
      );
    }

    try {
      const newUsersForChat: IUserState[] = [];
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const userData: IUserState = doc.data() as IUserState;
          newUsersForChat.push(userData);
        });

        setUsersForChat(newUsersForChat);
      } else {
        setUsersForChat([]);
      }
      setSearchLoading(false);
    } catch (error: any) {
      Alert.alert("Error during finding users: ", error.message);
      console.log(error.message);
      setSearchLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    const q = query(
      collection(database, "users"),
      where("email", "!=", user.email)
    );
    try {
      updateUsersForChatState(q);
    } catch (e: any) {
      Alert.alert("Error during getting all users: ", e.message);
      setSearchLoading(false);
    }
  }, []);

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
          {usersForChat.length ? (
            usersForChat.map((userForChat) => (
              <UserCardInSearch
                userForChat={userForChat}
              ></UserCardInSearch>
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
