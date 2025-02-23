import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import AppRouter from "./routes/AppRouter";
import { PrivyProvider } from "@privy-io/react-auth";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <PrivyProvider
        appId="cm7fv0uef00p85apk3jxe98qw"
        config={{
          appearance: { theme: "dark" },
          loginMethods: ["email"],
          embeddedWallets: { ethereum: { createOnLogin: "off" } },
        }}
      >
        <AppRouter />
      </PrivyProvider>
    </ReactQueryProvider>
  </StrictMode>
);
