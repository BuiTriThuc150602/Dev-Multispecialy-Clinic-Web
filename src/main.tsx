import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider  client={queryClient}>
    <RecoilRoot>
      <App />
    </RecoilRoot>
    </QueryClientProvider>
  </StrictMode>
);
