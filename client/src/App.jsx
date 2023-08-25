
import './App.css'

import Layout from './Layout';
import HomePage from './Pages/Home/HomePage';

import {Route,Routes} from "react-router-dom";
import LoginPage from './Pages/Login/LoginPage';
import RegisterPage from './Pages/Register/RegisterPage';

import CreatePost from './Pages/CreatePost/CreatePost.jsx';
import PostPage from './Pages/PostPage/PostPage';
import Editpage from './Pages/EditPage/editpage';

function App () {
  return (
    <Routes>
    
      <Route path={'/'} element={<Layout/>}>
     
      <Route index element ={ <HomePage/>} />
      
      <Route path={'/login'} element={<LoginPage/>}></Route>
      <Route path={'/register'} element={<RegisterPage/>}></Route>
      <Route path={'/create'} element={<CreatePost/>}></Route>
      <Route path={'/post/:id'} element={<PostPage/>}></Route>
      <Route path={'edit/:id'} element={<Editpage/>}></Route>
    </Route>
      
    </Routes>
   
  )
}

export default App
