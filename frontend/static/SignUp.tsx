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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../core/firebase/firebase";
import { IUserState, RouteProps } from "../shared/types";
import { palette } from "../shared/palette";
import { getDatabase, push, ref, set } from "firebase/database";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

const SignUp: FC<RouteProps> = ({ navigation }) => {
  // Redux dispatch
  const dispatch = useDispatch();

  // States
  const [loadingSignUp, setLoadingSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [showEmailError, setShowEmailError] =
    useState<SetStateAction<boolean>>(false);
  const [showPasswordError, setShowPasswordError] =
    useState<SetStateAction<boolean>>(false);

  // Functions
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

  const onHandleSignUp = async () => {
    setLoadingSignUp(true);
    if (email && password && email !== "" && password !== "") {
      const q = query(
        collection(database, "users"),
        where("email", "==", email)
      );

      try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            Alert.alert("User already registered!");
          });
          return;
        } else {
          const newUser: IUserState = {
            general: {
              name: null,
              surname: null,
              dateOfBirth: null,
              email: email.toLocaleLowerCase(),
            },
            images: {
              backgroundURL: null,
              avatar: null,
            },
            socialContacts: {
              friends: [],
            },
            secret: {
              password,
            },
          };
          await addDoc(collection(database, "users"), newUser);
          dispatch(loginUser(newUser));
          setLoadingSignUp(false);

          console.log("Success SignUp!");
        }
      } catch (error: any) {
        Alert.alert("Error dureng finding user: ", error.message);
        setLoadingSignUp(false);
      }
    }
  };

  if (loadingSignUp) {
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
    <View // Container for SignUp page
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
        Create an account
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
        title="Sign Up"
        onPress={onHandleSignUp}
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
          Already have an account?
        </Text>
        <Text
          onPress={() => navigation.navigate("Login")}
          style={{
            color: palette.blue[300],
          }}
        >
          Log In
        </Text>
      </View>
    </View>
  );
};

export default SignUp;
