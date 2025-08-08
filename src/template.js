// ==UserScript==
// @name        Working Demo Popup
// @namespace   Violentmonkey Scripts
// @match       *://*.google.*/*
// @grant       GM_addStyle
// @version     1.0
// @author      Avitesh Murmu
// @description A simple popup to test the Gulp build setup.
// ==/UserScript==

(function () {
  "use strict";

  // The build process will inject the minified CSS here.
  // {{STYLES}}

  // The build process will inject the bundled and minified JavaScript logic here.
  // {{CODE}}
})();
