function FiqusPromise(resolver) {
  let value = null;

  function fulfill(result) {
    value = result;
  }

  function reject(error) {
    value = error;
  }

  this.then = function(cb) {
    return cb(value);
  }
  
  resolver(fulfill, reject);
}

module.exports = FiqusPromise;
