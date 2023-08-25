
import { useState } from 'react';
import { Navigate } from "react-router-dom";
import '../Login/LoginPage.css'
export default function RegisterPage(){

const[username,setUsername]=useState('');
const[password,setPassword]=useState('');
const[redirect,setRedirect]=useState(false);

 async function register(ev){
   ev.preventDefault();
  const response= await fetch('http://localhost:4000/register',{
    method:'Post',body:JSON.stringify({username,password}),
    headers:{'Content-Type':'application/json'},
   });
console.log(response);
   if(response.status===200){
    alert('Registration is successful');
    setRedirect(true);
   }else{
    
    alert('Registration failed');
   }

}
if(redirect){
    return <Navigate to={'/login'} />
}
    return(
        <div className="Registerbox">
        <form className="register" onSubmit={register}>
       
        <h1>Register</h1>
            <input type='text' placeholder="Enter your Username" value={username} onChange={ev=>setUsername(ev.target.value)} ></input>
            
            <input type='text' placeholder="Enter your Password" value={password} onChange={ev => setPassword(ev.target.value)}></input>
            <button>Register</button>
        </form>
        </div>
    );
}