import { AlertColor } from "@mui/material";
import { type } from "os";

export type TableType = {
  family: string;
  name: string;
  handle?: number;
};

export type ChainType = {
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
  ipSrc: string;
  portSrc: string;
  ipDst: string;
  portDst: string;
  portProt: string;
  handle: number;
  protocol: string;
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
