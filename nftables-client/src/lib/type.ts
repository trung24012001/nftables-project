export type TableType = {
  family: string;
  name: string;
  priority: number;
};

export type ChainType = {
  table: TableType;
  name: string;
  type: string;
  hook: string;
  priority: number;
};

export type RuleType = {
  chain: ChainType;
  ipSrc: string;
  portSrc: string;
  ipDst: string;
  portDst: string;
  priority: number;
};
