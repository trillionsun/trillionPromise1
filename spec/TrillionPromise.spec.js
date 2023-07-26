const {TrillionPromise, STATE} = require('../main/TrillionPromise'); // Adjust the path accordingly

describe('TrillionPromise', function () {
    describe('resolve and then', function () {
        it('should resolve with a value', function () {
            const promise = new TrillionPromise((resolve) => {
                resolve('resolved value');
            });

            promise.then((value) => {
                expect(value).toBe('resolved value');
            });
        });

        it('should resolve and call onFulfilled', function () {
            const promise = new TrillionPromise((resolve) => {
                resolve('resolved value');
            });

            promise.then(
                (value) => {
                    expect(value).toBe('resolved valu');
                }
            );
        });
    });

    // describe('reject and then', function () {
    //     it('should reject with a reason', function (done) {
    //         const promise = new TrillionPromise((resolve, reject) => {
    //             reject('rejected reason');
    //         });
    //
    //         promise.then(
    //             (value) => {
    //                 // Should not reach this block
    //                 done.fail('Resolved: ' + value);
    //             },
    //             (reason) => {
    //                 expect(reason).toBe('rejected reason');
    //                 done();
    //             }
    //         );
    //     });
    //
    //     it('should reject and call onRejected', function (done) {
    //         const promise = new TrillionPromise((resolve, reject) => {
    //             reject('rejected reason');
    //         });
    //
    //         promise.then(
    //             (value) => {
    //                 // Should not reach this block
    //                 done.fail('Resolved: ' + value);
    //             },
    //             (reason) => {
    //                 expect(reason).toBe('rejected reason');
    //                 done();
    //             }
    //         );
    //     });
    // });
    //
    // describe('state', function () {
    //     it('should be PENDING initially', function () {
    //         const promise = new TrillionPromise(() => {
    //         });
    //         expect(promise.state).toBe(STATE.PENDING);
    //     });
    //
    //     it('should be FULFILLED after resolving', function (done) {
    //         const promise = new TrillionPromise((resolve) => {
    //             resolve();
    //         });
    //
    //         promise.then(() => {
    //             expect(promise.state).toBe(STATE.FULFILLED);
    //             done();
    //         });
    //     });

    // it('should be REJECTED after rejecting', function (done) {
    //     const promise = new TrillionPromise((resolve, reject) => {
    //         reject();
    //     });
    //
    //     promise.then(
    //         () => {
    //             // Should not reach this block
    //             done.fail('Resolved');
    //         },
    //         () => {
    //             expect(promise.state).toBe(STATE.REJECTED);
    //             done();
    //         }
    //     );
    // });
    //
    // it('should not be updated once FULFILLED', function (done) {
    //     const promise = new TrillionPromise((resolve) => {
    //             resolve();
    //     });
    //
    //     promise.then(() => {
    //         try {
    //             promise.setState(STATE.REJECTED);
    //             done.fail('State should not be updated after FULFILLED');
    //         } catch (err) {
    //             expect(promise.state).toBe(STATE.FULFILLED);
    //             done();
    //         }
    //     });
    // });
    // });
});
