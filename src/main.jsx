import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'
import App from './App.jsx'
import Error from './components/error/Error.jsx';
import Home from "./components/home/Home.jsx"
import QuestionDetail from './components/questionDetail/QuestionDetail.jsx';
import Signup from './components/signup/Signup.jsx';
import Login from './components/login/Login.jsx';
import CreateQuestion from './components/create_question/CreateQuestion.jsx';
import CreateTag from './components/create_tag/CreateTag.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,

    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/signup",
        element: <Signup />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/question/:questionId",
        element: <QuestionDetail />
      },
      {
        path: "/create-question",
        element: <CreateQuestion />
      },
      {
        path: "/create-tag",
        element: <CreateTag />
      },
    ]
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router= {router} />
  </StrictMode>,
)
