import { FC, useState } from "react";
import { View } from "react-native";
import { ChatScreenNavigationProp, IChat, IUserState } from "../types";
import { Avatar, Button } from "@rneui/base";
import uuid from "react-native-uuid";
import TextWithFont from "./TextWithFont";
import { palette } from "../palette";
import { addDoc, collection } from "firebase/firestore";
import { database } from "../../core/firebase/firebase";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentChat } from "../../core/reducers/currentChat";
import { RootState } from "../../core/store/store";

type UserCardInSearchProps = {
  userForChat: IUserState;
};

const UserCardInSearch: FC<UserCardInSearchProps> = ({ userForChat }) => {
  // Redux states and dispatch
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  // Navigation
  const navigation = useNavigation<ChatScreenNavigationProp>();

  const handleCreateChatWithUser = async () => {
    const newChat: IChat = {
      createdAt: new Date().toISOString(),
      createdBy: user.uid!,
      messages: [],
      parcipients: [user.uid!, userForChat.uid!],
    };
    await addDoc(collection(database, "chats"), newChat);
    navigation.navigate("Chat");
    dispatch(setCurrentChat(newChat));
    console.log("Created a new chat: ", newChat);
  };
  return (
    <View>
      <Button
        key={uuid.v4() + "-userContainer"}
        onPress={() => handleCreateChatWithUser()}
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
        <Avatar
          size={42}
          rounded
          source={userForChat.avatar ? { uri: userForChat.avatar } : undefined}
          title={userForChat.firstName![0] + " " + userForChat.lastName![0]}
          containerStyle={{
            backgroundColor: palette.dark[100],
          }}
        ></Avatar>
        <TextWithFont
          styleProps={{
            color: palette.light[800],
            fontSize: 16,
            flex: 1,
            marginLeft: 12,
          }}
        >
          {userForChat.firstName + " " + userForChat.lastName}
        </TextWithFont>
      </Button>
    </View>
  );
};

export default UserCardInSearch;
