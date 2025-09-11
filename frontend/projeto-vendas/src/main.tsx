import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { ChakraProvider as ChakraUIProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./auth";
import React from "react";
import App from "./App";
import "./css/theme.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraUIProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraUIProvider>
  </React.StrictMode>
);
