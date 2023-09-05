import { createAssertions } from "@helpers/createAssertions";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const log = jest.spyOn(console, "log").mockImplementation(() => {});

describe("createAssertions", () => {
  test("createAssertions logs proper assertions to console", async () => {
    const input = {
      one: 1,
      two: "2",
      three: {
        four: ["4", "cuatro"],
        five: [
          {
            six: [],
          },
          {
            seven: null,
          },
        ],
      },
    };
    const expectedLogConsoleCalls = [
      ["expect(body.one).toBe(1);"],
      ['expect(body.two).toBe("2");'],
      ['expect(body.three.four).toEqual(["4","cuatro"]);'],
      ["expect(body.three.five[0].six).toEqual([]);"],
      ["expect(body.three.five[1].seven).toBeNull();"],
    ];

    await createAssertions(input);

    expect(log.mock.calls).toEqual(expectedLogConsoleCalls);
  });
});
