import { Text } from "@rneui/themed";
import { FC } from "react";
import { ScrollView, View } from "react-native";
import { palette } from "../shared/palette";
import { Avatar } from "@rneui/base";
import { useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import TextWithFont from "../shared/components/TextWithFont";

const Profile: FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const { general, socialContacts } = user;
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: palette.dark[900],
        minHeight: "100%",
      }}
    >
      <Avatar
        size={200}
        rounded
        source={{ uri: user.images.avatar! }}
        title={user.general.surname![0] + " " + user.general.name![0]}
        containerStyle={{
          position: "absolute",
          top: 100,
          margin: "auto",
          backgroundColor: palette.dark[500],
          zIndex: 1,
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
      <ScrollView
        style={{
          marginTop: 200,
          width: "150%",
          backgroundColor: palette.dark[700],
          minHeight: "100%",
          borderTopLeftRadius: 250,
          borderTopRightRadius: 250,
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
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginTop: 100,
          }}
        >
          <TextWithFont
            styleProps={{
              fontSize: 32,
              color: palette.light[800],
            }}
          >
            {user.general.surname + " " + user.general.name}
          </TextWithFont>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
