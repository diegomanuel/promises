function isTheneable(obj) {
  return obj && typeof obj.then === "function";
}

function FiqusPromise(resolver) {
  let value = undefined, status = "pending";

  function fulfill(result) {
    value = result;
    status = "resolved";
  }
  
  function reject(error) {
    value = error;
    status = "rejected";
  }

  function waitForStatus(onFulfill, onReject) {
    if (status === "pending") {
      setTimeout(() => { waitForStatus(onFulfill, onReject); });
    } else if (status === "resolved") {
      onFulfill(value);
    } else if (status === "rejected") {
      onReject(value);
    }
  }

  this.then = (onFulfilled, onRejected = (val) => {return val;}) => {
    return new FiqusPromise((resolve, reject) => {
      try {
        waitForStatus(
          (val) => {
            try {
              const rs = onFulfilled(val);
              if (isTheneable(rs)) {
                rs.then(resolve, reject);
              } else {
                resolve(rs);
              }
            } catch (err) {
              reject(err);
            }
          },
          (err) => {
            try {
              const rs = onRejected(err);
              if (isTheneable(rs)) {
                rs.then(reject);
              } else {
                reject(rs);
              }
            } catch (err) {
              reject(err);
            }
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  };

  this.catch = (onRejected) => {
    return new FiqusPromise((resolve, reject) => {
      try {
        waitForStatus(
          (val) => {
            try {
              resolve(val);
            } catch (err) {
              reject(err);
            }
          },
          (err) => {
            try {
              const rs = onRejected(err);
              if (isTheneable(rs)) {
                rs.then(resolve, reject);
              } else {
                resolve(rs);
              }
            } catch (err) {
              reject(err);
            }
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  }
  
  resolver(fulfill, reject);
}

FiqusPromise.resolve = (val) => {
  return new FiqusPromise((resolve, reject) => {
    try {
      if (isTheneable(val)) {
        val.then(resolve, reject);
      } else {
        resolve(val);
      }
    } catch (err) {
      reject(err);
    }
  });
};

FiqusPromise.reject = (val) => {
  return new FiqusPromise((resolve, reject) => {
    try {
      if (isTheneable(val)) {
        val.then(reject);
      } else {
        reject(val);
      }
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = FiqusPromise;
