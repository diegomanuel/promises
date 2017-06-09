const { FiqusPromise } = require("./../src/promise");

//executes the fn asynchronously
function asyncTask(fn) {
  setTimeout(fn, 0);
}

function times(n, fn) {
  for(let i = 0; i < n; i++) {
    fn();
  }
}

function someError() {
  return new Error("someError");
}

//creates a promise that is resolved synchronously
function syncronicPromiseFactory(value, {rejected = false} = {}) {
  return new FiqusPromise((resolve, reject) => {
    if(!rejected) {
      resolve(value);
    } else {
      reject(someError());
    }
  });
}

//creates a promise that is resolved asynchronously
function asyncronicPromiseFactory(value, {rejected = false} = {}) {
  return new FiqusPromise((resolve, reject) => {
    asyncTask(function() {
      if(!rejected) {
        resolve(value);
      } else {
        reject(someError());
      } 
    });
  });;
}

module.exports = {
  asyncronicPromiseFactory,
  syncronicPromiseFactory,
  someError,
  times
}