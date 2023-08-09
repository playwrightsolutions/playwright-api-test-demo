/*
  this function logs in console ready to use expects
  example: passing the following object (body) to the function 
  {
    "one": 1,
    "two": "2",
    "three": {
      "four": ["4", "cuatro"],
      "five": [
        {
          "six": []
        },
        {
          "seven": null
        }
      ]
    }
  }

  would generate the following ready to use assertions:

  expect(body.one).toBe(1);
  expect(body.two).toBe("2");
  expect(body.three.four).toEqual(["4","cuatro"]);
  expect(body.three.five[0].six).toEqual([]);
  expect(body.three.five[1].seven).toBe(null);
*/

export async function createAssertions(
  object: any,
  paramName = "body"
): Promise<void> {
  const keys = Object.keys(object);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = object[key];

    if (typeof value === "string") {
      console.log(`expect(${paramName}.${key}).toBe("${value}");`);
    } else if (value === null) {
      console.log(`expect(${paramName}.${key}).toBeNull();`);
    } else if (typeof value === "number") {
      console.log(`expect(${paramName}.${key}).toBe(${value});`);
    } else if (typeof value === "object") {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          console.log(`expect(${paramName}.${key}).toEqual([]);`);
        } else if (typeof value[0] === "object") {
          createAssertions(value, `${paramName}.${key}`);
        } else {
          const newArray = value.map((item: any) =>
            typeof item === "string" ? `"${item}"` : item
          );
          console.log(`expect(${paramName}.${key}).toEqual([${newArray}]);`);
        }
      } else if (Object.keys(value).length === 0) {
        console.log(`expect(${paramName}.${key}).toEqual({});`);
      } else if (parseInt(key) >= 0) {
        createAssertions(value, `${paramName}[${key}]`);
      } else {
        createAssertions(value, `${paramName}.${key}`);
      }
    }
  }
}
