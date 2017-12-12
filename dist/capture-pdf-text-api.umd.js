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

  const getPage = async n => {
    const result = await waitOneSecond(pages[n]);
    return result;
  };
  getPage.size = pages.length;

  const api = await waitOneSecond(getPage);

  return api;
});

return main;

})));
