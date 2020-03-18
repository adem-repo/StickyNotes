import { NoteData } from 'src/Note';

class LStorage {

  protected static _instance: LStorage;

  constructor() {

    if (!LStorage.storageAvailable()) {
      throw new Error("Storage is not available");
    }

    if (!this.getNotes()) {
      localStorage.setItem('notes', '[]');
    }

    if (LStorage._instance) {
      return LStorage._instance;
    }

    LStorage._instance = this;
  }

  private static storageAvailable(): boolean {
    let storage;
    try {
      storage = window['localStorage'];
      let x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch(e) {
      return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        (storage && storage.length !== 0);
    }
  }

  private static setItemToLocalStorage(notes: NoteData[]) {
    localStorage.setItem('notes', JSON.stringify(notes));
  }

  getNotes(): NoteData[] {
    const notesString = localStorage.getItem('notes');
    return JSON.parse(notesString);
  }

  addNote(noteData: NoteData) {
    const notes = this.getNotes();
    notes.push(noteData);
    LStorage.setItemToLocalStorage(notes);
  }

  updateNote(noteData: NoteData) {
    const notes = this.getNotes();
    const noteIndex = notes.findIndex(note => note.id === noteData.id);
    notes[noteIndex] = noteData;
    LStorage.setItemToLocalStorage(notes);
  }

  removeNote(id: string) {
    const notes: NoteData[] = this.getNotes();
    const noteIndex = notes.findIndex( note => note.id === id);
    notes.splice(noteIndex, 1);
    LStorage.setItemToLocalStorage(notes);
  }
}

export default LStorage;
