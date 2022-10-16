export const delay = (ms, data?: any) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));
