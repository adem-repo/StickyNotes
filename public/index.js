document.addEventListener('DOMContentLoaded', main);
var StickyNotes = /** @class */ (function () {
    function StickyNotes(canvas) {
        var _this = this;
        this.canvas = canvas;
        this.isDragging = false;
        this.isEditing = false;
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
        this.notesZone = canvas.querySelector('#notes-zone');
        this.trashZone = canvas.querySelector('#trash-zone');
        this.addNote = this.addNote.bind(this);
        this.notesZone.addEventListener('mouseup', function (event) {
            if (event.button === 0) {
                if (_this.isDragging)
                    return;
                if (!event.target.closest('.note'))
                    _this.addNote({ x: event.x, y: event.y });
            }
        });
    }
    StickyNotes.prototype.addNote = function (pos) {
        var _this = this;
        // Creating new note
        var noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.style.backgroundColor = this.colors[Math.floor(Math.random() * 10)];
        noteElement.innerHTML = "\n        <div class=\"note-inner\">\n            <textarea class=\"text\" placeholder=\"Your text here\"></textarea>\n        </div>        \n        <span class=\"resize\"></span>\n    ";
        this.notesZone.append(noteElement);
        noteElement.style.left = pos.x - noteElement.offsetWidth / 2 + 'px';
        noteElement.style.top = pos.y - noteElement.offsetHeight / 2 + 'px';
        //
        var currentDroppable = null;
        var textElement = noteElement.querySelector('.text');
        textElement.addEventListener('focus', function (event) {
            event.preventDefault();
            return false;
        });
        var resizingElement = noteElement.querySelector('.resize');
        resizingElement.addEventListener('mousedown', function (event) {
            _this.isDragging = true;
            var noteWidth = noteElement.offsetWidth;
            var noteHeight = noteElement.offsetHeight;
            var startX = event.pageX;
            var startY = event.pageY;
            var onNoteResize = function (event) {
                noteElement.style.width = noteWidth + (event.pageX - startX) + 'px';
                noteElement.style.height = noteHeight + (event.pageY - startY) + 'px';
            };
            var onMouseUp = function () {
                _this.isDragging = false;
                document.removeEventListener('mousemove', onNoteResize);
            };
            document.addEventListener('mousemove', onNoteResize);
            document.addEventListener('mouseup', onMouseUp);
        });
        noteElement.addEventListener('mousedown', function (event) {
            if (event.target === resizingElement)
                return;
            // Moving note to front
            var notes = _this.notesZone.querySelectorAll('.note');
            for (var i = 0; i < notes.length; ++i) {
                notes[i].style.zIndex = '1';
            }
            noteElement.style.zIndex = '1000';
            //
            var shiftX = event.clientX - noteElement.getBoundingClientRect().left;
            var shiftY = event.clientY - noteElement.getBoundingClientRect().top;
            var moveAt = function (pageX, pageY) {
                noteElement.style.left = pageX - shiftX + 'px';
                noteElement.style.top = pageY - shiftY + 'px';
            };
            var enterDroppable = function (elem) {
                elem.style.background = 'pink';
            };
            var leaveDroppable = function (elem) {
                elem.style.background = '';
            };
            var onMouseMove = function (event) {
                _this.isDragging = true;
                moveAt(event.pageX, event.pageY);
                noteElement.hidden = true;
                var elemBelow = document.elementFromPoint(event.clientX, event.clientY);
                noteElement.hidden = false;
                if (!elemBelow)
                    return;
                var droppableBelow = elemBelow.closest('#trash-zone');
                if (currentDroppable != droppableBelow) {
                    if (currentDroppable) {
                        leaveDroppable(currentDroppable);
                    }
                    currentDroppable = droppableBelow;
                    if (currentDroppable) {
                        enterDroppable(currentDroppable);
                    }
                }
            };
            var onMouseUp = function () {
                document.removeEventListener('mousemove', onMouseMove);
                if (!_this.isDragging) {
                    _this.isEditing = true;
                }
                _this.isDragging = false;
                if (currentDroppable) {
                    _this.notesZone.removeChild(noteElement);
                    leaveDroppable(currentDroppable);
                }
                noteElement.removeEventListener('mouseup', onMouseUp);
            };
            moveAt(event.pageX, event.pageY);
            document.addEventListener('mousemove', onMouseMove);
            noteElement.addEventListener('mouseup', onMouseUp);
            noteElement.addEventListener('dragstart', function () { return false; });
        });
    };
    return StickyNotes;
}());
function main() {
    var canvas = document.querySelector('#canvas');
    new StickyNotes(canvas);
}
