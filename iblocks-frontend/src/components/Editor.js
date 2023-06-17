/*npm depencies */
import dotenv from "dotenv";
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';


/*dependencies for ace editor */
import AceEditor from "react-ace";
import { response } from './Nav';


import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-javascript";

import "ace-builds/src-noconflict/theme-ambiance";
import 'ace-builds/src-noconflict/theme-dracula';
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-xcode";

/*materialui dependencies */

import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import SaveIcon from '@mui/icons-material/Save';
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import { Button } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Alert } from "@mui/material";
import {CircularProgress} from "@material-ui/core";
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import {Snackbar} from "@mui/material";

/*npm dependencies */

/*local dependencies */
import "./Editor.css";
import templates from "../templates.js"
import Devteam from "./Devteam.js";
import { logged } from './Nav';
import axiosbackend from '../axios.js';

var link="";
var genlink = "";
var id="";
dotenv.config();
const Editor = React.memo((props)=> {
    const [changed,setChanged] = useState(false);
    const [filename,setfilename] = useState("");
    const [err,setErr] = useState(false);
    const [output,setouput] = useState("");
    const [input,setInput] = useState("");
    const [contentcode,setContentcode] = useState("");
    const [codelink,setCodelink] = useState("");
    const [visible,setvisible] = useState(false);
    const [loading,setloading] = useState(false);
    const [loadouput,setloadoutput] = useState(false);
    const [newCode,setNewCode] = useState(false);
    const [language,setLanguage] = useState({
        language:"java",
        version:'15.0.2'
    });
    const [savesucess,setSavesucess] = useState(null);
    const [theme,setTheme] = useState("dracula");


    const [open,setOpen] = useState(false);
    const [alert_message,set_alert_message] = useState("");
    const [serverity,setSeverity] = useState("success");


    useEffect(()=>{
        const uqnid = props.match.params.id;
        if(uqnid===undefined)
        {
            props.history.push("/");
            var code = localStorage.getItem('code');
            if(code===""){
                if(!newCode||contentcode==="")
                {
                    setContentcode(templates[0]);
                }
            }
            else
            {
                setNewCode(true);
                setContentcode(code);
            }
        }
        else{
            id=uqnid;
            const requesturl = `/${uqnid}`;
            axiosbackend.get(requesturl)
            .then((data)=>{
                if(data.data.message===false)
                {
                    alert("code not found with this link");
                }
                else{
                    setContentcode(data.data.code);
                    setLanguage({
                        language:data.data.language,
                        version:data.data.version
                    });

                    link = `${process.env.REACT_APP_FRONTEND}/${id}`;
                    setNewCode(true);
                }
            }).catch((err)=>{
                alert("error loading the code");
            });
        }
    },[]);
    function handlelan(e)
    {
        const lan = e.target.value;
        if(lan==="java")
        {
            setLanguage({
                language:'java',
                version:'15.0.2'
            });
            if(!newCode||contentcode==="")
            {
                setContentcode(templates[0]);
                setNewCode(false);
            }
        }
        else if(lan==="c"){
            setLanguage({
                language:'c',
                version:'10.2.0'
            })
            if(!newCode||contentcode===""){
                console.log(templates[3]);
                setContentcode(templates[3]);
                setNewCode(false);
            }
        }
        else if(lan==="python")
        {
            setLanguage({
                language:"python",
                version:'3.10.0'
            })
            if(!newCode||contentcode==="")
            {
                setContentcode(templates[1]);
                setNewCode(false);
            }
        }
        else if(lan==='javascript')
        {
            setLanguage({
                language:'javascript',
                version:'16.3.0'
            });
            if(!newCode||contentcode==="")
            {
                setContentcode(templates[4]);
            }
        }
        else if(lan==="c_cpp")
        {
            setLanguage({
                language:'c++',
                version:"10.2.0"
            });
            if(!newCode||contentcode==="")
            {
                setContentcode(templates[2]);
                setNewCode(false);
            }
        }
        else{
            setLanguage({
                language:"",
                version:''
            })
        }
    }
    function handletheme(e){
        setTheme(e.target.value);
    }
    function handlerun(e)
    {
        setloadoutput(true);
        const post_data = {
            "language": language.language,
            "version": language.version,
            "files":[
               {"content":contentcode}
            ],
            "stdin":input
        }
        console.log(post_data);
        axios.post("https://emkc.org/api/v2/piston/execute",post_data,{
            headers:{
                'content_type':'application/json'
            }
        }).then((data)=>{
            const err = data.data.run.stderr;
            setloadoutput(false);
            if(err==="")
            {
                setErr(false);
                setouput(data.data.run.stdout);
                setOpen(true);
                set_alert_message("success");
                setSeverity("success");
            }
            else{
                setouput(err);
                setErr(true);
                setOpen(true);
                set_alert_message("Error");
                setSeverity("error");
            }
        }).catch((err)=>{
            console.log("err");
        })
        e.preventDefault();
    }
    const handlefilename = (e)=>{
        const value = e.target.value;
        setfilename(value);
    }
    /*stylings in react */
    const ace_editor_stylings = {
       height:"70vh",
       width:"90%",
       marginTop:'10px'
    }
    function handleContent(e)
    {
        setChanged(true);
        setContentcode(e);
        localStorage.setItem('code',e);
        if(contentcode!=="")
        {
            setNewCode(true);
        }
        else
        {
            setNewCode(false);
        }
    }
    function handleInput(e)
    {
        setInput(e.target.value);
    }
    const save_Styles = {
        backgroundColor : savesucess==="saved sucessfully"? '#6ECB63':'#FF5C58',
    }
    const handlesave =  (e)=>{
        if(logged)
        {
            if(filename.trim()===""||contentcode.trim()==="")
            {
                alert("filename and codeeditor cannot be empty");
            }
            else{
               if((link!==""&&!changed)||(genlink!==""&&!changed))
               {
                   var sent_link = "";
                   if(genlink!=="")
                   {
                       sent_link=genlink;
                   }
                   else
                   {
                       sent_link=link;
                   }
                   const post_data = {
                        uniqueid:response.googleId,
                        language:language.language,
                        version:language.version,
                        filename:filename,
                        link:sent_link
                   }
                    axiosbackend.post("/save",post_data,{
                        headers:{
                            'Content-Type':'application/json'
                        }
                    })
                    .then((data)=>{
                        setChanged(false);
                        if(data.data.saved)
                        {
                            setOpen(true);
                            set_alert_message("success");
                            setSeverity("success");
                        }
                        else{
                            setOpen(true);
                            set_alert_message("code already exists ");
                            setSeverity("error");
                        }
                    })
                    .catch((err)=>{
                        setOpen(true);
                        set_alert_message("error while saving");
                        setSeverity("error");
                        setSavesucess("not saved");
                    })
               }   
               else if(changed) /*if((link&&changed)||(genlink&&changed))*/
               {
                   axiosbackend.get("/unqid")
                   .then((data)=>{
                      id = data.data.link
                      const post_data = {
                        language:language.language,
                        version:language.version,
                        code:contentcode
                    }
                    axiosbackend.post(`/${id}`,post_data,{
                        headers:{
                        'content_type':'application/json'
                    }
                    }).then((res)=>{
                        genlink=`${'http://localhost:3000'}/${id}`;;
                        setCodelink(genlink);
                        setChanged(false);
                        setvisible(true);
                        setloading(false);
                        const postData = {
                            uniqueid:response.googleId,
                            language:language.language,
                            version:language.version,
                            filename:filename,
                            link:genlink
                        }
                        axiosbackend.post("/save",postData,{
                            headers:{
                                'Content-Type':'application/json'
                            }
                        }).then((data)=>{
                            setOpen(true);
                            set_alert_message("Saved successfully");
                            setSeverity("success");
                            setSavesucess("saved sucessfully");
                        }).catch((err)=>{
                            alert("error");
                        })
                    }).catch((err)=>{
                        console.log("error");
                    });
                   }).catch((err)=>{
                        setOpen(true);
                        set_alert_message("failed generating new ID");
                        setSeverity("error");
                   })
               }
               else if(!changed)
               {
                    setOpen(true);
                    set_alert_message("cant save same code twice");
                    setSeverity("error");
               }          
            }
        }
        else
        {
            alert("login to save your code");
        }
    }
    const handleLink = (e)=>{
            if(contentcode.trim()==="")
            {
                alert("codeeditor cannot be empty");
            }
            else
            {
                setvisible(true);
                if(link!==""&&!changed&&genlink==="")
                {
                    setCodelink(link);
                    setvisible(true);
                }
                else if(genlink!==""&&!changed)
                {
                    setCodelink(genlink);
                    setvisible(true);
                }
                else{
                    setloading(true);
                    axiosbackend.get("/unqid")
                    .then((data)=>{
                        console.log("i am here");
                        id=data.data.link
                        console.log(id);
                        const post_data = {
                            language:language.language,
                            version:language.version,
                            code:contentcode
                        }
                        axiosbackend.post(`/${id}`,post_data,{
                            headers:{
                            'content_type':'application/json'
                        }
                        }).then((res)=>{
                            genlink=`${'http://localhost:3000'}/${id}`;
                            setCodelink(genlink);
                            setChanged(false);
                            setvisible(true);
                            setloading(false);
                        }).catch((err)=>{
                            setvisible(false);
                            setloading(false);
                            setOpen(true);
                            set_alert_message("success");
                            setSeverity("success");
                        });
                    })
                    .catch((err)=>{
                        setvisible(false);
                        setloading(false);
                        setOpen(true);
                        set_alert_message("Error");
                        setSeverity("error");
                    })
                }
                
            }
    }
    
    async function handlecopy (){
       await navigator.clipboard.writeText(codelink)
       .then(()=>{
        setOpen(true);
        set_alert_message("Copied");
        setSeverity("success");
       })
       .catch((err)=>{
        setOpen(true);
        set_alert_message("Error");
        setSeverity("error");
       })
    }

    const spinner_styles = {
       color:"white",
       margin:'10px 0'
    }
    const icon_styles = {
        color:'white',
    }
    const output_icon_style={
        color:'white',
        transform:'rotate(180deg)'
    }
    const button_styles = {
        backgroundColor:"#96BAFF",
        color:'#121212',
    }
    const copy_styles = {
        color:'white',
        cursor:'pointer',
        fontSize:'2.5rem',
    }
    const handleclose = (event,reason)=>{
        if (reason === 'clickaway') {
            return;
          }
      
          setOpen(false);
    }
    const snackBar_position = {
        vertical: 'bottom',
        horizontal: 'right',
    }
    return (
        <div className="home">
            <div className="editor" >
                <div className="editor_content">
                    <div className="stylings">
                        <select custom="this is also a version" onChange={handlelan} value={language.language==="c++"? "c_cpp":language.language} className="select_bars" name="lan" id="mode">
                            <option custom="ths is version"  value="java">Java</option>
                            <option custom="ths is version"  value="python">Python</option>
                            <option custom="ths is version"  value="c_cpp">C++</option>
                            <option custom="ths is version"  value="javascript">Javascript</option>
                            <option custom="ths is version"  value="c">C</option>
                        </select>
                        <select onChange={handletheme} className="select_bars" name="theme" id="theme">
                            <option  value="dracula">dark theme</option>
                            <option  value="xcode">Light theme</option>
                        </select>
                    </div>
                    <AceEditor
                        onChange={handleContent}
                        mode={language.language==="c++"||"c"? "c_cpp":language.language}
                        theme={theme}
                        value={contentcode}
                        style={ace_editor_stylings}
                        name="UNIQUE_ID_OF_DIV"
                        editorProps={{ $blockScrolling: true }}
                        setOptions={{
                            showPrintMargin:false,
                            fontSize:"19px",
                            enableBasicAutocompletion: true,
                            enableSnippets: true,
                            enableLiveAutocompletion: false,
                            showLineNumbers: true,
                            tabSize: 4,
                        }}
                    />
                    <div className="response_button">
                        <Button style={button_styles} className="prop_buttons" onClick={handlerun} name="run">
                            <DirectionsRunIcon />
                            Run
                        </Button>
                        <Button style={button_styles} className="prop_buttons" onClick={handlesave}  name="save" >
                            <SaveIcon/>
                            Save
                        </Button>
                        <Button style={button_styles} className="prop_buttons" name="link" onClick={handleLink} >
                            <LinkOutlinedIcon/>
                            Link
                        </Button>
                    </div>
                    {visible? loading? <div className="loader"> <CircularProgress style={spinner_styles} size="4rem" thickness={5} /> </div>: <div className="generated_link" ><a target="_blank"  href={codelink}>{codelink}</a> <Button onClick={handlecopy} ><ContentCopyIcon style={copy_styles} /></Button> </div> :null}
                </div>
            <div className="editor_creds">
                
                <div className="input_feild">
                    <div className="input_heading">
                        <InputOutlinedIcon style={icon_styles}/>
                        <h1 className="laro heading">Input</h1>
                    </div>
                    <textarea className="laro textareas" placeholder="enter your input here " onChange={handleInput}  name="input" cols="20" rows="7"></textarea>
                </div>
                {
                    loadouput? <div className="loader_output" > <CircularProgress style={spinner_styles} size="4rem" thickness={5} /> </div>:null
                }
                <div className="output_feild">
                    <div className="input_heading">
                        <InputOutlinedIcon style={output_icon_style} />
                        <h1 className="laro heading">Output</h1>
                    </div>
                    <textarea placeholder="click run to generate the output" className="laro textareas" style={err? {"color":"red"}:{"color":'black'}} value={output} readOnly name="ouput" id="" cols="20" rows="7"></textarea>
                </div>
                <div className="filename">
                    <input className="laro" onChange={handlefilename} type="text" placeholder="filename"/>
                </div>
                <div className="alert-right" >
                    <Snackbar  open={open} autoHideDuration={1800} onClose={handleclose} anchorOrigin={snackBar_position} key={'bottom' + 'right'} >
                        <Alert onClose={handleclose} severity={serverity} sx={{ width: '27rem' }}  >
                            {alert_message}
                        </Alert>
                    </Snackbar>
                </div>
            </div>
        </div>
        <Devteam/>
        </div>
    )
}
)
export default withRouter(Editor);