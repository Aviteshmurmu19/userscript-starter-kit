// ==UserScript==
// @name        Working Demo Popup
// @namespace   Violentmonkey Scripts
// @match       *://*.google.*/*
// @grant       GM_addStyle
// @version     1.0
// @author      Your Name
// @description A simple popup to test the Gulp build setup.
// ==/UserScript==

(function () {
  "use strict";

  // Styles will be injected here by the build process
  GM_addStyle(`.demo-popup-container{align-items:center;background-color:rgba(0,0,0,.6);display:flex;font-family:sans-serif;inset:0;justify-content:center;position:fixed;z-index:99999}.demo-popup-box{background-color:#fff;border-radius:8px;box-shadow:0 5px 20px rgba(0,0,0,.3);max-width:90%;padding:2em;text-align:center;width:400px}.demo-popup-box h2{color:#2c3e50;margin-top:0}.demo-popup-box p{color:#34495e;line-height:1.6}#demo-popup-close-btn{background-color:#3498db;border:none;border-radius:5px;color:#fff;cursor:pointer;font-size:1em;margin-top:1em;padding:10px 20px;transition:background-color .2s}#demo-popup-close-btn:hover{background-color:#2980b9}`);

  // Your bundled and minified code will be injected here
  const uiHTML='<div class="demo-popup-container"><div class="demo-popup-box"><h2>Congratulations!</h2><p>Your modular build setup is working perfectly.</p><p>This popup was built from separate HTML, CSS, and JS files.</p><button id="demo-popup-close-btn">Close</button></div></div>';function injectPopup(){const o=(new DOMParser).parseFromString(uiHTML,"text/html").body.firstChild;if(o){const e=o.querySelector("#demo-popup-close-btn");e&&e.addEventListener("click",()=>{o.remove()}),document.body.appendChild(o)}}injectPopup(),console.log("Demo script loaded and popup injected using DOMParser!");
})();
