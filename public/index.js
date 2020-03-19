!function(e){var t={};function o(n){if(t[n])return t[n].exports;var s=t[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,o),s.l=!0,s.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)o.d(n,s,function(t){return e[t]}.bind(null,s));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=0)}([function(e,t,o){"use strict";o.r(t);class n{constructor(){if(!n.storageAvailable())throw new Error("Storage is not available");if(this.getNotes()||localStorage.setItem("notes","[]"),n._instance)return n._instance;n._instance=this}static storageAvailable(){let e;try{e=window.localStorage;let t="__storage_test__";return e.setItem(t,t),e.removeItem(t),!0}catch(t){return t instanceof DOMException&&(22===t.code||1014===t.code||"QuotaExceededError"===t.name||"NS_ERROR_DOM_QUOTA_REACHED"===t.name)&&e&&0!==e.length}}static setItemToLocalStorage(e){localStorage.setItem("notes",JSON.stringify(e))}getNotes(){const e=localStorage.getItem("notes");return JSON.parse(e)}saveNote(e){const t=this.getNotes();t.push(e),n.setItemToLocalStorage(t)}updateNote(e){const t=this.getNotes(),o=t.findIndex(t=>t.id===e.id);t[o]=e,n.setItemToLocalStorage(t)}removeNote(e){const t=this.getNotes(),o=t.findIndex(t=>t.id===e);t.splice(o,1),n.setItemToLocalStorage(t)}}var s=n;var i=class{constructor(e,t,o="",n=`f${(+new Date).toString(16)+Math.random()}`,i){this.parentElement=e,this.onDragSet=t,this.text=o,this.id=n,this.currentDroppable=null,this.colors=["#bfff25","#0cffc6","#ff9cbf","#ffc92a","#97b7ff","#daa0ff","#69ff72","#c9fff6","#bbbeff","#fcfeff"],this.moveNote=e=>{if(e.target===this.resizingElement)return;const t=this.parentElement.querySelectorAll(".note");for(let e=0;e<t.length;++e)t[e].style.zIndex="1";this.noteElement.style.zIndex="1000";let o=e.clientX-this.noteElement.getBoundingClientRect().left,n=e.clientY-this.noteElement.getBoundingClientRect().top;const s=(e,t)=>{this.setPosition({x:e-o,y:t-n})},i=e=>{e.style.backgroundColor="#fdd1cf"},r=e=>{s(e.pageX,e.pageY),this.noteElement.hidden=!0;let t=document.elementFromPoint(e.clientX,e.clientY);if(this.noteElement.hidden=!1,!t)return;let o=t.closest("#trash-zone");this.currentDroppable!=o&&(this.currentDroppable&&i(this.currentDroppable),this.currentDroppable=o,this.currentDroppable&&(this.currentDroppable.style.backgroundColor="#FDB7B2"))},a=()=>{document.removeEventListener("mousemove",r),this.onDragSet(!1),this.currentDroppable&&(this.removeNote(),i(this.currentDroppable)),this.noteElement.removeEventListener("mouseup",a)};s(e.pageX,e.pageY),document.addEventListener("mousemove",r),this.noteElement.addEventListener("mouseup",a),this.noteElement.addEventListener("dragstart",()=>!1)},this.resizeNoteHandler=e=>{this.onDragSet(!0);const t=this.noteElement.offsetWidth,o=this.noteElement.offsetHeight,n=e.pageX,s=e.pageY,i=e=>{this.setSize({x:t+(e.pageX-n),y:o+(e.pageY-s)})};document.addEventListener("mousemove",i),document.addEventListener("mouseup",()=>{this.onDragSet(!1),document.removeEventListener("mousemove",i)}),this.noteElement.addEventListener("mousedown",this.moveNote)},this.textInputHandler=e=>{this.text=e.target.value,this.store.updateNote(this.getNoteData())},this.setPosition=e=>{this.position=e,this.noteElement.style.left=e.x+"px",this.noteElement.style.top=e.y+"px",this.store.updateNote(this.getNoteData())},this.setSize=e=>{this.size=e,this.noteElement.style.width=e.x+"px",this.noteElement.style.height=e.y+"px",this.store.updateNote(this.getNoteData())},this.removeNote=()=>{this.store.removeNote(this.id),this.resizingElement.removeEventListener("mousedown",this.resizeNoteHandler),this.parentElement.removeChild(this.noteElement)},this.getNoteData=()=>({id:this.id,color:this.color,position:this.position,size:{x:this.noteElement.offsetWidth,y:this.noteElement.offsetHeight},text:this.text}),this.store=new s,this.noteElement=document.createElement("div"),this.noteElement.classList.add("note");const r=Math.floor(10*Math.random());this.color=this.colors[r],i&&(this.color=i),this.noteElement.style.backgroundColor=this.color,this.noteElement.innerHTML=`\n        <div class="note-inner">\n            <textarea class="text" placeholder="Your text here">${this.text}</textarea>\n        </div>        \n        <span class="resize"></span>\n    `,this.textArea=this.noteElement.querySelector(".text"),this.parentElement.appendChild(this.noteElement),this.resizingElement=this.noteElement.querySelector(".resize"),this.resizingElement.addEventListener("mousedown",this.resizeNoteHandler),this.noteElement.addEventListener("mousedown",this.moveNote),this.textArea.addEventListener("keyup",this.textInputHandler)}};class r{constructor(e){this.canvas=e,this.isDragging=!1,this.addNote=(e,t)=>{const o=new i(this.notesZone,this.onDragSet,e.text,e.id,e.color);o.setPosition({x:e.position.x,y:e.position.y}),t&&t(o)},this.notesZone=e.querySelector("#notes-zone"),this.trashZone=e.querySelector("#trash-zone"),this.store=new s,this.notesZone.addEventListener("mouseup",e=>{if(0===e.button){if(this.isDragging)return;e.target.closest(".note")||this.addNote({position:{x:e.x,y:e.y}},e=>this.store.saveNote(e.getNoteData()))}}),this.onDragSet=this.onDragSet.bind(this),this.setNotesFromStorage()}setNotesFromStorage(){this.store.getNotes().forEach(e=>{this.addNote(e,t=>t.setSize(e.size))})}onDragSet(e){this.isDragging=e}}document.addEventListener("DOMContentLoaded",(function(){const e=document.querySelector("#canvas");new r(e)}))}]);
//# sourceMappingURL=index.js.map