import LStorage from './LStorage';

export interface Vector {
  x: number;
  y: number;
}

export interface NoteData {
  id?: string;
  text?: string;
  position: Vector;
  size?: Vector;
  color?: string;
}

interface NoteProps {
  onDragSet: (isDraggeable: boolean) => void,
  onRemove: (note: Note) => Promise<boolean>,
  text: string,
  id: string,
  color?: string
}

class Note {

  readonly id: string;
  noteElement: HTMLElement;
  private readonly resizingElement: HTMLElement;
  private textArea: HTMLTextAreaElement;
  private currentDroppable: HTMLElement | null = null;
  private store: LStorage;
  readonly color: string;
  private position: Vector;
  private size: Vector;
  text: string;
  startDragPosition: Vector;
  private colors = [
    '#bfff25', '#0cffc6', '#ff9cbf', '#ffc92a', '#97b7ff',
    '#daa0ff', '#69ff72', '#c9fff6', '#bbbeff', '#fcfeff',
  ];

  constructor(public props: NoteProps) {
    this.id = props.id || `f${(+new Date).toString(16)+Math.random()}`;
    this.text = props.text || '';
    this.store = new LStorage();
    this.noteElement = document.createElement('div');
    this.noteElement.classList.add('note');

    const rand = Math.floor(Math.random() * 10);
    this.color = this.colors[rand];
    if (props.color)
      this.color = props.color;

    this.noteElement.style.backgroundColor = this.color;
    this.noteElement.innerHTML = `
        <div class="note-inner">
            <textarea class="text" placeholder="Your text here">${this.text}</textarea>
        </div>        
        <span class="resize"></span>
    `;

    this.textArea = this.noteElement.querySelector('.text');

    this.resizingElement = this.noteElement.querySelector('.resize') as HTMLElement;
    this.resizingElement.addEventListener('mousedown', this.resizeNoteHandler);
    this.noteElement.addEventListener('mousedown', this.moveNote);
    this.textArea.addEventListener('keyup', this.textInputHandler);
  }

  moveNote = (event: MouseEvent) => {

    if (event.target === this.resizingElement)
      return;

    this.startDragPosition = this.position;

    // Moving note to front
    // const notes = this.parentElement.querySelectorAll('.note') as NodeListOf<HTMLElement>;
    // for (let i = 0; i < notes.length; ++i) {
    //   notes[i].style.zIndex = '1';
    // }
    // this.noteElement.style.zIndex = '1000';
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
      if (this.currentDroppable !== droppableBelow) {
        if (this.currentDroppable) {
          leaveDroppable(this.currentDroppable);
        }
        this.currentDroppable = droppableBelow;
        if (this.currentDroppable) {
          enterDroppable(this.currentDroppable);
        }
      }
    };

    const onMouseUp = async () => {
      document.removeEventListener('mousemove', onMouseMove);
      this.props.onDragSet(false);
      if (this.currentDroppable) {
        this.removeNote();
        leaveDroppable(this.currentDroppable);
      }
      this.noteElement.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseup', onMouseUp);
      this.currentDroppable = null;
    };

    moveAt(event.pageX, event.pageY);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    this.noteElement.addEventListener('mouseup', onMouseUp);
    this.noteElement.addEventListener('dragstart', () => false);

  };

  resizeNoteHandler = (event: MouseEvent) => {
    this.props.onDragSet(true);
    const noteWidth = this.noteElement.offsetWidth;
    const noteHeight = this.noteElement.offsetHeight;
    const startX = event.pageX;
    const startY = event.pageY;

    let prevWidth = noteWidth;
    let prevHeight = noteHeight;

    const onNoteResize = (event: MouseEvent) => {
      let nextWidth = noteWidth + (event.pageX - startX);
      let nextHeight = noteHeight + (event.pageY - startY);

      if (nextWidth < 200) {
        nextWidth = prevWidth;
      }

      if (nextHeight < 150) {
        nextHeight = prevHeight;
      }

      prevWidth = nextWidth;
      prevHeight = nextHeight;

      this.setSize({
        x: nextWidth,
        y: nextHeight,
      });
    };

    const onMouseUp = () => {
      this.props.onDragSet(false);
      document.removeEventListener('mousemove', onNoteResize);
    };

    document.addEventListener('mousemove', onNoteResize);
    document.addEventListener('mouseup', onMouseUp, { once: true });
    // this.noteElement.addEventListener('mousedown', this.moveNote);
  };

  textInputHandler = (event: InputEvent) => {
    this.text = (event.target as HTMLTextAreaElement).value;
    this.store.updateNote(this.getNoteData());
  };

  setPosition = (position: Vector) => {
    this.position = position;
    this.noteElement.style.left = position.x + 'px';
    this.noteElement.style.top = position.y + 'px';
    this.store.updateNote(this.getNoteData());
  };

  setSize = (size: Vector) => {
    this.size = size;
    this.noteElement.style.width = size.x + 'px';
    this.noteElement.style.height = size.y + 'px';
    this.store.updateNote(this.getNoteData());
  };

  removeNote = async () => {
    const isRemoved: boolean = await this.props.onRemove(this);
    if (isRemoved) {
      this.resizingElement.removeEventListener('mousedown', this.resizeNoteHandler);
    }
  };

  getNoteData = (): NoteData => {
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
  };
}

export default Note;
