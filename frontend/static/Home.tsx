import { FC, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import { IChat, RouteProps } from "../shared/types";
import { Tab, TabView, Text } from "@rneui/base";
import ChatCard from "../shared/components/ChatCard";
import {
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

const Home: FC<RouteProps> = () => {
  // Redux states and dispatch
  const chats = useSelector((state: RootState) => state.chats);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  // States
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [chatsLoading, setChatsLoading] = useState<boolean>(true);

  // Effects
  useEffect(() => {
    // Get all chat and push to a state
    const updateChats = async () => {
      const q = query(
        collection(database, "chats"),
        or(
          where("recipientEmail", "==", user.email),
          where("senderEmail", "==", user.email)
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
      });

      return unsubscribe;
    };
    try {
      updateChats();
    } catch (e) {
      console.error("Error during update chats on Home page: ", e);
    }
  }, []);

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
        backgroundColor: "#1f1e26",
      }}
    >
      <TabView value={pageIndex} onChange={setPageIndex} animationType="spring">
        <TabView.Item style={{ width: "100%" }}>
          <ScrollView
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 25,
              padding: 10,
            }}
          >
            <Text
              h1
              style={{
                color: "white",
              }}
            >
              All chats
            </Text>
            {chats.map((chat) => (
              <ChatCard chat={chat}></ChatCard>
            ))}
          </ScrollView>
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <ScrollView
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 25,
              padding: 10,
            }}
          >
            <Text
              h1
              style={{
                color: "white",
              }}
            >
              My chats
            </Text>
            {chats
              .filter((chat) => chat.createdBy === user.email)
              .map((chat) => (
                <ChatCard chat={chat}></ChatCard>
              ))}
          </ScrollView>
        </TabView.Item>
      </TabView>
      <Tab // Container for tab buttons
        value={pageIndex}
        onChange={(e) => setPageIndex(e)}
        iconPosition="left"
        indicatorStyle={{
          backgroundColor: "white",
          height: 3,
        }}
        containerStyle={{
          backgroundColor: "#131317",
        }}
        variant="primary"
      >
        <Tab.Item title="All chats" titleStyle={{ fontSize: 12 }} />
        <Tab.Item title="My chats" titleStyle={{ fontSize: 12 }} />
      </Tab>
    </View>
  );
};

export default Home;
