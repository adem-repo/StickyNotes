import { NoteData } from 'src/Note';

class LStorage {

  protected static _instance: LStorage;

  constructor() {
    if (!this.storageAvailable()) {
      throw new Error("Instantiation failed: storage is not available");
    }
    if (LStorage._instance) {
      throw new Error("Instantiation failed: use Singleton.getInstance() instead of new.");
    }
    LStorage._instance = this;

    if (!this.getNotes()) {
      localStorage.setItem('notes', '[]');
    }
  }

  public static getInstance(): LStorage {
    if (LStorage._instance) {
      return LStorage._instance;
    }
    return LStorage._instance = new LStorage;
  }

  storageAvailable(): boolean {
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

  getNotes(): NoteData[] {
    const notesString = localStorage.getItem('notes');
    return JSON.parse(notesString);
  }

  addNote(noteData: NoteData) {
    const notes = this.getNotes();
    notes.push(noteData);
    localStorage.setItem('notes', JSON.stringify(notes));
  }

  updateNote(noteData: NoteData) {
    const notes = this.getNotes();
    const noteIndex = notes.findIndex(note => note.id === noteData.id);
    notes[noteIndex] = noteData;
    localStorage.setItem('notes', JSON.stringify(notes));
  }

  removeNote(id: string) {
    const notes = this.getNotes();
    const noteIndex = notes.findIndex( note => note.id === id);
    notes.splice(noteIndex, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
  }
}

export default LStorage;
