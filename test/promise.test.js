const chai = require("chai");
const { FiqusPromise } = require("./../src/promise");
const expect = chai.expect; 
const {   asyncronicPromiseFactory, syncronicPromiseFactory, someError, times } = require("./helpers")

describe('FiqusPromise', suite(FiqusPromise));
describe('NodePromise', suite(Promise));

/* #################################################################################################### */
                                         /* TEST SUITES */
/* #################################################################################################### */

function suite(PromiseConstructor) {
  return function() {
      let promise = null;
  
      describe("then()", function() {
        
        it("should resolve syncronic values", function() {
          const promise = syncronicPromiseFactory(1, { PromiseConstructor });
          
          promise.then((v) => { 
            expect(v).to.eql(1);
          });

          return promise;
        });
        
        it("should resolve asyncronic values", function() {
          const promise = asyncronicPromiseFactory(1, { PromiseConstructor });
          
          promise.then((v) => { 
            expect(v).to.eql(1);
          });

          return promise;
        });

        it("should resolve multiple handlers for then()", function() {
          const promise = asyncronicPromiseFactory(1, { PromiseConstructor });
          
          times(5, function() {
            promise.then((v) => expect(v).to.eql(1));
          })

          return promise;
        });

        it("should resolve values returned in then()", function() {
          const promise = asyncronicPromiseFactory(1, { PromiseConstructor });
          
          promise.then((v) => { 
            return v + 1;
          }).then((newValue) => {
            expect(newValue).to.eql(2);
          });

          return promise;
        });

        it("should resolve values returned as Promises in then()", function() {
          const promise = asyncronicPromiseFactory(1, { PromiseConstructor });
          
          promise.then((v) => { 
            return asyncronicPromiseFactory(v + 1, { PromiseConstructor });
          }).then((newValue) => {
            expect(newValue).to.eql(2);
          });

          return promise;
        });

        it("should resolve values independently", function(done) {
          const promise = asyncronicPromiseFactory(1, { PromiseConstructor });
          
          promise.then((v) => { 
            expect(v).to.eql(1);
            return v + 1;
          });

          setTimeout(() => {
            promise.then((v) => {
              try {
                expect(v).to.eql(1);
                done();
              } catch(err) {
                done(err);
              }
            });
            
          })

        });
        
      });
      
      describe("catch()", function() {
      
        it("should return error if rejected", function(done) {
          const promise = asyncronicPromiseFactory(null, {rejected: true, PromiseConstructor});
          
          promise.then(() => { 
            done("Should not call then!")
          });

          promise.catch((err) => {
            expect(err.message).to.eql("someError");
            done();
          })
        });

        it("after catch() you can use then()", function(done) {
          const promise = asyncronicPromiseFactory(null, {rejected: true, PromiseConstructor});
          
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

        it("if then() throws synchronically catch() should handle", function() {
          const promise = syncronicPromiseFactory(1, {PromiseConstructor});
          
          return promise
            .then(() => {
              throw someError();
            })
            .catch((err) => {
              expect(err.message).to.eql("someError");
            })

        })

        it("if then() throws asynchronically catch() should handle", function() {
          const promise = asyncronicPromiseFactory(1, {PromiseConstructor});
          
          return promise
            .then(() => {
              throw someError();
            })
            .catch((err) => {
              expect(err.message).to.eql("someError");
            })
        })

      })
  }
}

