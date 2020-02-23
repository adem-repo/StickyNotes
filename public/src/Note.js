"use strict";
exports.__esModule = true;
var Note = /** @class */ (function () {
    function Note(position, id, text) {
        this.position = position;
        this.id = id;
        this.text = text;
        this.colors = [
            '#bfff25',
            '#0cffc6',
            '#ff9cbf',
            '#ffc92a',
            '#97b7ff',
            '#daa0ff',
            '#69ff72',
            '#c9fff6',
            '#bbbeff',
        ];
        this.noteElement = document.createElement('div');
        this.noteElement.classList.add('note');
        this.noteElement.style.backgroundColor = this.colors[Math.floor(Math.random() * 10)];
        this.noteElement.innerHTML = "\n        <div class=\"note-inner\">\n            <textarea class=\"text\" placeholder=\"Your text here\">" + this.text + "</textarea>\n        </div>        \n        <span class=\"resize\"></span>\n    ";
        this.noteElement.style.left = this.position.x - this.noteElement.offsetWidth / 2 + 'px';
        this.noteElement.style.top = this.position.y - this.noteElement.offsetHeight / 2 + 'px';
    }
    return Note;
}());
exports["default"] = Note;
