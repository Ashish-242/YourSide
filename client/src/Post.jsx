/* eslint-disable react/prop-types */
import {format} from "date-fns";
import { Link } from "react-router-dom";

export default function Post({_id,title,summary,cover,createdAt,author}) {
    return(
        <div className='post'>
   <div className='image'>
   <Link to={`/post/${_id}`}>
   <img src={'http://localhost:4000/'+cover}></img>
   </Link>
   
    </div>

    <div className='blogtext'>
      <Link to ={`/post/${_id}`}>
      <h2>{title}</h2>
      </Link>
          
          <p className='info'>
           
            <a href='' className='author'>{author.username}</a>
            <time className='infotime'>{format(new Date(createdAt),'MMM d,yyyy HH:mm')}</time>
          </p>
          <p className='description'>{summary}</p>
    </div>
  
   </div>
    );
}