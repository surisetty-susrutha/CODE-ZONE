/*npm dependencies */
import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import user,{codefile} from "./model.js";
import { nanoid } from "nanoid";
dotenv.config();
/*app config*/
const app = express();
app.use(bodyParser.json({extended:1}));
app.use(cors({
    origin:'http://localhost:3000'
}));
app.use(bodyParser.urlencoded({extended:1}));

var gid="";
/*mongoose setup */
const mogoose_connection_url = "mongodb+srv://shivasai:shivasai@cluster0.nrpiasi.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(mogoose_connection_url,{useNewUrlParser:true,useUnifiedTopology: true});

/*constants in app */
const port = process.env.PORT||5000;


app.get("/",(req,res)=>{
    res.send("<h1>running succesfully</h1>");
})
app.post("/fetchcodes",(req,res)=>{

    const uid = req.body.uniqueid;
    gid = uid;
    user.find({uniqueid:uid},(err,result)=>{
        if(err)
        {
            res.status(400).json({message:"internal database error"});
        }
        else
        {
            if(result)
            {
                res.status(200).send(result);
            }
            else
            {
                res.status(200).json({data:[]});
            }
        }
    })
});

app.get("/unqid",(req,res)=>{
    const id = nanoid(15);
    if(id===undefined)
    {
        res.status(400).json({message:"unabe to generate link"})
    }
    else{
        res.status(200).json({link:id});
    }
});

app.post("/:id",(req,res)=>{
    const id = req.params.id;
    if(id==="save")
    {
        user.findOne({uniqueid:req.body.uniqueid,link:req.body.link},(err,result_user)=>{
            if(err){
                res.status(400).json({message:"internal databse error"});
            }
            else
            {
                if(result_user)
                {
                    res.status(200).json({saved:false});
                }
                else{
                 const save_data = new user({
                    uniqueid:req.body.uniqueid,
                    language:req.body.language,
                    version:req.body.version,
                    filename:req.body.filename,
                    link:req.body.link
                });
                save_data.save();
                res.status(200).json({saved:true}); 
            }
            }
        })
            
    }
    else{
    codefile.findOne({uid:id},(err,result)=>{
        if(err)
        {
            res.status(400).json({message:"internal database error"});
        }
        else
        {
            if(result){
                res.status(200).json({found:true});
            }
            else
            {
                const code_file = new codefile({
                    uid:id,
                    language:req.body.language,
                    version:req.body.version,
                    code:req.body.code
                });
                code_file.save();
                res.status(200).json({message:true});
            }
        }
    });
    }
})
app.get("/:id",(req,res)=>{
    const unqid = req.params.id;
    codefile.findOne({uid:unqid},(err,result)=>{
        if(err)
        {
            res.status(400).json({message:"internal databse error"});
        }
        else
        {
            if(result)
            {
                res.status(200).json(result);
            }
            else{
                res.status(200).json({message:false});
            }
        }
    }) 
});
app.post("/codes/language",(req,res)=>{
    const lan = req.body.language;
    user.find({uniqueid:gid,language:lan},(err,results)=>{
        if(err)
        {
            res.status(400).json({message:false});
        }
        else
        {
            res.status(200).send(results);
        }
    });
});
app.post("/code/delete",(req,res)=>{
    const id = req.body.id_to_delete;
    user.deleteOne({_id:id},(err,result)=>{
        if(err)
        {
            res.status(400).json({message:fasle});
        }
        else
        {
            res.status(200).send(result);
        }
    })
})
app.listen(port,()=>{
    console.log("server is running");
});