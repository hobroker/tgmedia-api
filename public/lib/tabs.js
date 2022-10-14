class Tabs {
  constructor({ onChange }) {
    this.onChange = onChange;
    this.container = document.querySelector('#tabs');
    this.links = this.container.querySelectorAll('a');

    this.init();
    this.addListeners();
  }

  init() {
    this.activeLink.parentElement.classList.add('is-active');
  }

  addListeners() {
    this.links.forEach((link) => {
      link.addEventListener('click', () => {
        this.links.forEach((item) => {
          item.parentElement.classList.remove('is-active');
        });

        link.parentElement.classList.add('is-active');

        this.onChange(link.getAttribute('href'));
      });
    });
  }

  get activeLink() {
    const { hash } = window.location;
    let link = this.links[0];

    this.links.forEach((item) => {
      if (item.getAttribute('href') === hash) {
        link = item;
      }
    });

    return link;
  }

  get activeLinkHash() {
    return this.activeLink.getAttribute('href');
  }
}
