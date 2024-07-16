import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  View,
} from "react-native";
import { FC, SetStateAction, useEffect, useState } from "react";
import { Button, Input } from "@rneui/base";
import { useDispatch } from "react-redux";
import { loginUser } from "../core/reducers/user";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../core/firebase/firebase";
import { IUserState, RouteProps } from "../shared/types";
import { palette } from "../shared/palette";
import { getDatabase, push, ref, set } from "firebase/database";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import TextWithFont from "../shared/components/TextWithFont";

const SignUp: FC<RouteProps> = ({ navigation }) => {
  // Redux dispatch
  const dispatch = useDispatch();

  // States
  const [loadingSignUp, setLoadingSignUp] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const [showEmailError, setShowEmailError] =
    useState<SetStateAction<boolean>>(false);
  const [showPasswordError, setShowPasswordError] =
    useState<SetStateAction<boolean>>(false);

  useEffect(() => {
    setShowEmailError(!email);
    setShowPasswordError(!password);
  }, [firstName, lastName, email, password]);

  // Functions
  const handleLoginChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    setEmail(e.nativeEvent.text);
  };

  const handleInputChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>,
    setNewText: (text: string) => void
  ) => {
    setNewText(e.nativeEvent.text);
  };

  const onHandleSignUp = async () => {
    setLoadingSignUp(true);

    try {
      if (!email || !password || !firstName || !lastName) {
        Alert.alert("All fields must be filled in");
        setLoadingSignUp(false);
        return;
      }
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUserState: IUserState = {
        uid: user.uid,
        firstName,
        lastName,
        dateOfBirth: null,
        email: email.toLocaleLowerCase(),
        avatar: null,
        friends: [],
      };
      await setDoc(doc(database, "users", user.uid), newUserState);
      dispatch(loginUser(newUserState));
      setLoadingSignUp(false);
    } catch (e: any) {
      Alert.alert("Error during create user: ", e.message);
      setLoadingSignUp(false);
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
    <View // Outer container for SignUp page
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
            Create an account
          </TextWithFont>
          <View // Container for all inputs
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 20,
              width: "100%",
            }}
          >
            <View // Container for inputs names
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 12,
                width: "100%",
              }}
            >
              <Input
                placeholder="First name*"
                errorStyle={{ color: "red" }}
                containerStyle={{
                  flex: 1,
                }}
                style={{
                  color: "white",
                }}
                errorMessage={
                  !email && showEmailError ? "This field must be fill" : ""
                }
                onChange={(e) => handleInputChange(e, setFirstName)}
              ></Input>
              <Input
                placeholder="Last name*"
                onChange={(e) => handleInputChange(e, setLastName)}
                errorStyle={{ color: "red" }}
                containerStyle={{
                  flex: 1,
                }}
                style={{
                  flex: 1,
                  color: "white",
                }}
                errorMessage={
                  !email && showEmailError ? "This field must be fill" : ""
                }
              ></Input>
            </View>
            <Input
              placeholder="Email*"
              onChange={(e) => handleInputChange(e, setEmail)}
              errorStyle={{ color: "red" }}
              style={{
                color: "white",
              }}
              errorMessage={
                !email && showEmailError ? "This field must be fill" : ""
              }
            ></Input>
            <Input
              placeholder="Password*"
              onChange={(e) => handleInputChange(e, setPassword)}
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
                  color: palette.blue[100],
                }}
              >
                Log In
              </TextWithFont>
            </Button>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SignUp;
