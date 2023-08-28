const express=require('express');
const cors=require('cors');
const exp = require('constants');
const User=require('./model/user');
const Post=require('./model/post');
const { Mongoose, default: mongoose } = require('mongoose');
const bcrypt=require('bcrypt');
const UserModel = require('./model/user');
const jwt=require('jsonwebtoken');
const cookieparser=require('cookie-parser');
// multer is used to upload files
const multer=require('multer');
// this is the destination where files should be uploaded
const uploadMiddlewear = multer({ dest: 'uploads/' });
// fs used for rename
const fs=require('fs');
const { useParams } = require('react-router-dom');

const app=express();
const Port=process.env.PORT ||4000;
app.listen(Port,()=>{
    console.log(`server is working on http://localhost:${Port}`);
})
// we are using cors because by directly accessing data there are cors erros
const secret='lksfjaijfowjpoerjwfnaksfdaf';

app.get('/',(req,res)=>{
    res.send('successful');
});
app.use(cors({credentials:true,origin:'http://localhost:5173'}));
// app.use('/uploads', express.static(__dirname + '/uploads'));

// we need parser for the post data to parse into json
// express.json() is a middlewear parser
// middlewear{
    app.use(express.json());
    app.use(cookieparser());

// }
// to uplaod file from upload folder to ui
app.use('/uploads',express.static(__dirname +'/uploads'))

// we need to connect it with mongodatabase 
mongoose.connect('mongodb+srv://ash:ZVgUcSfQlsGGVQJX@cluster0.lzuyeec.mongodb.net/?retryWrites=true&w=majority');

const salt=bcrypt.genSaltSync(10);

app.post('/register',async(req,res)=>{
    const {username,password}=req.body;
    try{
        const userdoc=await User.create(
            {username,
            password:bcrypt.hashSync(password,salt),
        } );
    res.json(userdoc);
    } catch(e){
        console.log(e);
        res.status(400).json(e);
    }
   
})

app.post('/login',async(req,res)=>{
    try{
    const data=req.body;
    if(data.username){
        const user=await User.findOne({username:data.username});
        if(user){
            console.log(user);
            const passok= await bcrypt.compareSync(data.password,user.password);
            if(passok){
                // this is used to create a cookie
              jwt.sign({username:data.username,id:user._id},secret,{},(err,token)=>{
                if(err) throw err;
               res.cookie('token',token).json({
                id:user._id,
               username: data.username,
               });
              })
            }else{
                res.json({
                    message:"Wrong Credentials",
    
                });
            }
        }else{
            res.json({
                message:"User Not Found"
            })
        }
    }else{
        res.json({
            message:"Empty data field",
        })
    }
    }catch(e){
        console.log(e);
        res.status(400);

    }
    }
);

app.get('/profile',(req,res)=>{
    // now her we check that our login cookie is active or not so to deal with cookies we install cookie parser
    const {token}=req.cookies;
    if(token){
        jwt.verify(token,secret,{},(err,info)=>{
            if(err) throw err;
            res.json(info);
        })
        res.json(req.cookies);
    }
   
})

app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
     
})

app.post('/post', uploadMiddlewear.single('file'), async (req,res)=>{
    const {originalname,path}=req.file;
    const parts=originalname.split('.');
    const ext=parts[parts.length-1];
    const newPath=path+'.'+ext;
// we rename the file because using .single above it get the file in a binaty form so we need to rename this with its extension so that it can be open as image
    fs.renameSync(path,newPath);
    const {title,summary,content}=req.body;

    const {token}=req.cookies;
    if(token){
        jwt.verify(token,secret,{},async (err,info)=>{
            if(err) throw err;
            const PostDoc=await Post.create({
                title,
                summary,
                content,
                cover:newPath,
                author:info.id,
            })
             res.json(PostDoc);
            
        })
       
    }
   

})

app.get('/post',async (req,res)=>{
   
    res.json(
        await Post.find().populate('author',['username'])
        .sort({createdAt:-1}).limit(20)
        );
})


app.get('/post/:id', async (req,res)=>{
    const postInfo=await  Post.findById(req.params.id).populate('author',['username']);
    res.json(postInfo);
    
})


app.put('/update', uploadMiddlewear.single('file'),async (req,res)=>{
   const {token}=req.cookies;
   
    if(token!=''){
        let newPath=null;
        if(req.file){
                     
    if(req.file.originalname){
        const {originalname,path}=req.file;
        const parts=originalname.split('.');
        const ext=parts[parts.length-1];
         newPath=path+'.'+ext;
    // we rename the file because using .single above it get the file in a binaty form so we need to rename this with its extension so that it can be open as image
        fs.renameSync(path,newPath);
    }
        }

const {id,title,summary,content}=req.body;


    jwt.verify(token,secret,{},async (err,info)=>{
                if(err) throw err;
                const PostDoc=await Post.findById(id);
                //  res.json(PostDoc);
                const isAuthor=JSON.stringify(PostDoc.author)===JSON.stringify(info.id);
                if(!isAuthor){
                   return  res.status(400).json('You are not the author');
                }
                await PostDoc.updateOne({
                    title,
                    summary,
                    cover:newPath!=null?newPath:PostDoc.cover,
                    content,
                });
                res.json(PostDoc);
    });
    }else{
            res.status(404).json('You are not LoggedIn');
        }
   

   
})


app.delete('/delete', (req,res)=>{
        const {token}=req.cookies;
         const id=req.body.id;
        // res.json(id);
        if(token){
            
                // iska mtlb mai login hu 
                jwt.verify(token,secret,{},async(err,info)=>{
                    if(err) throw err;
                    const postdoc=await Post.findById(id);
                //   res.json(postdoc);
                    await postdoc.deleteOne();
                    res.json('successfull');
                })
                // res.json({id});
               
            }else{
                res.status(404).json('Please Login');
            }
       
})


 // const {id}=req.body;
        // res.json(id);
        //