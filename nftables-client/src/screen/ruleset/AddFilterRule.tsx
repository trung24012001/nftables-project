import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  styled,
} from "@mui/material";
import { Page } from "components/Layout/Page";
import { ChainType, request, routes, FilterRuleType } from "lib";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { getChains, setMessage } from "store/reducers";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import Background from "components/Layout/Background";
import { FormListControl } from "components/FormListControl";

const validate = yup.object({
  chain_name: yup.string().required("Chain is a required field"),
});

const ACTION_FILTER = ["accept", "drop"];
const PROTOCOL = ["tcp", "udp", "icmp", "sctp", "dccp", "gre", "icmpv6"];
const PORT_PROTOCOL = ["tcp", "udp", "sctp"];

export function AddFirewallRule() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chains = useSelector((state: RootState) => state.ruleset.chains);
  const [chainSelected, setChainSelected] = useState<ChainType | string>("");
  const protocolRef = useRef<string[]>([]);
  const ipSrcRef = useRef<string[]>([]);
  const ipDstRef = useRef<string[]>([]);
  const portSrcRef = useRef<string[]>([]);
  const portDstRef = useRef<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FilterRuleType>({
    defaultValues: {
      chain_name: "",
      port_prot: "",
      policy: "",
    },
    resolver: yupResolver(validate),
  });

  useEffect(() => {
    dispatch(getChains({}));
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      name === "port_prot" && setValue("protocol", value.port_prot as string);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit: SubmitHandler<FilterRuleType> = async (data) => {
    const payload = {
      ...data,
      chain: JSON.parse(chainSelected as string),
      protocol: protocolRef.current,
      ip_src: ipSrcRef.current,
      ip_dst: ipDstRef.current,
      port_src: portSrcRef.current,
      port_dst: portDstRef.current,
    };
    try {
      const res = await request.post("/rules/filter", payload);
      if (res.status === 200) {
        dispatch(
          setMessage({
            content: res.data.message,
            type: "success",
          })
        );
      }
    } catch (error) {
      console.log(error);
      dispatch(
        setMessage({
          content: "Add rule error",
          type: "error",
        })
      );
    }
  };

  const onChainChange = (e: SelectChangeEvent<ChainType | string>) => {
    setChainSelected(e.target.value);
    setValue("chain_name", "has value");
  };

  const onProtocol = (protocols: string[]) => {
    protocolRef.current = protocols;
  };

  const onIpSrc = (ipSrc: string[]) => {
    ipSrcRef.current = ipSrc;
  };

  const onIpDst = (ipDst: string[]) => {
    ipDstRef.current = ipDst;
  };

  const onPortSrc = (portSrc: string[]) => {
    portSrcRef.current = portSrc;
    if (portDstRef.current.length) {
    }
  };

  const onPortDst = (portDst: string[]) => {
    portDstRef.current = portDst;
  };

  return (
    <Background
      onClick={() => {
        navigate(routes.FIREWALL_ROUTE);
      }}
    >
      <Page title="Add Firewall Rule">
        <Box
          p={5}
          display="flex"
          justifyContent="center"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack spacing={2} width="70%" minWidth="600px">
            <FormControl fullWidth>
              <FormLabel>Chain</FormLabel>
              <Select
                value={chainSelected}
                onChange={onChainChange}
                error={!!errors.chain_name?.message}
              >
                <MenuItem value="" sx={{ opacity: 0.6 }}>
                  None
                </MenuItem>
                {chains.map((chain: ChainType, idx: number) => {
                  if (chain.type !== "filter") return;
                  return (
                    <MenuItem key={idx} value={JSON.stringify(chain)}>
                      {chain.name}
                      <MenuSubTitle>
                        table: {chain.family} {chain.table}; hook: {chain.hook};
                        priority: {chain.priority}; policy: {chain.policy}
                      </MenuSubTitle>
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText error={!!errors.chain_name?.message}>
                {errors.chain_name?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Action</FormLabel>
              <Select value={watch("policy")} {...register("policy")}>
                {ACTION_FILTER.map((p: string) => {
                  return (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <Stack direction="row">
              <FormListControl
                title="IP source"
                type="textfield"
                onCallback={onIpSrc}
              />
              <FormListControl
                title="IP destination"
                type="textfield"
                onCallback={onIpDst}
              />
              <FormListControl
                title="Protocol"
                options={PROTOCOL}
                onCallback={onProtocol}
                fullWidth
              />
            </Stack>

            <Stack direction={"row"}>
              <FormListControl
                title="Port source"
                type="textfield"
                onCallback={onPortSrc}
              />
              <FormListControl
                title="Port destination"
                type="textfield"
                onCallback={onPortDst}
              />
              <FormControl fullWidth>
                <FormLabel>Port Protocol</FormLabel>
                <Select value={watch("port_prot")} {...register("port_prot")}>
                  <MenuItem value="" sx={{ opacity: 0.6 }}>
                    None
                  </MenuItem>
                  {PORT_PROTOCOL.map((p: string, idx: number) => (
                    <MenuItem key={idx} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Button variant="contained" type="submit">
              Add
            </Button>
          </Stack>
        </Box>
      </Page>
    </Background>
  );
}

const MenuSubTitle = styled("span")(() => ({
  marginLeft: "15px",
  opacity: 0.8,
  fontStyle: "italic",
}));
