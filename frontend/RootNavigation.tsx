import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./core/store/store";
import Login from "./static/Login";
import { FC, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import Home from "./static/Home";
import SignUp from "./static/SignUp";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./core/firebase/firebase";
import { loginUser, logoutUser } from "./core/reducers/user";
import {
  CreateChatScreenNavigationProp,
  IButtonsList,
  IChat,
  IUserState,
  RootStackParamList,
} from "./shared/types";
import Chat from "./static/Chat";
import { palette } from "./shared/palette";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheetComponent from "./shared/components/BottomSheet";
import CreateChat from "./static/CreateChat";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1e26",
  },
});

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigation: FC = () => {
  const navigation = useNavigation<CreateChatScreenNavigationProp>();
  // Redux states and dispatch
  const user: IUserState = useSelector((state: RootState) => state.user);
  const { senderEmail, recipientEmail }: IChat = useSelector(
    (state: RootState) => state.currentChat
  );
  const dispatch = useDispatch();

  // States
  // const [loading, setLoading] = useState<boolean>(false);

  // Functions
  const handleLogoutBtnPress = () => {
    signOut(auth)
      .then(() => {
        dispatch(logoutUser());
      })
      .catch((err) => Alert.alert("Error during log out: ", err.message));
  };

  // Buttons for menu
  const buttonsList: IButtonsList[] = [
    {
      title: "My profile",
      icon: (
        <FontAwesome
          name="user-circle-o"
          size={24}
          color={palette.light[600]}
        />
      ),
      onPress: () => navigation.navigate("CreateChat"),
    },
    {
      title: "Create a new chat",
      icon: <Ionicons name="create" size={24} color={palette.light[800]} />,
      onPress: () => navigation.navigate("CreateChat"),
    },
    {
      title: "Log Out",
      icon: (
        <MaterialCommunityIcons
          name="logout"
          size={24}
          color={palette.light[800]}
        />
      ),
      onPress: () => handleLogoutBtnPress(),
    },
    {
      title: "Cancel",
      icon: null,
      onPress: () => {},
    },
  ];
  return (
    <>
      {user.general.email ? (
        <Stack.Navigator
          initialRouteName="Home" // Home page
        >
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerStyle: {
                backgroundColor: palette.dark[1000],
              },
              headerTitleStyle: { color: "white" },
              headerRight: () => (
                <BottomSheetComponent
                  buttonsList={buttonsList}
                ></BottomSheetComponent>
              ),
            }}
          />

          <Stack.Screen // CreateChat page
            name="CreateChat"
            component={CreateChat}
            options={{
              headerStyle: {
                backgroundColor: palette.dark[1000],
              },
              headerTitleStyle: { color: "white" },
              headerTitle: "Create a new chat",
              headerBackTitleStyle: { fontSize: 30 },
              headerTintColor: palette.dark[100],
            }}
          />

          <Stack.Screen // Chat page
            name="Chat"
            component={Chat}
            options={{
              headerStyle: {
                backgroundColor: palette.dark[1000],
              },
              headerTitleStyle: { color: "white" },
              headerBackTitleStyle: { fontSize: 30 },
              headerTintColor: palette.dark[100],
              headerTitle:
                user.general.email === senderEmail
                  ? recipientEmail
                  : senderEmail,
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator // Login page
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerStyle: {
                backgroundColor: "#131317",
              },
              headerTitleStyle: { color: "white" },
            }}
          />
          <Stack.Screen // SignUp page
            name="SignUp"
            component={SignUp}
            options={{
              headerStyle: {
                backgroundColor: "#131317",
              },
              headerTitleStyle: { color: "white" },
            }}
          />
        </Stack.Navigator>
      )}
    </>
  );
};

export default RootNavigation;
