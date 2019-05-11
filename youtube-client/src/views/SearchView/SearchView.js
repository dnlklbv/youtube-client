export default class SearchView {
  constructor(placeholder) {
    this.placeholder = placeholder;
  }

  render() {
    const searchBox = document.createElement('input');
    searchBox.classList.add('search-box');
    searchBox.id = 'search-box';
    searchBox.setAttribute('placeholder', this.placeholder);

    const container = document.getElementById('container');
    container.appendChild(searchBox);
  }
}
