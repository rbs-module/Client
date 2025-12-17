import { io } from "socket.io-client";

// const getSocket = (access_token: string, path = "/orders") => {
//   const url = `${"http://localhost:4000"}/${path}`;

//   const socket = io(url, {
//     extraHeaders: {
//       access_token: `Bearer ${access_token}`,
//     },
//   });
//   return socket;
// };
// export { getSocket };

import { BASE_URL } from "@/constant/base-url";

const getSocket = (access_token: string, path?: string) => {
  console.log({ path });
  const socket = io(BASE_URL, {
    // transports: ["websocket"], // include polling
    secure: true,
    auth: {
      token: "Bearer " + access_token,
    },
    extraHeaders: {
      access_token: `Bearer ${access_token}`,
    },
  });
  return socket;
};
export { getSocket };

// import { io } from "socket.io-client";

// const getSocket = (access_token: string, path = "/orders") => {
//   const socket = io(`https://rbs-emb.art${path}`, {
//     transports: ["polling", "websocket"], // include polling
//     secure: true,
//     withCredentials: true,
//   });
//   return socket;
// };
// export { getSocket };
