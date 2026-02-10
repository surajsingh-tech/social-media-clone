import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import Mainlayout from './components/Mainlayout'
import Profile from './components/Profile'
import Signup from './components/Signup'
import { createBrowserRouter ,RouterProvider} from 'react-router-dom'

const browserRouter=createBrowserRouter([
  {
    path:'/',
    element:<Mainlayout/>,
    children:[
      {
       path:'/',
       element:<Home/> 
      },
      {
       path:'/profile',
       element:<Profile/> 
      },
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
  return (
    <>
    <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
