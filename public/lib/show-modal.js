class ShowModal {
  constructor() {
    this.modal = document.querySelector('#show-modal');
    this.modalContent = this.modal.querySelector('.modal-content > .box');
    this.api = new API();
  }

  addEpisodeActions({ showId }) {
    this.modalContent
      .querySelectorAll('button[data-episode-number]')
      .forEach((button) => {
        const { episodeNumber, seasonNumber } = button.dataset;

        button.addEventListener('click', () => {
          button.disabled = true;

          return this.api
            .sendEpisode({
              showId,
              episodeNumber,
              seasonNumber,
            })
            .catch(() => {
              button.disabled = false;
            });
        });
      });
  }

  async open(showId) {
    const seasons = await this.api.getShowSeasons(showId);

    this.modalContent.innerHTML = `
      <div class="mb-4 flex is-justify-content-right">
        <button class="button is-primary">
          Send main message
        </button>
      </div>
      <hr />
      <div class="columns is-multiline">
        ${Object.entries(seasons)
          .map(
            ([seasonNumber, episodes]) => `
            <div class="column is-one-quarter-desktop is-one-third-tablet">
              <h5 class="title is-5 flex">
                Season ${seasonNumber}
                <button class="button is-small is-primary ml-auto">
                  Send full season
                </button>
              </h5>
              <div>
                ${Object.entries(episodes)
                  .map(
                    ([episodeNumber, episode]) => `
                      <button class="button is-small is-fullwidth mb-1 is-justify-content-left is-multiline p-1" title="${episode.title}" data-episode-number="${episodeNumber}" data-season-number="${seasonNumber}">
                        <span class="tag is-black mr-1 is-small">${episodeNumber}</span>
                        ${episode.title}
                      </button>
                    `,
                  )
                  .join('')}
              </div>
            </div>
          `,
          )
          .join('')}
      </div>
    `;
    this.modal.classList.add('is-active');
    this.addEpisodeActions({ showId });
  }
}
