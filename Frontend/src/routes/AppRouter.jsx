
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Verify from "../pages/Verify.jsx";
import NotFound from "../pages/NotFound.jsx";

import Events from "../pages/Dashboard/Events.jsx";
import AddEvent from "../pages/Dashboard/AddEvent.jsx";
import Student from "../pages/Student.jsx"

import EventDetails from "../pages/Dashboard/EventDetails.jsx";

const router = createBrowserRouter([
  // Public pages
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "events",
        element: <Events />,
      },
     
      {
        path: "verify",
        element: <Verify />,
      },
      {
        path:"student",
        element:<Student />,
      }
     
    ],
  },

  // Protected admin pages
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <DashboardLayout />,
        children: [
           {
        index: true,
        element: <Events />
      },
          {
            path: "events",
            element: <Events />,
          },
          {
            path: "events/new",
            element: <AddEvent />,
          },
          {
            path: "events/:id",
            element: <EventDetails />,
          },
        ],
      },
    ],
  },

  // 404
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;

