export default class VideoCardView {
  constructor(videoData) {
    this.videoData = videoData;
  }

  render() {
    const videoCard = document.createElement('a');
    videoCard.classList.add('video-card');
    videoCard.href = this.videoData.link;
    videoCard.target = '_blank';

    const videoThumbnail = document.createElement('img');
    videoThumbnail.classList.add('video-card__img');
    videoThumbnail.src = this.videoData.thumbnail;
    videoThumbnail.alt = this.videoData.title;
    videoCard.appendChild(videoThumbnail);

    const videoTitle = document.createElement('h2');
    videoTitle.classList.add('video-card__heading');
    videoTitle.title = this.videoData.title;
    videoTitle.innerText = this.videoData.title;
    videoCard.appendChild(videoTitle);

    const videoStats = document.createElement('p');
    videoStats.classList.add('video-card__info');

    const videoChannel = document.createElement('span');
    videoChannel.classList.add('video-card__channel');
    videoChannel.title = this.videoData.title;
    videoChannel.innerText = this.videoData.title;
    videoStats.appendChild(videoChannel);

    const videoDate = document.createElement('span');
    videoDate.classList.add('video-card__date');
    videoDate.innerHTML = this.videoData.date;
    videoStats.appendChild(videoDate);

    const videoViews = document.createElement('span');
    videoViews.classList.add('video-card__views');
    videoViews.innerText = this.videoData.views;
    videoStats.appendChild(videoViews);

    videoCard.appendChild(videoStats);

    const videoDescription = document.createElement('p');
    videoDescription.classList.add('video-card__description');
    videoDescription.innerText = this.videoData.description;
    videoCard.appendChild(videoDescription);

    const slider = document.getElementById('slider');
    slider.appendChild(videoCard);
  }
}