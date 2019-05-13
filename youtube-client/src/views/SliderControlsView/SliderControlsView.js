export default class SliderControlsView {
  constructor(currPage) {
    this.currPage = currPage;
  }

  render() {
    const sliderControls = document.createElement('div');
    sliderControls.classList.add('slider-controls');
    sliderControls.id = 'slider-controls';

    const buttonPrev = document.createElement('button');
    buttonPrev.classList.add('slider-controls__button', 'slider-controls__button_prev');
    sliderControls.appendChild(buttonPrev);

    const pageNum = document.createElement('div');
    pageNum.classList.add('slider-controls__page-num');
    pageNum.innerText = this.currPage;
    sliderControls.appendChild(pageNum);

    const buttonNext = document.createElement('button');
    buttonNext.classList.add('slider-controls__button', 'slider-controls__button_next');
    sliderControls.appendChild(buttonNext);

    const container = document.getElementById('container');
    container.appendChild(sliderControls);
  }
}
