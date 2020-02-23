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
  ];

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
  }

  addNote(pos: XYPosition) {

    // Creating new note
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.style.backgroundColor = this.colors[Math.floor(Math.random()*10)];
    noteElement.innerHTML = `
        <div class="note-inner">
            <textarea class="text" placeholder="Your text here"></textarea>
        </div>        
        <span class="resize"></span>
    `;
    this.notesZone.append(noteElement);
    noteElement.style.left = pos.x - noteElement.offsetWidth / 2 + 'px';
    noteElement.style.top = pos.y - noteElement.offsetHeight / 2 + 'px';
    //

    let currentDroppable: HTMLElement | null = null;

    const textElement = noteElement.querySelector('.text') as HTMLElement;
    textElement.addEventListener('focus', (event: FocusEvent) => {
      event.preventDefault();
      return false;
    });

    const resizingElement = noteElement.querySelector('.resize') as HTMLElement;
    resizingElement.addEventListener('mousedown', (event: MouseEvent) => {
      this.isDragging = true;
      const noteWidth = noteElement.offsetWidth;
      const noteHeight = noteElement.offsetHeight;
      const startX = event.pageX;
      const startY = event.pageY;

      const onNoteResize = (event: MouseEvent) => {
        noteElement.style.width = noteWidth + (event.pageX - startX) + 'px';
        noteElement.style.height = noteHeight + (event.pageY - startY) + 'px';
      };

      const onMouseUp = () => {
        this.isDragging = false;
        document.removeEventListener('mousemove', onNoteResize);
      };

      document.addEventListener('mousemove', onNoteResize);
      document.addEventListener('mouseup', onMouseUp);
    });

    noteElement.addEventListener('mousedown', (event: MouseEvent) => {

      if (event.target === resizingElement)
        return;

      // Moving note to front
      const notes = this.notesZone.querySelectorAll('.note') as NodeListOf<HTMLElement>;
      for (let i = 0; i < notes.length; ++i) {
        notes[i].style.zIndex = '1';
      }
      noteElement.style.zIndex = '1000';
      //

      let shiftX = event.clientX - noteElement.getBoundingClientRect().left;
      let shiftY = event.clientY - noteElement.getBoundingClientRect().top;

      const moveAt = (pageX: number, pageY: number) => {
        noteElement.style.left = pageX - shiftX + 'px';
        noteElement.style.top = pageY - shiftY + 'px';
      };

      const enterDroppable = (elem: HTMLElement) => {
        elem.style.background = 'pink';
      };

      const leaveDroppable = (elem: HTMLElement) => {
        elem.style.background = '';
      };

      const onMouseMove = (event: MouseEvent) => {

        this.isDragging = true;

        moveAt(event.pageX, event.pageY);

        noteElement.hidden = true;
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        noteElement.hidden = false;

        if (!elemBelow) return;

        let droppableBelow: HTMLElement | null = elemBelow.closest('#trash-zone');
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

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        if (!this.isDragging) {
          this.isEditing = true;
        }
        this.isDragging = false;
        if (currentDroppable) {
          this.notesZone.removeChild(noteElement);
          leaveDroppable(currentDroppable);
        }
        noteElement.removeEventListener('mouseup', onMouseUp);
      };

      moveAt(event.pageX, event.pageY);

      document.addEventListener('mousemove', onMouseMove);
      noteElement.addEventListener('mouseup', onMouseUp);
      noteElement.addEventListener('dragstart', () => false);
    });
  }
}

function main() {
  const canvas: HTMLElement = document.querySelector('#canvas') as HTMLInputElement;
  new StickyNotes(canvas);
}
