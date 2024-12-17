import { Outlet } from "react-router-dom";
import { useLayoutEffect } from 'react';
import Navbar from "./components/navbar/Navbar"
import { AuthProvider } from "./components/context/auth/AuthContext";
import { QuestionProvider } from "./components/context/question_context/Question";
import { cache } from "react";


function App() {
  useLayoutEffect(() => {
    // Ensure body has scroll
    document.body.style.overflowY = 'scroll';
  }, []);

  return (
    
      <AuthProvider>
        <QuestionProvider>
          <Navbar />
          <Outlet />
        </QuestionProvider>
      </AuthProvider>
  )
}

export default App;

