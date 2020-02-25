!function(e){var t={};function n(o){if(t[o])return t[o].exports;var s=t[o]={i:o,l:!1,exports:{}};return e[o].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)n.d(o,s,function(t){return e[t]}.bind(null,s));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);class o{constructor(){if(!this.storageAvailable())throw new Error("Instantiation failed: storage is not available");if(o._instance)throw new Error("Instantiation failed: use Singleton.getInstance() instead of new.");o._instance=this,this.getNotes()||localStorage.setItem("notes","[]")}static getInstance(){return o._instance?o._instance:o._instance=new o}storageAvailable(){let e;try{e=window.localStorage;let t="__storage_test__";return e.setItem(t,t),e.removeItem(t),!0}catch(t){return t instanceof DOMException&&(22===t.code||1014===t.code||"QuotaExceededError"===t.name||"NS_ERROR_DOM_QUOTA_REACHED"===t.name)&&e&&0!==e.length}}getNotes(){const e=localStorage.getItem("notes");return JSON.parse(e)}addNote(e){const t=this.getNotes();t.push(e),localStorage.setItem("notes",JSON.stringify(t))}updateNote(e){const t=this.getNotes(),n=t.findIndex(t=>t.id===e.id);t[n]=e,localStorage.setItem("notes",JSON.stringify(t))}removeNote(e){const t=this.getNotes(),n=t.findIndex(t=>t.id===e);t.splice(n,1),localStorage.setItem("notes",JSON.stringify(t))}}var s=o;var i=class{constructor(e,t,n="",o=`f${(+new Date).toString(16)+Math.random()}`,i){this.parentElement=e,this.onDragSet=t,this.text=n,this.id=o,this.isDragging=!1,this.isEditing=!1,this.currentDroppable=null,this.colors=["#bfff25","#0cffc6","#ff9cbf","#ffc92a","#97b7ff","#daa0ff","#69ff72","#c9fff6","#bbbeff","#fcfeff"],this.store=s.getInstance(),this.noteElement=document.createElement("div"),this.noteElement.classList.add("note");const r=Math.floor(10*Math.random());this.color=this.colors[r],i&&(this.color=i),this.noteElement.style.backgroundColor=this.color,this.noteElement.innerHTML=`\n        <div class="note-inner">\n            <textarea class="text" placeholder="Your text here">${this.text}</textarea>\n        </div>        \n        <span class="resize"></span>\n    `,this.textArea=this.noteElement.querySelector(".text"),this.resizeNoteHandler=this.resizeNoteHandler.bind(this),this.textInputHandler=this.textInputHandler.bind(this),this.moveNote=this.moveNote.bind(this),this.parentElement.appendChild(this.noteElement),this.resizingElement=this.noteElement.querySelector(".resize"),this.resizingElement.addEventListener("mousedown",this.resizeNoteHandler),this.noteElement.addEventListener("mousedown",this.moveNote),this.textArea.addEventListener("keyup",this.textInputHandler)}moveNote(e){if(e.target===this.resizingElement)return;const t=this.parentElement.querySelectorAll(".note");for(let e=0;e<t.length;++e)t[e].style.zIndex="1";this.noteElement.style.zIndex="1000";let n=e.clientX-this.noteElement.getBoundingClientRect().left,o=e.clientY-this.noteElement.getBoundingClientRect().top;const s=(e,t)=>{this.setPosition({x:e-n,y:t-o})},i=e=>{e.style.backgroundColor="#fdd1cf"},r=e=>{s(e.pageX,e.pageY),this.noteElement.hidden=!0;let t=document.elementFromPoint(e.clientX,e.clientY);if(this.noteElement.hidden=!1,!t)return;let n=t.closest("#trash-zone");this.currentDroppable!=n&&(this.currentDroppable&&i(this.currentDroppable),this.currentDroppable=n,this.currentDroppable&&(this.currentDroppable.style.backgroundColor="#FDB7B2"))},a=()=>{document.removeEventListener("mousemove",r),this.onDragSet(!1),this.currentDroppable&&(this.removeNote(),i(this.currentDroppable)),this.noteElement.removeEventListener("mouseup",a)};s(e.pageX,e.pageY),document.addEventListener("mousemove",r),this.noteElement.addEventListener("mouseup",a),this.noteElement.addEventListener("dragstart",()=>!1)}resizeNoteHandler(e){this.onDragSet(!0);const t=this.noteElement.offsetWidth,n=this.noteElement.offsetHeight,o=e.pageX,s=e.pageY,i=e=>{this.setSize({x:t+(e.pageX-o),y:n+(e.pageY-s)})};document.addEventListener("mousemove",i),document.addEventListener("mouseup",()=>{this.onDragSet(!1),document.removeEventListener("mousemove",i)}),this.noteElement.addEventListener("mousedown",this.moveNote)}textInputHandler(e){this.text=e.target.value,this.store.updateNote(this.getNoteData())}setPosition(e){this.position=e,this.noteElement.style.left=e.x+"px",this.noteElement.style.top=e.y+"px",this.store.updateNote(this.getNoteData())}setSize(e){this.size=e,this.noteElement.style.width=e.x+"px",this.noteElement.style.height=e.y+"px",this.store.updateNote(this.getNoteData())}removeNote(){this.store.removeNote(this.id),this.resizingElement.removeEventListener("mousedown",this.resizeNoteHandler),this.parentElement.removeChild(this.noteElement)}getNoteData(){return{id:this.id,color:this.color,position:this.position,size:{x:this.noteElement.offsetWidth,y:this.noteElement.offsetHeight},text:this.text}}};class r{constructor(e){this.canvas=e,this.isDragging=!1,this.isEditing=!1,this.notesZone=e.querySelector("#notes-zone"),this.trashZone=e.querySelector("#trash-zone"),this.store=new s,this.addNote=this.addNote.bind(this),this.notesZone.addEventListener("mouseup",e=>{if(0===e.button){if(this.isDragging)return;e.target.closest(".note")||this.addNote({position:{x:e.x,y:e.y}},e=>this.store.addNote(e.getNoteData()))}}),this.onDragSet=this.onDragSet.bind(this),this.setNotesFromStorage()}setNotesFromStorage(){this.store.getNotes().forEach(e=>{this.addNote(e,t=>t.setSize(e.size))})}addNote(e,t){const n=new i(this.notesZone,this.onDragSet,e.text,e.id,e.color);n.setPosition({x:e.position.x,y:e.position.y}),t&&t(n)}onDragSet(e){this.isDragging=e}}document.addEventListener("DOMContentLoaded",(function(){const e=document.querySelector("#canvas");new r(e)}))}]);
//# sourceMappingURL=index.js.map