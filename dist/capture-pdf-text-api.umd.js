(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.capturePDF = factory());
}(this, (function () { 'use strict';

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
  api.size = pages.length;

  return api;
});

return main;

})));
