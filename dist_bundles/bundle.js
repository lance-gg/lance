/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist_bundles";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	__webpack_require__(1);
	__webpack_require__(4);
	var smoothScroll = __webpack_require__(5);
	
	var innerWidth = window.innerWidth;
	
	document.addEventListener("resize",function(){
	    innerWidth = window.innerWidth;
	});
	
	document.addEventListener("DOMContentLoaded",function(){
	
	    if (innerWidth>500) {
	        var waypoint = new Waypoint({
	            element: document.getElementById('demo'),
	            context: qs('.siteContainer'),
	            offset: 73,
	            handler: function (direction) {
	                if (direction == "down") {
	                    document.body.classList.add("fixedMenu");
	                }
	                else {
	                    document.body.classList.remove("fixedMenu");
	                }
	            }
	        });
	    }
	    var myScroller = smoothScroll.createScroller(qs('.siteContainer'), null, qs('#outerMenu').offsetHeight);
	    var linksArr = document.querySelectorAll('a[href*="#"]:not([href="#"])');
	    for (var x=0; x<linksArr.length;x++){
	        linksArr[x].addEventListener("click",function(e){
	            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	                var target = qs(this.hash);
	                myScroller.to(target);
	                e.preventDefault();
	            }
	        });
	    }
	
	
	    if (!is_touch_device()){
	        document.querySelector("#demo iframe").setAttribute("src", "http://spaaace.herokuapp.com");
	    }
	});
	
	function qs(selector){
	    return document.querySelector(selector);
	}
	
	function is_touch_device() {
	    return 'ontouchstart' in window        // works on most browsers
	        || navigator.maxTouchPoints;       // works on IE10/11 and Surface
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(3)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/raw-loader/index.js!./../node_modules/sass-loader/index.js!./main.scss", function() {
				var newContent = require("!!./../node_modules/raw-loader/index.js!./../node_modules/sass-loader/index.js!./main.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = "@media (min-width: 1281px) {\n  section .content {\n    max-width: 100%;\n    margin-left: auto;\n    margin-right: auto;\n    max-width: 1366px;\n    padding: 1rem; }\n    section .content:after {\n      content: \" \";\n      display: block;\n      clear: both; }\n    section .content h3 {\n      width: 100%;\n      float: left;\n      margin-left: 0;\n      margin-right: 0; } }\n\n@media (min-width: 501px) and (max-width: 1280px) {\n  section .content {\n    max-width: 100%;\n    margin-left: auto;\n    margin-right: auto;\n    padding: 1rem; }\n    section .content:after {\n      content: \" \";\n      display: block;\n      clear: both; }\n    section .content h3 {\n      width: 74.35897%;\n      margin: 0 auto;\n      padding: 2rem 0; } }\n\n@media (max-width: 500px) {\n  section .content {\n    max-width: 100%;\n    margin-left: auto;\n    margin-right: auto;\n    padding: 1rem; }\n    section .content:after {\n      content: \" \";\n      display: block;\n      clear: both; }\n    section .content h3 {\n      width: 100%;\n      float: left;\n      margin-left: 0;\n      margin-right: 0; } }\n\nsection {\n  position: relative;\n  width: 100%;\n  z-index: 5; }\n  section .content h3 {\n    font-size: 2.5rem;\n    font-weight: 100;\n    text-align: center;\n    display: flex;\n    align-items: stretch;\n    justify-content: center; }\n    section .content h3:before, section .content h3:after {\n      content: ' ';\n      display: inline-block;\n      flex: 1;\n      background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox=%220 0 20 48%22%3E%0A %3Crect width=%2248%22 height=%2248%22 stroke=%22%23FFF%22 fill=%22none%22 x=%225%22 y=%220%22 %2F%3E%0A%3C%2Fsvg%3E%0A\"), url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' width=%221000%22 viewBox=%220 0 1000 10%22%3E%0A %3Crect width=%221000%22 height=%221%22 fill=%22%23FFF%22 y=%224%22 %2F%3E%0A%3C%2Fsvg%3E%0A\");\n      background-repeat: no-repeat, no-repeat;\n      background-position: center right, right 14px center;\n      background-size: auto, auto;\n      margin: 0 1rem; }\n    section .content h3:after {\n      transform: scale(-1, 1); }\n  section .content a {\n    transition: all 0.1s ease-in;\n    color: #68b2f8; }\n    section .content a:hover {\n      color: #506ee5; }\n\n.parallax {\n  perspective: 3px;\n  height: 100vh;\n  overflow-x: hidden;\n  overflow-y: auto;\n  perspective-origin-x: 100%; }\n\n.parallax__layer {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  transform-origin-x: 100%; }\n\n.parallax__group {\n  position: relative;\n  transform-style: preserve-3d; }\n\n.parallax__layer--base {\n  transform: translateZ(0); }\n\n.parallax__layer--back {\n  transform: translateZ(-1px); }\n\nhtml, body {\n  padding: 0;\n  margin: 0;\n  background: #1d0c24;\n  color: #fff;\n  text-align: center;\n  font-family: \"proxima-nova\", sans-serif; }\n\n#splash {\n  background-image: url(images/splash_bg.png), url(images/page_bg_black.png);\n  background-repeat: no-repeat, repeat;\n  background-position: center, center;\n  background-size: cover, auto;\n  z-index: 15;\n  padding-bottom: 72px; }\n  @media (min-width: 1281px) {\n    #splash {\n      padding-top: 10rem; } }\n  @media (max-width: 500px) {\n    #splash {\n      padding-top: 0; }\n      #splash .content {\n        padding: 0; } }\n  #splash h1 {\n    position: relative;\n    background-image: url(images/splash_incheonlogo.png);\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: contain;\n    text-indent: -1000rem;\n    overflow: hidden;\n    height: 16rem;\n    width: 100%;\n    margin: 0 auto;\n    z-index: 10; }\n    @media (max-width: 500px) {\n      #splash h1 {\n        background-size: 150%; } }\n  #splash h3:before {\n    display: none; }\n  #splash h3:after {\n    display: none; }\n  #splash .titleContainer {\n    clear: both;\n    position: relative; }\n  #splash h2 {\n    position: absolute;\n    top: 4rem;\n    right: 10%;\n    z-index: 11;\n    background-image: url(images/splash_beta.png);\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: contain;\n    text-indent: -1000rem;\n    overflow: hidden;\n    width: 23.72881%;\n    margin: 0;\n    height: 14rem; }\n    @media (max-width: 500px) {\n      #splash h2 {\n        top: 3rem;\n        right: 5%; } }\n  #splash h3 {\n    font-weight: 100;\n    font-size: 2.5rem;\n    margin: -3rem auto 2rem auto; }\n    @media (max-width: 500px) {\n      #splash h3 {\n        font-size: 2rem; } }\n  #splash .description {\n    width: 57.62712%;\n    margin: 1rem auto;\n    font-weight: 100;\n    font-size: 1.1rem;\n    line-height: 1.6rem;\n    text-align: justify; }\n    @media (max-width: 500px) {\n      #splash .description {\n        width: 100%;\n        padding: 1rem;\n        box-sizing: border-box; } }\n  #splash .ship1 {\n    transform: translateZ(-1px) scaleX(1) scaleY(1);\n    height: 13vw;\n    width: 13vw;\n    position: absolute;\n    top: -21vh;\n    left: 20%;\n    z-index: 1;\n    background-image: url(images/splash_ship1.png);\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: contain; }\n    @media (max-width: 500px) {\n      #splash .ship1 {\n        display: none; } }\n  #splash .ship2 {\n    transform: translateZ(1px) scaleX(0.5) scaleY(0.5);\n    height: 20vw;\n    width: 20vw;\n    position: absolute;\n    bottom: -10%;\n    right: 19%;\n    z-index: 20;\n    background-image: url(images/splash_ship2.png);\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: contain; }\n    @media (max-width: 500px) {\n      #splash .ship2 {\n        display: none; } }\n  #splash .ctaContainer {\n    position: relative;\n    background-color: rgba(104, 178, 248, 0.2);\n    display: inline-block;\n    padding: 0.2rem 1.8rem 0.1rem 1.8rem;\n    margin: 2rem auto;\n    font-size: 1.2rem;\n    transition: all 0.1s ease-in;\n    margin-right: 1.5rem; }\n    #splash .ctaContainer:last-child {\n      margin-right: 0; }\n    #splash .ctaContainer:before {\n      content: \"\";\n      position: absolute;\n      z-index: 10;\n      left: -3rem;\n      top: -2.4rem;\n      width: 6rem;\n      height: 7rem;\n      background-image: url(images/cta_glow_left.png);\n      background-repeat: no-repeat;\n      background-position: top;\n      background-size: auto;\n      pointer-events: none; }\n    #splash .ctaContainer:after {\n      content: \"\";\n      position: absolute;\n      z-index: 10;\n      right: -3rem;\n      top: -2.4rem;\n      width: 6rem;\n      height: 7rem;\n      background-image: url(images/cta_glow_left.png);\n      background-repeat: no-repeat;\n      background-position: top;\n      background-size: auto;\n      transform: scaleX(-1);\n      pointer-events: none; }\n    #splash .ctaContainer a {\n      width: 100%;\n      padding: 0.2rem 0.5rem;\n      color: #fff;\n      transition: all 0.1s ease-in; }\n    #splash .ctaContainer:hover {\n      background: rgba(104, 178, 248, 0.4); }\n      #splash .ctaContainer:hover a {\n        padding: 0.2rem 0.8rem; }\n\n#innerMenu {\n  position: absolute;\n  background-image: -owg-linear-gradient(top, transparent 0%, black 100%);\n  background-image: -webkit-linear-gradient(top, transparent 0%, black 100%);\n  background-image: -moz-linear-gradient(top, transparent 0%, black 100%);\n  background-image: -o-linear-gradient(top, transparent 0%, black 100%);\n  background-image: linear-gradient(top, transparent 0%, black 100%);\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  z-index: 50; }\n\n#innerMenu, #outerMenu {\n  border-bottom: 2px solid #68b2f8;\n  padding-bottom: 1rem;\n  z-index: 10; }\n  #innerMenu ul, #outerMenu ul {\n    padding-left: 0; }\n    #innerMenu ul li, #outerMenu ul li {\n      position: relative;\n      display: inline-block;\n      margin-right: 40px; }\n      #innerMenu ul li:after, #outerMenu ul li:after {\n        content: \"\";\n        position: absolute;\n        right: -57px;\n        top: -32px;\n        width: 71px;\n        height: 83px;\n        vertical-align: middle;\n        background-image: url(images/divider.png);\n        background-repeat: no-repeat;\n        background-position: center;\n        background-size: cover;\n        pointer-events: none;\n        transition: all 0.5s ease-in; }\n    #innerMenu ul li:last-child, #outerMenu ul li:last-child {\n      margin-right: 0; }\n      #innerMenu ul li:last-child:after, #outerMenu ul li:last-child:after {\n        opacity: 0;\n        top: -50px;\n        right: -130px;\n        background-image: url(images/splash_ship2.png);\n        width: 80px;\n        height: 80px;\n        transform: translateY(-150px); }\n  #innerMenu a, #outerMenu a {\n    transition: all 0.1s ease-in;\n    color: #ffffff; }\n    #innerMenu a:hover, #outerMenu a:hover {\n      color: #68b2f8; }\n\n#outerMenu {\n  position: fixed;\n  width: calc(100% - 18px);\n  top: 0;\n  z-index: 100;\n  opacity: 0;\n  pointer-events: none;\n  background: black;\n  margin-top: 0px;\n  padding: 0.5rem 0; }\n  @media (max-width: 500px) {\n    #outerMenu {\n      display: none; } }\n\n.fixedMenu #outerMenu {\n  opacity: 1;\n  pointer-events: all; }\n  .fixedMenu #outerMenu ul li:last-child:after {\n    transform: translateY(0px);\n    opacity: 1; }\n\na {\n  color: #fff;\n  text-decoration: none; }\n\n#par1 {\n  height: 50vh;\n  width: 100%;\n  z-index: -1;\n  display: none; }\n  #par1 .parallax__layer--back {\n    width: 100vw;\n    height: 90vh;\n    background-image: url(images/game1.png);\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: cover;\n    transform: translateZ(-1px) scaleX(1.6) scaleY(1.6) translateY(0); }\n\n#par2 {\n  height: 50vh;\n  width: 100%;\n  z-index: -1; }\n  #par2 .parallax__layer--back {\n    width: 100vw;\n    height: 70vh;\n    background-image: url(images/game2.png);\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: cover;\n    transform: translateZ(-1px) scaleX(1.5) scaleY(1.5) translateY(0vh);\n    z-index: 4; }\n\n#demo {\n  border-bottom: 2px solid #68b2f8;\n  position: relative; }\n  #demo:before {\n    display: block;\n    content: \"\";\n    width: 100%;\n    padding-top: 31.25%; }\n  #demo > .aspect_content {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0; }\n  @media (min-width: 501px) and (max-width: 1280px) {\n    #demo {\n      display: none; } }\n  @media (max-width: 500px) {\n    #demo {\n      display: none; } }\n  #demo iframe {\n    width: 100%;\n    height: 100%;\n    border: 0; }\n\n#features {\n  background: #751a62; }\n  #features .content {\n    box-sizing: border-box;\n    width: 66.10169%;\n    margin: 0 auto; }\n    @media (max-width: 500px) {\n      #features .content {\n        width: 205.26316%; } }\n    @media (min-width: 501px) and (max-width: 1280px) {\n      #features .content {\n        width: 100%; } }\n  #features .featureContainer {\n    padding-left: 15.25424%; }\n    @media (min-width: 501px) and (max-width: 1280px) {\n      #features .featureContainer {\n        padding-top: 2rem; } }\n    @media (max-width: 500px) {\n      #features .featureContainer {\n        padding: 0; } }\n  #features .feature {\n    position: relative;\n    padding-left: 6.77966%;\n    width: 32.20339%;\n    float: left;\n    margin-right: 1.69492%;\n    text-align: left;\n    margin-bottom: 4rem;\n    padding-right: 1rem; }\n    @media (max-width: 500px) {\n      #features .feature {\n        width: 73.68421%;\n        float: left;\n        margin-right: 5.26316%;\n        padding-left: 21.05263%;\n        margin: 2rem 0rem; } }\n  #features .title {\n    font-weight: 700;\n    font-size: 1.3rem;\n    padding-bottom: 0.3rem; }\n  #features .text {\n    font-size: 0.9rem;\n    text-align: j; }\n  #features .feature:before {\n    content: \"\";\n    position: absolute;\n    left: 0;\n    top: 0.3rem;\n    width: 3.5rem;\n    height: 3.5rem;\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: contain; }\n  #features .feature.gameAgnostic:before {\n    background-image: url(images/icons/phantom.svg); }\n  #features .feature.physics:before {\n    background-image: url(images/icons/rpg-game.svg);\n    left: 0.4rem; }\n  #features .feature.binary:before {\n    background-image: url(images/icons/logic-game.svg);\n    left: 0.2rem; }\n  #features .feature.lag:before {\n    background-image: url(images/icons/online-game.svg); }\n  #features .feature.architecture:before {\n    background-image: url(images/icons/arcade.svg); }\n  #features .feature.opensource:before {\n    background-image: url(images/icons/multiplayer.svg); }\n  #features .shot {\n    transform: translateZ(2px) scaleX(1) scaleY(1);\n    height: 20vw;\n    width: 10vw;\n    position: absolute;\n    top: 0;\n    left: 33%;\n    z-index: 20;\n    background-image: url(images/shot1.png);\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: contain; }\n\n.bottom {\n  background-image: url(images/page_bg.png); }\n\n#quickstart {\n  padding-bottom: 5rem; }\n  #quickstart .instructions {\n    clear: both;\n    width: 49.15254%;\n    margin: 0 auto;\n    text-align: center; }\n  #quickstart pre {\n    background: #1d0c20;\n    border: 0.2rem solid #68b2f8;\n    padding: 1rem;\n    font-family: monospace; }\n  #quickstart ol {\n    padding: 0;\n    text-align: left; }\n\n#help {\n  padding-bottom: 5rem; }\n  @media (max-width: 500px) {\n    #help {\n      display: none; } }\n  #help .helpContainer {\n    width: 66.10169%;\n    margin: 0 auto;\n    padding: 2rem 0;\n    overflow: hidden;\n    *zoom: 1; }\n  #help a {\n    position: relative;\n    display: block;\n    height: 7rem;\n    width: 23.07692%;\n    float: left;\n    margin-right: 2.5641%;\n    text-align: center;\n    color: #fff;\n    pointer-events: all; }\n    #help a:hover {\n      text-shadow: #68b2f8 0rem 0rem 1rem; }\n    #help a:before {\n      position: absolute;\n      top: 2.5rem;\n      left: 4rem;\n      font-size: 5rem; }\n  #help a:last-child {\n    width: 23.07692%;\n    float: right;\n    margin-right: 0; }\n\n#about .aboutContainer {\n  width: 66.10169%;\n  margin: 0 auto;\n  padding: 2rem 0;\n  overflow: hidden;\n  *zoom: 1; }\n  @media (max-width: 500px) {\n    #about .aboutContainer {\n      width: 100%; } }\n  #about .aboutContainer .person {\n    width: 48.71795%;\n    float: left;\n    margin-right: 2.5641%;\n    position: relative;\n    position: relative;\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: contain; }\n    #about .aboutContainer .person:before {\n      display: block;\n      content: \"\";\n      width: 100%;\n      padding-top: 70.81218%; }\n    #about .aboutContainer .person > .aspect_content {\n      position: absolute;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0; }\n    @media (max-width: 500px) {\n      #about .aboutContainer .person {\n        width: 100%;\n        float: left;\n        margin-left: 0;\n        margin-right: 0; } }\n    #about .aboutContainer .person .name {\n      position: absolute;\n      left: 64%;\n      top: 16%;\n      font-size: 1.1rem; }\n    #about .aboutContainer .person .social {\n      position: absolute;\n      left: 65%;\n      top: 27%;\n      font-size: 2rem; }\n    #about .aboutContainer .person .social a {\n      color: #fff; }\n    #about .aboutContainer .person .social a:hover {\n      color: #fff;\n      text-shadow: #68b2f8 0rem 0rem 1rem; }\n  #about .aboutContainer .person:nth-child(even) {\n    width: 48.71795%;\n    float: right;\n    margin-right: 0; }\n    @media (max-width: 500px) {\n      #about .aboutContainer .person:nth-child(even) {\n        width: 100%;\n        float: left;\n        margin-left: 0;\n        margin-right: 0; } }\n  #about .aboutContainer .person.opher {\n    background-image: url(images/opher.png); }\n  #about .aboutContainer .person.gary {\n    background-image: url(images/gary.png); }\n\n#footer {\n  height: 60vw;\n  background-image: url(images/footer_bg.png);\n  background-repeat: no-repeat;\n  background-position: top;\n  background-size: cover; }\n"

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*!
	Waypoints - 4.0.1
	Copyright © 2011-2016 Caleb Troughton
	Licensed under the MIT license.
	https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
	*/
	(function() {
	  'use strict'
	
	  var keyCounter = 0
	  var allWaypoints = {}
	
	  /* http://imakewebthings.com/waypoints/api/waypoint */
	  function Waypoint(options) {
	    if (!options) {
	      throw new Error('No options passed to Waypoint constructor')
	    }
	    if (!options.element) {
	      throw new Error('No element option passed to Waypoint constructor')
	    }
	    if (!options.handler) {
	      throw new Error('No handler option passed to Waypoint constructor')
	    }
	
	    this.key = 'waypoint-' + keyCounter
	    this.options = Waypoint.Adapter.extend({}, Waypoint.defaults, options)
	    this.element = this.options.element
	    this.adapter = new Waypoint.Adapter(this.element)
	    this.callback = options.handler
	    this.axis = this.options.horizontal ? 'horizontal' : 'vertical'
	    this.enabled = this.options.enabled
	    this.triggerPoint = null
	    this.group = Waypoint.Group.findOrCreate({
	      name: this.options.group,
	      axis: this.axis
	    })
	    this.context = Waypoint.Context.findOrCreateByElement(this.options.context)
	
	    if (Waypoint.offsetAliases[this.options.offset]) {
	      this.options.offset = Waypoint.offsetAliases[this.options.offset]
	    }
	    this.group.add(this)
	    this.context.add(this)
	    allWaypoints[this.key] = this
	    keyCounter += 1
	  }
	
	  /* Private */
	  Waypoint.prototype.queueTrigger = function(direction) {
	    this.group.queueTrigger(this, direction)
	  }
	
	  /* Private */
	  Waypoint.prototype.trigger = function(args) {
	    if (!this.enabled) {
	      return
	    }
	    if (this.callback) {
	      this.callback.apply(this, args)
	    }
	  }
	
	  /* Public */
	  /* http://imakewebthings.com/waypoints/api/destroy */
	  Waypoint.prototype.destroy = function() {
	    this.context.remove(this)
	    this.group.remove(this)
	    delete allWaypoints[this.key]
	  }
	
	  /* Public */
	  /* http://imakewebthings.com/waypoints/api/disable */
	  Waypoint.prototype.disable = function() {
	    this.enabled = false
	    return this
	  }
	
	  /* Public */
	  /* http://imakewebthings.com/waypoints/api/enable */
	  Waypoint.prototype.enable = function() {
	    this.context.refresh()
	    this.enabled = true
	    return this
	  }
	
	  /* Public */
	  /* http://imakewebthings.com/waypoints/api/next */
	  Waypoint.prototype.next = function() {
	    return this.group.next(this)
	  }
	
	  /* Public */
	  /* http://imakewebthings.com/waypoints/api/previous */
	  Waypoint.prototype.previous = function() {
	    return this.group.previous(this)
	  }
	
	  /* Private */
	  Waypoint.invokeAll = function(method) {
	    var allWaypointsArray = []
	    for (var waypointKey in allWaypoints) {
	      allWaypointsArray.push(allWaypoints[waypointKey])
	    }
	    for (var i = 0, end = allWaypointsArray.length; i < end; i++) {
	      allWaypointsArray[i][method]()
	    }
	  }
	
	  /* Public */
	  /* http://imakewebthings.com/waypoints/api/destroy-all */
	  Waypoint.destroyAll = function() {
	    Waypoint.invokeAll('destroy')
	  }
	
	  /* Public */
	  /* http://imakewebthings.com/waypoints/api/disable-all */
	  Waypoint.disableAll = function() {
	    Waypoint.invokeAll('disable')
	  }
	
	  /* Public */
	  /* http://imakewebthings.com/waypoints/api/enable-all */
	  Waypoint.enableAll = function() {
	    Waypoint.Context.refreshAll()
	    for (var waypointKey in allWaypoints) {
	      allWaypoints[waypointKey].enabled = true
	    }
	    return this
	  }
	
	  /* Public */
	  /* http://imakewebthings.com/waypoints/api/refresh-all */
	  Waypoint.refreshAll = function() {
	    Waypoint.Context.refreshAll()
	  }
	
	  /* Public */
	  /* http://imakewebthings.com/waypoints/api/viewport-height */
	  Waypoint.viewportHeight = function() {
	    return window.innerHeight || document.documentElement.clientHeight
	  }
	
	  /* Public */
	  /* http://imakewebthings.com/waypoints/api/viewport-width */
	  Waypoint.viewportWidth = function() {
	    return document.documentElement.clientWidth
	  }
	
	  Waypoint.adapters = []
	
	  Waypoint.defaults = {
	    context: window,
	    continuous: true,
	    enabled: true,
	    group: 'default',
	    horizontal: false,
	    offset: 0
	  }
	
	  Waypoint.offsetAliases = {
	    'bottom-in-view': function() {
	      return this.context.innerHeight() - this.adapter.outerHeight()
	    },
	    'right-in-view': function() {
	      return this.context.innerWidth() - this.adapter.outerWidth()
	    }
	  }
	
	  window.Waypoint = Waypoint
	}())
	;(function() {
	  'use strict'
	
	  function requestAnimationFrameShim(callback) {
	    window.setTimeout(callback, 1000 / 60)
	  }
	
	  var keyCounter = 0
	  var contexts = {}
	  var Waypoint = window.Waypoint
	  var oldWindowLoad = window.onload
	
	  /* http://imakewebthings.com/waypoints/api/context */
	  function Context(element) {
	    this.element = element
	    this.Adapter = Waypoint.Adapter
	    this.adapter = new this.Adapter(element)
	    this.key = 'waypoint-context-' + keyCounter
	    this.didScroll = false
	    this.didResize = false
	    this.oldScroll = {
	      x: this.adapter.scrollLeft(),
	      y: this.adapter.scrollTop()
	    }
	    this.waypoints = {
	      vertical: {},
	      horizontal: {}
	    }
	
	    element.waypointContextKey = this.key
	    contexts[element.waypointContextKey] = this
	    keyCounter += 1
	    if (!Waypoint.windowContext) {
	      Waypoint.windowContext = true
	      Waypoint.windowContext = new Context(window)
	    }
	
	    this.createThrottledScrollHandler()
	    this.createThrottledResizeHandler()
	  }
	
	  /* Private */
	  Context.prototype.add = function(waypoint) {
	    var axis = waypoint.options.horizontal ? 'horizontal' : 'vertical'
	    this.waypoints[axis][waypoint.key] = waypoint
	    this.refresh()
	  }
	
	  /* Private */
	  Context.prototype.checkEmpty = function() {
	    var horizontalEmpty = this.Adapter.isEmptyObject(this.waypoints.horizontal)
	    var verticalEmpty = this.Adapter.isEmptyObject(this.waypoints.vertical)
	    var isWindow = this.element == this.element.window
	    if (horizontalEmpty && verticalEmpty && !isWindow) {
	      this.adapter.off('.waypoints')
	      delete contexts[this.key]
	    }
	  }
	
	  /* Private */
	  Context.prototype.createThrottledResizeHandler = function() {
	    var self = this
	
	    function resizeHandler() {
	      self.handleResize()
	      self.didResize = false
	    }
	
	    this.adapter.on('resize.waypoints', function() {
	      if (!self.didResize) {
	        self.didResize = true
	        Waypoint.requestAnimationFrame(resizeHandler)
	      }
	    })
	  }
	
	  /* Private */
	  Context.prototype.createThrottledScrollHandler = function() {
	    var self = this
	    function scrollHandler() {
	      self.handleScroll()
	      self.didScroll = false
	    }
	
	    this.adapter.on('scroll.waypoints', function() {
	      if (!self.didScroll || Waypoint.isTouch) {
	        self.didScroll = true
	        Waypoint.requestAnimationFrame(scrollHandler)
	      }
	    })
	  }
	
	  /* Private */
	  Context.prototype.handleResize = function() {
	    Waypoint.Context.refreshAll()
	  }
	
	  /* Private */
	  Context.prototype.handleScroll = function() {
	    var triggeredGroups = {}
	    var axes = {
	      horizontal: {
	        newScroll: this.adapter.scrollLeft(),
	        oldScroll: this.oldScroll.x,
	        forward: 'right',
	        backward: 'left'
	      },
	      vertical: {
	        newScroll: this.adapter.scrollTop(),
	        oldScroll: this.oldScroll.y,
	        forward: 'down',
	        backward: 'up'
	      }
	    }
	
	    for (var axisKey in axes) {
	      var axis = axes[axisKey]
	      var isForward = axis.newScroll > axis.oldScroll
	      var direction = isForward ? axis.forward : axis.backward
	
	      for (var waypointKey in this.waypoints[axisKey]) {
	        var waypoint = this.waypoints[axisKey][waypointKey]
	        if (waypoint.triggerPoint === null) {
	          continue
	        }
	        var wasBeforeTriggerPoint = axis.oldScroll < waypoint.triggerPoint
	        var nowAfterTriggerPoint = axis.newScroll >= waypoint.triggerPoint
	        var crossedForward = wasBeforeTriggerPoint && nowAfterTriggerPoint
	        var crossedBackward = !wasBeforeTriggerPoint && !nowAfterTriggerPoint
	        if (crossedForward || crossedBackward) {
	          waypoint.queueTrigger(direction)
	          triggeredGroups[waypoint.group.id] = waypoint.group
	        }
	      }
	    }
	
	    for (var groupKey in triggeredGroups) {
	      triggeredGroups[groupKey].flushTriggers()
	    }
	
	    this.oldScroll = {
	      x: axes.horizontal.newScroll,
	      y: axes.vertical.newScroll
	    }
	  }
	
	  /* Private */
	  Context.prototype.innerHeight = function() {
	    /*eslint-disable eqeqeq */
	    if (this.element == this.element.window) {
	      return Waypoint.viewportHeight()
	    }
	    /*eslint-enable eqeqeq */
	    return this.adapter.innerHeight()
	  }
	
	  /* Private */
	  Context.prototype.remove = function(waypoint) {
	    delete this.waypoints[waypoint.axis][waypoint.key]
	    this.checkEmpty()
	  }
	
	  /* Private */
	  Context.prototype.innerWidth = function() {
	    /*eslint-disable eqeqeq */
	    if (this.element == this.element.window) {
	      return Waypoint.viewportWidth()
	    }
	    /*eslint-enable eqeqeq */
	    return this.adapter.innerWidth()
	  }
	
	  /* Public */
	  /* http://imakewebthings.com/waypoints/api/context-destroy */
	  Context.prototype.destroy = function() {
	    var allWaypoints = []
	    for (var axis in this.waypoints) {
	      for (var waypointKey in this.waypoints[axis]) {
	        allWaypoints.push(this.waypoints[axis][waypointKey])
	      }
	    }
	    for (var i = 0, end = allWaypoints.length; i < end; i++) {
	      allWaypoints[i].destroy()
	    }
	  }
	
	  /* Public */
	  /* http://imakewebthings.com/waypoints/api/context-refresh */
	  Context.prototype.refresh = function() {
	    /*eslint-disable eqeqeq */
	    var isWindow = this.element == this.element.window
	    /*eslint-enable eqeqeq */
	    var contextOffset = isWindow ? undefined : this.adapter.offset()
	    var triggeredGroups = {}
	    var axes
	
	    this.handleScroll()
	    axes = {
	      horizontal: {
	        contextOffset: isWindow ? 0 : contextOffset.left,
	        contextScroll: isWindow ? 0 : this.oldScroll.x,
	        contextDimension: this.innerWidth(),
	        oldScroll: this.oldScroll.x,
	        forward: 'right',
	        backward: 'left',
	        offsetProp: 'left'
	      },
	      vertical: {
	        contextOffset: isWindow ? 0 : contextOffset.top,
	        contextScroll: isWindow ? 0 : this.oldScroll.y,
	        contextDimension: this.innerHeight(),
	        oldScroll: this.oldScroll.y,
	        forward: 'down',
	        backward: 'up',
	        offsetProp: 'top'
	      }
	    }
	
	    for (var axisKey in axes) {
	      var axis = axes[axisKey]
	      for (var waypointKey in this.waypoints[axisKey]) {
	        var waypoint = this.waypoints[axisKey][waypointKey]
	        var adjustment = waypoint.options.offset
	        var oldTriggerPoint = waypoint.triggerPoint
	        var elementOffset = 0
	        var freshWaypoint = oldTriggerPoint == null
	        var contextModifier, wasBeforeScroll, nowAfterScroll
	        var triggeredBackward, triggeredForward
	
	        if (waypoint.element !== waypoint.element.window) {
	          elementOffset = waypoint.adapter.offset()[axis.offsetProp]
	        }
	
	        if (typeof adjustment === 'function') {
	          adjustment = adjustment.apply(waypoint)
	        }
	        else if (typeof adjustment === 'string') {
	          adjustment = parseFloat(adjustment)
	          if (waypoint.options.offset.indexOf('%') > - 1) {
	            adjustment = Math.ceil(axis.contextDimension * adjustment / 100)
	          }
	        }
	
	        contextModifier = axis.contextScroll - axis.contextOffset
	        waypoint.triggerPoint = Math.floor(elementOffset + contextModifier - adjustment)
	        wasBeforeScroll = oldTriggerPoint < axis.oldScroll
	        nowAfterScroll = waypoint.triggerPoint >= axis.oldScroll
	        triggeredBackward = wasBeforeScroll && nowAfterScroll
	        triggeredForward = !wasBeforeScroll && !nowAfterScroll
	
	        if (!freshWaypoint && triggeredBackward) {
	          waypoint.queueTrigger(axis.backward)
	          triggeredGroups[waypoint.group.id] = waypoint.group
	        }
	        else if (!freshWaypoint && triggeredForward) {
	          waypoint.queueTrigger(axis.forward)
	          triggeredGroups[waypoint.group.id] = waypoint.group
	        }
	        else if (freshWaypoint && axis.oldScroll >= waypoint.triggerPoint) {
	          waypoint.queueTrigger(axis.forward)
	          triggeredGroups[waypoint.group.id] = waypoint.group
	        }
	      }
	    }
	
	    Waypoint.requestAnimationFrame(function() {
	      for (var groupKey in triggeredGroups) {
	        triggeredGroups[groupKey].flushTriggers()
	      }
	    })
	
	    return this
	  }
	
	  /* Private */
	  Context.findOrCreateByElement = function(element) {
	    return Context.findByElement(element) || new Context(element)
	  }
	
	  /* Private */
	  Context.refreshAll = function() {
	    for (var contextId in contexts) {
	      contexts[contextId].refresh()
	    }
	  }
	
	  /* Public */
	  /* http://imakewebthings.com/waypoints/api/context-find-by-element */
	  Context.findByElement = function(element) {
	    return contexts[element.waypointContextKey]
	  }
	
	  window.onload = function() {
	    if (oldWindowLoad) {
	      oldWindowLoad()
	    }
	    Context.refreshAll()
	  }
	
	
	  Waypoint.requestAnimationFrame = function(callback) {
	    var requestFn = window.requestAnimationFrame ||
	      window.mozRequestAnimationFrame ||
	      window.webkitRequestAnimationFrame ||
	      requestAnimationFrameShim
	    requestFn.call(window, callback)
	  }
	  Waypoint.Context = Context
	}())
	;(function() {
	  'use strict'
	
	  function byTriggerPoint(a, b) {
	    return a.triggerPoint - b.triggerPoint
	  }
	
	  function byReverseTriggerPoint(a, b) {
	    return b.triggerPoint - a.triggerPoint
	  }
	
	  var groups = {
	    vertical: {},
	    horizontal: {}
	  }
	  var Waypoint = window.Waypoint
	
	  /* http://imakewebthings.com/waypoints/api/group */
	  function Group(options) {
	    this.name = options.name
	    this.axis = options.axis
	    this.id = this.name + '-' + this.axis
	    this.waypoints = []
	    this.clearTriggerQueues()
	    groups[this.axis][this.name] = this
	  }
	
	  /* Private */
	  Group.prototype.add = function(waypoint) {
	    this.waypoints.push(waypoint)
	  }
	
	  /* Private */
	  Group.prototype.clearTriggerQueues = function() {
	    this.triggerQueues = {
	      up: [],
	      down: [],
	      left: [],
	      right: []
	    }
	  }
	
	  /* Private */
	  Group.prototype.flushTriggers = function() {
	    for (var direction in this.triggerQueues) {
	      var waypoints = this.triggerQueues[direction]
	      var reverse = direction === 'up' || direction === 'left'
	      waypoints.sort(reverse ? byReverseTriggerPoint : byTriggerPoint)
	      for (var i = 0, end = waypoints.length; i < end; i += 1) {
	        var waypoint = waypoints[i]
	        if (waypoint.options.continuous || i === waypoints.length - 1) {
	          waypoint.trigger([direction])
	        }
	      }
	    }
	    this.clearTriggerQueues()
	  }
	
	  /* Private */
	  Group.prototype.next = function(waypoint) {
	    this.waypoints.sort(byTriggerPoint)
	    var index = Waypoint.Adapter.inArray(waypoint, this.waypoints)
	    var isLast = index === this.waypoints.length - 1
	    return isLast ? null : this.waypoints[index + 1]
	  }
	
	  /* Private */
	  Group.prototype.previous = function(waypoint) {
	    this.waypoints.sort(byTriggerPoint)
	    var index = Waypoint.Adapter.inArray(waypoint, this.waypoints)
	    return index ? this.waypoints[index - 1] : null
	  }
	
	  /* Private */
	  Group.prototype.queueTrigger = function(waypoint, direction) {
	    this.triggerQueues[direction].push(waypoint)
	  }
	
	  /* Private */
	  Group.prototype.remove = function(waypoint) {
	    var index = Waypoint.Adapter.inArray(waypoint, this.waypoints)
	    if (index > -1) {
	      this.waypoints.splice(index, 1)
	    }
	  }
	
	  /* Public */
	  /* http://imakewebthings.com/waypoints/api/first */
	  Group.prototype.first = function() {
	    return this.waypoints[0]
	  }
	
	  /* Public */
	  /* http://imakewebthings.com/waypoints/api/last */
	  Group.prototype.last = function() {
	    return this.waypoints[this.waypoints.length - 1]
	  }
	
	  /* Private */
	  Group.findOrCreate = function(options) {
	    return groups[options.axis][options.name] || new Group(options)
	  }
	
	  Waypoint.Group = Group
	}())
	;(function() {
	  'use strict'
	
	  var Waypoint = window.Waypoint
	
	  function isWindow(element) {
	    return element === element.window
	  }
	
	  function getWindow(element) {
	    if (isWindow(element)) {
	      return element
	    }
	    return element.defaultView
	  }
	
	  function NoFrameworkAdapter(element) {
	    this.element = element
	    this.handlers = {}
	  }
	
	  NoFrameworkAdapter.prototype.innerHeight = function() {
	    var isWin = isWindow(this.element)
	    return isWin ? this.element.innerHeight : this.element.clientHeight
	  }
	
	  NoFrameworkAdapter.prototype.innerWidth = function() {
	    var isWin = isWindow(this.element)
	    return isWin ? this.element.innerWidth : this.element.clientWidth
	  }
	
	  NoFrameworkAdapter.prototype.off = function(event, handler) {
	    function removeListeners(element, listeners, handler) {
	      for (var i = 0, end = listeners.length - 1; i < end; i++) {
	        var listener = listeners[i]
	        if (!handler || handler === listener) {
	          element.removeEventListener(listener)
	        }
	      }
	    }
	
	    var eventParts = event.split('.')
	    var eventType = eventParts[0]
	    var namespace = eventParts[1]
	    var element = this.element
	
	    if (namespace && this.handlers[namespace] && eventType) {
	      removeListeners(element, this.handlers[namespace][eventType], handler)
	      this.handlers[namespace][eventType] = []
	    }
	    else if (eventType) {
	      for (var ns in this.handlers) {
	        removeListeners(element, this.handlers[ns][eventType] || [], handler)
	        this.handlers[ns][eventType] = []
	      }
	    }
	    else if (namespace && this.handlers[namespace]) {
	      for (var type in this.handlers[namespace]) {
	        removeListeners(element, this.handlers[namespace][type], handler)
	      }
	      this.handlers[namespace] = {}
	    }
	  }
	
	  /* Adapted from jQuery 1.x offset() */
	  NoFrameworkAdapter.prototype.offset = function() {
	    if (!this.element.ownerDocument) {
	      return null
	    }
	
	    var documentElement = this.element.ownerDocument.documentElement
	    var win = getWindow(this.element.ownerDocument)
	    var rect = {
	      top: 0,
	      left: 0
	    }
	
	    if (this.element.getBoundingClientRect) {
	      rect = this.element.getBoundingClientRect()
	    }
	
	    return {
	      top: rect.top + win.pageYOffset - documentElement.clientTop,
	      left: rect.left + win.pageXOffset - documentElement.clientLeft
	    }
	  }
	
	  NoFrameworkAdapter.prototype.on = function(event, handler) {
	    var eventParts = event.split('.')
	    var eventType = eventParts[0]
	    var namespace = eventParts[1] || '__default'
	    var nsHandlers = this.handlers[namespace] = this.handlers[namespace] || {}
	    var nsTypeList = nsHandlers[eventType] = nsHandlers[eventType] || []
	
	    nsTypeList.push(handler)
	    this.element.addEventListener(eventType, handler)
	  }
	
	  NoFrameworkAdapter.prototype.outerHeight = function(includeMargin) {
	    var height = this.innerHeight()
	    var computedStyle
	
	    if (includeMargin && !isWindow(this.element)) {
	      computedStyle = window.getComputedStyle(this.element)
	      height += parseInt(computedStyle.marginTop, 10)
	      height += parseInt(computedStyle.marginBottom, 10)
	    }
	
	    return height
	  }
	
	  NoFrameworkAdapter.prototype.outerWidth = function(includeMargin) {
	    var width = this.innerWidth()
	    var computedStyle
	
	    if (includeMargin && !isWindow(this.element)) {
	      computedStyle = window.getComputedStyle(this.element)
	      width += parseInt(computedStyle.marginLeft, 10)
	      width += parseInt(computedStyle.marginRight, 10)
	    }
	
	    return width
	  }
	
	  NoFrameworkAdapter.prototype.scrollLeft = function() {
	    var win = getWindow(this.element)
	    return win ? win.pageXOffset : this.element.scrollLeft
	  }
	
	  NoFrameworkAdapter.prototype.scrollTop = function() {
	    var win = getWindow(this.element)
	    return win ? win.pageYOffset : this.element.scrollTop
	  }
	
	  NoFrameworkAdapter.extend = function() {
	    var args = Array.prototype.slice.call(arguments)
	
	    function merge(target, obj) {
	      if (typeof target === 'object' && typeof obj === 'object') {
	        for (var key in obj) {
	          if (obj.hasOwnProperty(key)) {
	            target[key] = obj[key]
	          }
	        }
	      }
	
	      return target
	    }
	
	    for (var i = 1, end = args.length; i < end; i++) {
	      merge(args[0], args[i])
	    }
	    return args[0]
	  }
	
	  NoFrameworkAdapter.inArray = function(element, array, i) {
	    return array == null ? -1 : array.indexOf(element, i)
	  }
	
	  NoFrameworkAdapter.isEmptyObject = function(obj) {
	    /* eslint no-unused-vars: 0 */
	    for (var name in obj) {
	      return false
	    }
	    return true
	  }
	
	  Waypoint.adapters.push({
	    name: 'noframework',
	    Adapter: NoFrameworkAdapter
	  })
	  Waypoint.Adapter = NoFrameworkAdapter
	}())
	;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Zenscroll 3.3.0
	 * https://github.com/zengabor/zenscroll/
	 *
	 * Copyright 2015–2016 Gabor Lenard
	 *
	 * This is free and unencumbered software released into the public domain.
	 * 
	 * Anyone is free to copy, modify, publish, use, compile, sell, or
	 * distribute this software, either in source code form or as a compiled
	 * binary, for any purpose, commercial or non-commercial, and by any
	 * means.
	 * 
	 * In jurisdictions that recognize copyright laws, the author or authors
	 * of this software dedicate any and all copyright interest in the
	 * software to the public domain. We make this dedication for the benefit
	 * of the public at large and to the detriment of our heirs and
	 * successors. We intend this dedication to be an overt act of
	 * relinquishment in perpetuity of all present and future rights to this
	 * software under copyright law.
	 * 
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
	 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
	 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
	 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 * 
	 * For more information, please refer to <http://unlicense.org>
	 *
	 */
	
	/*jshint devel:true, asi:true */
	
	/*global define, module */
	
	
	(function (root, factory) {
		if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory()), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
		} else if (typeof module === "object" && module.exports) {
			module.exports = factory()
		} else {
			root.zenscroll = factory()
		}
	}(this, function () {
		"use strict"
		
		// Detect if the browser already supports native smooth scrolling (e.g., Firefox 36+ and Chrome 49+) and it is enabled:
		var isNativeSmoothScrollEnabledOn = function (elem) {
			return ("getComputedStyle" in window) &&
				window.getComputedStyle(elem)["scroll-behavior"] === "smooth"
		}
	
		// Exit if it’s not a browser environment:
		if (typeof window === "undefined" || !("document" in window)) {
			return {}
		}
	
		var createScroller = function (scrollContainer, defaultDuration, edgeOffset) {
	
			defaultDuration = defaultDuration || 999 //ms
			if (!edgeOffset && edgeOffset !== 0) {
				// When scrolling, this amount of distance is kept from the edges of the scrollContainer:
				edgeOffset = 9 //px
			}
	
			var scrollTimeoutId
			var setScrollTimeoutId = function (newValue) {
				scrollTimeoutId = newValue
			}
			var docElem = document.documentElement
			
			var getScrollTop = function () {
				if (scrollContainer) {
					return scrollContainer.scrollTop
				} else {
					return window.scrollY || docElem.scrollTop
				}
			}
	
			var getViewHeight = function () {
				if (scrollContainer) {
					return Math.min(scrollContainer.offsetHeight, window.innerHeight)
				} else {
					return window.innerHeight || docElem.clientHeight
				}
			}
	
			var getRelativeTopOf = function (elem) {
				if (scrollContainer) {
					return elem.offsetTop
				} else {
					return elem.getBoundingClientRect().top + getScrollTop() - docElem.offsetTop
				}
			}
	
			/**
			 * Immediately stops the current smooth scroll operation
			 */
			var stopScroll = function () {
				clearTimeout(scrollTimeoutId)
				setScrollTimeoutId(0)
			}
	
			/**
			 * Scrolls to a specific vertical position in the document.
			 *
			 * @param {endY} The vertical position within the document.
			 * @param {duration} Optionally the duration of the scroll operation.
			 *        If 0 or not provided it is automatically calculated based on the 
			 *        distance and the default duration.
			 * @param {onDone} Callback function to be invoken once the scroll finishes.
			 */
			var scrollToY = function (endY, duration, onDone) {
				stopScroll()
				if (isNativeSmoothScrollEnabledOn(scrollContainer ? scrollContainer : document.body)) {
					(scrollContainer || window).scrollTo(0, endY)
					if (onDone) {
						onDone()
					}
				} else {
					var startY = getScrollTop()
					var distance = Math.max(endY,0) - startY
					duration = duration || Math.min(Math.abs(distance), defaultDuration)
					var startTime = new Date().getTime();
					(function loopScroll() {
						setScrollTimeoutId(setTimeout(function () {
							var p = Math.min((new Date().getTime() - startTime) / duration, 1) // percentage
							var y = Math.max(Math.floor(startY + distance*(p < 0.5 ? 2*p*p : p*(4 - p*2)-1)), 0)
							if (scrollContainer) {
								scrollContainer.scrollTop = y
							} else {
								window.scrollTo(0, y)
							}
							if (p < 1 && (getViewHeight() + y) < (scrollContainer || docElem).scrollHeight) {
								loopScroll()
							} else {
								setTimeout(stopScroll, 99) // with cooldown time
								if (onDone) {
									onDone()
								}
							}
						}, 9))
					})()
				}
			}
	
			/**
			 * Scrolls to the top of a specific element.
			 *
			 * @param {elem} The element.
			 * @param {duration} Optionally the duration of the scroll operation.
			 *        A value of 0 is ignored.
			 * @param {onDone} Callback function to be invoken once the scroll finishes.
			 * @returns {endY} The new vertical scoll position that will be valid once the scroll finishes.
			 */
			var scrollToElem = function (elem, duration, onDone) {
				var endY = getRelativeTopOf(elem) - edgeOffset
				scrollToY(endY, duration, onDone)
				return endY
			}
	
			/**
			 * Scrolls an element into view if necessary.
			 *
			 * @param {elem} The element.
			 * @param {duration} Optionally the duration of the scroll operation.
			 *        A value of 0 is ignored.
			 * @param {onDone} Callback function to be invoken once the scroll finishes.
			 */
			var scrollIntoView = function (elem, duration, onDone) {
				var elemHeight = elem.getBoundingClientRect().height
				var elemTop = getRelativeTopOf(elem)
				var elemBottom = elemTop + elemHeight
				var containerHeight = getViewHeight()
				var containerTop = getScrollTop()
				var containerBottom = containerTop + containerHeight
				if ((elemTop - edgeOffset) < containerTop || (elemHeight + edgeOffset) > containerHeight) {
					// Element is clipped at top or is higher than screen.
					scrollToElem(elem, duration, onDone)
				} else if ((elemBottom + edgeOffset) > containerBottom) {
					// Element is clipped at the bottom.
					scrollToY(elemBottom - containerHeight + edgeOffset, duration, onDone)
				} else if (onDone) {
					onDone()
				}
			}
	
			/**
			 * Scrolls to the center of an element.
			 *
			 * @param {elem} The element.
			 * @param {duration} Optionally the duration of the scroll operation.
			 * @param {offset} Optionally the offset of the top of the element from the center of the screen.
			 *        A value of 0 is ignored.
			 * @param {onDone} Callback function to be invoken once the scroll finishes.
			 */
			var scrollToCenterOf = function (elem, duration, offset, onDone) {
				scrollToY(
					Math.max(
						getRelativeTopOf(elem) - getViewHeight()/2 + (offset || elem.getBoundingClientRect().height/2), 
						0
					), 
					duration,
					onDone
				)
			}
	
			/**
			 * Changes default settings for this scroller.
			 *
			 * @param {newDefaultDuration} New value for default duration, used for each scroll method by default.
			 *        Ignored if 0 or falsy.
			 * @param {newEdgeOffset} New value for the edge offset, used by each scroll method by default.
			 */
			var setup = function (newDefaultDuration, newEdgeOffset) {
				if (newDefaultDuration) {
					defaultDuration = newDefaultDuration
				}
				if (newEdgeOffset === 0 || newEdgeOffset) {
					edgeOffset = newEdgeOffset
				}
			}
	
			return {
				setup: setup,
				to: scrollToElem,
				toY: scrollToY,
				intoView: scrollIntoView,
				center: scrollToCenterOf,
				stop: stopScroll,
				moving: function () { return !!scrollTimeoutId },
				getY: getScrollTop
			}
	
		}
	
		// Create a scroller for the browser window, omitting parameters:
		var defaultScroller = createScroller()
	
		// Create listeners for the documentElement only & exclude IE8-
		if ("addEventListener" in window && !(isNativeSmoothScrollEnabledOn(document.body) || window.noZensmooth)) {
			if ("scrollRestoration" in history) {
				history.scrollRestoration = "manual"
				window.addEventListener("popstate", function (event) {
					if (event.state && "scrollY" in event.state) {
						defaultScroller.toY(event.state.scrollY)
					}
				}, false)
			}
			var replaceUrl = function (hash, newY) {
				try {
					history.replaceState({scrollY:defaultScroller.getY()}, "") // remember the scroll position before scrolling
					history.pushState({scrollY:newY}, "", window.location.href.split("#")[0] + hash) // remember the new scroll position (which will be after scrolling)
				} catch (e) {
					// To avoid the Security exception in Chrome when the page was opened via the file protocol, e.g., file://index.html
				}
			}
			window.addEventListener("click", function (event) {
				var anchor = event.target
				while (anchor && anchor.tagName !== "A") {
					anchor = anchor.parentNode
				}
				// Only handle links that were clicked with the primary button, without modifier keys:
				if (!anchor || event.which !== 1 || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) {
					return
				}
				var href = anchor.getAttribute("href") || ""
				if (href.indexOf("#") === 0) {
					if (href === "#") {
						event.preventDefault()
						defaultScroller.toY(0)
						replaceUrl("", 0)
					} else {
						var targetId = anchor.hash.substring(1)
						var targetElem = document.getElementById(targetId)
						if (targetElem) {
							event.preventDefault()
							replaceUrl("#" + targetId, defaultScroller.to(targetElem))
						}
					}
				}
			}, false)
		}
	
		return {
			// Expose the "constructor" that can create a new scroller:
			createScroller: createScroller,
			// Surface the methods of the default scroller:
			setup: defaultScroller.setup,
			to: defaultScroller.to,
			toY: defaultScroller.toY,
			intoView: defaultScroller.intoView,
			center: defaultScroller.center,
			stop: defaultScroller.stop,
			moving: defaultScroller.moving
		}
	
	}));


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map