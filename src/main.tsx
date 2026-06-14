import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NuqsAdapter } from "nuqs/adapters/react";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { persistor } from "./app/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleSignInProvider } from "./components/google-signin-button.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleSignInProvider>
          <NuqsAdapter>
            <App />
          </NuqsAdapter>
          <Toaster
            position="top-center"
            expand={true}
            duration={5000}
            richColors
            closeButton
          />
        </GoogleSignInProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
