
/**
 * Reading a value from the cookie by it's name.
 * @param  name - the key name in the cookie
 * @returns  - the value corresponds to the given name.
 */
export function getCookieValueByName(name) {
  const cookieValue = document.cookie.split(';').filter((entry) => entry.includes(name));
  if (cookieValue && cookieValue.length > 0)
    return decodeURIComponent(cookieValue[0].split('=')[1]);
  return null;
}

/**
 * Deleting a value from the cookie by it's name.
 * @param  name - the key name in the cookie
 */
export function deleteCookie(name) {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

/**
 * checks whether 2 arrays are identical
 * @param {Array} arr1 - one array to compare
 * @param {Array} arr2 - second array to compare
 * @returns true if the two arrays are identical (icluding empty and null arrays), false otherwise. 
 */
export function compareArrays(arr1, arr2) {
  if (!arr1 || !arr2) {
    if (arr1 === arr2)
      return true;
    return false
  }
  if (arr1.length !== arr2.length)
    return false;
  return compareObjectIteration(arr1, arr2);
}


/**
 * checks whether 2 objects are identical - same exact properties with values.
 * @param {Object} obj1 - one object to compare
 * @param {Object} obj2 - second object to compare
 * @returns true if the two objects are identical (icluding empty and null objects), false otherwise.
 */
export function compareObjects(obj1, obj2) {
  if (!obj1 || !obj2) {
    if (obj1 === obj2)
      return true;
    return false
  }
  return compareObjectIteration(obj1, obj2) && compareObjectIteration(obj2, obj1);
}

/**
 * Iterating through none null one object and check if it has the same fields and values as the second object.
 * @param {Object} obj1 
 * @param {Object} obj2 
 * @returns {true} if obj1 has the same fields and values obj2 has, otherwise @returns {false}.
 */
function compareObjectIteration(obj1, obj2) {
  for (const key in obj1) {

    if (obj1[key] instanceof Array) {
      if (!compareArrays(obj1[key], obj2[key]))
        return false;
    }
    else if (obj1[key] instanceof Object) {
      if (!compareObjects(obj1[key], obj2[key]))
        return false;
    }
    else if (obj1[key] !== obj2[key])
      return false;
  }
  return true;
}

