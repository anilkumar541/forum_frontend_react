import React, {createContext, useState} from "react";


// create the context
export const questionContext= createContext();

export const QuestionProvider= ({children}) => {
    const [questions, setQuestions]= useState([]); 

    return (
        <questionContext.Provider value={{questions, setQuestions}}>
            {children}
        </questionContext.Provider>
    )
}

