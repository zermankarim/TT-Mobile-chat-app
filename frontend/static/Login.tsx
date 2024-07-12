import {
  Alert,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInputChangeEventData,
  View,
} from "react-native";
import { FC, SetStateAction, useState } from "react";
import { Button, Input } from "@rneui/base";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import { loginUser } from "../core/reducers/user";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../core/firebase/firebase";
import { RouteProps } from "../shared/types";

const Login: FC<RouteProps> = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

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

  // const handleLoginBtnPress = () => {
  //   if (!email || !password) {
  //     if (!email) {
  //       setShowEmailError(true);
  //     }
  //     if (!password) {
  //       setShowPasswordError(true);
  //     }
  //     return;
  //   }

  //   dispatch(loginUser({ email, password }));
  // };

  const onHandleLogin = () => {
    if (email && password && email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => console.log("Login success!"))
        .catch((err) => Alert.alert("Login error", err.message));
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#1f1e26",
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
        // onPress={() => {
        //   dispatch(decrement());
        //   console.log(count);
        // }}
        // disabled={true}
        loading={false}
        loadingProps={{ size: "small", color: "white" }}
        buttonStyle={{
          backgroundColor: "#6f87ca",
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
            color: "#3576ee",
          }}
        >
          Sign Up
        </Text>
      </View>
    </View>
  );
};

export default Login;
