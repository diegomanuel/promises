const chai = require("chai");
const { FiqusPromise } = require("./../src/promise");
const expect = chai.expect; 

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
function syncronicPromiseFactory(value) {
  return new FiqusPromise((resolve, reject) => {
    resolve(value);
  });
}

//creates a promise that is resolved asynchronously
function asyncronicPromiseFactory(value) {
  return new FiqusPromise((resolve, reject) => {
    asyncTask(function() {
      resolve(1);  
    });
  });;
}

describe('FiqusPromise', function() {
  let promise = null;
  
  
  describe("then()", function() {
    
    it("should resolve syncronic values", function() {
      const promise = syncronicPromiseFactory(1);
      
      promise.then((v) => { 
        expect(v).to.eql(1);
      });

      return promise;
    });
    
    it("should resolve asyncronic values", function() {
      const promise = asyncronicPromiseFactory(1);
      
      promise.then((v) => { 
        expect(v).to.eql(1);
      });

      return promise;
    });

    it("should resolve multiple handlers for then()", function() {
      const promise = asyncronicPromiseFactory(1);
      
      times(5, function() {
        promise.then((v) => expect(v).to.eql(1));
      })

      return promise;
    });

    it("should resolve values returned in then()", function() {
      const promise = asyncronicPromiseFactory(1);
      
      promise.then((v) => { 
        return v + 1;
      }).then((newValue) => {
        expect(newValue).to.eql(2);
      });

      return promise;
    });
    
  });
  
  describe("catch()", function() {
  
    it("should return error if rejected", function(done) {
      const promise = new FiqusPromise((resolve, reject) => {
        reject(someError());
      });
      
      promise.then(() => { 
        done("Should not call then!")
      });

      promise.catch((err) => {
        expect(err.message).to.eql("someError");
        done();
      })
    });

    it("after catch() you can use then()", function(done) {
      const promise = new FiqusPromise((resolve, reject) => {
        reject(someError());
      });
      
      promise
        .catch((err) => {
          expect(err.message).to.eql("someError");
        })
        .then(() => {
          done()
        });
    });
    
  });
  
});

