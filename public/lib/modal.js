class ShowModal {
  constructor() {
    this.modal = document.querySelector('#show-modal');
    this.modalContent = this.modal.querySelector('.modal-content > .box');
    this.api = new API();
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
                      <button class="button is-small is-fullwidth mb-1 is-justify-content-left p-1" title="${episode.title}">
                        <span class="tag is-black mr-1">${episodeNumber}</span>
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
  }

  close() {
    this.modal.classList.remove('is-active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  (
    document.querySelectorAll(
      '.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button',
    ) || []
  ).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) {
      closeAllModals();
    }
  });
});
