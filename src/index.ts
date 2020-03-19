'use strict';
import Note, { NoteData } from './Note';
import LStorage from './LStorage';

class StickyNotes {

  notesZone: HTMLElement;
  trashZone: HTMLElement;
  store: LStorage;
  isDragging: boolean = false;

  constructor(public canvas: HTMLElement) {
    this.notesZone = canvas.querySelector('#notes-zone') as HTMLElement;
    this.trashZone = canvas.querySelector('#trash-zone') as HTMLElement;

    this.store = new LStorage();

    this.notesZone.addEventListener('mouseup', (event: MouseEvent) => {
      if (event.button === 0) {
        if (this.isDragging)
          return;
        if (!(event.target as HTMLElement).closest('.note'))
          this.addNote({
            position: { x: event.x, y: event.y }
          }, (note) => this.store.saveNote(note.getNoteData()))
      }
    });

    this.onDragSet = this.onDragSet.bind(this);

    this.setNotesFromStorage();
  }

  setNotesFromStorage() {
    const notes = this.store.getNotes();
    notes.forEach(noteData => {
      this.addNote(noteData, note => note.setSize(noteData.size));
    })
  }

  addNote = (noteData: NoteData, cb?: (note: Note) => void) => {
    const note = new Note(
      this.notesZone,
      this.onDragSet,
      noteData.text,
      noteData.id,
      noteData.color);
    note.setPosition({
      x: noteData.position.x,
      y: noteData.position.y
    });
    cb && cb(note);
  };

  onDragSet(isDragging: boolean) {
    this.isDragging = isDragging;
  }
}

function main() {
  const canvas: HTMLElement = document.querySelector('#canvas') as HTMLInputElement;
  new StickyNotes(canvas);
}

document.addEventListener('DOMContentLoaded', main);
