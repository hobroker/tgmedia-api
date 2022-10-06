export const delay = (ms) => (data) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));
