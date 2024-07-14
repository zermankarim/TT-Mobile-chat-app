import React, { useEffect, useState } from "react";
import { SearchBar } from "@rneui/themed";
import { View, Text, StyleSheet, Alert } from "react-native";
import { getAuth } from "firebase/auth";
import { and, collection, getDocs, or, query, where } from "firebase/firestore";
import { database } from "../../core/firebase/firebase";
import { IUserState } from "../types";
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
        }}
        inputContainerStyle={{
         borderRadius: 12,
        }}
      />
    </View>
  );
};

export default SearchBarComponent;
