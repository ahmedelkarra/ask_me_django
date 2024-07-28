import { BrowserRouter, Route, Routes } from "react-router-dom"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Home from "./pages/Home"
import UserProfile from "./pages/UserProfile"
import { useEffect, useState } from "react"
import axios from "axios"
import IsChange from "./context/IsChange"
import IsUser from "./context/IsUser"
import ShowQuisitionsEach from "./pages/Quisitions"

export interface IUser {
  id: string;
  fName: string;
  lName: string;
  email: string;
  username: string;
}

export interface IQuisitions {
  id: string;
  title: string;
  body: string;
  author__first_name: string;
  author__last_name: string;
  author__username: string;
  created_at: string;
}

function App() {
  const [userInfo, SetUserInfo] = useState<IUser>({ id: '', fName: '', lName: '', email: '', username: '' })
  const [quisitions, SetQuisitions] = useState<IQuisitions[]>([])
  const [isUser, setIsUser] = useState<boolean>(false)
  const [isChange, setIsChange] = useState<boolean>(false)

  const handleUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      const data = response.data as { message: IUser };
      if (data.message) {
        SetUserInfo(data.message);
        setIsUser(true)
      }
    } catch (error: any) {
      SetUserInfo({ id: '', fName: '', lName: '', email: '', username: '' })
      setIsUser(false)
      console.error(error.response.data.message as string)
    }
  };

  const handleQuisitions = async () => {
    try {
      const response = await axios.get('/api/quisition/all/');
      const data = response.data as { message: IQuisitions[] };
      if (data.message) {
        SetQuisitions(data.message);
      }
    } catch (error: any) {
      SetQuisitions([])
      console.error(error.response.data.message as string)
    }
  }

  useEffect(() => {
    handleUser()
    handleQuisitions()
    setIsChange(false)
  }, [isChange])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <BrowserRouter>
        <IsChange.Provider value={{ isChange, setIsChange }}>
          <IsUser.Provider value={{ isUser, setIsUser }}>
            <Header isUser={isUser} userInfo={userInfo} />
            <Routes>
              <Route path="/" element={<Home quisitions={quisitions} />} />
              {isUser && <Route path="/profile" element={<UserProfile userInfo={userInfo} />} />}
              <Route path="/:id" element={<ShowQuisitionsEach quisitions={quisitions} userInfo={userInfo} />} />
            </Routes>
            <Footer />
          </IsUser.Provider>
        </IsChange.Provider>
      </BrowserRouter>
    </div>
  )
}

export default App
