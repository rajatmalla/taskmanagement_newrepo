import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import store from "./redux/store";

import "./index.css";

// Create router with future flags
const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider 
        router={router}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
          v7_normalizeFormMethod: true
        }}
      />
    </React.StrictMode>
  </Provider>
);