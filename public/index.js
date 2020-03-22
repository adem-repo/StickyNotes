!function(t){var e={};function n(o){if(e[o])return e[o].exports;var s=e[o]={i:o,l:!1,exports:{}};return t[o].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)n.d(o,s,function(e){return t[e]}.bind(null,s));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";n.r(e);class o{constructor(){if(!o.storageAvailable())throw new Error("Storage is not available");if(this.getNotes()||localStorage.setItem("notes","[]"),o._instance)return o._instance;o._instance=this}static storageAvailable(){let t;try{t=window.localStorage;let e="__storage_test__";return t.setItem(e,e),t.removeItem(e),!0}catch(e){return e instanceof DOMException&&(22===e.code||1014===e.code||"QuotaExceededError"===e.name||"NS_ERROR_DOM_QUOTA_REACHED"===e.name)&&t&&0!==t.length}}static setItemToLocalStorage(t){localStorage.setItem("notes",JSON.stringify(t))}getNotes(){const t=localStorage.getItem("notes");return JSON.parse(t)}saveNote(t){const e=this.getNotes();e.push(t),o.setItemToLocalStorage(e)}updateNote(t){const e=this.getNotes(),n=e.findIndex(e=>e.id===t.id);e[n]=t,o.setItemToLocalStorage(e)}removeNote(t){const e=this.getNotes(),n=e.findIndex(e=>e.id===t);e.splice(n,1),o.setItemToLocalStorage(e)}}var s=o,i=function(t,e,n,o){return new(n||(n=Promise))((function(s,i){function r(t){try{a(o.next(t))}catch(t){i(t)}}function l(t){try{a(o.throw(t))}catch(t){i(t)}}function a(t){var e;t.done?s(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(r,l)}a((o=o.apply(t,e||[])).next())}))};var r=class{constructor(t){this.props=t,this.currentDroppable=null,this.colors=["#bfff25","#0cffc6","#ff9cbf","#ffc92a","#97b7ff","#daa0ff","#69ff72","#c9fff6","#bbbeff","#fcfeff"],this.moveNote=t=>{if(t.target===this.resizingElement)return;this.startDragPosition=this.position;let e=t.clientX-this.noteElement.getBoundingClientRect().left,n=t.clientY-this.noteElement.getBoundingClientRect().top;const o=(t,o)=>{this.setPosition({x:t-e,y:o-n})},s=t=>{t.style.backgroundColor="#fdd1cf"},r=t=>{o(t.pageX,t.pageY),this.noteElement.hidden=!0;let e=document.elementFromPoint(t.clientX,t.clientY);if(this.noteElement.hidden=!1,!e)return;let n=e.closest("#trash-zone");this.currentDroppable!==n&&(this.currentDroppable&&s(this.currentDroppable),this.currentDroppable=n,this.currentDroppable&&(this.currentDroppable.style.backgroundColor="#FDB7B2"))},l=()=>i(this,void 0,void 0,(function*(){document.removeEventListener("mousemove",r),this.props.onDragSet(!1),this.currentDroppable&&(this.removeNote(),s(this.currentDroppable)),this.noteElement.removeEventListener("mouseup",l),document.removeEventListener("mouseup",l),this.currentDroppable=null}));o(t.pageX,t.pageY),document.addEventListener("mousemove",r),document.addEventListener("mouseup",l),this.noteElement.addEventListener("mouseup",l),this.noteElement.addEventListener("dragstart",()=>!1)},this.resizeNoteHandler=t=>{this.props.onDragSet(!0);const e=this.noteElement.offsetWidth,n=this.noteElement.offsetHeight,o=t.pageX,s=t.pageY;let i=e,r=n;const l=t=>{let l=e+(t.pageX-o),a=n+(t.pageY-s);l<200&&(l=i),a<150&&(a=r),i=l,r=a,this.setSize({x:l,y:a})};document.addEventListener("mousemove",l),document.addEventListener("mouseup",()=>{this.props.onDragSet(!1),document.removeEventListener("mousemove",l)},{once:!0})},this.textInputHandler=t=>{this.text=t.target.value,this.store.updateNote(this.getNoteData())},this.setPosition=t=>{this.position=t,this.noteElement.style.left=t.x+"px",this.noteElement.style.top=t.y+"px",this.store.updateNote(this.getNoteData())},this.setSize=t=>{this.size=t,this.noteElement.style.width=t.x+"px",this.noteElement.style.height=t.y+"px",this.store.updateNote(this.getNoteData())},this.removeNote=()=>i(this,void 0,void 0,(function*(){(yield this.props.onRemove(this))&&this.resizingElement.removeEventListener("mousedown",this.resizeNoteHandler)})),this.getNoteData=()=>({id:this.id,color:this.color,position:this.position,size:{x:this.noteElement.offsetWidth,y:this.noteElement.offsetHeight},text:this.text}),this.id=t.id||`f${(+new Date).toString(16)+Math.random()}`,this.text=t.text||"",this.store=new s,this.noteElement=document.createElement("div"),this.noteElement.classList.add("note");const e=Math.floor(10*Math.random());this.color=this.colors[e],t.color&&(this.color=t.color),this.noteElement.style.backgroundColor=this.color,this.noteElement.innerHTML=`\n        <div class="note-inner">\n            <textarea class="text" placeholder="Your text here">${this.text}</textarea>\n        </div>        \n        <span class="resize"></span>\n    `,this.textArea=this.noteElement.querySelector(".text"),this.resizingElement=this.noteElement.querySelector(".resize"),this.resizingElement.addEventListener("mousedown",this.resizeNoteHandler),this.noteElement.addEventListener("mousedown",this.moveNote),this.textArea.addEventListener("keyup",this.textInputHandler)}};var l=class{constructor(t,e){this.color=t,this.text=e,this.count=5,this.isPaused=!1,this.removeOnTimeout=()=>new Promise((t,e)=>{this.breakOnClick(e),this.interval=setInterval(()=>{this.count<=0&&(clearInterval(this.interval),this.htmlElement.removeEventListener("hover",this.hoverHandler),t()),this.counterElement.innerText=this.count.toString(),--this.count},1e3)}),this.hoverHandler=()=>{this.isPaused=!0},this.breakOnClick=t=>{this.htmlElement.addEventListener("click",()=>{clearInterval(this.interval),t()})},this.htmlElement=document.createElement("div"),this.htmlElement.classList.add("note-thumbnail"),this.htmlElement.style.backgroundColor=t,this.counterElement=document.createElement("p"),this.counterElement.classList.add("counter"),this.counterElement.innerText=this.count.toString(),this.textElement=document.createElement("p"),this.textElement.classList.add("text"),this.textElement.innerText=e,this.restoreElement=document.createElement("div"),this.restoreElement.classList.add("restore"),this.restoreElement.innerText="restore",this.htmlElement.append(this.counterElement,this.textElement,this.restoreElement),this.htmlElement.addEventListener("hover",this.hoverHandler)}},a=function(t,e,n,o){return new(n||(n=Promise))((function(s,i){function r(t){try{a(o.next(t))}catch(t){i(t)}}function l(t){try{a(o.throw(t))}catch(t){i(t)}}function a(t){var e;t.done?s(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(r,l)}a((o=o.apply(t,e||[])).next())}))};class h{constructor(t){this.canvas=t,this.isDragging=!1,this.addNote=(t,e)=>{const n=new r({onDragSet:this.onDragSet,onRemove:this.removeNote,text:t.text,id:t.id,color:t.color});n.setPosition({x:t.position.x,y:t.position.y}),this.notesZone.appendChild(n.noteElement),e&&e(n)},this.removeNote=t=>a(this,void 0,void 0,(function*(){const e=new l(t.color,t.text);this.trashZone.appendChild(e.htmlElement),t.noteElement.style.visibility="hidden";let n=!1;try{yield e.removeOnTimeout(),this.trashZone.removeChild(e.htmlElement),this.notesZone.removeChild(t.noteElement),this.store.removeNote(t.id),n=!0}catch(n){this.trashZone.removeChild(e.htmlElement),t.noteElement.style.visibility="visible",t.setPosition(t.startDragPosition)}return n})),this.notesZone=t.querySelector("#notes-zone"),this.trashZone=t.querySelector("#trash-zone"),this.store=new s,this.notesZone.addEventListener("mouseup",t=>{if(0===t.button){if(this.isDragging)return;t.target.closest(".note")||this.addNote({position:{x:t.x,y:t.y}},t=>this.store.saveNote(t.getNoteData()))}}),this.onDragSet=this.onDragSet.bind(this),this.setNotesFromStorage()}setNotesFromStorage(){this.store.getNotes().forEach(t=>{this.addNote(t,e=>e.setSize(t.size))})}onDragSet(t){this.isDragging=t}}document.addEventListener("DOMContentLoaded",(function(){const t=document.querySelector("#canvas");new h(t)}))}]);
//# sourceMappingURL=index.js.map