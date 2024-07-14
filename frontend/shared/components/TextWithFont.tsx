import { Text } from "@rneui/themed";
import { FC } from "react";
import { TextStyle } from "react-native";

type MyAppTextProps = {
  children: string;
  styleProps?: TextStyle;
  numberOfLines?: number;
};

const TextWithFont: FC<MyAppTextProps> = ({
  children,
  styleProps,
  numberOfLines,
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={{
        fontFamily: "cabin-regular",
        ...styleProps,
      }}
    >
      {children}
    </Text>
  );
};

export default TextWithFont;
