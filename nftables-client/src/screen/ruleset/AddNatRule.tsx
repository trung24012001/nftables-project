import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";
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
import { ChainType, request, routes, RuleType } from "lib";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { getChains, setMessage } from "store/reducers";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import Background from "components/Layout/Background";
import { FormListControl } from "components/FormListControl";
import { useFetchData } from "lib/hooks";



const ACTION_NAT = ["snat", "dnat", "redirect", "masquerade"];
const PROTOCOL = ["tcp", "udp", "icmp", "sctp"];
// const PROTOCOL = ["tcp", "udp", "icmp", "sctp", "dccp", "gre", "icmpv6"];
const PORT_PROTOCOL = ["tcp", "udp", "sctp"];

export function AddNatRule() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [chainSelected, setChainSelected] = useState<ChainType | string>("");
  const [actions, setActions] = useState<string[]>(ACTION_NAT);
  const protocolRef = useRef<string[]>([]);
  const ipSrcRef = useRef<string[]>([]);
  const ipDstRef = useRef<string[]>([]);
  const portSrcRef = useRef<string[]>([]);
  const portDstRef = useRef<string[]>([]);

  const validate = yup.object({
    chain: yup.string().required("Chain is a required field"),
    port_prot: yup.string().test({
      message: 'Port protocol is required when port is filled',
      test: (value) => {
        if (portSrcRef.current.length || portDstRef.current.length) {
          return !!value
        }
        return true
      },
    })
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RuleType>({
    defaultValues: {
      chain: "",
      port_prot: "",
      policy: "",
      to: "",
    },
    resolver: yupResolver(validate),
  });

  const { data: chainsRes } = useFetchData<{ chains: ChainType[] }>({
    path: '/chains',
    onError: (error) => {
      console.log(error)
    }
  })

  const onSubmit: SubmitHandler<RuleType> = async (data) => {
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
    setValue("chain", e.target.value);
    setValue(("policy"), '')
  };

  const onPortChange = (ports: string[]) => {
    if (ports.length > 0 && ports[0]) {
      console.log('required port')
    }
  }

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
          <Stack spacing={3} width="80%" >
            <FormControl fullWidth>
              <FormLabel>Chain</FormLabel>
              <Select
                value={chainSelected}
                onChange={onChainChange}
                error={!!(errors.chain as FieldError)?.message}
              >
                <MenuItem value="" sx={{ opacity: 0.6 }}>
                  None
                </MenuItem>
                {(chainsRes?.chains || []).map((chain: ChainType, idx: number) => {
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
              <FormHelperText error={!!(errors.chain as FieldError)?.message}>
                {(errors.chain as FieldError)?.message}
              </FormHelperText>
            </FormControl>
            <Stack direction={"row"} spacing={2}>
              <FormControl fullWidth>
                <FormLabel>Action</FormLabel>
                <Select
                  value={watch("policy")}
                  {...register("policy")}
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
                <TextField
                  value={watch("to")}
                  {...register("to")}
                  placeholder='0.0.0.0:port' />
              </FormControl>
            </Stack>

            <Stack direction="row">
              <FormListControl
                title="IP source"
                type="textfield"
                placeholder='0.0.0.0'
                dataRef={ipSrcRef}
              />
              <FormListControl
                title="Port source"
                type="textfield"
                dataRef={portSrcRef}
                onChange={onPortChange}
              />
            </Stack>

            <Stack direction={"row"}>
              <FormListControl
                title="IP destination"
                type="textfield"
                placeholder='0.0.0.0'
                dataRef={ipDstRef}
              />
              <FormListControl
                title="Port destination"
                type="textfield"
                dataRef={portDstRef}
                onChange={onPortChange}
              />
            </Stack>
            <Stack direction={'row'}>
              <FormListControl
                title="Protocol"
                options={PROTOCOL}
                dataRef={protocolRef}
              />
              <FormControl fullWidth>
                <FormLabel>Port Protocol</FormLabel>
                <Select value={watch("port_prot")} {...register("port_prot")} error={!!errors.port_prot?.message}>
                  <MenuItem value="" sx={{ opacity: 0.6 }}>
                    None
                  </MenuItem>
                  {PORT_PROTOCOL.map((p: string, idx: number) => (
                    <MenuItem key={idx} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error={!!errors.port_prot?.message}>
                  {errors.port_prot?.message}
                </FormHelperText>
              </FormControl>
            </Stack>
            <Box textAlign={'center'} pt={5}>
              <Button variant="contained" type="submit" sx={{ width: 300 }}>
                Add
              </Button>
            </Box>
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
