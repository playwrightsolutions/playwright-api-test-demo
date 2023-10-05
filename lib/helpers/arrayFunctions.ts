/* 
  Call valueExists function with an array of objects, a key, and value.
  The function will return true or false if it found the value specified in the array

  body.items is an array of objects from the customers table, 
  last_name is a key in the array of objects,
  "LaRusso" is the value we are trying to match

  valueExists(body.items, "last_name", "LaRusso")  //returns true or false
*/

export function valueExistsInArray(array: [], key: string, value: string) {
  return array.some(function (el) {
    return el[key] === value;
  });
}

export function removeItemsFromArray(arrayToFilter: string[], itemsToRemove: string[]) {
  itemsToRemove.forEach((itemToRemove) => {
    arrayToFilter = arrayToFilter.filter((arrayItem) => arrayItem !== itemToRemove);
  });

  return arrayToFilter;
}
