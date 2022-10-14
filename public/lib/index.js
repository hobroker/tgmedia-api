const onTabChange = (hash) => {
  if (hash === '#tab-movies') {
    table.renderMovies();
  } else {
    table.renderShows();
  }
};

const tabs = new Tabs({ onChange: onTabChange });
const table = new Table(tabs);

onTabChange(tabs.activeLinkHash);
