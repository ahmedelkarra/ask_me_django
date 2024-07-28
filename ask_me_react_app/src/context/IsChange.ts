import { createContext, Dispatch, SetStateAction } from "react";


const IsChange = createContext<
    {
        isChange: boolean,
        setIsChange: Dispatch<SetStateAction<boolean>>
    } | undefined>(undefined)


export default IsChange