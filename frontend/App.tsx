import { Provider } from "react-redux";
import { store } from "./core/store/store";
import { FC, useCallback, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigation from "./RootNavigation";
import { palette } from "./shared/palette";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

const App: FC = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "cabin-regular": require("./assets/fonts/Cabin-Regular.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider
        onLayout={onLayoutRootView}
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
