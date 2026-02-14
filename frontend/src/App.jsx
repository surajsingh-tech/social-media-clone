import { useEffect } from 'react'
import './App.css'
import ChatPage from './components/ChatPage'
import EditProfile from './components/EditProfile'
import Home from './components/Home'
import Login from './components/Login'
import Mainlayout from './components/Mainlayout'
import Profile from './components/Profile'
import Signup from './components/Signup'
import { createBrowserRouter ,RouterProvider, useNavigate} from 'react-router-dom'
import {io} from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/sockitSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setNotification } from './redux/rtnSlice'
import ProtectedRoutes from './components/ProtectedRoutes'

const browserRouter=createBrowserRouter([
  {
    path:'/',
    element: <ProtectedRoutes> <Mainlayout/> </ProtectedRoutes> ,
    children:[
      {
       path:'/',
       element:<Home/> 
      },
      {
       path:'/profile/:id',
       element:<ProtectedRoutes> <Profile/> </ProtectedRoutes>
      },
       {
       path:'/account/edit',
       element:<ProtectedRoutes> <EditProfile/>  </ProtectedRoutes>
      },
      {
         path:'/chat',
         element:<ProtectedRoutes> <ChatPage/> </ProtectedRoutes>
      }
    ] 
  }, 
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<Signup/>
  },

])
function App() {
  const dispatch = useDispatch()
  const {socket} = useSelector(store => store.socketio)
  const {user} = useSelector(store=>store.auth)
  useEffect(()=>{
    if(user)
    {
      const socketio = io('http://localhost:8000',{
        query:{
          userId:user?._id
        },
        transports:['websocket']
      });
      dispatch(setSocket(socketio))
      //Listen all the events
      socketio.on('getOnlineUsers',(onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers))
      });

      socketio.on('notification',(notification)=>{
        dispatch(setNotification(notification))
      })

      return ()=>{
         socketio.close()
         dispatch(setSocket(null))
      }
    }
    else if(socket){
       socket?.close()
         dispatch(setSocket(null))
    }
  },[user , dispatch]) 

 
  return (
    <> 
    <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
