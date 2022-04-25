import { AlertColor } from "@mui/material";
import { type } from "os";

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

export type RuleType = {
  chain: ChainType;
  chain_name: string;
  ip_src: string;
  ip_dst: string;
  port_src: string;
  port_dst: string;
  port_prot: string;
  protocol: string;
  handle: number;
  policy: string;
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

export type PortType = {
  port: string;
  protocol: string;
};

export type MessageAlertType = {
  content: string;
  type: AlertColor;
};
