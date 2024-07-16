import React from "react";
import { SearchBar } from "@rneui/themed";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../core/store/store";
import { palette } from "../palette";

type SearchBarComponentProps = {
  updateSearchFunction: (search: any) => Promise<void>;
  search: string;
};

const SearchBarComponent: React.FunctionComponent<SearchBarComponentProps> = ({
  updateSearchFunction,
  search,
}) => {
  // Redux states
  const user = useSelector((state: RootState) => state.user);

  return (
    <View>
      <SearchBar
        placeholder="Search by email.."
        onChangeText={updateSearchFunction}
        value={search}
        containerStyle={{
          borderBottomRightRadius: 24,
          borderBottomLeftRadius: 24,
          backgroundColor: palette.dark[600],
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.39,
          shadowRadius: 8.3,

          elevation: 13,
        }}
        inputContainerStyle={{
          borderRadius: 12,
          backgroundColor: palette.dark[400],
        }}
      />
    </View>
  );
};

export default SearchBarComponent;
