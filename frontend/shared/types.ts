import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export interface ICounterState {
  value: number;
}

export interface IUserState {
  email: string | null;
  password: string | null;
}

export interface ILoginInputsState {
  login: string | null;
  password: string | null;
}

type RootStackParamList = {
  Chat: undefined;
  Login: undefined;
  SignUp: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

export type RouteProps = {
  navigation: LoginScreenNavigationProp;
};
