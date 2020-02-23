import Note from './Note';

document.addEventListener('DOMContentLoaded', main);

interface XYPosition {
  x: number;
  y: number;
}

class StickyNotes {

  notesZone: HTMLElement;
  trashZone: HTMLElement;
  isDragging: boolean = false;
  isEditing: boolean = false;

  constructor(public canvas: HTMLElement) {
    this.notesZone = canvas.querySelector('#notes-zone') as HTMLElement;
    this.trashZone = canvas.querySelector('#trash-zone') as HTMLElement;

    this.addNote = this.addNote.bind(this);

    this.notesZone.addEventListener('mouseup', (event: MouseEvent) => {
      if (event.button === 0) {
        if (this.isDragging)
          return;
        if (!(event.target as HTMLElement).closest('.note'))
          this.addNote({ x: event.x, y: event.y })
      }
    });

    this.onDragSet = this.onDragSet.bind(this);
  }

  addNote(pos: XYPosition) {
    const note = new Note('Some text', this.notesZone, this.onDragSet);
    const noteElement = note.noteElement;
    note.setPosition({
      x: pos.x - noteElement.offsetWidth / 2,
      y: pos.y - noteElement.offsetHeight / 2
    });
  }

  onDragSet(isDragging: boolean) {
    this.isDragging = isDragging;
  }
}

function main() {
  const canvas: HTMLElement = document.querySelector('#canvas') as HTMLInputElement;
  new StickyNotes(canvas);
}
