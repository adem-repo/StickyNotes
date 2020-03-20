class RemovingNoteThumbnail {

  htmlElement: HTMLElement;
  counterElement: HTMLElement;
  textElement: HTMLElement;
  interval: number;
  count: number = 5;
  isPaused = false;

  constructor(public color: string, public text: string) {
    this.htmlElement = document.createElement('div');
    this.htmlElement.classList.add('note-thumbnail');
    this.htmlElement.style.backgroundColor = color;

    this.counterElement = document.createElement('p');
    this.counterElement.classList.add('counter');
    this.counterElement.innerText = this.count.toString();

    this.textElement = document.createElement('p');
    this.textElement.classList.add('text');
    this.textElement.innerText = text;

    this.htmlElement.append(this.counterElement, this.textElement);
    this.htmlElement.addEventListener('hover', this.hoverHandler);
  }

  removeOnTimeout = () => {

    return new Promise( (resolve, reject) => {

      this.breakOnClick(reject);

      this.interval = setInterval(() => {
        if (this.count <= 0) {
          clearInterval(this.interval);
          this.htmlElement.removeEventListener('hover', this.hoverHandler);
          resolve();
        }
        this.counterElement.innerText = this.count.toString();
        --this.count;
      }, 1000)
    });
  };

  hoverHandler = () => {
    this.isPaused = true;
  };

  breakOnClick = (reject: (reason?: any) => void) => {
    this.htmlElement.addEventListener('click', () => {
      clearInterval(this.interval);
      reject();
    });
  }
}

export default RemovingNoteThumbnail;
