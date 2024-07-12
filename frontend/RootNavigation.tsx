import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "./core/store/store";
import Login from "./static/Login";
import { FC } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Chat from "./static/Chat";
import SignUp from "./static/SignUp";
// import { NavigationParams, NavigationScreenProp } from "react-navigation";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1e26",
  },
});

const Stack = createNativeStackNavigator();

const RootNavigation: FC = () => {
  const user = useSelector((state: RootState) => state.user);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            headerStyle: {
              backgroundColor: "#131317",
            },
            headerTitleStyle: { color: "white" },
          }}
        />

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
        <Stack.Screen
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
    </NavigationContainer>
  );
};

export default RootNavigation;
