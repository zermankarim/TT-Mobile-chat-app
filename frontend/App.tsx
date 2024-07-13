import { Provider } from "react-redux";
import { store } from "./core/store/store";
import { FC } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigation from "./RootNavigation";
import { palette } from "./shared/palette";
import { NavigationContainer } from "@react-navigation/native";

const App: FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider
        style={{
          backgroundColor: palette.dark[700],
        }}
      >
        <NavigationContainer>
          <RootNavigation></RootNavigation>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
