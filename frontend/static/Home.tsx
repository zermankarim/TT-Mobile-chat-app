import { FC, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import { IChatClient, IChatDB, IUserState, RouteProps } from "../shared/types";
import { Tab, TabView } from "@rneui/base";
import ChatCard from "../shared/components/ChatCard";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { database } from "../core/firebase/firebase";
import { setChats } from "../core/reducers/chats";
import { palette } from "../shared/palette";
import SearchBarComponent from "../shared/components/SearchBar";
import TextWithFont from "../shared/components/TextWithFont";
import uuid from "react-native-uuid";

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
  const [selectedChats, setSelectedChats] = useState<IChatClient[]>([]);

  // Effects
  useEffect(() => {
    // Get all chat and push to a state
    const updateChats = async () => {
      const q = query(
        collection(database, "chats"),
        where("participants", "array-contains", user.uid)
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const newChats: IChatClient[] = [];
        for (const doc of snapshot.docs) {
          const chatDataFromDB: IChatDB = doc.data() as IChatDB;
          const { participants } = chatDataFromDB;
          const q = query(
            collection(database, "users"),
            where("uid", "in", participants)
          );
          const querySnapshot = await getDocs(q);
          const usersData: IUserState[] = querySnapshot.docs.map((doc) =>
            doc.data()
          ) as IUserState[];

          const chatForClient: IChatClient = {
            ...chatDataFromDB,
            participants: usersData,
          };
          newChats.push(chatForClient);
        }
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
    try {
      if (searchReq) {
        const filteredChats = chats.filter((chat) =>
          chat.participants.some((participant) =>
            participant.email?.includes(searchReq.toLocaleLowerCase())
          )
        );
        dispatch(setChats(filteredChats));
      }
      setSearchLoading(false);
    } catch (error: any) {
      Alert.alert("Error during finding user: ", error.message);
      console.error("Error during finding user: ", error.message);
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
        <Tab.Item title="My chats" titleStyle={{ fontSize: 14 }} />
        <Tab.Item title="All chats" titleStyle={{ fontSize: 14 }} />
      </Tab>
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
                <TextWithFont
                  styleProps={{
                    fontSize: 16,
                    color: palette.light[300],
                  }}
                >
                  My chats
                </TextWithFont>
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
                  <ChatCard
                    key={uuid.v4() + "-chatCard"}
                    chat={chat}
                  ></ChatCard>
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
                <TextWithFont
                  styleProps={{
                    fontSize: 16,
                    color: palette.light[300],
                  }}
                >
                  All chats
                </TextWithFont>
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
                  <ChatCard
                    key={uuid.v4() + "-chatCard"}
                    chat={chat}
                  ></ChatCard>
                ))
              )}
            </ScrollView>
          </View>
        </TabView.Item>
      </TabView>
    </View>
  );
};

export default Home;
