import LStorage from './LStorage';

export interface Vector {
  x: number;
  y: number;
}

export interface NoteData {
  id?: string;
  text?: string;
  position?: Vector;
  size?: Vector;
  color?: string;
}

class Note {

  noteElement: HTMLElement;
  resizingElement: HTMLElement;
  textArea: HTMLTextAreaElement;
  currentDroppable: HTMLElement | null = null;
  colors = [
    '#bfff25',
    '#0cffc6',
    '#ff9cbf',
    '#ffc92a',
    '#97b7ff',
    '#daa0ff',
    '#69ff72',
    '#c9fff6',
    '#bbbeff',
    '#fcfeff',
  ];
  store: LStorage;
  color: string;
  position: Vector;
  size: Vector;

  constructor(
    public parentElement: HTMLElement,
    public onDragSet: (isDraggeable: boolean) => void,
    public text: string = '',
    public id: string = `f${(+new Date).toString(16)+Math.random()}`,
    color?: string
  ) {
    this.store = LStorage.getInstance();
    this.noteElement = document.createElement('div');
    this.noteElement.classList.add('note');

    const rand = Math.floor(Math.random() * 10);
    this.color = this.colors[rand];
    if (color)
      this.color = color;

    this.noteElement.style.backgroundColor = this.color;
    this.noteElement.innerHTML = `
        <div class="note-inner">
            <textarea class="text" placeholder="Your text here">${this.text}</textarea>
        </div>        
        <span class="resize"></span>
    `;

    this.textArea = this.noteElement.querySelector('.text');

    this.resizeNoteHandler = this.resizeNoteHandler.bind(this);
    this.textInputHandler = this.textInputHandler.bind(this);
    this.moveNote = this.moveNote.bind(this);

    this.parentElement.appendChild(this.noteElement);
    this.resizingElement = this.noteElement.querySelector('.resize') as HTMLElement;
    this.resizingElement.addEventListener('mousedown', this.resizeNoteHandler);
    this.noteElement.addEventListener('mousedown', this.moveNote);
    this.textArea.addEventListener('keyup', this.textInputHandler);
  }

  moveNote(event: MouseEvent) {

    if (event.target === this.resizingElement)
      return;

    // Moving note to front
    const notes = this.parentElement.querySelectorAll('.note') as NodeListOf<HTMLElement>;
    for (let i = 0; i < notes.length; ++i) {
      notes[i].style.zIndex = '1';
    }
    this.noteElement.style.zIndex = '1000';
    //

    let shiftX = event.clientX - this.noteElement.getBoundingClientRect().left;
    let shiftY = event.clientY - this.noteElement.getBoundingClientRect().top;

    const moveAt = (pageX: number, pageY: number) => {
      this.setPosition({
        x: pageX - shiftX,
        y: pageY - shiftY,
      })
    };

    const enterDroppable = (elem: HTMLElement) => {
      elem.style.backgroundColor = '#FDB7B2';
    };

    const leaveDroppable = (elem: HTMLElement) => {
      elem.style.backgroundColor = '#fdd1cf';
    };

    const onMouseMove = (event: MouseEvent) => {

      moveAt(event.pageX, event.pageY);

      this.noteElement.hidden = true;
      let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      this.noteElement.hidden = false;

      if (!elemBelow) return;

      let droppableBelow: HTMLElement | null = elemBelow.closest('#trash-zone');
      if (this.currentDroppable != droppableBelow) {
        if (this.currentDroppable) {
          leaveDroppable(this.currentDroppable);
        }
        this.currentDroppable = droppableBelow;
        if (this.currentDroppable) {
          enterDroppable(this.currentDroppable);
        }
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      this.onDragSet(false);
      if (this.currentDroppable) {
        this.removeNote();
        leaveDroppable(this.currentDroppable);
      }
      this.noteElement.removeEventListener('mouseup', onMouseUp);
    };

    moveAt(event.pageX, event.pageY);

    document.addEventListener('mousemove', onMouseMove);
    this.noteElement.addEventListener('mouseup', onMouseUp);
    this.noteElement.addEventListener('dragstart', () => false);

  }

  resizeNoteHandler(event: MouseEvent) {
    this.onDragSet(true);
    const noteWidth = this.noteElement.offsetWidth;
    const noteHeight = this.noteElement.offsetHeight;
    const startX = event.pageX;
    const startY = event.pageY;
    const onNoteResize = (event: MouseEvent) => {
      this.setSize({
        x: noteWidth + (event.pageX - startX),
        y: noteHeight + (event.pageY - startY),
      })
    };
    const onMouseUp = () => {
      this.onDragSet(false);
      document.removeEventListener('mousemove', onNoteResize);
    };
    document.addEventListener('mousemove', onNoteResize);
    document.addEventListener('mouseup', onMouseUp);
    this.noteElement.addEventListener('mousedown', this.moveNote);
  }

  textInputHandler(event: InputEvent) {
    this.text = (event.target as HTMLTextAreaElement).value;
    this.store.updateNote(this.getNoteData());
  }

  setPosition(position: Vector) {
    this.position = position;
    this.noteElement.style.left = position.x + 'px';
    this.noteElement.style.top = position.y + 'px';
    this.store.updateNote(this.getNoteData());
  };

  setSize(size: Vector) {
    this.size = size;
    this.noteElement.style.width = size.x + 'px';
    this.noteElement.style.height = size.y + 'px';
    this.store.updateNote(this.getNoteData());
  }

  removeNote() {
    this.store.removeNote(this.id);
    this.resizingElement.removeEventListener('mousedown', this.resizeNoteHandler);
    this.parentElement.removeChild(this.noteElement);
  }

  getNoteData(): NoteData {
    return {
      id: this.id,
      color: this.color,
      position: this.position,
      size: {
        x: this.noteElement.offsetWidth,
        y: this.noteElement.offsetHeight,
      },
      text: this.text
    }
  }
}

export default Note;
