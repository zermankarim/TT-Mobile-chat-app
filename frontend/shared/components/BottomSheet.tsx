import React, { useState } from "react";
import { BottomSheet, Button, ListItem } from "@rneui/themed";
import { View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { palette } from "../palette";
import { IBottomSheetComponentProps } from "../types";

const BottomSheetComponent: React.FunctionComponent<
  IBottomSheetComponentProps
> = ({ buttonsList, name, icon }) => {
  // States
  const [isVisible, setIsVisible] = useState<boolean>(false);

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
        {icon || (
          <Entypo
            name="dots-three-vertical"
            size={24}
            color={palette.light[800]}
          />
        )}
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
                  fontFamily: "cabin-regular",
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
