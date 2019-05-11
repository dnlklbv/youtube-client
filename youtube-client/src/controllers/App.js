export default class App {
  constructor(Model, AppView) {
    this.model = new Model();
    this.appView = new AppView('YouTube Client');
    this.state = {
      request: null,
    };
  }

  start() {
    this.appView.render();

    const searchBox = document.getElementById('search-box');
    searchBox.addEventListener('keypress', this.getRequest.bind(this));
  }

  getRequest(event) {
    if (event.keyCode === 10 || event.keyCode === 13) {
      let { value } = event.target;
      if (value.length < 1) return;
      value = value.replace(/^\s+|\s+$/g, '');
      this.state.request = value;
    }
  }
}
