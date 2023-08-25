
import { useContext, useEffect } from "react";
import {Link} from "react-router-dom";
import { UserContext } from "./UserContext";
export default function Header(){
  // username is used to check that if a user is login then it pass the cookie to server then in that cookie i have username of that user 
  // so if we have username then it means user is login then we do not need to show register and login page then 
  // then we show logout and create new post
  // const[username,setUsername]=useState(null);

  // but ye ab nhi krenge kyunki ab hum usercontext ka use kr rhe h 
  const {setUserInfo,userInfo}=useContext(UserContext);
  const username=userInfo?.username;
    
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  async function logout() {
    await fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }



    return(

        <header>
        <Link to="/" className="Logo">MyBlog</Link>
          <nav>
          {username && (
            <>
              <Link to='/create'>Create New Post</Link>
              <a onClick={logout}>Logout</a>
            </>
          )}
          {!username && (
            <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            </>
          )}

          
          </nav>
        </header>
    );
}
