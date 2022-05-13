import { AlertColor } from "@mui/material";

export type TableType = {
  family: string;
  name: string;
  handle: number;
};

export type ChainType = {
  table: TableType | string;
  family: string;
  name: string;
  type: string;
  hook: string;
  priority: number;
  handle: number;
  policy: string;
};

export type RuleType = {
  family?: string;
  table?: string;
  chain: ChainType | string;
  ip_src: string | string[];
  ip_dst: string | string[];
  port_src: string | number[] | string[];
  port_dst: string | number[] | string[];
  port_prot: string | number;
  protocol: string | string[];
  handle: number;
  unique_handle?: number;
  policy: string;
  to?: string;
};

export type AnomalyType = {
  rule_a: RuleType;
  rule_b: RuleType;
  anomaly_type: string;
};

export type AnalyticsType = {};

export type MessageAlertType = {
  content: string;
  type: AlertColor;
};
