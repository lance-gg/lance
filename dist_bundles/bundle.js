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

	module.exports = "@media (min-width: 1281px) {\n  section .content {\n    max-width: 100%;\n    margin-left: auto;\n    margin-right: auto;\n    max-width: 1366px;\n    padding: 1rem; }\n    section .content:after {\n      content: \" \";\n      display: block;\n      clear: both; }\n    section .content h3 {\n      width: 100%;\n      float: left;\n      margin-left: 0;\n      margin-right: 0; } }\n\n@media (min-width: 501px) and (max-width: 1280px) {\n  section .content {\n    max-width: 100%;\n    margin-left: auto;\n    margin-right: auto;\n    padding: 1rem; }\n    section .content:after {\n      content: \" \";\n      display: block;\n      clear: both; }\n    section .content h3 {\n      width: 74.35897%;\n      margin: 0 auto;\n      padding: 2rem 0; } }\n\n@media (max-width: 500px) {\n  section .content {\n    max-width: 100%;\n    margin-left: auto;\n    margin-right: auto;\n    padding: 1rem; }\n    section .content:after {\n      content: \" \";\n      display: block;\n      clear: both; }\n    section .content h3 {\n      width: 100%;\n      float: left;\n      margin-left: 0;\n      margin-right: 0; } }\n\nsection {\n  position: relative;\n  width: 100%;\n  z-index: 5; }\n  section .content h3 {\n    font-size: 2.5rem;\n    font-weight: 100;\n    text-align: center;\n    display: flex;\n    align-items: stretch;\n    justify-content: center; }\n    section .content h3:before, section .content h3:after {\n      content: ' ';\n      display: inline-block;\n      flex: 1;\n      background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox=%220 0 20 48%22%3E%0A %3Crect width=%2248%22 height=%2248%22 stroke=%22%23FFF%22 fill=%22none%22 x=%225%22 y=%220%22 %2F%3E%0A%3C%2Fsvg%3E%0A\"), url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' width=%221000%22 viewBox=%220 0 1000 10%22%3E%0A %3Crect width=%221000%22 height=%221%22 fill=%22%23FFF%22 y=%224%22 %2F%3E%0A%3C%2Fsvg%3E%0A\");\n      background-repeat: no-repeat, no-repeat;\n      background-position: center right, right 14px center;\n      background-size: auto, auto;\n      margin: 0 1rem; }\n    section .content h3:after {\n      transform: scale(-1, 1); }\n  section .content a {\n    transition: all 0.1s ease-in;\n    color: #68b2f8; }\n    section .content a:hover {\n      color: #506ee5; }\n\n.parallax {\n  perspective: 3px;\n  height: 100vh;\n  overflow-x: hidden;\n  overflow-y: auto;\n  perspective-origin-x: 100%; }\n\n.parallax__layer {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  transform-origin-x: 100%; }\n\n.parallax__group {\n  position: relative;\n  transform-style: preserve-3d; }\n\n.parallax__layer--base {\n  transform: translateZ(0); }\n\n.parallax__layer--back {\n  transform: translateZ(-1px); }\n\nhtml, body {\n  padding: 0;\n  margin: 0;\n  background: #1d0c24;\n  color: #fff;\n  text-align: center;\n  font-family: \"proxima-nova\", sans-serif; }\n\n#splash {\n  background-image: url(images/splash_bg.png), url(images/page_bg_black.png);\n  background-repeat: no-repeat, repeat;\n  background-position: center, center;\n  background-size: cover, auto; }\n  @media (min-width: 1281px) {\n    #splash {\n      padding-top: 10rem; } }\n  @media (max-width: 500px) {\n    #splash {\n      padding-top: 0; }\n      #splash .content {\n        padding: 0; } }\n  #splash h1 {\n    position: relative;\n    background-image: url(images/splash_incheonlogo.png);\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: contain;\n    text-indent: -1000rem;\n    overflow: hidden;\n    height: 16rem;\n    width: 100%;\n    margin: 0 auto;\n    z-index: 10; }\n    @media (max-width: 500px) {\n      #splash h1 {\n        background-size: 150%; } }\n  #splash h3:before {\n    display: none; }\n  #splash h3:after {\n    display: none; }\n  #splash .titleContainer {\n    clear: both;\n    position: relative; }\n  #splash h2 {\n    position: absolute;\n    top: 4rem;\n    right: 10%;\n    z-index: 11;\n    background-image: url(images/splash_beta.png);\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: contain;\n    text-indent: -1000rem;\n    overflow: hidden;\n    width: 23.72881%;\n    margin: 0;\n    height: 14rem; }\n    @media (max-width: 500px) {\n      #splash h2 {\n        top: 3rem;\n        right: 5%; } }\n  #splash h3 {\n    font-weight: 100;\n    font-size: 2.5rem;\n    margin: -3rem auto 2rem auto; }\n    @media (max-width: 500px) {\n      #splash h3 {\n        font-size: 2rem; } }\n  #splash .description {\n    width: 57.62712%;\n    margin: 1rem auto;\n    font-weight: 100;\n    font-size: 1.1rem;\n    line-height: 1.6rem;\n    text-align: justify; }\n    @media (max-width: 500px) {\n      #splash .description {\n        width: 100%;\n        padding: 1rem;\n        box-sizing: border-box; } }\n  #splash .ship1 {\n    transform: translateZ(-1px) scaleX(1) scaleY(1);\n    height: 13vw;\n    width: 13vw;\n    position: absolute;\n    top: -21vh;\n    left: 20%;\n    z-index: 1;\n    background-image: url(images/splash_ship1.png);\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: contain; }\n  #splash .ship2 {\n    transform: translateZ(1px) scaleX(0.5) scaleY(0.5);\n    height: 20vw;\n    width: 20vw;\n    position: absolute;\n    bottom: -10%;\n    right: 19%;\n    z-index: 20;\n    background-image: url(images/splash_ship2.png);\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: contain; }\n  #splash .ctaContainer {\n    position: relative;\n    background-color: rgba(104, 178, 248, 0.2);\n    display: inline-block;\n    padding: 0.2rem 1.8rem 0.1rem 1.8rem;\n    margin: 2rem auto;\n    font-size: 1.2rem;\n    transition: all 0.1s ease-in; }\n    #splash .ctaContainer:before {\n      content: \"\";\n      position: absolute;\n      z-index: 10;\n      left: -3rem;\n      top: -2.4rem;\n      width: 6rem;\n      height: 7rem;\n      background-image: url(images/cta_glow_left.png);\n      background-repeat: no-repeat;\n      background-position: top;\n      background-size: auto;\n      pointer-events: none; }\n    #splash .ctaContainer:after {\n      content: \"\";\n      position: absolute;\n      z-index: 10;\n      right: -3rem;\n      top: -2.4rem;\n      width: 6rem;\n      height: 7rem;\n      background-image: url(images/cta_glow_left.png);\n      background-repeat: no-repeat;\n      background-position: top;\n      background-size: auto;\n      transform: scaleX(-1);\n      pointer-events: none; }\n    #splash .ctaContainer a {\n      width: 100%;\n      padding: 0.2rem 0.5rem;\n      color: #fff;\n      transition: all 0.1s ease-in; }\n    #splash .ctaContainer:hover {\n      background: rgba(104, 178, 248, 0.4); }\n      #splash .ctaContainer:hover a {\n        padding: 0.2rem 0.8rem; }\n\na {\n  color: #fff;\n  text-decoration: none; }\n\n#par1 {\n  height: 50vh;\n  width: 100%;\n  z-index: -1; }\n  #par1 .parallax__layer--back {\n    width: 100vw;\n    height: 90vh;\n    background-image: url(images/game1.png);\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: cover;\n    transform: translateZ(-1px) scaleX(1.6) scaleY(1.6) translateY(0); }\n\n#par2 {\n  height: 50vh;\n  width: 100%;\n  z-index: -1; }\n  #par2 .parallax__layer--back {\n    width: 100vw;\n    height: 70vh;\n    background-image: url(images/game2.png);\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: cover;\n    transform: translateZ(-1px) scaleX(1.5) scaleY(1.5) translateY(0vh);\n    z-index: 4; }\n\n#features {\n  background: #751a62; }\n  #features .content {\n    box-sizing: border-box;\n    width: 66.10169%;\n    margin: 0 auto; }\n    @media (max-width: 500px) {\n      #features .content {\n        width: 205.26316%; } }\n    @media (min-width: 501px) and (max-width: 1280px) {\n      #features .content {\n        width: 100%; } }\n  #features .featureContainer {\n    padding-left: 15.25424%; }\n    @media (min-width: 501px) and (max-width: 1280px) {\n      #features .featureContainer {\n        padding-top: 2rem; } }\n    @media (max-width: 500px) {\n      #features .featureContainer {\n        padding: 0; } }\n  #features .feature {\n    position: relative;\n    padding-left: 6.77966%;\n    width: 32.20339%;\n    float: left;\n    margin-right: 1.69492%;\n    text-align: left;\n    margin-bottom: 4rem;\n    padding-right: 1rem; }\n    @media (max-width: 500px) {\n      #features .feature {\n        width: 73.68421%;\n        float: left;\n        margin-right: 5.26316%;\n        padding-left: 21.05263%;\n        margin: 2rem 0rem; } }\n  #features .title {\n    font-weight: 700;\n    font-size: 1.3rem;\n    padding-bottom: 0.3rem; }\n  #features .text {\n    font-size: 0.9rem;\n    text-align: j; }\n  #features .feature:before {\n    content: \"\";\n    position: absolute;\n    left: 0;\n    top: 0.3rem;\n    width: 3.5rem;\n    height: 3.5rem;\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: contain; }\n  #features .feature.gameAgnostic:before {\n    background-image: url(images/icons/phantom.svg); }\n  #features .feature.physics:before {\n    background-image: url(images/icons/rpg-game.svg);\n    left: 0.4rem; }\n  #features .feature.binary:before {\n    background-image: url(images/icons/logic-game.svg);\n    left: 0.2rem; }\n  #features .feature.lag:before {\n    background-image: url(images/icons/online-game.svg); }\n  #features .feature.architecture:before {\n    background-image: url(images/icons/arcade.svg); }\n  #features .feature.opensource:before {\n    background-image: url(images/icons/multiplayer.svg); }\n  #features .shot {\n    transform: translateZ(2px) scaleX(1) scaleY(1);\n    height: 20vw;\n    width: 10vw;\n    position: absolute;\n    top: 0;\n    left: 33%;\n    z-index: 20;\n    background-image: url(images/shot1.png);\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: contain; }\n\n.bottom {\n  background-image: url(images/page_bg.png); }\n\n#quickstart {\n  padding-bottom: 5rem; }\n  @media (max-width: 500px) {\n    #quickstart {\n      display: none; } }\n  #quickstart .instructions {\n    clear: both;\n    width: 49.15254%;\n    margin: 0 auto;\n    text-align: left; }\n  #quickstart pre {\n    background: #1d0c20;\n    border: 0.2rem solid #68b2f8;\n    padding: 1rem;\n    font-family: monospace; }\n  #quickstart ol {\n    padding: 0; }\n\n#help {\n  padding-bottom: 5rem; }\n  @media (max-width: 500px) {\n    #help {\n      display: none; } }\n  #help .helpContainer {\n    width: 49.15254%;\n    margin: 0 auto;\n    padding: 2rem 0;\n    overflow: hidden;\n    *zoom: 1; }\n  #help a {\n    position: relative;\n    display: block;\n    height: 7rem;\n    width: 31.03448%;\n    float: left;\n    margin-right: 3.44828%;\n    text-align: center;\n    color: #fff; }\n    #help a:hover {\n      text-shadow: #68b2f8 0rem 0rem 1rem; }\n    #help a:before {\n      position: absolute;\n      top: 2.5rem;\n      left: 4rem;\n      font-size: 5rem; }\n  #help a:last-child {\n    width: 31.03448%;\n    float: right;\n    margin-right: 0; }\n\n#about .aboutContainer {\n  width: 66.10169%;\n  margin: 0 auto;\n  padding: 2rem 0;\n  overflow: hidden;\n  *zoom: 1; }\n  @media (max-width: 500px) {\n    #about .aboutContainer {\n      width: 100%; } }\n  #about .aboutContainer .person {\n    width: 48.71795%;\n    float: left;\n    margin-right: 2.5641%;\n    position: relative;\n    position: relative;\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: contain; }\n    #about .aboutContainer .person:before {\n      display: block;\n      content: \"\";\n      width: 100%;\n      padding-top: 70.81218%; }\n    #about .aboutContainer .person > .content {\n      position: absolute;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0; }\n    @media (max-width: 500px) {\n      #about .aboutContainer .person {\n        width: 100%;\n        float: left;\n        margin-left: 0;\n        margin-right: 0; } }\n    #about .aboutContainer .person .name {\n      position: absolute;\n      left: 64%;\n      top: 16%;\n      font-size: 1.1rem; }\n    #about .aboutContainer .person .social {\n      position: absolute;\n      left: 65%;\n      top: 27%;\n      font-size: 2rem; }\n    #about .aboutContainer .person .social a {\n      color: #fff; }\n    #about .aboutContainer .person .social a:hover {\n      color: #fff;\n      text-shadow: #68b2f8 0rem 0rem 1rem; }\n  #about .aboutContainer .person:nth-child(even) {\n    width: 48.71795%;\n    float: right;\n    margin-right: 0; }\n    @media (max-width: 500px) {\n      #about .aboutContainer .person:nth-child(even) {\n        width: 100%;\n        float: left;\n        margin-left: 0;\n        margin-right: 0; } }\n  #about .aboutContainer .person.opher {\n    background-image: url(images/opher.png); }\n  #about .aboutContainer .person.gary {\n    background-image: url(images/gary.png); }\n\n#footer {\n  height: 60vw;\n  background-image: url(images/footer_bg.png);\n  background-repeat: no-repeat;\n  background-position: top;\n  background-size: cover; }\n"

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map