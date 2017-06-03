const chai = require("chai");
const { FiqusPromise } = require("./../src/promise");
const expect = chai.expect; 
const {   asyncronicPromiseFactory, syncronicPromiseFactory, someError, times } = require("./helpers")

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
      const promise = asyncronicPromiseFactory(null, {rejected: true});
      
      promise.then(() => { 
        done("Should not call then!")
      });

      promise.catch((err) => {
        expect(err.message).to.eql("someError");
        done();
      })
    });

    it("after catch() you can use then()", function(done) {
      const promise = asyncronicPromiseFactory(null, {rejected: true});
      
      promise
        .catch((err) => {
          expect(err.message).to.eql("someError");
        })
        .then(() => {
          done()
        });
    });

  });

  describe("then() and catch()", function() {

    it("if then() throws catch() should handle", function() {
      const promise = asyncronicPromiseFactory(1);
      
      return promise
        .then(() => {
          throw someError();
        })
        .catch((err) => {
          expect(err.message).to.eql("someError");
        })

    })

  })
  
});

