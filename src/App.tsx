import AppRouter from "@/app/router/AppRouter";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" />
    </>
  );
}
