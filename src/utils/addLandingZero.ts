const landingZeros = (num: number | string, places: number = 2) =>
  String(num).padStart(places, "0");
export { landingZeros };
