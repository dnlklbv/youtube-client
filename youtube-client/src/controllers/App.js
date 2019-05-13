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
  }

  async getDataChunk() {
    const model = new AppModel(this.state);
    const dataChunk = await model.getDataChunk();
    this.state.nextChunkToken = model.state.nextChunkToken;
    return dataChunk;
  }
}
