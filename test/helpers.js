const FiqusPromise = require("./../src/promise");

//executes the fn asynchronously
function asyncTask(fn) {
  setTimeout(fn, 0);
}

function times(n, fn) {
  for(let idx = 1; idx <= n; idx++) {
    fn(idx);
  }
}

function someError(message = "someError") {
  return new Error(message);
}

//creates a promise that is resolved synchronously
function synchronicPromiseFactory(value, {rejected = false, PromiseConstructor = FiqusPromise} = {}) {
  return new PromiseConstructor((resolve, reject) => {
    if(!rejected) {
      resolve(value);
    } else {
      reject(someError());
    }
  });
}

//creates a promise that is resolved asynchronously
function asynchronicPromiseFactory(value, {rejected = false, PromiseConstructor = FiqusPromise} = {}) {
  return new PromiseConstructor((resolve, reject) => {
    asyncTask(function() {
      if(!rejected) {
        resolve(value);
      } else {
        reject(someError());
      } 
    });
  });
}

module.exports = {
  asynchronicPromiseFactory,
  synchronicPromiseFactory,
  someError,
  times
};
