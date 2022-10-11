class Table {
  constructor(tabs) {
    this.tabs = tabs;
    this.table = document.getElementById('table');
    this.tbody = document.querySelector('tbody');
    this.tableLoading = document.getElementById('table-loading');
    this.api = new API();
  }

  show() {
    this.table.classList.remove('is-hidden');
    this.tableLoading.classList.add('is-hidden');
  }

  hide() {
    this.table.classList.add('is-hidden');
    this.tableLoading.classList.remove('is-hidden');
  }

  addActions() {
    this.tbody.querySelectorAll('button').forEach((button) => {
      const { id } = button.dataset;

      button.addEventListener('click', () => {
        button.disabled = true;
        button.innerText = 'Sending...';

        return this.api.sendMovie(id).catch(() => {
          button.disabled = false;
        });
      });
    });
  }

  async renderMovies() {
    this.hide();
    const movies = await this.api.getMovies();

    this.tbody.innerHTML = movies
      .map(({ title, overview, poster, id, movieFile }) => {
        const disabled = movieFile ? '' : 'disabled';

        return `<tr>
            <td class="w-100">
              <img src="${poster}" alt="${title}" class="image w-100" />
            </td>
            <td class="w-192">
              <p class="title is-6">${title}</p>
            </td>
            <td>
              <p class="subtitle is-6">${overview}</p>
            </td>
            <td class="w-100 has-text-centered">
              <button class="button is-primary is-small" data-id="${id}" ${disabled}>
                ${disabled ? 'No file' : 'Send'}
              </button>
            </td>
          </tr>`;
      })
      .join('');

    this.addActions();

    this.show();
  }

  async renderShows() {
    this.hide();
    const movies = await this.api.getShows();

    this.tbody.innerHTML = movies
      .map(({ title, overview, poster, id, movieFile }) => {
        const disabled = movieFile ? '' : 'disabled';

        return `<tr>
            <td class="w-100">
              <img src="${poster}" alt="${title}" class="image w-100" />
            </td>
            <td class="w-192">
              <p class="title is-6">${title}</p>
            </td>
            <td>
              <p class="subtitle is-6">${overview}</p>
            </td>
            <td class="w-100 has-text-centered">
              <button class="button is-primary is-small" data-id="${id}" ${disabled}>
                ${disabled ? 'No file' : 'Send'}
              </button>
            </td>
          </tr>`;
      })
      .join('');

    this.addActions();

    this.show();
  }
}
