const currentMs = () => new Date().getTime();

export const timer = () => {
  const startTime = currentMs();

  return () => {
    return currentMs() - startTime;
  };
};
