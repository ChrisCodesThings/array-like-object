
const { default: testFunc } = await import("../");

class extendedReadOnlyArrayClass {
    #arr = ["a", "b", "c"];
    foo = "bar";

    constructor() {
        return testFunc(this.#arr, this, ["includes"]);
    }

    hello() {
        return "world";
    }

    last() {
        return this.#arr[2];
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
});

describe("check array set/methods blocked", () => {
    test("set index", async () => {
        expect(() => { testArray[0] = "d"; }).toThrow();
        expect(testArray[0]).toEqual("a");
    });

    test("array method", async () => {
        expect(() => { testArray.push("d") }).toThrow();
    });
});

describe("check allowed array method", () => {
    test("includes", async () => {
        expect(testArray.includes("a")).toEqual(true);
    });
});
