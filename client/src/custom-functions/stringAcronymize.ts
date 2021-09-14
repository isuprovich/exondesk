export const stringAcronymize = (fullString: string | undefined) => {
  return fullString?.match(/[A-Z,А-Я]/g)?.join('');
};
