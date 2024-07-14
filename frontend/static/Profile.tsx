import { Text } from "@rneui/themed";
import { FC } from "react";
import { View } from "react-native";
import { palette } from "../shared/palette";

const Profile: FC = () => {
  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: palette.dark[700],
      }}
    >
      <Text
        style={{
          fontSize: 20,
          color: palette.light[800],
        }}
      >Profile Page!</Text>
    </View>
  );
};

export default Profile;
