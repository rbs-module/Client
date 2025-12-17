// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _arrToObjBy_id(arr: any[]) {
  return arr?.reduce((a, i) => ({ ...a, [i._id]: i }), {});
}
