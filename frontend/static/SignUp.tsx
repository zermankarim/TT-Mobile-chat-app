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
import TextWithFont from "../shared/components/TextWithFont";

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
        backgroundColor: palette.dark[700],
      }}
    >
      <View // Inner container
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: palette.dark[900],
          alignItems: "center",
          padding: 10,
          borderTopLeftRadius: 250,
          borderBottomRightRadius: 250,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.23,
          shadowRadius: 8.3,

          elevation: 10,
        }}
      >
        <TextWithFont
          styleProps={{
            fontSize: 30,
            color: "white",
          }}
        >
          Create an account
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
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.23,
            shadowRadius: 8.3,
            elevation: 10,
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
            Already have an account?
          </TextWithFont>
          <Button
            onPress={() => navigation.navigate("Login")}
            buttonStyle={{
              backgroundColor: "transparent",
            }}
          >
            <TextWithFont
              styleProps={{
                color: palette.blue[300],
              }}
            >
              Log In
            </TextWithFont>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default SignUp;
