import React, { useEffect, useState } from "react";
import { SearchBar } from "@rneui/themed";
import { View, Text, StyleSheet, Alert } from "react-native";
import { getAuth } from "firebase/auth";
import { and, collection, getDocs, or, query, where } from "firebase/firestore";
import { database } from "../../core/firebase/firebase";
import { IUserState } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../../core/store/store";

type SearchBarComponentProps = {
  setUsersEmails: React.Dispatch<React.SetStateAction<string[]>>;
  setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchBarComponent: React.FunctionComponent<SearchBarComponentProps> = ({
  setUsersEmails,
  setSearchLoading,
}) => {
  // Redux states
  const user = useSelector((state: RootState) => state.user);

  // States
  const [search, setSearch] = useState("");

  // Functions
  const updateSearch = async (search: any) => {
    setSearchLoading(true);
    setSearch(search);
    const q = query(
      collection(database, "users"),
      and(
        or(
          where("general.email", ">", search),
          where("general.email", "==", search)
        ),
        where("general.email", "!=", user.general.email)
      )
    );

    try {
      const newUsersEmails: string[] = [];
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const userData:IUserState = doc.data() as IUserState;
          newUsersEmails.push(userData.general.email!);
        });

        setUsersEmails(newUsersEmails);
        setSearchLoading(false);
      }
    } catch (error: any) {
      Alert.alert("Error dureng finding user: ", error.message);
      setSearchLoading(false);
    }
  };

  return (
    <View>
      <SearchBar
        placeholder="Search by email.."
        onChangeText={updateSearch}
        value={search}
      />
    </View>
  );
};

export default SearchBarComponent;
