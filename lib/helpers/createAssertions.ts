/*eslint-disable*/

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

let timeDateRegex =
  /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?/i;

export function createAssertions(object, paramName = "body") {
  let keys = Object.keys(object);

  for (let i = 0; i < keys.length; i++) {
    let value = object[keys[i]];

    if (typeof value == "string") {
      if (timeDateRegex.test(value)) console.log("expect(" + paramName + "." + keys[i] + ").toBeValidDate();");
      else console.log("expect(" + paramName + "." + keys[i] + ').toBe("' + value + '");');
    } else if (value == null) {
      console.log("expect(" + paramName + "." + keys[i] + ").toBe(null);");
    } else if (typeof value == "number") {
      console.log("expect(" + paramName + "." + keys[i] + ").toBe(" + value + ");");
    } else if (typeof value == "object") {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          console.log("expect(" + paramName + "." + keys[i] + ").toEqual([]);");
        } else if (typeof value[0] === "object") {
          createAssertions(value, paramName + "." + keys[i]);
        } else {
          let newArray = [];
          for (let k = 0; k < value.length; k++) {
            if (typeof value[k] === "string") {
              newArray.push('"' + value[k] + '"');
            } else {
              newArray.push(value[k]);
            }
          }
          console.log("expect(" + paramName + "." + keys[i] + ").toEqual([" + newArray + "]);");
        }
      } else if (Object.keys(value).length === 0) {
        console.log("expect(" + paramName + "." + keys[i] + ").toEqual({});");
      } else if (parseInt(keys[i]) >= 0) {
        createAssertions(value, paramName + "[" + keys[i] + "]");
      } else {
        createAssertions(value, paramName + "." + keys[i]);
      }
    }
  }
}
