export default class SliderView {
  constructor(numOfPages) {
    this.numOfPages = numOfPages;
  }

  render() {
    const slider = document.createElement('div');
    slider.classList.add('slider');
    slider.id = 'slider';
    slider.style.setProperty('--numOfPages', this.numOfPages);

    const container = document.getElementById('container');
    container.appendChild(slider);
  }
}
