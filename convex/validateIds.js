// Five-letter identifier, lowercase alpha and numbers
export async function validateIds(...ids) {
  for (const i of ids) {
    if (/^([a-z0-9]{5,})$/.test(i) === false) {
      return false;
    }
  }
  return true;
}

export default validateIds;
