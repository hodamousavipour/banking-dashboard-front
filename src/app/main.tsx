import ReactDOM from "react-dom/client";
import App from "./App";
import { worker } from "../mocks/browser";
import "../styles/index.css";
import "../styles/theme.css";

async function enableMocking() {
  // احتیاط: فقط توی مرورگر، نه مثلا هنگام تست Node
  if (typeof window === "undefined") return;

  await worker.start({
    onUnhandledRequest: "bypass",
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <App />
  );
});