const chai = require("chai");
const { FiqusPromise } = require("./../src/promise");
const expect = chai.expect; 
const {   asyncronicPromiseFactory, syncronicPromiseFactory, someError, times } = require("./helpers")

describe('NodePromise', suite(Promise));
describe('FiqusPromise', suite(FiqusPromise));

/* #################################################################################################### */
                                         /* TEST SUITES */
/* #################################################################################################### */

function suite(PromiseConstructor) {
  return function() {
      let promise = null;
  
      describe("then()", function() {
        
        it("should resolve syncronic values", function() {
          const promise = syncronicPromiseFactory(1, { PromiseConstructor });
          
          return promise.then((v) => { 
            expect(v).to.eql(1);
          });
        });
        
        it("should resolve asyncronic values", function() {
          const promise = asyncronicPromiseFactory(1, { PromiseConstructor });
          
          return promise.then((v) => { 
            expect(v).to.eql(1);
          });
        });

        it("should resolve multiple handlers for then()", function() {
          let promise = asyncronicPromiseFactory(1, { PromiseConstructor });
          
          times(5, function() {
            promise = promise.then((v) => {
              expect(v).to.eql(1);
              return v;
            });
          })

          return promise;
        });

        it("should resolve values returned in then()", function() {
          const promise = asyncronicPromiseFactory(1, { PromiseConstructor });
          
          return promise.then((v) => { 
            return v + 1;
          }).then((newValue) => {
            expect(newValue).to.eql(2);
          });
        });

        it("should resolve values returned as Promises in then()", function() {
          const promise = asyncronicPromiseFactory(1, { PromiseConstructor });
          
          return promise.then((v) => { 
            return asyncronicPromiseFactory(v + 1, { PromiseConstructor });
          }).then((newValue) => {
            expect(newValue).to.eql(2);
          });
        });

        it("should resolve values independently", function(done) {
          const promise = asyncronicPromiseFactory(1, { PromiseConstructor });
          
          promise.then((v) => { 
            expect(v).to.eql(1);
            return v + 1;
          }).catch(done);

          setTimeout(() => {
            promise.then((v) => {
              expect(v).to.eql(1);
            })
            .then(done)
            .catch(done)
          })

        });
        
      });
      
      describe("catch()", function() {
      
        it("should return error if rejected", function() {
          const promise = asyncronicPromiseFactory(null, {rejected: true, PromiseConstructor});
          
          return promise
            .then(() => { 
              //this line should not be called!
              expect(true).to.eql(false);
            })
            .catch((err) => {
              expect(err.message).to.eql("someError");
            })
        });

        it("after catch() you can use then()", function(done) {
          const promise = asyncronicPromiseFactory(null, {rejected: true, PromiseConstructor});
          
          promise
            .catch((err) => {
              expect(err.message).to.eql("someError");
            })
            .then(done);
        });

      });

      describe("then() and catch()", function() {

        it("if then() throws synchronically catch() should handle", function(done) {
          const promise = syncronicPromiseFactory(1, {PromiseConstructor});
          
          promise
            .then(() => {
              throw someError();
            })
            .catch((err) => {
              expect(err.message).to.eql("someError");
              done();
            })
            .catch(done)

        })

        it("if then() throws asynchronically catch() should handle", function(done) {
          const promise = asyncronicPromiseFactory(1, {PromiseConstructor});
          
          promise
            .then(() => {
              throw someError();
            })
            .catch((err) => {
              expect(err.message).to.eql("someError");
              done();
            })
            .catch(done)
        })

      })
  }
}

