import { FC, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import { IChat, RouteProps } from "../shared/types";
import { Tab, TabView, Text } from "@rneui/base";
import ChatCard from "../shared/components/ChatCard";
import {
  and,
  collection,
  getDocs,
  onSnapshot,
  or,
  query,
  where,
} from "firebase/firestore";
import { database } from "../core/firebase/firebase";
import { setChats } from "../core/reducers/chats";
import { palette } from "../shared/palette";
import SearchBarComponent from "../shared/components/SearchBar";

const Home: FC<RouteProps> = () => {
  // Redux states and dispatch
  const chats = useSelector((state: RootState) => state.chats);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  // States
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [chatsLoading, setChatsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState<boolean>(true);
  const [usersEmails, setUsersEmails] = useState<string[]>([]);

  // Effects
  useEffect(() => {
    // Get all chat and push to a state
    const updateChats = async () => {
      const q = query(
        collection(database, "chats"),
        or(
          where("recipientEmail", "==", user.general.email),
          where("senderEmail", "==", user.general.email)
        )
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newChats: IChat[] = [];
        snapshot.forEach((doc) => {
          const chatData: IChat = doc.data() as IChat;
          newChats.push(chatData);
        });
        dispatch(setChats(newChats));
        setChatsLoading(false);
        setSearchLoading(false);
      });

      return unsubscribe;
    };
    try {
      updateChats();
    } catch (e) {
      console.error("Error during update chats on Home page: ", e);
    }
  }, []);

  // Functions
  const updateSearchChats = async (searchReq: string) => {
    setSearchLoading(true);

    setSearch(searchReq);
    const q = query(
      collection(database, "chats"),
      and(
        or(
          where("senderEmail", ">", searchReq.toLocaleLowerCase()),
          where("recipientEmail", "==", searchReq.toLocaleLowerCase())
        )
      )
    );
    try {
      const newChats: IChat[] = [];
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const chatData: IChat = doc.data() as IChat;
          newChats.push(chatData);
        });
        dispatch(setChats(newChats));
        setSearchLoading(false);
      } else {
        dispatch(setChats([]));
        setSearchLoading(false);
      }
    } catch (error: any) {
      Alert.alert("Error during finding user: ", error.message);
      console.log("Error during finding user: ", error.message);
      setSearchLoading(false);
    }
  };

  if (chatsLoading) {
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
    <View // Container for Home page
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        flex: 1,
        width: "100%",
        backgroundColor: palette.dark[700],
      }}
    >
      <TabView value={pageIndex} onChange={setPageIndex} animationType="spring">
        <TabView.Item style={{ width: "100%" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <SearchBarComponent
              updateSearchFunction={updateSearchChats}
              search={search}
            ></SearchBarComponent>
            <ScrollView
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                gap: 25,
                paddingLeft: 24,
                paddingRight: 24,
                paddingTop: 24,
                backgroundColor: palette.dark[600],
                marginTop: 36,
                borderTopRightRadius: 48,
                borderTopLeftRadius: 48,
              }}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: palette.light[300],
                  }}
                >
                  All chats
                </Text>
              </View>
              {searchLoading ? (
                <ActivityIndicator
                  size={"large"}
                  color={palette.light[100]}
                  style={{
                    flex: 1,
                  }}
                ></ActivityIndicator>
              ) : (
                chats.map((chat) => (
                  <ChatCard key={chat._id + "-chatCard"} chat={chat}></ChatCard>
                ))
              )}
            </ScrollView>
          </View>
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            {chats.length ? (
              <SearchBarComponent
                updateSearchFunction={updateSearchChats}
                search={search}
              ></SearchBarComponent>
            ) : null}
            <ScrollView
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 25,
                paddingLeft: 24,
                paddingRight: 24,
                paddingTop: 24,
                backgroundColor: palette.dark[600],
                marginTop: chats.length ? 36 : 100,
                borderTopRightRadius: 48,
                borderTopLeftRadius: 48,
              }}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: palette.light[300],
                  }}
                >
                  My chats
                </Text>
              </View>

              {searchLoading ? (
                <ActivityIndicator
                  size={"large"}
                  color={palette.light[100]}
                  style={{
                    flex: 1,
                  }}
                ></ActivityIndicator>
              ) : (
                chats.map((chat) => (
                  <ChatCard key={chat._id + "-chatCard"} chat={chat}></ChatCard>
                ))
              )}
            </ScrollView>
          </View>
        </TabView.Item>
      </TabView>
      <Tab // Container for tab buttons
        value={pageIndex}
        onChange={(e) => setPageIndex(e)}
        iconPosition="left"
        indicatorStyle={{
          backgroundColor: palette.light[600],
          height: 3,
        }}
        containerStyle={{
          backgroundColor: palette.dark[700],
          height: 64,
        }}
        variant="primary"
      >
        <Tab.Item title="All chats" titleStyle={{ fontSize: 14 }} />
        <Tab.Item title="My chats" titleStyle={{ fontSize: 14 }} />
      </Tab>
    </View>
  );
};

export default Home;
