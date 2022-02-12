(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };
    function addTouchClass() {
        if (isMobile.any()) document.documentElement.classList.add("touch");
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 0) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 0) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 0) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: false,
                    goHash: false
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Проснулся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if ("error" !== this._dataValue) {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Ой ой, не заполнен атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") ? true : false;
                if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Открыл попап`);
                } else this.popupLogging(`Ой ой, такого попапа нет.Проверьте корректность ввода. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрыл попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && 0 === focusedIndex) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    /*! @license is-dom-node v1.0.4

	Copyright 2018 Fisssion LLC.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

*/
    function isDomNode(x) {
        return "object" === typeof window.Node ? x instanceof window.Node : null !== x && "object" === typeof x && "number" === typeof x.nodeType && "string" === typeof x.nodeName;
    }
    const is_dom_node_es = isDomNode;
    /*! @license is-dom-node-list v1.2.1

	Copyright 2018 Fisssion LLC.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

*/
    function isDomNodeList(x) {
        var prototypeToString = Object.prototype.toString.call(x);
        var regex = /^\[object (HTMLCollection|NodeList|Object)\]$/;
        return "object" === typeof window.NodeList ? x instanceof window.NodeList : null !== x && "object" === typeof x && "number" === typeof x.length && regex.test(prototypeToString) && (0 === x.length || is_dom_node_es(x[0]));
    }
    const is_dom_node_list_es = isDomNodeList;
    /*! @license Tealight v0.3.6

	Copyright 2018 Fisssion LLC.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

*/
    function tealight(target, context) {
        if (void 0 === context) context = document;
        if (target instanceof Array) return target.filter(is_dom_node_es);
        if (is_dom_node_es(target)) return [ target ];
        if (is_dom_node_list_es(target)) return Array.prototype.slice.call(target);
        if ("string" === typeof target) try {
            var query = context.querySelectorAll(target);
            return Array.prototype.slice.call(query);
        } catch (err) {
            return [];
        }
        return [];
    }
    const tealight_es = tealight;
    /*! @license Rematrix v0.3.0

	Copyright 2018 Julian Lloyd.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/
    function format(source) {
        if (source.constructor !== Array) throw new TypeError("Expected array.");
        if (16 === source.length) return source;
        if (6 === source.length) {
            var matrix = identity();
            matrix[0] = source[0];
            matrix[1] = source[1];
            matrix[4] = source[2];
            matrix[5] = source[3];
            matrix[12] = source[4];
            matrix[13] = source[5];
            return matrix;
        }
        throw new RangeError("Expected array with either 6 or 16 values.");
    }
    function identity() {
        var matrix = [];
        for (var i = 0; i < 16; i++) i % 5 == 0 ? matrix.push(1) : matrix.push(0);
        return matrix;
    }
    function multiply(m, x) {
        var fm = format(m);
        var fx = format(x);
        var product = [];
        for (var i = 0; i < 4; i++) {
            var row = [ fm[i], fm[i + 4], fm[i + 8], fm[i + 12] ];
            for (var j = 0; j < 4; j++) {
                var k = 4 * j;
                var col = [ fx[k], fx[k + 1], fx[k + 2], fx[k + 3] ];
                var result = row[0] * col[0] + row[1] * col[1] + row[2] * col[2] + row[3] * col[3];
                product[i + k] = result;
            }
        }
        return product;
    }
    function parse(source) {
        if ("string" === typeof source) {
            var match = source.match(/matrix(3d)?\(([^)]+)\)/);
            if (match) {
                var raw = match[2].split(", ").map(parseFloat);
                return format(raw);
            }
        }
        return identity();
    }
    function rotateX(angle) {
        var theta = Math.PI / 180 * angle;
        var matrix = identity();
        matrix[5] = matrix[10] = Math.cos(theta);
        matrix[6] = matrix[9] = Math.sin(theta);
        matrix[9] *= -1;
        return matrix;
    }
    function rotateY(angle) {
        var theta = Math.PI / 180 * angle;
        var matrix = identity();
        matrix[0] = matrix[10] = Math.cos(theta);
        matrix[2] = matrix[8] = Math.sin(theta);
        matrix[2] *= -1;
        return matrix;
    }
    function rotateZ(angle) {
        var theta = Math.PI / 180 * angle;
        var matrix = identity();
        matrix[0] = matrix[5] = Math.cos(theta);
        matrix[1] = matrix[4] = Math.sin(theta);
        matrix[4] *= -1;
        return matrix;
    }
    function scale(scalar, scalarY) {
        var matrix = identity();
        matrix[0] = scalar;
        matrix[5] = "number" === typeof scalarY ? scalarY : scalar;
        return matrix;
    }
    function translateX(distance) {
        var matrix = identity();
        matrix[12] = distance;
        return matrix;
    }
    function translateY(distance) {
        var matrix = identity();
        matrix[13] = distance;
        return matrix;
    }
    /*! @license miniraf v1.0.0

	Copyright 2018 Fisssion LLC.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

*/
    var polyfill = function() {
        var clock = Date.now();
        return function(callback) {
            var currentTime = Date.now();
            if (currentTime - clock > 16) {
                clock = currentTime;
                callback(currentTime);
            } else setTimeout((function() {
                return polyfill(callback);
            }), 0);
        };
    }();
    var index = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || polyfill;
    const miniraf_es = index;
    /*! @license ScrollReveal v4.0.9

	Copyright 2021 Fisssion LLC.

	Licensed under the GNU General Public License 3.0 for
	compatible open source projects and non-commercial use.

	For commercial sites, themes, projects, and applications,
	keep your source code private/proprietary by purchasing
	a commercial license from https://scrollrevealjs.org/
*/
    var defaults = {
        delay: 0,
        distance: "0",
        duration: 600,
        easing: "cubic-bezier(0.5, 0, 0, 1)",
        interval: 0,
        opacity: 0,
        origin: "bottom",
        rotate: {
            x: 0,
            y: 0,
            z: 0
        },
        scale: 1,
        cleanup: false,
        container: document.documentElement,
        desktop: true,
        mobile: true,
        reset: false,
        useDelay: "always",
        viewFactor: 0,
        viewOffset: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        afterReset: function afterReset() {},
        afterReveal: function afterReveal() {},
        beforeReset: function beforeReset() {},
        beforeReveal: function beforeReveal() {}
    };
    function failure() {
        document.documentElement.classList.remove("sr");
        return {
            clean: function clean() {},
            destroy: function destroy() {},
            reveal: function reveal() {},
            sync: function sync() {},
            get noop() {
                return true;
            }
        };
    }
    function success() {
        document.documentElement.classList.add("sr");
        if (document.body) document.body.style.height = "100%"; else document.addEventListener("DOMContentLoaded", (function() {
            document.body.style.height = "100%";
        }));
    }
    var mount = {
        success,
        failure
    };
    function isObject(x) {
        return null !== x && x instanceof Object && (x.constructor === Object || "[object Object]" === Object.prototype.toString.call(x));
    }
    function each(collection, callback) {
        if (isObject(collection)) {
            var keys = Object.keys(collection);
            return keys.forEach((function(key) {
                return callback(collection[key], key, collection);
            }));
        }
        if (collection instanceof Array) return collection.forEach((function(item, i) {
            return callback(item, i, collection);
        }));
        throw new TypeError("Expected either an array or object literal.");
    }
    function logger(message) {
        var details = [], len = arguments.length - 1;
        while (len-- > 0) details[len] = arguments[len + 1];
        if (this.constructor.debug && console) {
            var report = "%cScrollReveal: " + message;
            details.forEach((function(detail) {
                return report += "\n — " + detail;
            }));
            console.log(report, "color: #ea654b;");
        }
    }
    function rinse() {
        var this$1 = this;
        var struct = function() {
            return {
                active: [],
                stale: []
            };
        };
        var elementIds = struct();
        var sequenceIds = struct();
        var containerIds = struct();
        try {
            each(tealight_es("[data-sr-id]"), (function(node) {
                var id = parseInt(node.getAttribute("data-sr-id"));
                elementIds.active.push(id);
            }));
        } catch (e) {
            throw e;
        }
        each(this.store.elements, (function(element) {
            if (-1 === elementIds.active.indexOf(element.id)) elementIds.stale.push(element.id);
        }));
        each(elementIds.stale, (function(staleId) {
            return delete this$1.store.elements[staleId];
        }));
        each(this.store.elements, (function(element) {
            if (-1 === containerIds.active.indexOf(element.containerId)) containerIds.active.push(element.containerId);
            if (element.hasOwnProperty("sequence")) if (-1 === sequenceIds.active.indexOf(element.sequence.id)) sequenceIds.active.push(element.sequence.id);
        }));
        each(this.store.containers, (function(container) {
            if (-1 === containerIds.active.indexOf(container.id)) containerIds.stale.push(container.id);
        }));
        each(containerIds.stale, (function(staleId) {
            var stale = this$1.store.containers[staleId].node;
            stale.removeEventListener("scroll", this$1.delegate);
            stale.removeEventListener("resize", this$1.delegate);
            delete this$1.store.containers[staleId];
        }));
        each(this.store.sequences, (function(sequence) {
            if (-1 === sequenceIds.active.indexOf(sequence.id)) sequenceIds.stale.push(sequence.id);
        }));
        each(sequenceIds.stale, (function(staleId) {
            return delete this$1.store.sequences[staleId];
        }));
    }
    var getPrefixedCssProp = function() {
        var properties = {};
        var style = document.documentElement.style;
        function getPrefixedCssProperty(name, source) {
            if (void 0 === source) source = style;
            if (name && "string" === typeof name) {
                if (properties[name]) return properties[name];
                if ("string" === typeof source[name]) return properties[name] = name;
                if ("string" === typeof source["-webkit-" + name]) return properties[name] = "-webkit-" + name;
                throw new RangeError('Unable to find "' + name + '" style property.');
            }
            throw new TypeError("Expected a string.");
        }
        getPrefixedCssProperty.clearCache = function() {
            return properties = {};
        };
        return getPrefixedCssProperty;
    }();
    function style(element) {
        var computed = window.getComputedStyle(element.node);
        var position = computed.position;
        var config = element.config;
        var inline = {};
        var inlineStyle = element.node.getAttribute("style") || "";
        var inlineMatch = inlineStyle.match(/[\w-]+\s*:\s*[^;]+\s*/gi) || [];
        inline.computed = inlineMatch ? inlineMatch.map((function(m) {
            return m.trim();
        })).join("; ") + ";" : "";
        inline.generated = inlineMatch.some((function(m) {
            return m.match(/visibility\s?:\s?visible/i);
        })) ? inline.computed : inlineMatch.concat([ "visibility: visible" ]).map((function(m) {
            return m.trim();
        })).join("; ") + ";";
        var computedOpacity = parseFloat(computed.opacity);
        var configOpacity = !isNaN(parseFloat(config.opacity)) ? parseFloat(config.opacity) : parseFloat(computed.opacity);
        var opacity = {
            computed: computedOpacity !== configOpacity ? "opacity: " + computedOpacity + ";" : "",
            generated: computedOpacity !== configOpacity ? "opacity: " + configOpacity + ";" : ""
        };
        var transformations = [];
        if (parseFloat(config.distance)) {
            var axis = "top" === config.origin || "bottom" === config.origin ? "Y" : "X";
            var distance = config.distance;
            if ("top" === config.origin || "left" === config.origin) distance = /^-/.test(distance) ? distance.substr(1) : "-" + distance;
            var ref = distance.match(/(^-?\d+\.?\d?)|(em$|px$|%$)/g);
            var value = ref[0];
            var unit = ref[1];
            switch (unit) {
              case "em":
                distance = parseInt(computed.fontSize) * value;
                break;

              case "px":
                distance = value;
                break;

              case "%":
                distance = "Y" === axis ? element.node.getBoundingClientRect().height * value / 100 : element.node.getBoundingClientRect().width * value / 100;
                break;

              default:
                throw new RangeError("Unrecognized or missing distance unit.");
            }
            if ("Y" === axis) transformations.push(translateY(distance)); else transformations.push(translateX(distance));
        }
        if (config.rotate.x) transformations.push(rotateX(config.rotate.x));
        if (config.rotate.y) transformations.push(rotateY(config.rotate.y));
        if (config.rotate.z) transformations.push(rotateZ(config.rotate.z));
        if (1 !== config.scale) if (0 === config.scale) transformations.push(scale(2e-4)); else transformations.push(scale(config.scale));
        var transform = {};
        if (transformations.length) {
            transform.property = getPrefixedCssProp("transform");
            transform.computed = {
                raw: computed[transform.property],
                matrix: parse(computed[transform.property])
            };
            transformations.unshift(transform.computed.matrix);
            var product = transformations.reduce(multiply);
            transform.generated = {
                initial: transform.property + ": matrix3d(" + product.join(", ") + ");",
                final: transform.property + ": matrix3d(" + transform.computed.matrix.join(", ") + ");"
            };
        } else transform.generated = {
            initial: "",
            final: ""
        };
        var transition = {};
        if (opacity.generated || transform.generated.initial) {
            transition.property = getPrefixedCssProp("transition");
            transition.computed = computed[transition.property];
            transition.fragments = [];
            var delay = config.delay;
            var duration = config.duration;
            var easing = config.easing;
            if (opacity.generated) transition.fragments.push({
                delayed: "opacity " + duration / 1e3 + "s " + easing + " " + delay / 1e3 + "s",
                instant: "opacity " + duration / 1e3 + "s " + easing + " 0s"
            });
            if (transform.generated.initial) transition.fragments.push({
                delayed: transform.property + " " + duration / 1e3 + "s " + easing + " " + delay / 1e3 + "s",
                instant: transform.property + " " + duration / 1e3 + "s " + easing + " 0s"
            });
            var hasCustomTransition = transition.computed && !transition.computed.match(/all 0s|none 0s/);
            if (hasCustomTransition) transition.fragments.unshift({
                delayed: transition.computed,
                instant: transition.computed
            });
            var composed = transition.fragments.reduce((function(composition, fragment, i) {
                composition.delayed += 0 === i ? fragment.delayed : ", " + fragment.delayed;
                composition.instant += 0 === i ? fragment.instant : ", " + fragment.instant;
                return composition;
            }), {
                delayed: "",
                instant: ""
            });
            transition.generated = {
                delayed: transition.property + ": " + composed.delayed + ";",
                instant: transition.property + ": " + composed.instant + ";"
            };
        } else transition.generated = {
            delayed: "",
            instant: ""
        };
        return {
            inline,
            opacity,
            position,
            transform,
            transition
        };
    }
    function applyStyle(el, declaration) {
        declaration.split(";").forEach((function(pair) {
            var ref = pair.split(":");
            var property = ref[0];
            var value = ref.slice(1);
            if (property && value) el.style[property.trim()] = value.join(":");
        }));
    }
    function clean(target) {
        var this$1 = this;
        var dirty;
        try {
            each(tealight_es(target), (function(node) {
                var id = node.getAttribute("data-sr-id");
                if (null !== id) {
                    dirty = true;
                    var element = this$1.store.elements[id];
                    if (element.callbackTimer) window.clearTimeout(element.callbackTimer.clock);
                    applyStyle(element.node, element.styles.inline.generated);
                    node.removeAttribute("data-sr-id");
                    delete this$1.store.elements[id];
                }
            }));
        } catch (e) {
            return logger.call(this, "Clean failed.", e.message);
        }
        if (dirty) try {
            rinse.call(this);
        } catch (e) {
            return logger.call(this, "Clean failed.", e.message);
        }
    }
    function destroy() {
        var this$1 = this;
        each(this.store.elements, (function(element) {
            applyStyle(element.node, element.styles.inline.generated);
            element.node.removeAttribute("data-sr-id");
        }));
        each(this.store.containers, (function(container) {
            var target = container.node === document.documentElement ? window : container.node;
            target.removeEventListener("scroll", this$1.delegate);
            target.removeEventListener("resize", this$1.delegate);
        }));
        this.store = {
            containers: {},
            elements: {},
            history: [],
            sequences: {}
        };
    }
    function deepAssign(target) {
        var sources = [], len = arguments.length - 1;
        while (len-- > 0) sources[len] = arguments[len + 1];
        if (isObject(target)) {
            each(sources, (function(source) {
                each(source, (function(data, key) {
                    if (isObject(data)) {
                        if (!target[key] || !isObject(target[key])) target[key] = {};
                        deepAssign(target[key], data);
                    } else target[key] = data;
                }));
            }));
            return target;
        } else throw new TypeError("Target must be an object literal.");
    }
    function scrollreveal_es_isMobile(agent) {
        if (void 0 === agent) agent = navigator.userAgent;
        return /Android|iPhone|iPad|iPod/i.test(agent);
    }
    var nextUniqueId = function() {
        var uid = 0;
        return function() {
            return uid++;
        };
    }();
    function initialize() {
        var this$1 = this;
        rinse.call(this);
        each(this.store.elements, (function(element) {
            var styles = [ element.styles.inline.generated ];
            if (element.visible) {
                styles.push(element.styles.opacity.computed);
                styles.push(element.styles.transform.generated.final);
                element.revealed = true;
            } else {
                styles.push(element.styles.opacity.generated);
                styles.push(element.styles.transform.generated.initial);
                element.revealed = false;
            }
            applyStyle(element.node, styles.filter((function(s) {
                return "" !== s;
            })).join(" "));
        }));
        each(this.store.containers, (function(container) {
            var target = container.node === document.documentElement ? window : container.node;
            target.addEventListener("scroll", this$1.delegate);
            target.addEventListener("resize", this$1.delegate);
        }));
        this.delegate();
        this.initTimeout = null;
    }
    function animate(element, force) {
        if (void 0 === force) force = {};
        var pristine = force.pristine || this.pristine;
        var delayed = "always" === element.config.useDelay || "onload" === element.config.useDelay && pristine || "once" === element.config.useDelay && !element.seen;
        var shouldReveal = element.visible && !element.revealed;
        var shouldReset = !element.visible && element.revealed && element.config.reset;
        if (force.reveal || shouldReveal) return triggerReveal.call(this, element, delayed);
        if (force.reset || shouldReset) return triggerReset.call(this, element);
    }
    function triggerReveal(element, delayed) {
        var styles = [ element.styles.inline.generated, element.styles.opacity.computed, element.styles.transform.generated.final ];
        if (delayed) styles.push(element.styles.transition.generated.delayed); else styles.push(element.styles.transition.generated.instant);
        element.revealed = element.seen = true;
        applyStyle(element.node, styles.filter((function(s) {
            return "" !== s;
        })).join(" "));
        registerCallbacks.call(this, element, delayed);
    }
    function triggerReset(element) {
        var styles = [ element.styles.inline.generated, element.styles.opacity.generated, element.styles.transform.generated.initial, element.styles.transition.generated.instant ];
        element.revealed = false;
        applyStyle(element.node, styles.filter((function(s) {
            return "" !== s;
        })).join(" "));
        registerCallbacks.call(this, element);
    }
    function registerCallbacks(element, isDelayed) {
        var this$1 = this;
        var duration = isDelayed ? element.config.duration + element.config.delay : element.config.duration;
        var beforeCallback = element.revealed ? element.config.beforeReveal : element.config.beforeReset;
        var afterCallback = element.revealed ? element.config.afterReveal : element.config.afterReset;
        var elapsed = 0;
        if (element.callbackTimer) {
            elapsed = Date.now() - element.callbackTimer.start;
            window.clearTimeout(element.callbackTimer.clock);
        }
        beforeCallback(element.node);
        element.callbackTimer = {
            start: Date.now(),
            clock: window.setTimeout((function() {
                afterCallback(element.node);
                element.callbackTimer = null;
                if (element.revealed && !element.config.reset && element.config.cleanup) clean.call(this$1, element.node);
            }), duration - elapsed)
        };
    }
    function sequence(element, pristine) {
        if (void 0 === pristine) pristine = this.pristine;
        if (!element.visible && element.revealed && element.config.reset) return animate.call(this, element, {
            reset: true
        });
        var seq = this.store.sequences[element.sequence.id];
        var i = element.sequence.index;
        if (seq) {
            var visible = new SequenceModel(seq, "visible", this.store);
            var revealed = new SequenceModel(seq, "revealed", this.store);
            seq.models = {
                visible,
                revealed
            };
            if (!revealed.body.length) {
                var nextId = seq.members[visible.body[0]];
                var nextElement = this.store.elements[nextId];
                if (nextElement) {
                    cue.call(this, seq, visible.body[0], -1, pristine);
                    cue.call(this, seq, visible.body[0], +1, pristine);
                    return animate.call(this, nextElement, {
                        reveal: true,
                        pristine
                    });
                }
            }
            if (!seq.blocked.head && i === [].concat(revealed.head).pop() && i >= [].concat(visible.body).shift()) {
                cue.call(this, seq, i, -1, pristine);
                return animate.call(this, element, {
                    reveal: true,
                    pristine
                });
            }
            if (!seq.blocked.foot && i === [].concat(revealed.foot).shift() && i <= [].concat(visible.body).pop()) {
                cue.call(this, seq, i, +1, pristine);
                return animate.call(this, element, {
                    reveal: true,
                    pristine
                });
            }
        }
    }
    function Sequence(interval) {
        var i = Math.abs(interval);
        if (!isNaN(i)) {
            this.id = nextUniqueId();
            this.interval = Math.max(i, 16);
            this.members = [];
            this.models = {};
            this.blocked = {
                head: false,
                foot: false
            };
        } else throw new RangeError("Invalid sequence interval.");
    }
    function SequenceModel(seq, prop, store) {
        var this$1 = this;
        this.head = [];
        this.body = [];
        this.foot = [];
        each(seq.members, (function(id, index) {
            var element = store.elements[id];
            if (element && element[prop]) this$1.body.push(index);
        }));
        if (this.body.length) each(seq.members, (function(id, index) {
            var element = store.elements[id];
            if (element && !element[prop]) if (index < this$1.body[0]) this$1.head.push(index); else this$1.foot.push(index);
        }));
    }
    function cue(seq, i, direction, pristine) {
        var this$1 = this;
        var blocked = [ "head", null, "foot" ][1 + direction];
        var nextId = seq.members[i + direction];
        var nextElement = this.store.elements[nextId];
        seq.blocked[blocked] = true;
        setTimeout((function() {
            seq.blocked[blocked] = false;
            if (nextElement) sequence.call(this$1, nextElement, pristine);
        }), seq.interval);
    }
    function reveal(target, options, syncing) {
        var this$1 = this;
        if (void 0 === options) options = {};
        if (void 0 === syncing) syncing = false;
        var containerBuffer = [];
        var sequence$$1;
        var interval = options.interval || defaults.interval;
        try {
            if (interval) sequence$$1 = new Sequence(interval);
            var nodes = tealight_es(target);
            if (!nodes.length) throw new Error("Invalid reveal target.");
            var elements = nodes.reduce((function(elementBuffer, elementNode) {
                var element = {};
                var existingId = elementNode.getAttribute("data-sr-id");
                if (existingId) {
                    deepAssign(element, this$1.store.elements[existingId]);
                    applyStyle(element.node, element.styles.inline.computed);
                } else {
                    element.id = nextUniqueId();
                    element.node = elementNode;
                    element.seen = false;
                    element.revealed = false;
                    element.visible = false;
                }
                var config = deepAssign({}, element.config || this$1.defaults, options);
                if (!config.mobile && scrollreveal_es_isMobile() || !config.desktop && !scrollreveal_es_isMobile()) {
                    if (existingId) clean.call(this$1, element);
                    return elementBuffer;
                }
                var containerNode = tealight_es(config.container)[0];
                if (!containerNode) throw new Error("Invalid container.");
                if (!containerNode.contains(elementNode)) return elementBuffer;
                var containerId;
                containerId = getContainerId(containerNode, containerBuffer, this$1.store.containers);
                if (null === containerId) {
                    containerId = nextUniqueId();
                    containerBuffer.push({
                        id: containerId,
                        node: containerNode
                    });
                }
                element.config = config;
                element.containerId = containerId;
                element.styles = style(element);
                if (sequence$$1) {
                    element.sequence = {
                        id: sequence$$1.id,
                        index: sequence$$1.members.length
                    };
                    sequence$$1.members.push(element.id);
                }
                elementBuffer.push(element);
                return elementBuffer;
            }), []);
            each(elements, (function(element) {
                this$1.store.elements[element.id] = element;
                element.node.setAttribute("data-sr-id", element.id);
            }));
        } catch (e) {
            return logger.call(this, "Reveal failed.", e.message);
        }
        each(containerBuffer, (function(container) {
            this$1.store.containers[container.id] = {
                id: container.id,
                node: container.node
            };
        }));
        if (sequence$$1) this.store.sequences[sequence$$1.id] = sequence$$1;
        if (true !== syncing) {
            this.store.history.push({
                target,
                options
            });
            if (this.initTimeout) window.clearTimeout(this.initTimeout);
            this.initTimeout = window.setTimeout(initialize.bind(this), 0);
        }
    }
    function getContainerId(node) {
        var collections = [], len = arguments.length - 1;
        while (len-- > 0) collections[len] = arguments[len + 1];
        var id = null;
        each(collections, (function(collection) {
            each(collection, (function(container) {
                if (null === id && container.node === node) id = container.id;
            }));
        }));
        return id;
    }
    function sync() {
        var this$1 = this;
        each(this.store.history, (function(record) {
            reveal.call(this$1, record.target, record.options, true);
        }));
        initialize.call(this);
    }
    var scrollreveal_es_polyfill = function(x) {
        return (x > 0) - (x < 0) || +x;
    };
    var mathSign = Math.sign || scrollreveal_es_polyfill;
    function getGeometry(target, isContainer) {
        var height = isContainer ? target.node.clientHeight : target.node.offsetHeight;
        var width = isContainer ? target.node.clientWidth : target.node.offsetWidth;
        var offsetTop = 0;
        var offsetLeft = 0;
        var node = target.node;
        do {
            if (!isNaN(node.offsetTop)) offsetTop += node.offsetTop;
            if (!isNaN(node.offsetLeft)) offsetLeft += node.offsetLeft;
            node = node.offsetParent;
        } while (node);
        return {
            bounds: {
                top: offsetTop,
                right: offsetLeft + width,
                bottom: offsetTop + height,
                left: offsetLeft
            },
            height,
            width
        };
    }
    function getScrolled(container) {
        var top, left;
        if (container.node === document.documentElement) {
            top = window.pageYOffset;
            left = window.pageXOffset;
        } else {
            top = container.node.scrollTop;
            left = container.node.scrollLeft;
        }
        return {
            top,
            left
        };
    }
    function isElementVisible(element) {
        if (void 0 === element) element = {};
        var container = this.store.containers[element.containerId];
        if (!container) return;
        var viewFactor = Math.max(0, Math.min(1, element.config.viewFactor));
        var viewOffset = element.config.viewOffset;
        var elementBounds = {
            top: element.geometry.bounds.top + element.geometry.height * viewFactor,
            right: element.geometry.bounds.right - element.geometry.width * viewFactor,
            bottom: element.geometry.bounds.bottom - element.geometry.height * viewFactor,
            left: element.geometry.bounds.left + element.geometry.width * viewFactor
        };
        var containerBounds = {
            top: container.geometry.bounds.top + container.scroll.top + viewOffset.top,
            right: container.geometry.bounds.right + container.scroll.left - viewOffset.right,
            bottom: container.geometry.bounds.bottom + container.scroll.top - viewOffset.bottom,
            left: container.geometry.bounds.left + container.scroll.left + viewOffset.left
        };
        return elementBounds.top < containerBounds.bottom && elementBounds.right > containerBounds.left && elementBounds.bottom > containerBounds.top && elementBounds.left < containerBounds.right || "fixed" === element.styles.position;
    }
    function delegate(event, elements) {
        var this$1 = this;
        if (void 0 === event) event = {
            type: "init"
        };
        if (void 0 === elements) elements = this.store.elements;
        miniraf_es((function() {
            var stale = "init" === event.type || "resize" === event.type;
            each(this$1.store.containers, (function(container) {
                if (stale) container.geometry = getGeometry.call(this$1, container, true);
                var scroll = getScrolled.call(this$1, container);
                if (container.scroll) container.direction = {
                    x: mathSign(scroll.left - container.scroll.left),
                    y: mathSign(scroll.top - container.scroll.top)
                };
                container.scroll = scroll;
            }));
            each(elements, (function(element) {
                if (stale || void 0 === element.geometry) element.geometry = getGeometry.call(this$1, element);
                element.visible = isElementVisible.call(this$1, element);
            }));
            each(elements, (function(element) {
                if (element.sequence) sequence.call(this$1, element); else animate.call(this$1, element);
            }));
            this$1.pristine = false;
        }));
    }
    function isTransformSupported() {
        var style = document.documentElement.style;
        return "transform" in style || "WebkitTransform" in style;
    }
    function isTransitionSupported() {
        var style = document.documentElement.style;
        return "transition" in style || "WebkitTransition" in style;
    }
    var version = "4.0.9";
    var boundDelegate;
    var boundDestroy;
    var boundReveal;
    var boundClean;
    var boundSync;
    var config;
    var debug;
    var instance;
    function ScrollReveal(options) {
        if (void 0 === options) options = {};
        var invokedWithoutNew = "undefined" === typeof this || Object.getPrototypeOf(this) !== ScrollReveal.prototype;
        if (invokedWithoutNew) return new ScrollReveal(options);
        if (!ScrollReveal.isSupported()) {
            logger.call(this, "Instantiation failed.", "This browser is not supported.");
            return mount.failure();
        }
        var buffer;
        try {
            buffer = config ? deepAssign({}, config, options) : deepAssign({}, defaults, options);
        } catch (e) {
            logger.call(this, "Invalid configuration.", e.message);
            return mount.failure();
        }
        try {
            var container = tealight_es(buffer.container)[0];
            if (!container) throw new Error("Invalid container.");
        } catch (e) {
            logger.call(this, e.message);
            return mount.failure();
        }
        config = buffer;
        if (!config.mobile && scrollreveal_es_isMobile() || !config.desktop && !scrollreveal_es_isMobile()) {
            logger.call(this, "This device is disabled.", "desktop: " + config.desktop, "mobile: " + config.mobile);
            return mount.failure();
        }
        mount.success();
        this.store = {
            containers: {},
            elements: {},
            history: [],
            sequences: {}
        };
        this.pristine = true;
        boundDelegate = boundDelegate || delegate.bind(this);
        boundDestroy = boundDestroy || destroy.bind(this);
        boundReveal = boundReveal || reveal.bind(this);
        boundClean = boundClean || clean.bind(this);
        boundSync = boundSync || sync.bind(this);
        Object.defineProperty(this, "delegate", {
            get: function() {
                return boundDelegate;
            }
        });
        Object.defineProperty(this, "destroy", {
            get: function() {
                return boundDestroy;
            }
        });
        Object.defineProperty(this, "reveal", {
            get: function() {
                return boundReveal;
            }
        });
        Object.defineProperty(this, "clean", {
            get: function() {
                return boundClean;
            }
        });
        Object.defineProperty(this, "sync", {
            get: function() {
                return boundSync;
            }
        });
        Object.defineProperty(this, "defaults", {
            get: function() {
                return config;
            }
        });
        Object.defineProperty(this, "version", {
            get: function() {
                return version;
            }
        });
        Object.defineProperty(this, "noop", {
            get: function() {
                return false;
            }
        });
        return instance ? instance : instance = this;
    }
    ScrollReveal.isSupported = function() {
        return isTransformSupported() && isTransitionSupported();
    };
    Object.defineProperty(ScrollReveal, "debug", {
        get: function() {
            return debug || false;
        },
        set: function(value) {
            return debug = "boolean" === typeof value ? value : debug;
        }
    });
    ScrollReveal();
    const scrollreveal_es = ScrollReveal;
    const sr = scrollreveal_es({
        origin: "top",
        distance: "60px",
        duration: 700,
        delay: 200,
        easing: "cubic-bezier(0.2, 0.1, 0, 1)"
    });
    sr.reveal(".present-block__header", {
        distance: "25px"
    });
    sr.reveal(".present-block__text", {
        distance: "25px",
        origin: "right",
        delay: 100
    });
    sr.reveal(".anim-btn-text", {
        distance: "25px",
        delay: 300
    });
    sr.reveal(".interesting__title", {
        origin: "left",
        interval: 100
    });
    sr.reveal(".interesting__text", {
        origin: "bottom",
        interval: 100,
        distance: "30px"
    });
    sr.reveal(".other-interesting", {
        origin: "right",
        interval: 100
    });
    sr.reveal(".cases__title", {
        origin: "left",
        interval: 100,
        origin: "left"
    });
    sr.reveal(".block-cases", {
        origin: "left",
        interval: 100,
        origin: "left"
    });
    sr.reveal(".block-cases__link-title", {
        origin: "left",
        interval: 150
    });
    sr.reveal(".block-cases__text", {
        origin: "left",
        interval: 200
    });
    sr.reveal(".your-broject-cases__area", {
        origin: "right",
        interval: 100
    });
    sr.reveal(".your-broject-cases__title", {
        origin: "bottom",
        interval: 100
    });
    sr.reveal(".title-line", {
        origin: "left",
        distance: "20px",
        interval: 100
    });
    sr.reveal(".brands__body-title", {
        origin: "top",
        distance: "30px",
        interval: 100
    });
    sr.reveal(".brands__body-logo", {
        origin: "right",
        distance: "30px",
        interval: 100
    });
    sr.reveal(".services__label", {
        origin: "top",
        distance: "30px",
        interval: 100
    });
    sr.reveal(".services__text", {
        origin: "left",
        distance: "10px",
        interval: 100
    });
    sr.reveal(".footer__title", {
        origin: "left",
        distance: "30px",
        interval: 100
    });
    sr.reveal(".contacts__item", {
        origin: "bottom",
        distance: "10px",
        interval: 100
    });
    const langBtn = document.querySelector(".header__lang");
    langBtn.addEventListener("click", script_translate);
    function script_translate() {
        if (document.body.classList.contains("en")) toRus(); else toEng();
    }
    function toRus() {
        document.body.classList.remove("en");
        langBtn.innerHTML = "RU";
        const menuLink = document.querySelectorAll(".menu__link");
        const menuLinkCont = [ "услуги<span>6</span>", "кейсы<span>13</span>", "о нас", "контакты", "блог", "связаться с нами" ];
        sortArray(menuLink, menuLinkCont);
        const presentText = document.querySelectorAll(".present-block__text");
        sortArray(presentText, [ "Агентство, в котором подружились Scrum и творчество" ]);
        const presentBtn = document.querySelectorAll(".anim-btn-text");
        sortArray(presentBtn, [ "ОБСУДИМ ПРОЕКТ?", "Все проекты" ]);
        const interestingitems = document.querySelectorAll(".interesting__text");
        const interestingCount = [ "«Не все старое — доброе». Рассказали всю правду о перьевых подушках и помогли организовать марафон по их утилизации", "Объединили лидеров мнений с грузинским происхождением в рамках коммуникационной стратегии бренда на 2021-2022 год", "Решили проблему «одного друга» через разработку онлайн-хаба о мужском здоровье" ];
        sortArray(interestingitems, interestingCount);
        const interestingTitles = document.querySelectorAll(".interesting__title");
        const inTitleCount = [ "Askona", "Borjomi", "Афала / Импаза" ];
        sortArray(interestingTitles, inTitleCount);
        const interestingTitle = document.querySelectorAll(".cases__title");
        sortArray(interestingTitle, [ "<span>+</span>КЕЙСЫ" ]);
        const casesLabels = document.querySelectorAll(".block-cases__link-title");
        const caseslabValue = [ "Tikkurila", "Бубновский", "МаксиПРО" ];
        sortArray(casesLabels, caseslabValue);
        const casesTexts = document.querySelectorAll(".block-cases__text");
        const casesTextValue = [ "Превратили самый нудный процесс на свете в креативный TikTok-челлендж с блогерами", "С 0 до 1 102 378 рублей за первый месяц. Привели пациентов из соцсетей прямо к открытию нового центра в сети клиник", "С 1% до 2,5% ERR за 6 месяцев. Превратили скучный строительный паблик в комьюнити для профессионалов в строительстве и ремонте" ];
        sortArray(casesTexts, casesTextValue);
        const yourProject = document.querySelectorAll(".your-broject-cases__title");
        const projectValue = [ "МЕСТО ДЛЯ ВАШЕГО ПРОЕКТА" ];
        sortArray(yourProject, projectValue);
        const titles = document.querySelectorAll(".title-line");
        const titlesValue = [ "С КЕМ <span>УСПЕЛИ</span> ПОРАБОТАТЬ", "УСЛУГИ" ];
        sortArray(titles, titlesValue);
        const footerTitles = document.querySelectorAll(".footer__title");
        const footerTitlesValue = [ "Свяжитесь с нами", "Ресурсы агентства" ];
        sortArray(footerTitles, footerTitlesValue);
        const footerItems = document.querySelectorAll(".contacts__title");
        const footerItemsValue = [ "ПОЧТА", "ТЕЛЕФОН" ];
        sortArray(footerItems, footerItemsValue);
        const footerBtn = document.querySelectorAll(".footer__agency-btn");
        sortArray(footerBtn, [ "Обсудить наш проект" ]);
        const servTitle = document.querySelectorAll(".services__label");
        const servText = [ "SMM", "PRODUCTION", "ЯНДЕКС.ДЗЕН", "ТАРГЕТИРОВАННАЯ РЕКЛАМА", "МЕДИЙНАЯ РЕКЛАМА", "УПРАВЛЕНИЕ РЕПУТАЦИЕЙ", "INFLUENCE-MARKETING", "PR" ];
        sortArray(servTitle, servText);
        const servSubTitle = document.querySelectorAll(".services__text");
        const servSubText = [ "Разрабатываем стратегии и комплексно ведем аккаунты во всех социальных сетях с четкими KPI", "Продакшн полного цикла. Умеем делать все: от баннеров до мини-сериалов", "Пишем и промим так, что нашими кейсами делится сам Яндекс", "Запускаем рекламные кампании за 5 дней, включая разработку креативов и настройку аналитики", "Запускаем многоуровневые рекламные кампании с использованием Big Data во всех возможных форматах", "Пишем и промим так, что нашими кейсами делится сам Яндекс", "Запускаем рекламные кампании за 5 дней, включая разработку креативов и настройку аналитики", "Запускаем многоуровневые рекламные кампании с использованием Big Data во всех возможных форматах" ];
        sortArray(servSubTitle, servSubText);
    }
    function toEng() {
        document.body.classList.add("en");
        langBtn.innerHTML = "EN";
        const menuLink = document.querySelectorAll(".menu__link");
        const menuLinkCont = [ "services<span>6</span>", "cases<span>13</span>", "about Us", "contacts", "blog", "to contact us" ];
        sortArray(menuLink, menuLinkCont);
        const presentText = document.querySelectorAll(".present-block__text");
        sortArray(presentText, [ "An agency that brought together Scrum and<br> creativity" ]);
        const presentBtn = document.querySelectorAll(".anim-btn-text");
        sortArray(presentBtn, [ "DISCUSS THE PROJECT?", "all projects" ]);
        const interestingitems = document.querySelectorAll(".interesting__text");
        const interestingCount = [ `"Not everything old is good." They told the whole truth about feather pillows and helped organize a marathon for their disposal`, `We united opinion leaders with Georgian origin as part of the brand's communication strategy for 2021-2022`, `We solved the problem of "one friend" through the development of an online hub about men's health` ];
        sortArray(interestingitems, interestingCount);
        const interestingTitles = document.querySelectorAll(".interesting__title");
        const inTitleCount = [ "Askona", "Borjomi", "Afala / Impaza" ];
        sortArray(interestingTitles, inTitleCount);
        const interestingTitle = document.querySelectorAll(".cases__title");
        sortArray(interestingTitle, [ "<span>+</span>CASES" ]);
        const casesLabels = document.querySelectorAll(".block-cases__link-title");
        const caseslabValue = [ "Tikkurila", "Bubnovsky", "MaxiPRO" ];
        sortArray(casesLabels, caseslabValue);
        const casesTexts = document.querySelectorAll(".block-cases__text");
        const casesTextValue = [ "We turned the most boring process in the world into a creative TikTok challenge with bloggers", "From 0 to 1,102,378 rubles for the first month. Brought patients from social networks directly to the opening of a new center in a network of clinics", "From 1% to 2.5% ERR in 6 months. We turned a boring construction public into a community for professionals in construction and repair" ];
        sortArray(casesTexts, casesTextValue);
        const yourProject = document.querySelectorAll(".your-broject-cases__title");
        const projectValue = [ "THE PLACE FOR YOUR PROJECT" ];
        sortArray(yourProject, projectValue);
        const titles = document.querySelectorAll(".title-line");
        const titlesValue = [ "HAD <span>TO WORK</span> WITH", "SERVICES" ];
        sortArray(titles, titlesValue);
        const footerTitles = document.querySelectorAll(".footer__title");
        const footerTitlesValue = [ "Contact us", "Agency resources" ];
        sortArray(footerTitles, footerTitlesValue);
        const footerItems = document.querySelectorAll(".contacts__title");
        const footerItemsValue = [ "MAIL", "TELEPHONE" ];
        sortArray(footerItems, footerItemsValue);
        const footerBtn = document.querySelectorAll(".footer__agency-btn");
        sortArray(footerBtn, [ "Discuss our project" ]);
        const servTitle = document.querySelectorAll(".services__label");
        const servText = [ "SMM", "PRODUCTION", "YANDEX.ZEN", "TARGETED ADVERTISING", "MEDIA ADVERTISING", "REPUTATION MANAGEMENT", "INFLUENCE-MARKETING", "PR" ];
        sortArray(servTitle, servText);
        const servSubTitle = document.querySelectorAll(".services__text");
        const servSubText = [ "We develop strategies and comprehensively manage accounts in all social networks with clear KPIs", "Full cycle production. We can do everything: from banners to mini-series", "We write and promote so that Yandex itself shares our cases", "We launch advertising campaigns in 5 days, including the development of creatives and setting up analytics", "We launch multi-level advertising campaigns using Big Data in all possible formats", "We write and promote so that Yandex itself shares our cases", "We launch advertising campaigns in 5 days, including the development of creatives and setting up analytics", "We launch multi-level advertising campaigns using Big Data in all possible formats" ];
        sortArray(servSubTitle, servSubText);
    }
    function sortArray(items, values) {
        const arrItems = items;
        const arrValue = values;
        if (1 == arrItems.length) arrItems[0].innerHTML = arrValue[0];
        if (arrItems.length > 1) for (let i = 0; i < arrValue.length; i++) arrItems[i].innerHTML = arrValue[i];
    }
    window["FLS"] = false;
    isWebp();
    addTouchClass();
    menuInit();
})();