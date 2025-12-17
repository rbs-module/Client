export const _arrSum = <T>(arr: T[], key: keyof T) => {
  if (!arr) {
    return 0;
  }
  return arr.reduce((sum, item) => +sum + +item[key], 0);
};
