import { query } from '@convex-dev/server';

// Five-letter identifier, lowercase alpha and numbers
export function validateIdsInternal(...ids: string[]) {
  for (const i of ids) {
    if (/^([a-z0-9]{5,})$/.test(i) === false) {
      return false;
    }
  }
  return true;
}

export default query(async ({}, ...ids: string[]) => {
  return validateIdsInternal(...ids);
});
