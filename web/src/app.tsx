import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import CreateRoom from "./pages/create-room";
import { Room } from "./pages/room";
import { queryClient } from "./lib/react-query";

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
    <QueryClientProvider client={queryClient}>
      <Toaster invert richColors />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
