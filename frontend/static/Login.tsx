import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  View,
} from "react-native";
import { FC, SetStateAction, useState } from "react";
import { Button, Input } from "@rneui/base";
import { useDispatch } from "react-redux";
import { loginUser } from "../core/reducers/user";
import { auth, database } from "../core/firebase/firebase";
import { IUserState, RouteProps } from "../shared/types";
import { palette } from "../shared/palette";
import {
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import TextWithFont from "../shared/components/TextWithFont";
import { signInWithEmailAndPassword } from "firebase/auth";

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
    if (!email || !password) {
      Alert.alert("All fields must be filled in");
      return;
    }
    try {
      // Getting user from auth
      const { user: userFromAuth } = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Getting user data from firestore by user's from auth uid
      const userRef = doc(database, "users", userFromAuth.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData: IUserState = userSnap.data() as IUserState;
        dispatch(loginUser(userData));
      } else {
        console.log("No such document!");
      }
      setLoadingLogin(false);
    } catch (e: any) {
      Alert.alert("Error during login user: ", e.message);
      setLoadingLogin(false);
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
    <View // Outer container
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: palette.dark[700],
      }}
    >
      <ImageBackground
        source={require("../assets/background-image-login-signup.jpg")}
        resizeMode="cover"
        blurRadius={1}
        style={{
          flex: 1,
        }}
      >
        <View // Inner container
          style={{
            flex: 1,
            justifyContent: "center",
            // backgroundColor: palette.dark[900],
            alignItems: "center",
            padding: 10,
          }}
        >
          <TextWithFont
            styleProps={{
              fontSize: 30,
              color: "white",
            }}
          >
            Login
          </TextWithFont>
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
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.23,
              shadowRadius: 8.3,
              elevation: 10,
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
            <TextWithFont
              styleProps={{
                color: "white",
              }}
            >
              Don't have an account?
            </TextWithFont>
            <Button
              onPress={() => navigation.navigate("SignUp")}
              buttonStyle={{
                backgroundColor: "transparent",
              }}
            >
              <TextWithFont
                styleProps={{
                  color: palette.blue[100],
                }}
              >
                Sign Up
              </TextWithFont>
            </Button>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Login;
