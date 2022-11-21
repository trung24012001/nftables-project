const ipv4ToNum = (ipv4: string) => {
  let d = ipv4.split(".");
  return ((+d[0] * 256 + +d[1]) * 256 + +d[2]) * 256 + +d[3];
};
const numToIpv4 = (num: number) => {
  let d = (num % 256).toString();
  for (let i = 3; i > 0; i--) {
    num = Math.floor(num / 256);
    d = (num % 256) + "." + d;
  }
  return d;
};

const parseListValue = (value: string | string[] | number[]) => {
  return (value as string[])?.join(", ")
}

export { ipv4ToNum, numToIpv4, parseListValue };
