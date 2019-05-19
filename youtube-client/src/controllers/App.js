import AppView from '../views/AppView';
import SliderView from '../views/SliderView';
import SliderControlsView from '../views/SliderControlsView';
import VideoCardView from '../views/VideoCardView';

import AppModel from '../models/Model';

export default class App {
  constructor(title, apiKey, chunkSize) {
    this.state = {
      title,
      request: null,
      apiKey,
      chunkSize,
      nextChunkToken: null,
      slider: {
        elementPerPage: 0,
        numOfPages: 0,
        currPage: 0,
      },
    };
  }

  start() {
    const appView = new AppView(this.state.title);
    appView.render();

    const searchBox = document.getElementById('search-box');
    searchBox.addEventListener('keypress', this.newRequest.bind(this));
  }

  newRequest(event) {
    if (event.keyCode !== 13) return;
    let { value } = event.target;
    if (value.length < 1) return;
    value = value.replace(/^\s+|\s+$/g, '');
    if (value === this.state.request) return;

    this.state.request = value;
    this.state.nextChunkToken = null;

    const slider = document.getElementById('slider');
    if (slider) {
      while (slider.lastChild) {
        slider.removeChild(slider.lastChild);
      }
      slider.style.setProperty('--pageNum', this.state.slider.currPage = 0);
    }

    this.handleRequest();
  }

  async handleRequest() {
    const dataChunk = await this.getDataChunk();

    let slider = document.getElementById('slider');
    if (!slider) {
      slider = new SliderView(this.state.slider.numOfPages);
      slider.render();
      const sliderControls = new SliderControlsView(this.state.slider.currPage);
      sliderControls.render();
      this.initSlider();
    }

    dataChunk.forEach((video) => {
      const videoCard = new VideoCardView(video);
      videoCard.render();
    });

    this.updateSliderState();
    this.updatePageMarker();
  }

  async getDataChunk() {
    const model = new AppModel(this.state);
    const dataChunk = await model.getDataChunk();
    this.state.nextChunkToken = model.state.nextChunkToken;
    return dataChunk;
  }

  initSlider() {
    const slider = document.getElementById('slider');
    const btnPrev = document.getElementById('button-prev');
    const btnNext = document.getElementById('button-next');

    const windowWidth = window.outerWidth;

    if (windowWidth > 1200) {
      this.state.slider.elementPerPage = 4;
    } else
    if (windowWidth > 600) {
      this.state.slider.elementPerPage = 2;
    } else {
      this.state.slider.elementPerPage = 1;
    }

    let x0 = null;
    let locked = false;
    this.state.slider.currPage = 0;

    const prevPage = () => {
      if (this.state.slider.currPage === 0) return;
      slider.classList.add('slider_smooth');
      slider.style.setProperty('--pageNum', this.state.slider.currPage -= 1);
      this.updatePageMarker();
      setTimeout(() => {
        slider.classList.remove('slider_smooth');
      }, parseFloat(getComputedStyle(slider).transitionDuration) * 1000);
    };

    const nextPage = () => {
      if (this.state.slider.currPage + 1 >= Math.ceil(this.state.slider.numOfPages)) return;
      slider.classList.add('slider_smooth');
      slider.style.setProperty('--pageNum', this.state.slider.currPage += 1);
      this.updatePageMarker();
      setTimeout(() => {
        slider.classList.remove('slider_smooth');
      }, parseFloat(getComputedStyle(slider).transitionDuration) * 1000);
      if (this.state.slider.currPage + 2 === Math.ceil(this.state.slider.numOfPages)) {
        this.handleRequest(true);
      }
    };

    const unify = e => (e.changedTouches ? e.changedTouches[0] : e);

    const lock = (e) => {
      x0 = unify(e).clientX;
      slider.classList.toggle('slider_smooth', !(locked = true));
    };

    const drag = (e) => {
      e.preventDefault();

      if (locked) { slider.style.setProperty('--tx', `${Math.round(unify(e).clientX - x0)}px`); }
    };

    const move = (e) => {
      if (locked) {
        const dx = unify(e).clientX - x0;
        const minDx = document.body.clientWidth * 0.1;
        let sign;
        if (minDx > Math.abs(dx)) {
          sign = 0;
        } else {
          sign = Math.sign(dx);
        }

        if (this.state.slider.currPage > 0 && sign === 1) {
          prevPage();
        } else if (this.state.slider.currPage < this.state.slider.numOfPages - 1 && sign === -1) {
          nextPage();
        }

        this.updatePageMarker();
        slider.style.setProperty('--tx', '0px');
        slider.classList.toggle('slider_smooth', !(locked = false));
        x0 = null;
      }
    };

    slider.addEventListener('mousedown', lock, false);
    slider.addEventListener('touchstart', lock, false);

    slider.addEventListener('mousemove', drag, false);
    slider.addEventListener('touchmove', drag, false);

    slider.addEventListener('mouseup', move, false);
    slider.addEventListener('touchend', move, false);

    btnPrev.addEventListener('click', prevPage);
    btnNext.addEventListener('click', nextPage);
  }

  updateSliderState() {
    const slider = document.getElementById('slider');
    const numOfElements = slider.children.length;
    this.state.slider.numOfPages = numOfElements / this.state.slider.elementPerPage;
    slider.style.setProperty('--numOfPages', this.state.slider.numOfPages);
  }

  updatePageMarker() {
    const pageMarker = document.getElementById('pageMarker');
    const tooltips = document.querySelectorAll('.slider-controls__tooltip');
    pageMarker.innerHTML = this.state.slider.currPage + 1;

    if (this.state.slider.currPage === 0) {
      tooltips[0].classList.toggle('visually-hidden', true);
    } else {
      tooltips[0].classList.toggle('visually-hidden', false);
      tooltips[0].innerHTML = this.state.slider.currPage;
    }

    if (this.state.slider.currPage + 1 >= Math.ceil(this.state.slider.numOfPages)) {
      tooltips[1].classList.toggle('visually-hidden', true);
    } else {
      tooltips[1].classList.toggle('visually-hidden', false);
      tooltips[1].innerHTML = this.state.slider.currPage + 2;
    }
  }
}
