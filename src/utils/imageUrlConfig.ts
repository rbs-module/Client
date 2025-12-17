export const ImageUrlConfig = (url: string, config: string) => {
  const path = url?.split("/")?.slice(6)?.join("/");
  const base = url?.split("/")?.slice(0, 6)?.join("/");
  const uri = `${base}/${config}/${path}`;
  return uri;
};
