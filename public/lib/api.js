class API {
  async getMovies() {
    const publishedMovies = await fetch('/v1/messenger/published/movies').then(
      (response) => response.json(),
    );

    return fetch('/v1/media/movies')
      .then((response) => response.json())
      .then((response) =>
        response
          .map(({ images, ...movie }) => ({
            ...movie,
            size: toHumanSize(movie?.movieFile?.size),
            isPublished: publishedMovies.includes(movie.title),
            poster: images.find(({ coverType }) => coverType === 'poster')
              ?.remoteUrl,
          }))
          .sort((a, b) => a.title.localeCompare(b.title)),
      );
  }

  sendMovie(id) {
    return fetch(`/v1/messenger/movie/${id}`);
  }

  sendEpisode({ showId, episodeNumber, seasonNumber }) {
    return fetch(
      `/v1/messenger/show/${showId}/season/${seasonNumber}/episode/${episodeNumber}`,
    );
  }

  getShows() {
    return fetch('/v1/media/shows')
      .then((response) => response.json())
      .then((response) =>
        response
          .map(({ images, ...movie }) => ({
            ...movie,
            poster: images.find(({ coverType }) => coverType === 'poster')
              ?.remoteUrl,
          }))
          .sort((a, b) => a.title.localeCompare(b.title)),
      );
  }

  getShowSeasons(showId) {
    return fetch(`/v1/media/show/${showId}/seasons`).then((response) =>
      response.json(),
    );
  }
}

function toHumanSize(bytes) {
  if (!bytes) {
    return 0;
  }
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}
