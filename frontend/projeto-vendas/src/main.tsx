// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider as ChakraUIProvider } from "@chakra-ui/react";
import { AuthProvider } from "./auth";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraUIProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraUIProvider>
  </React.StrictMode>
);
