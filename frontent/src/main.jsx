import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SnackbarProvider } from "../context/SnackbarContext.jsx";
import GlobalSnackbar from "./Components/GlobalSnackbar.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <BrowserRouter>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        </BrowserRouter>
        <GlobalSnackbar />
      </SnackbarProvider>
      {/* <ReactQueryDevtools position="bottom-right" /> */}
    </QueryClientProvider>
  </Provider>,
);
