/*npm dependencies */
import React from "react";
import dotenv from "dotenv";

import {GoogleLogin,GoogleLogout} from "react-google-login";
import {Link,withRouter,useHistory } from 'react-router-dom';
import { useState } from 'react';

/*local dependencies */
import codelogo from "../Images/code_logo.png";
import "./Nav.css";


var logged = false;
var response = {};
dotenv.config();
function Nav(props) {
    const google_Credential_id = '461359349344-8vrg7pj97v7ocmlelj9vt1rgu83ier01.apps.googleusercontent.com'
    const his = useHistory();
    const [loggedin,setloggedin] = useState(false);
    const img_styling = {
        "height":"55px"
    }
    const onSuccess = (data)=>{
        setloggedin(true);
        response = data.profileObj;
        logged = true;
    }
    const onFailure= (err)=>{
        logged=false;
        setloggedin(false);
    }
    const logout = ()=>{
        setloggedin(false);
        logged=false;
        his.pushBack();
    }
    return (
        <div className="nav">
            <button className="burger" id="burger">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </button>
            <div className="nav_left">
                
                <img style={img_styling} src={codelogo} alt="codelogo" />
                <div className="nav_heading">
                    <h1 className="main_heading" >OnlineCompiler</h1>
                </div>
            </div>
            <div
            /*style={nav_right_styles}*/
             className="nav_right" id="nav_right">
                    <Link className="navlink" to="/">Home</Link>
                    {loggedin? (<GoogleLogout
                        clientId={google_Credential_id}
                        buttonText="Logout"
                        onLogoutSuccess={logout}
                        onFailure={logout}
                        />)
                        :
                        (<GoogleLogin
                        clientId={google_Credential_id}
                        buttonText="Login"
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                        cookiePolicy={'single_host_origin'}
                    />)}
                    <Link className="navlink" to="/stored/codes" >Codes</Link>
            </div>

        </div>
    )
}

export default React.memo(withRouter(Nav));
export {logged,response};