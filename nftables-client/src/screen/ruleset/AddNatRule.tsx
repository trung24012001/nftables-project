import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  styled,
  TextField,
} from "@mui/material";
import { Page } from "components/Layout/Page";
import { ChainType, request, routes, NatRuleType } from "lib";
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

const ACTION_NAT = ["snat", "dnat", "redirect", "masquerade"];
const PROTOCOL = ["tcp", "udp", "icmp", "sctp", "dccp", "gre", "icmpv6"];
const PORT_PROTOCOL = ["tcp", "udp", "sctp"];

export function AddNatRule() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chains = useSelector((state: RootState) => state.ruleset.chains);
  const [chainSelected, setChainSelected] = useState<ChainType | string>("");
  const [actions, setActions] = useState<string[]>(ACTION_NAT);
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
  } = useForm<NatRuleType>({
    defaultValues: {
      chain_name: "",
      port_prot: "",
      policy: "",
      to: "",
    },
    resolver: yupResolver(validate),
  });

  useEffect(() => {
    dispatch(getChains({}));
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      name === "port_prot" && setValue("protocol", value.port_prot as string);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit: SubmitHandler<NatRuleType> = async (data) => {
    try {
      const payload = {
        ...data,
        chain: JSON.parse(chainSelected as string),
        protocol: protocolRef.current,
        ip_src: ipSrcRef.current,
        ip_dst: ipDstRef.current,
        port_src: portSrcRef.current,
        port_dst: portDstRef.current,
      };

      delete payload.chain_name;

      console.log(payload)

      const res = await request.post("/rules", payload, {
        params: {
          type: 'nat'
        }
      });
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
    if (e.target.value) {
      const chainValue = JSON.parse(e.target.value as string);
      if (chainValue.hook === "prerouting") {
        setActions(["dnat", "redirect"]);
      } else if (chainValue.hook === "postrouting") {
        setActions(["snat", "masquerade"]);
      }
    }
    setChainSelected(e.target.value);
    setValue("chain_name", "value");
    setValue(("policy"), '')
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
        navigate(routes.NAT_ROUTE);
      }}
    >
      <Page title="Add Nat Rule">
        <Box
          p={5}
          display="flex"
          justifyContent="center"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack spacing={2} width="80%" >
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
                  if (chain.type !== "nat") return;
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
            <Stack direction={"row"} spacing={2}>
              <FormControl fullWidth>
                <FormLabel>Action</FormLabel>
                <Select
                  value={watch("policy")}
                  {...register("policy")}
                  disabled={!chainSelected}
                >
                  {actions.map((p: string) => {
                    return (
                      <MenuItem key={p} value={p}>
                        {p}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <FormLabel>To</FormLabel>
                <TextField disabled={!watch("policy")} value={watch("to")}
                  {...register("to")} />
              </FormControl>
            </Stack>

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
