import React, { useState } from "react";
import { BottomSheet, Button, ListItem } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { palette } from "../palette";
import { IBottomSheetComponentProps } from "../types";

const BottomSheetComponent: React.FunctionComponent<
  IBottomSheetComponentProps
> = ({ buttonsList }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View>
      <Button
        title="Open Bottom Sheet"
        onPress={() => setIsVisible(true)}
        buttonStyle={{
          backgroundColor: "transparent",
          borderRadius: 50,
          width: 48,
        }}
        titleStyle={{ fontWeight: "bold", fontSize: 14 }}
        containerStyle={{
          marginVertical: 10,
        }}
      >
        <Entypo
          name="dots-three-vertical"
          size={24}
          color={palette.light[800]}
        />
      </Button>
      <BottomSheet
        modalProps={{}}
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
      >
        {buttonsList.map((l, i) => (
          <ListItem
            key={i}
            containerStyle={{
              backgroundColor: palette.dark[600],
              borderLeftWidth: 1,
              borderTopWidth: 1,
              borderRightWidth: 1,
              borderColor: palette.dark[200],
            }}
            onPress={() => {
              l.onPress();
              setIsVisible(false);
            }}
          >
            <ListItem.Content
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              {l.icon && l.icon}
              <ListItem.Title
                style={{
                  color: palette.light[800],
                }}
              >
                {l.title}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
    </View>
  );
};

export default BottomSheetComponent;
