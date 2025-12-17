// const getQueryStringParams = (query: any) => {
//   return query
//     ? (/^[?#]/.test(query) ? query.slice(1) : query)
//         .split("&")
//         .reduce((params: any, param: any) => {
//           const [key, value] = param.split("=");
//           params[key] = value
//             ? decodeURIComponent(value.replace(/\+/g, " "))
//             : "";
//           return params;
//         }, {})
//     : {};
// };

// function queryStringToJSON(queryString: string) {
//    if (queryString.indexOf('?') > -1) {
//       queryString = queryString.split('?')[1];
//    }
//    var pairs = queryString.split('&');
//    var result: any = {};
//    pairs.forEach(function (pair: any) {
//       pair = pair.split('=');
//       result[pair[0]] = decodeURIComponent(pair[1] || '');
//    });
//    return result;
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const objToQueryString = function (obj: any) {
  const str: string[] = [];
  for (const p in obj)
    if (Object.prototype.hasOwnProperty.call(obj, p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

export { objToQueryString };
