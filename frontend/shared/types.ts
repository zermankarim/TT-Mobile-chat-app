import { StackNavigationProp } from "@react-navigation/stack";

export interface ICounterState {
  value: number;
}

export interface IUserState {
  general: {
    name: string | null;
    surname: string | null;
    dateOfBirth: string | null;
    email: string | null;
  };
  images: {
    avatar: string | null;
  };
  socialContacts: {
    friends: string[];
  };
  secret: {
    password: string | null;
  };
}

export interface ILoginInputsState {
  login: string | null;
  password: string | null;
}

export type RootStackParamList = {
  Chat: undefined;
  Home: undefined;
  Login: undefined;
  SignUp: undefined;
  CreateChat: undefined;
  Profile: undefined;
};

export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;
export type ChatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Chat"
>;
export type CreateChatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CreateChat"
>;
export type SignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignUp"
>;
export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

export type RouteProps = {
  navigation: LoginScreenNavigationProp;
};

export type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Profile"
>;

export interface IChat {
  _id: string;
  createdAt: string;
  createdBy: string;
  messages: IMessage[];
  senderEmail: string;
  recipientEmail: string;
}

export interface IMessage {
  _id: string;
  createdAt: string;
  text: string;
  senderEmail: string;
  recipientEmail: string;
}

export interface IButtonsList {
  title: string;
  icon: React.ReactNode | null;
  onPress: () => void;
}

export interface IBottomSheetComponentProps {
  buttonsList: IButtonsList[];
  name: string;
  icon?: React.ReactNode;
}

export interface IPalette {
  dark: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    1000: string;
  };
  light: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    1000: string;
  };
  blue: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
  };
}
