const common = [
  {
    name: "Family",
    access: "family",
  },
  {
    name: "Table",
    access: "table",
  },
  {
    name: "Chain",
    access: "chain",
  },
  {
    name: "IPSrc",
    access: "ip_src",
  },
  {
    name: "PortSrc",
    access: "port_src",
  },
  {
    name: "IPDst",
    access: "ip_dst",
  },
  {
    name: "PortDst",
    access: "port_dst",
  },
  {
    name: "Protocol",
    access: "protocol",
  },
  {
    name: "InIF",
    access: "iif",
  },
  {
    name: "OutIF",
    access: "oif",
  },
  {
    name: "Target",
    access: "policy",
  },
];

export const firewallHeaders = [...common];

export const natHeaders = [
  ...common,
  {
    name: "To",
    access: "to",
  },
  {
    name: "Priority",
    access: "handle",
  },
];

export const returnHeaders = [...common];
