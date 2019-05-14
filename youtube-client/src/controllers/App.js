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
      numberOfPages: 1,
    };
  }

  start() {
    const appView = new AppView(this.state.title);
    appView.render();

    const searchBox = document.getElementById('search-box');
    searchBox.addEventListener('keypress', this.handleRequest.bind(this));
  }

  async handleRequest(event) {
    if (event.keyCode !== 13) return;
    let { value } = event.target;
    if (value.length < 1) return;
    value = value.replace(/^\s+|\s+$/g, '');
    if (value === this.state.request) return;

    this.state.request = value;
    this.state.nextChunkToken = null;

    const dataChunk = await this.getDataChunk();

    let slider = document.getElementById('slider');
    if (!slider) {
      slider = new SliderView(this.state.numberOfPages);
      slider.render();
    } else {
      while (slider.firstChild) {
        slider.removeChild(slider.firstChild);
      }
    }

    let sliderControls = document.getElementById('slider-controls');
    if (!sliderControls) {
      sliderControls = new SliderControlsView(this.state.numberOfPages);
      sliderControls.render(1);
    }

    dataChunk.forEach((video) => {
      const videoCard = new VideoCardView(video);
      videoCard.render();
    });

    App.initSlider();
  }

  async getDataChunk() {
    const model = new AppModel(this.state);
    const dataChunk = await model.getDataChunk();
    this.state.nextChunkToken = model.state.nextChunkToken;
    return dataChunk;
  }

  static initSlider() {
    const slider = document.getElementById('slider');
    const btnPrev = document.getElementById('button-prev');
    const btnNext = document.getElementById('button-next');
    const pageMarker = document.getElementById('pageMarker');

    const windowWidth = window.outerWidth;

    let elementPerPage;
    if (windowWidth > 1200) { elementPerPage = 4; } else
    if (windowWidth > 600) { elementPerPage = 2; } else { elementPerPage = 1; }

    const numOfElements = slider.children.length;
    const numOfPages = numOfElements / elementPerPage;
    let pageNum = 0;
    let x0 = null;
    let locked = false;

    function updatePageMarker(n) {
      pageMarker.innerHTML = n + 1;
    }

    function unify(e) { return e.changedTouches ? e.changedTouches[0] : e; }

    function lock(e) {
      x0 = unify(e).clientX;
      slider.classList.toggle('slider_smooth', !(locked = true));
    }

    function drag(e) {
      e.preventDefault();

      if (locked) { slider.style.setProperty('--tx', `${Math.round(unify(e).clientX - x0)}px`); }
    }

    function move(e) {
      if (locked) {
        const dx = unify(e).clientX - x0;
        const minDx = document.body.clientWidth * 0.1;
        let s;
        if (minDx > Math.abs(dx)) {
          s = 0;
        } else {
          s = Math.sign(dx);
        }


        if ((pageNum > 0 || s < 0) && (pageNum < numOfPages - 1 || s > 0)) {
          slider.style.setProperty('--pageNum', pageNum -= s);
          updatePageMarker(pageNum);
        }
        slider.style.setProperty('--tx', '0px');
        slider.classList.toggle('slider_smooth', !(locked = false));
        x0 = null;
      }
    }

    function prevPage() {
      if (pageNum < 1) return;
      slider.classList.add('slider_smooth');
      slider.style.setProperty('--pageNum', pageNum -= 1);
      updatePageMarker(pageNum);
      setTimeout(() => {
        slider.classList.remove('slider_smooth');
      }, parseFloat(getComputedStyle(slider).transitionDuration) * 1000);
    }

    function nextPage() {
      if (pageNum > numOfPages - 2) return;
      slider.classList.add('slider_smooth');
      slider.style.setProperty('--pageNum', pageNum += 1);
      updatePageMarker(pageNum);
      setTimeout(() => {
        slider.classList.remove('slider_smooth');
      }, parseFloat(getComputedStyle(slider).transitionDuration) * 1000);
    }

    slider.style.setProperty('--numOfPages', numOfPages);

    slider.addEventListener('mousedown', lock, false);
    slider.addEventListener('touchstart', lock, false);

    slider.addEventListener('mousemove', drag, false);
    slider.addEventListener('touchmove', drag, false);

    slider.addEventListener('mouseup', move, false);
    slider.addEventListener('touchend', move, false);

    btnPrev.addEventListener('click', prevPage);
    btnNext.addEventListener('click', nextPage);
  }
}
