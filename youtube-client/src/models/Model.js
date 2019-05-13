export default class AppModel {
  constructor(state) {
    this.state = state;
  }

  async getDataChunk() {
    let searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${this.state.apiKey}&type=video&part=snippet&maxResults=${this.state.chunkSize}&q=${this.state.request}`;
    if (this.state.nextChunkToken) searchUrl = `${searchUrl}&pageToken=${this.state.nextChunkToken}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    this.state.nextChunkToken = searchData.nextPageToken;

    const videoIds = searchData.items.map(item => item.id.videoId);
    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${this.state.apiKey}&id=${videoIds.join(',')}&part=snippet,statistics`;
    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json();

    return AppModel.extractData(statsData.items);
  }

  static extractData(items) {
    const dataChunk = items.map(item => ({
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      description: item.snippet.description,
      channel: item.snippet.channelTitle,
      date: item.snippet.publishedAt.substring(0, 10),
      views: item.statistics.viewCount,
      link: `https://www.youtube.com/watch?v=${item.id}`,
    }));
    return dataChunk;
  }
}
