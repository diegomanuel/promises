const chai = require("chai");
const { FiqusPromise } = require("./../src/promise");

const expect = chai.expect; 

function asyncTask(fn) {
  setTimeout(fn, 0);
}

function someError() {
  return new Error("someError");
}

describe('FiqusPromise', function() {
  let promise = null;
  
  
  describe("then()", function() {
    
    it("should resolve syncronic values", function() {
      const promise = new FiqusPromise((resolve, reject) => {
        resolve(1);
      });
      
      return promise.then((v) => { 
        expect(v).to.eql(1);
      });
    });
    
    it("should resolve asyncronic values", function() {
      const promise = new FiqusPromise((resolve, reject) => {
        asyncTask(function() {
          resolve(1);  
        });
      });
      
      console.log(promise)
      
      return promise.then((v) => { 
        expect(v).to.eql(1);
      });
    });
    
  });
  
    describe("catch()", function() {
    
      it("should return error if rejected", function() {
        const promise = new FiqusPromise((resolve, reject) => {
          reject(someError());
        });
        
        return promise.catch((err) => { 
          expect(err.name).to.eql("someError");
        });
      });
      
    });
  
});

