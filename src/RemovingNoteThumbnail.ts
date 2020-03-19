class RemovingNoteThumbnail {

  htmlElement: HTMLElement;
  interval: number;
  count: number = 5;

  constructor() {
    this.htmlElement = document.createElement('div');
    this.htmlElement.innerHTML = `
      <p>${this.count}</p>
    `;
    this.htmlElement.classList.add('note-thumbnail');

  }

  removeOnTimeout = () => {

    return new Promise( (resolve, reject) => {

      this.breakOnClick(reject);

      this.interval = setInterval(() => {
        if (this.count <= 0) {
          clearInterval(this.interval);
          resolve();
        }
        this.htmlElement.innerHTML = `<p>${this.count.toString()}</p>`;
        --this.count;
      }, 1000)
    });
  };

  breakOnClick = (reject: (reason?: any) => void) => {
    const clickHandler = () => {
      clearInterval(this.interval);
      reject();
    };
    this.htmlElement.addEventListener('click', clickHandler);
  }


}

export default RemovingNoteThumbnail;
