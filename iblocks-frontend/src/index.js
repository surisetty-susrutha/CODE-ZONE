import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);

const  button = document.getElementById('burger');
const nav = document.getElementById('nav_right');
button.addEventListener('click',()=>{
  console.log('clicked')
  nav.classList.toggle('nav_rightexpanded');
});

const link = document.querySelectorAll('.navlink');
link[0].addEventListener('click',()=>{
  nav.classList.toggle('nav_rightexpanded');
});

link[1].addEventListener('click',()=>{
  nav.classList.toggle('nav_rightexpanded');
});