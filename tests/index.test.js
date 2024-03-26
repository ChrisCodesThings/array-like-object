
const { default: testFunc } = await import("../");

describe("with a class", () => {
    class extendedReadOnlyArrayClass {
        #arr = ["a", "b", "c"];
        foo = "bar";

        constructor() {
            return testFunc(this.#arr, this);
        }

        hello() {
            return "world";
        }

        last() {
            return this.#arr[2];
        }

        addItem(item) {
            return this.#arr.push(item);
        }
    }

    const testArray = new extendedReadOnlyArrayClass();

    describe("check array access", () => {
        test("the array", async () => {
            expect(testArray).toEqual(["a", "b", "c"]);
        });

        test("an index", async () => {
            expect(testArray[1]).toEqual("b");
        });

        test("length", async () => {
            expect(testArray.length).toEqual(3);
        });

        test("keys", async () => {
            expect(Object.keys(testArray)).toEqual(["0", "1", "2"]);
        });

        test("iterate with 'in'", async () => {
            let n = 0;

            for (let i in testArray) {
                expect(testArray[i]).toEqual(["a", "b", "c"][i]);
                n++;
            }

            expect(n).toEqual(3);
        });

        test("iterate with 'of'", async () => {
            let n = 0;

            for (let i of testArray) {
                expect(i).toEqual(["a", "b", "c"][n++]);
            }

            expect(n).toEqual(3);
        });
    });

    describe("check class access", () => {
        test("basic function", async () => {
            expect(testArray.hello()).toEqual("world");
        });

        test("array access", async () => {
            expect(testArray.last()).toEqual("c");
        });

        test("adding something", async () => {
            expect(testArray.addItem("d")).toEqual(4);
        });

        test("the array", async () => {
            expect(testArray).toEqual(["a", "b", "c", "d"]);
        });
    });

    describe("check array set/methods blocked", () => {
        test("set index", async () => {
            expect(() => { testArray[0] = "d"; }).toThrow();
            expect(testArray[0]).toEqual("a");
        });

        test("forbidden array method", async () => {
            expect(() => { testArray.push("d") }).toThrow();
        });
    });

    describe("check allowed array method", () => {
        test("includes", async () => {
            expect(testArray.includes("a")).toEqual(true);
        });
    });
});

describe("with an object", () => {
    const arrHandler = {
        hello() {
            return "world";
        },

        last(arr) {
            return arr[arr.length - 1];
        },

        addItem(item, arr) {
            return arr.push(item);
        }
    }

    const testArray = testFunc(["a", "b", "c"], arrHandler);

    describe("check array access", () => {
        test("the array", async () => {
            expect(testArray).toEqual(["a", "b", "c"]);
        });

        test("an index", async () => {
            expect(testArray[1]).toEqual("b");
        });

        test("length", async () => {
            expect(testArray.length).toEqual(3);
        });

        test("keys", async () => {
            expect(Object.keys(testArray)).toEqual(["0", "1", "2"]);
        });

        test("iterate with 'in'", async () => {
            let n = 0;

            for (let i in testArray) {
                expect(testArray[i]).toEqual(["a", "b", "c"][i]);
                n++;
            }

            expect(n).toEqual(3);
        });

        test("iterate with 'of'", async () => {
            let n = 0;

            for (let i of testArray) {
                expect(i).toEqual(["a", "b", "c"][n++]);
            }

            expect(n).toEqual(3);
        });
    });

    describe("check object access", () => {
        test("basic function", async () => {
            expect(testArray.hello()).toEqual("world");
        });

        test("array access", async () => {
            expect(testArray.last()).toEqual("c");
        });

        test("adding something", async () => {
            expect(testArray.addItem("d")).toEqual(4);
        });

        test("the array", async () => {
            expect(testArray).toEqual(["a", "b", "c", "d"]);
        });
    });

    describe("check array set/methods blocked", () => {
        test("set index", async () => {
            expect(() => { testArray[0] = "d"; }).toThrow();
            expect(testArray[0]).toEqual("a");
        });

        test("forbidden array method", async () => {
            expect(() => { testArray.push("d") }).toThrow();
        });
    });

    describe("check customisation of allowed methods", () => {
        test("allowed default method", async () => {
            expect(testArray.includes("a")).toEqual(true);
        });

        test("disallow default methods", async () => {
            const testArray2 = testFunc(["a", "b", "c"], arrHandler, [], false);
            expect(() => { testArray2.includes("a") }).toThrow();
        });

        test("disallow default methods, allow includes", async () => {
            const testArray2 = testFunc(["a", "b", "c"], arrHandler, ["includes"], false);
            expect(testArray2.includes("a")).toEqual(true);
        });

        test("allow reverse method", async () => {
            const testArray2 = testFunc(["a", "b", "c"], arrHandler, ["reverse"]);
            testArray2.reverse();
            expect(testArray2).toEqual(["c", "b", "a"]);
        });
    });
});
