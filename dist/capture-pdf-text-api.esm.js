const waitOneSecond = x => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(x);
    }, 1000);
  });
};

var main = (async data => {
  const pages = ['empty', ...data];
  const api = await waitOneSecond(async n => {
    const result = await waitOneSecond(pages[n]);
    return result;
  });
  return api;
});

export default main;
