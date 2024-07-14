import {
  ActivityIndicator,
  Alert,
  NativeSyntheticEvent,
  Text,
  TextInputChangeEventData,
  View,
} from "react-native";
import { FC, SetStateAction, useState } from "react";
import { Button, Input } from "@rneui/base";
import { useDispatch } from "react-redux";
import { loginUser } from "../core/reducers/user";
import { database } from "../core/firebase/firebase";
import { IUserState, RouteProps } from "../shared/types";
import { palette } from "../shared/palette";
import { and, collection, getDocs, query, where } from "firebase/firestore";

const Login: FC<RouteProps> = ({ navigation }) => {
  // Redux states and dispatch
  const dispatch = useDispatch();

  // States
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [showEmailError, setShowEmailError] =
    useState<SetStateAction<boolean>>(false);
  const [showPasswordError, setShowPasswordError] =
    useState<SetStateAction<boolean>>(false);

  const handleLoginChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    if (!e.nativeEvent.text) {
      setShowEmailError(true);
    }
    if (e.nativeEvent.text) {
      setShowEmailError(false);
    }
    setEmail(e.nativeEvent.text);
  };

  const handlePasswordChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    if (!e.nativeEvent.text) {
      setShowPasswordError(true);
    }
    if (e.nativeEvent.text) {
      setShowPasswordError(false);
    }
    setPassword(e.nativeEvent.text);
  };

  const onHandleLogin = async () => {
    setLoadingLogin(true);
    if (email && password && email !== "" && password !== "") {
      const q = query(
        collection(database, "users"),
        and(
          where("general.email", "==", email.toLocaleLowerCase()),
          where("secret.password", "==", password)
        )
      );

      try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          Alert.alert("Wrong email or password.");
          console.log(email.toLocaleLowerCase());
          setLoadingLogin(false);
          return;
        } else {
          const userDoc: IUserState =
            querySnapshot.docs[0].data() as IUserState;
          dispatch(loginUser(userDoc));
          console.log("Success Login!");
          setLoadingLogin(false);
        }
      } catch (error: any) {
        Alert.alert("Error dureng finding user: ", error.message);
        setLoadingLogin(false);
      }
    }
  };

  if (loadingLogin) {
    return (
      <ActivityIndicator
        size={"large"}
        color={palette.light[100]}
        style={{
          flex: 1,
          backgroundColor: palette.dark[700],
        }}
      ></ActivityIndicator>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: palette.dark[700],
        alignItems: "center",
        padding: 10,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          color: "white",
        }}
      >
        Login
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 20,
          width: "100%",
        }}
      >
        <Input
          placeholder="Login"
          onChange={handleLoginChange}
          errorStyle={{ color: "red" }}
          style={{
            color: "white",
          }}
          errorMessage={
            !email && showEmailError ? "This field must be fill" : ""
          }
        ></Input>
        <Input
          placeholder="Password"
          onChange={handlePasswordChange}
          errorStyle={{ color: "red" }}
          style={{
            color: "white",
          }}
          secureTextEntry={true}
          errorMessage={
            !password && showPasswordError ? "This field must be fill" : ""
          }
        ></Input>
      </View>

      <Button
        title="Log in"
        onPress={onHandleLogin}
        loading={false}
        loadingProps={{ size: "small", color: "white" }}
        buttonStyle={{
          backgroundColor: palette.blue[200],
          borderRadius: 5,
          width: "100%",
        }}
        titleStyle={{ fontWeight: "bold", fontSize: 16 }}
        containerStyle={{
          marginHorizontal: 50,
          height: 50,
          marginVertical: 10,
          width: "100%",
        }}
      />
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: 8,
          width: "100%",
        }}
      >
        <Text
          style={{
            color: "white",
          }}
        >
          Don't have an account?
        </Text>
        <Text
          onPress={() => navigation.navigate("SignUp")}
          style={{
            color: palette.blue[300],
          }}
        >
          Sign Up
        </Text>
      </View>
    </View>
  );
};

export default Login;
