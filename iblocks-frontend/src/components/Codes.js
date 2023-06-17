import React, { useEffect, useState } from 'react'
import {logged,response} from "./Nav";
import "./Codes.css";
import axios from "../axios.js";
import {CircularProgress} from "@material-ui/core";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {Button} from "@mui/material";

function Codes(props) {
    const [respond,Setrespond] = useState([]);
    const [loading,setLoading] = useState(false);
    const [deleteloading,setdeleteloaing] = useState(false);
    const [searchkey,setSearchkey] = useState("");
    useEffect(()=>{
        if(logged){
            setLoading(true);
            axios.post("/fetchcodes",{uniqueid:response.googleId},{
                headers:{
                    'content_type':'application/json'
                }
            }).then((data)=>{
                Setrespond(data.data);
                setLoading(false);
            }).catch((err)=>{
                console.log(err);
            })
        }
        else
        {
            props.history.push("/");
        }
    },[]);
    const fetchcodes = (e)=>{
        setLoading(true);
        const lan = e.target.value;
            axios.post("/codes/language",{language:lan},{
                headers:{
                    'Content-Type':'application/json'
                }
            }).then((data)=>{
                setLoading(false);
                Setrespond(data.data);
            }).catch((err)=>{
                console.log("erorr");
            })
        
    }
    const allcodes = ()=>{
        setLoading(true);
        axios.post("/fetchcodes",{uniqueid:response.googleId},{
            headers:{
                'content_type':'application/json'
            }
        }).then((data)=>{
            Setrespond(data.data);
            setLoading(false);
        }).catch((err)=>{
            console.log("erorr");
        });
    }
    const handledelete = (e)=>{
        setdeleteloaing(true);
        const id_to_delete = e.target.value;
        axios.post("/code/delete",{id_to_delete:id_to_delete},{
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then((data)=>{
            setdeleteloaing(false);
            axios.post("/fetchcodes",{uniqueid:response.googleId},{
                headers:{
                    'content_type':'application/json'
                }
            }).then((data)=>{
                Setrespond(data.data);
                setLoading(false);
            }).catch((err)=>{
                console.log("err");
            })
        })
        .catch((err)=>{
            console.log("err");
        })
    }
    const handleSearch = (e)=>{
        setSearchkey(e.target.value);
    }
    const handlefilter = ()=>{
        if(searchkey.trim()==="")
        {
            console.log("enter key");
        }
        else
        {
            var filterkey = "";
            for(var i=0;i<searchkey.length;i++)
            {
                if(searchkey[i]!==" "){
                    filterkey+=searchkey[i]
                }
            }
            filterkey = filterkey.toLowerCase();
            var filter = [];
            respond.map((ele)=>{
                var ele_key = "";
                for(var i=0;i<ele.filename.length;i++)
                {
                    if(ele.filename[i]!==" "){
                        ele_key+=ele.filename[i];
                    }
                }
                ele_key = ele_key.toLowerCase();
                if(ele_key===filterkey)
                {
                    filter.push(ele);
                }
            });
            Setrespond(filter);
            setSearchkey("");
        }
    }
    const del_icon_style={
        fontSize:'2.5rem',
        pointerEvents:"none"
    }
    const loaderstyle={
        color:'white'
    }
    const button_styles = {
        backgroundColor:"#96BAFF",
        color:'white',
        paddingLeft:'1.4rem',
        paddingRight:'1.4rem',
        marginTop:'3rem'
    }
    return (
        <div className="codes">
            <div className="languages">
                <select onChange={fetchcodes} name="languages" id="language_filter">
                    <option  value="java">Java</option>
                    <option  value="python">Python</option>
                    <option  value="c++">C++</option>
                    <option  value="javascript">Java script</option>
                </select>
                <div className="searchbar">
                    <input value={searchkey} onChange={handleSearch} type="text" />
                    <Button style={button_styles} onClick={handlefilter} >Search</Button>
                </div>
                <Button style={button_styles} onClick={allcodes} value="allcodes" >Allcodes</Button>
            </div>
            { loading? <div><CircularProgress style={loaderstyle} /></div> : respond.length===0?<div><h1 style={{fontSize:'3rem',color:'white'}} >no stored codes</h1></div>:
            <div className="resultantcodes"  >
                <div className="innercodes" >
                {
                    respond.map((ele)=>{
                        return(
                            <div className="codename">
                                <a class="actualcode" target="_blank" href={ele.link} >{ele.filename}</a>
                                {deleteloading? <CircularProgress style={loaderstyle} /> : null}
                                <button className="delbtn" onClick={handledelete} value={ele._id} ><DeleteOutlineIcon value={ele._id} style={del_icon_style} /></button>
                            </div>
                        )
                    })
                }
                </div>
            </div>
            }
        </div>
    );
}

export default Codes;