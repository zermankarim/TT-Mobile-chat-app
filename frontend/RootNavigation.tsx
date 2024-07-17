import { Alert, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./core/store/store";
import Login from "./static/Login";
import { FC } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import Home from "./static/Home";
import SignUp from "./static/SignUp";
import { signOut } from "firebase/auth";
import { auth } from "./core/firebase/firebase";
import { logoutUser } from "./core/reducers/user";
import {
  CreateChatScreenNavigationProp,
  IButtonsList,
  IUserState,
  ProfileScreenNavigationProp,
  RootStackParamList,
} from "./shared/types";
import Chat from "./static/Chat";
import { palette } from "./shared/palette";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheetComponent from "./shared/components/BottomSheet";
import CreateChat from "./static/CreateChat";
import Profile from "./static/Profile";
import { AntDesign } from "@expo/vector-icons";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1e26",
  },
});

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigation: FC = () => {
  const navigation = useNavigation<
    CreateChatScreenNavigationProp | ProfileScreenNavigationProp
  >();
  // Redux states and dispatch
  const user: IUserState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  // Functions
  const handleLogoutBtnPress = () => {
    signOut(auth)
      .then(() => {
        dispatch(logoutUser());
      })
      .catch((err) => Alert.alert("Error during log out: ", err.message));
  };

  // Buttons for menu
  const homeButtonsList: IButtonsList[] = [
    {
      title: "My profile",
      icon: (
        <FontAwesome
          name="user-circle-o"
          size={24}
          color={palette.light[600]}
        />
      ),
      onPress: () => navigation.navigate("Profile"),
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
  ];
  const profileButtonsList: IButtonsList[] = [
    {
      title: "Edit profile",
      icon: (
        <FontAwesome
          name="user-circle-o"
          size={24}
          color={palette.light[600]}
        />
      ),
      onPress: () => console.log("edit"),
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
  ];
  return (
    <>
      {user.email ? (
        <Stack.Navigator
          initialRouteName="Home" // Home page
        >
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerStyle: {
                backgroundColor: palette.dark[700],
              },
              headerTitleStyle: { color: "white", fontFamily: "cabin-regular" },
              headerRight: () => (
                <BottomSheetComponent
                  name="Home"
                  buttonsList={homeButtonsList}
                ></BottomSheetComponent>
              ),
            }}
          />

          <Stack.Screen // CreateChat page
            name="CreateChat"
            component={CreateChat}
            options={{
              headerStyle: {
                backgroundColor: palette.dark[700],
              },
              headerTitleStyle: { color: "white", fontFamily: "cabin-regular" },
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
                backgroundColor: palette.dark[700],
              },
              headerTitleStyle: { color: "white", fontFamily: "cabin-regular" },
              headerBackTitleStyle: { fontSize: 30 },
              headerTintColor: palette.dark[100],
              // headerTitle:
              //   user.email === senderEmail ? recipientEmail : senderEmail,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              headerStyle: {
                backgroundColor: palette.dark[700],
              },
              headerTitleStyle: { color: "white", fontFamily: "cabin-regular" },
              headerBackTitleStyle: { fontSize: 30 },
              headerTintColor: palette.dark[100],
              headerTitle: "My profile",
              headerRight: () => (
                <BottomSheetComponent
                  name="Profile"
                  icon={
                    <AntDesign
                      name="setting"
                      size={24}
                      color={palette.light[800]}
                    />
                  }
                  buttonsList={profileButtonsList}
                ></BottomSheetComponent>
              ),
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
                backgroundColor: palette.dark[700],
              },
              headerTitleStyle: { color: "white", fontFamily: "cabin-regular" },
            }}
          />
          <Stack.Screen // SignUp page
            name="SignUp"
            component={SignUp}
            options={{
              headerStyle: {
                backgroundColor: palette.dark[700],
              },
              headerTitleStyle: { color: "white", fontFamily: "cabin-regular" },
            }}
          />
        </Stack.Navigator>
      )}
    </>
  );
};

export default RootNavigation;
