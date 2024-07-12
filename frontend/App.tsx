import { Provider } from "react-redux";
import { store } from "./core/store/store";
import { FC } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigation from "./RootNavigation";

const App: FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <RootNavigation></RootNavigation>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
