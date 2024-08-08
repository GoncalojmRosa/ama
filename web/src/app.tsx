import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateRoom from "./pages/create-room";
import { Room } from "./pages/room";
import { Toaster } from "sonner";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateRoom />,
  },
  {
    path: "/room/:roomId",
    element: <Room />,
  },
]);

export default function App() {
  return (
    <>
      <Toaster invert richColors />
      <RouterProvider router={router} />
    </>
  );
}
