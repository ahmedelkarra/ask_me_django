import { createContext, Dispatch, SetStateAction } from "react";


const IsUser = createContext<
    {
        isUser: boolean,
        setIsUser: Dispatch<SetStateAction<boolean>>
    } | undefined>(undefined)


export default IsUser