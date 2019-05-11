import SearchView from '../SearchView';

export default class AppView {
  constructor(title) {
    this.title = title;
  }

  render() {
    document.title = this.title;

    const container = document.createElement('div');
    container.classList.add('container');
    container.id = 'container';
    document.body.appendChild(container);

    const searchView = new SearchView('Enter request');
    searchView.render();
  }
}
