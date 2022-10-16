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
          button.classList.add('is-loading');

          return this.api
            .sendEpisode({
              showId,
              episodeNumber,
              seasonNumber,
            })
            .catch(() => {
              button.disabled = false;
              button.classList.remove('is-loading');
            });
        });
      });
  }

  async open(showId) {
    const [seasons, published] = await Promise.all([
      this.api.getShowSeasons(showId),
      this.api.getShowPublishedEpisodes(showId),
    ]);

    this.modalContent.innerHTML = `
      <div class="mb-4 flex is-justify-content-right">
        <button class="button is-primary">
          Send main message
        </button>
      </div>
      <hr />
      <div class="columns is-multiline">
        ${Object.entries(seasons)
          .map(([seasonNumber, episodes]) => {
            const disabled = Object.values(episodes).some(
              ({ hasFile }) => !hasFile,
            );

            return `
              <div class="column is-one-third-desktop is-half-tablet">
                <h5 class="title is-5 flex mb-2">
                  Season ${seasonNumber}
                  <button class="button is-small is-primary ml-auto"
                          ${disabled ? 'disabled' : 'disabled'}
                  >
                    Send full season
                  </button>
                </h5>
                <table class="table is-compact is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                  ${Object.entries(episodes)
                    .map(([episodeNumber, episode]) => {
                      const isPublished =
                        published[seasonNumber][episodeNumber];
                      const disabled = !episode.hasFile || isPublished;

                      return `
                          <tr>
                            <td class="has-text-centered w-24">
                              <code class="tag is-black w-24">${episodeNumber}</code>
                            </td>
                            <td>
                              <p class="content is-small">${episode.title}</p>
                            </td>
                            <td class="has-text-right w-60">
                              <button class="button is-small is-primary"
                                      data-episode-number="${episodeNumber}"
                                      data-season-number="${seasonNumber}"
                                      ${disabled ? 'disabled' : ''}
                              >
                                ${isPublished ? 'Published' : 'Send'}
                              </button>
                            </td>
                          </tr>
                        `;
                    })
                    .join('')}
                </table>
              </div>
            `;
          })
          .join('')}
      </div>
    `;
    this.modal.classList.add('is-active');
    this.addEpisodeActions({ showId });
  }
}
