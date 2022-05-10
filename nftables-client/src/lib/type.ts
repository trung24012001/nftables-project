import { AlertColor } from "@mui/material";

export type TableType = {
  family: string;
  name: string;
  handle?: number;
};

export type ChainType = {
  table_name?: string;
  table: TableType;
  family: string;
  name: string;
  type: string;
  hook: string;
  priority: number;
  handle?: number;
  policy: string;
};

export type FilterRuleType = {
  chain: ChainType | string;
  chain_name?: string;
  ip_src: string;
  ip_dst: string;
  port_src: string;
  port_dst: string;
  port_prot: string;
  protocol: string;
  handle: number;
  policy: string;
};

export type NatRuleType = {
  chain: ChainType | string;
  chain_name?: string;
  ip_src: string;
  ip_dst: string;
  port_src: string;
  port_dst: string;
  port_prot: string;
  protocol: string;
  handle: number;
  policy: string;
  to: string;
};

export type RuleTypeResponse = {
  chain: ChainType;
  ip_src: string[];
  ip_dst: string[];
  port_src: string[];
  port_dst: string[];
  port_prot: string;
  protocol: string[];
  handle: number;
  policy: string;
};

export type AnomalyType = {
  rule_a: FilterRuleType;
  rule_b: FilterRuleType;
  anomay_type: string;
};

export type MessageAlertType = {
  content: string;
  type: AlertColor;
};
