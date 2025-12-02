export type Booleanish = boolean | number | string | null | undefined;

const TRUE_VALUES = new Set(['1', 'true', 'yes', 'y']);
const FALSE_VALUES = new Set(['0', 'false', 'no', 'n']);

/**
 * Attempts to convert loosely-typed boolean flags into actual booleans.
 * Returns undefined when the input cannot be confidently parsed.
 */
export const parseBooleanish = (value: Booleanish): boolean | undefined => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    if (value === 1) return true;
    if (value === 0) return false;
    return undefined;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (TRUE_VALUES.has(normalized)) {
      return true;
    }
    if (FALSE_VALUES.has(normalized)) {
      return false;
    }
  }

  return undefined;
};


