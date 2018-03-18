const expect = require("chai").expect,
  FiqusPromise = require("./../src/promise"),
  { asynchronicPromiseFactory, synchronicPromiseFactory, someError, times } = require("./helpers");

describe('NodePromise', suite(Promise));
describe('FiqusPromise', suite(FiqusPromise));

/* #################################################################################################### */
                                         /* TEST SUITES */
/* #################################################################################################### */

function suite(PromiseConstructor) {
  return function() {
      let promise = null;
      this.timeout(100);
  
      describe("then()", () => {
        
        it("should resolve synchronic values", (done) => {
          const promise = synchronicPromiseFactory(1, {PromiseConstructor});
          
          promise.then((v) => { 
            expect(v).to.eql(1);
            done();
          });
        });
        
        it("should resolve asynchronic values", (done) => {
          const promise = asynchronicPromiseFactory(1, {PromiseConstructor});
          
          promise.then((v) => { 
            expect(v).to.eql(1);
            done();
          });
        });

        it("should resolve multiple handlers", (done) => {
          let promise = asynchronicPromiseFactory(1, {PromiseConstructor});
          
          times(5, function(idx) {
            promise = promise.then((v) => {
              expect(v).to.eql(1);
              if (idx == 5) return done();
              return v;
            });
          });
        });

        it("should resolve values returned in then()", (done) => {
          const promise = asynchronicPromiseFactory(1, {PromiseConstructor});
          
          promise.then((v) => {
            return v + 1;
          })
          .then((newValue) => {
            expect(newValue).to.eql(2);
            done();
          });
        });

        it("should resolve values independently without affecting the original promise", (done) => {
          const promise = asynchronicPromiseFactory(1, {PromiseConstructor});
          
          promise.then((v) => {
            return v + 1;
          });

          setTimeout(() => {
            promise.then((v) => {
              expect(v).to.eql(1);
              done();
            });
          });
        });

        it("should get undefined in the next then() if nothing is returned in the previous one", (done) => {
          const promise = asynchronicPromiseFactory(1, {PromiseConstructor});
          
          promise.then((v) => {
            expect(v).to.eql(1);
          })
          .then((shouldBeUndefined) => {
            expect(shouldBeUndefined).to.eql(undefined);
            done();
          });
        });

        it("should resolve values returned as promises", (done) => {
          const promise = asynchronicPromiseFactory(1, {PromiseConstructor});
          
          promise.then((v) => { 
            return asynchronicPromiseFactory(v + 1, {PromiseConstructor});
          })
          .then((newValue) => {
            expect(newValue).to.eql(2);
            done();
          });
        });

        it("should resolve values returned as functions", (done) => {
          const promise = asynchronicPromiseFactory(1, {PromiseConstructor});
          
          promise.then((v) => { 
            return (val) => {
              return v + val;
            };
          })
          .then((func) => {
            expect(func(3)).to.eql(4);
            done();
          });
        });

        it("should resolve values returned as a function returning a promise", (done) => {
          const promise = asynchronicPromiseFactory(1, {PromiseConstructor});
          
          promise.then((v) => { 
            return (val) => {
              return asynchronicPromiseFactory(val + v + 10, {PromiseConstructor});
            };
          })
          .then((func) => {
            return func(3).then((val) => {
              expect(val).to.eql(14);
              return val - 2;
            });
          })
          .then((val) => {
            expect(val).to.eql(12);
            done();
          });
        });

      });
      
      describe("catch()", () => {

        it("should return error if rejected and don't call then() defined before catch()", (done) => {
          const promise = asynchronicPromiseFactory(null, {rejected: true, PromiseConstructor});
          
          promise.then(() => { 
            done("This line should not be called!");
          })
          .catch((err) => {
            expect(err.message).to.eql("someError");
            done();
          });
        });

        it("after catch() you can use catch() again", (done) => {
          const promise = asynchronicPromiseFactory(null, {rejected: true, PromiseConstructor});
          
          promise.catch((err) => {
            throw someError();
          })
          .catch((err) => {
            expect(err.message).to.eql("someError");
            done();
          })
          .catch(done);
        });

        it("after catch() you can use then() with the returned value", (done) => {
          const promise = asynchronicPromiseFactory(null, {rejected: true, PromiseConstructor});
          
          promise.catch((err) => {
            return err.message;
          })
          .then((errMsg) => {
            expect(errMsg).to.eql("someError");
            done();
          })
          .catch(done);
        });

      });

      describe("then() and catch()", () => {

        it("if then() throws synchronically catch() should handle", (done) => {
          const promise = synchronicPromiseFactory(1, {PromiseConstructor});
          
          promise.then(() => {
            throw someError();
          })
          .catch((err) => {
            expect(err.message).to.eql("someError");
            done();
          })
          .catch(done);
        });

        it("if then() throws asynchronically catch() should handle", (done) => {
          const promise = asynchronicPromiseFactory(1, {PromiseConstructor});
          
          promise.then(() => {
            throw someError();
          })
          .catch((err) => {
            expect(err.message).to.eql("someError");
            done();
          })
          .catch(done);
        });

        it("should be able to catch an error produced on an inner promise's then", (done) => {
          const promise = asynchronicPromiseFactory(1, {PromiseConstructor});
          
          promise.then((v) => {
            return asynchronicPromiseFactory(v + 1, {PromiseConstructor}).then((val) => {
              expect(val).to.eql(10);
            });
          })
          .catch((err) => {
            expect(err.actual).to.eql(2);
            expect(err.expected).to.eql(10);
            done();
          })
          .catch(done);
        });

        it("should be able to catch an error produced on an inner promise's catch", (done) => {
          const promise = asynchronicPromiseFactory(1, {PromiseConstructor});
          
          promise.then((v) => {
            return asynchronicPromiseFactory(v + 1, {rejected: true, PromiseConstructor}).then(() => {
              done("This line should not be called!");
            })
            .catch((err) => {
              expect(err.message).to.eql("someAnotherError");
            });
          })
          .then(() => {
            done("This line should not be called!");
          })
          .catch((err) => {
            expect(err.actual).to.eql("someError");
            expect(err.expected).to.eql("someAnotherError");
            done();
          })
          .catch(done);
        });

      });
  }
}
