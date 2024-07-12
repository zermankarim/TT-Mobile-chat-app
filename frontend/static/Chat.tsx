import { Button, Text } from "@rneui/base";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../core/reducers/user";
import { RootState } from "../core/store/store";
import { GiftedChat } from "react-native-gifted-chat";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

const Chat: FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleLogoutBtnPress = () => {
    dispatch(logoutUser());
  };
  return (
    <View style={styles.container}>
      <Text>CHAT PAGE</Text>
      <Button
        title="Log Out"
        onPress={handleLogoutBtnPress}
        // disabled={true}
        loading={false}
        loadingProps={{ size: "small", color: "white" }}
        buttonStyle={{
          backgroundColor: "#6f87ca",
          borderRadius: 5,
        }}
        titleStyle={{ fontWeight: "bold", fontSize: 23 }}
        containerStyle={{
          marginHorizontal: 50,
          height: 50,
          width: 200,
          marginVertical: 10,
        }}
      />
    </View>
  );
};

export default Chat;
