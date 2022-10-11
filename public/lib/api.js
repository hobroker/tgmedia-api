class API {
  getMovies() {
    return fetch('/v1/media/movies')
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

  sendMovie(id) {
    return fetch(`/v1/messenger/${id}`);
  }
}
