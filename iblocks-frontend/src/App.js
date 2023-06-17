import './App.css';
import React from 'react';
import Editor from './components/Editor';
import {BrowserRouter as Router,Route} from "react-router-dom";
import Nav from './components/Nav';
import Codes from './components/Codes';


function App() {
  console.log("appjs")
  return (
    <div className="app">
    <Router>
        <Nav/>
        <Route path="/" exact component={Editor}/>
        <Route path= "/stored/codes" exact component={Codes}/>
        <Route path="/:id" exact component={Editor}/>
    </Router>
    </div>
  );
}

export default React.memo(App);