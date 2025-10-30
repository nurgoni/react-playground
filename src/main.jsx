import React from "react"
import { StrictMode } from 'react'
import { createRoot, ReactDOM } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import './index.css'
import App from './App.jsx'
import UsersList from "./pages/UsersList.jsx"
import CreateUser from "./pages/CreateUser.jsx"
import EditUser from "./pages/EditUser.jsx"


const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {index: true, element: <UsersList/>},
            {path: "users/new", element: <CreateUser/>},
            {path: "users/:id/edit", element: <EditUser/>}
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>,
);
