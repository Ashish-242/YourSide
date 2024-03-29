import { useState } from "react";
import {  useParams,Navigate } from "react-router-dom";
import Editor from "../../Editor";
import { useEffect } from "react";
// import { response } from "express";
export default function Editpage(){

    const {id}=useParams();
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [files, setFiles] = useState('');
    const[redirect,setRedirect]=useState(false);
    const[deleted,setDeleted]=useState(false);
    
    

    useEffect(()=>{
        

        fetch('http://localhost:4000/post/' +id)
        .then(response =>{
            response.json().then(postInfo=>{
                setTitle(postInfo.title);
                setSummary(postInfo.summary);
                setContent(postInfo.content);
               
            })
        })
    },[])
    async function updatePost(e){
        
    e.preventDefault();
        const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id',id);
    if(files?.[0]){
   data.set('file',files?.[0]);      
    }
  const response=await fetch('http://localhost:4000/update',{
    method:'PUT',
    body:data,
    credentials:'include'
  })
  if(response.ok ){
    console.log(response);
    setRedirect(true);
  }
  else{
    console.log(response);
    alert('Please Login');

  }
 
    
    }

    async function Delete(e){
      e.preventDefault();
     
      const response= await fetch('http://localhost:4000/delete',{
        method:'DELETE',
        body:JSON.stringify({ id: id }),
        credentials:'include',
        headers: {
          'Content-Type': 'application/json', // Set the Content-Type header
        },
      })
      if(response.ok){
        console.log(response);
        setDeleted(true);
        setRedirect(true);
      }else{
        alert('Please Login');
        
      }
    
    }
    if(redirect){
      console.log(deleted);
      if(deleted==true){
        console.log("hello");
        // setDeleted(false);
        return <Navigate to={'/'} />

      }else{
        return <Navigate to={'/post/'+id} />
      }
       
        
      }
      return (
        <form className="editbox" onSubmit={updatePost} >
          <input type="title"
                 placeholder={'Title'}
                 value={title}
                 onChange={ev => setTitle(ev.target.value)} />
          <input type="summary"
                 placeholder={'Summary'}
                 value={summary}
                 onChange={ev => setSummary(ev.target.value)} />
          <input type="file"
                 onChange={ev => setFiles(ev.target.files)} />
                 <Editor value={content} onChange={setContent}/>;
                
         
          <button style={{marginTop:'5px'}}>Update Post</button>
          <button onClick={Delete}>Delete Post</button>
        </form>
      )

}