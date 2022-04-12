export type TableType = {
  family: string;
  name: string;
  handle: number;
};

export type ChainType = {
  table: TableType;
  name: string;
  type: string;
  hook: string;
  handle: number;
};

export type RuleType = {
  chain: ChainType;
  ipSrc: string;
  portSrc: string;
  ipDst: string;
  portDst: string;
  handle: number;
};
