import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  styled,
  TextField,
} from "@mui/material";
import { Page } from "components/Layout/Page";
import { ChainType, request, RuleType, TableType } from "lib";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { getChains, setMessage } from "store/reducers";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import AddContainer from "./AddContainer";
import Background from "components/Layout/Background";
import { FormListControl } from "components/FormListIControl";

const validate = yup.object({
  chain: yup.string().required("Chain is required"),
});

const POLICY_FILTER = ["accept", "drop", "reject"];
const PROTOCOL = ["tcp", "udp", "icmp", "sctp", "dccp", "gre", "icmpv6"];
const PORT_PROTOCOL = ["tcp", "udp", "sctp"];

export function AddRule() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chains = useSelector((state: RootState) => state.ruleset.chains);
  const [chainSelected, setChainSelected] = useState<ChainType | string>("");
  const [protocolSelected, setProtocolSelected] = useState<string[]>([]);
  const [protocolSelect, setProtocolSelect] = useState<string[]>(['']);
  const [ipSrcSelected, setIpSrcSelected] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RuleType>({
    defaultValues: {
      ip_src: "",
      ip_dst: "",
      port_src: "",
      port_dst: "",
      port_prot: "",
      policy: "accept",
    },
    // resolver: yupResolver(validate),
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

  const onSubmit: SubmitHandler<RuleType> = async (data) => {
    console.log(data);
    try {
      const res = await request.post("/rules", data);
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
    reset();
  };

  const onChainChange = (e: SelectChangeEvent<ChainType | string>) => {
    setChainSelected(e.target.value);
  }

  const onProtocol = (protocols: string[]) => {
    console.log(protocols);
  }

  const onIpSrc = (ipSrc: string[]) => {
    console.log(ipSrc)
  }

  const onIpDst = (ipDst: string[]) => {
    console.log(ipDst)
  }

  const onPortSrc = (portSrc: string[]) => {
    console.log(portSrc)
  }

  const onPortDst = (portDst: string[]) => {
    console.log(portDst)
  }

  return (
    <Background onClick={() => { navigate('/rules') }}>
      <Page title="Add Rule">
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
              <Select value={chainSelected} onChange={onChainChange} >
                <MenuItem sx={{ opacity: 0.6 }}>
                  None
                </MenuItem>
                {chains.map((chain: ChainType, idx: number) => (
                  <MenuItem key={idx} value={JSON.stringify(chain)}>
                    {chain.name}
                    <MenuSubTitle>
                      family: {chain.family}; table: {chain.table}; hook: {chain.hook}; priority: {chain.priority}; policy: {chain.policy}
                    </MenuSubTitle>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Policy</FormLabel>
              <Select value={watch("policy")} {...register("policy")}>
                {POLICY_FILTER.map((p: string) => {
                  return (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl>
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
            <FormListControl title='Protocol' options={PROTOCOL} onCallback={onProtocol} />

            <Grid container justifyContent={"space-between"}>
              <Grid item xs={5.5}>
                <FormListControl title='IP source' type="textfield" onCallback={onIpSrc} />
                <FormListControl title="Port source" type="textfield" onCallback={onPortDst} />
              </Grid>
              <Grid item xs={5.5}>
                <FormListControl title='IP destination' type="textfield" onCallback={onIpDst} />
                <FormListControl title='Port destination' type='textfield' onCallback={onPortSrc} />
              </Grid>
            </Grid>
            <Button variant="contained" type="submit">
              Add
            </Button>
          </Stack>
        </Box>
      </Page>
    </Background>
  );
}


const MenuSubTitle = styled('span')(() => ({
  marginLeft: '15px',
  opacity: 0.8,
  fontStyle: 'italic'
}))