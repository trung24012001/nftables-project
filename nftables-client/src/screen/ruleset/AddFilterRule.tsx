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
import { MultipleSelectChip } from "components/FormSelectChip";


const ACTION_FILTER = ["accept", "drop"];
const PROTOCOL = ["tcp", "udp", "icmp", "sctp"];
// const PROTOCOL = ["tcp", "udp", "icmp", "sctp", "dccp", "gre", "icmpv6"];
const PORT_PROTOCOL = ["tcp", "udp", "sctp"];

const validate = yup.object({
  chain: yup.string().required("Chain is a required field"),
});

export function AddFirewallRule() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chains = useSelector((state: RootState) => state.ruleset.chains);
  const [chainSelected, setChainSelected] = useState<ChainType | string>("");
  const [resetForm, setResetForm] = useState<Date | string | number | undefined>();
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
    reset,
    formState: { errors },
  } = useForm<RuleType>({
    defaultValues: {
      chain: "",
      port_prot: "",
      policy: "accept",
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
      // delete payload.chain_name
      const res = await request.post("/rules", payload, {
        params: {
          type: 'filter'
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
    } finally {
      reset()
      setChainSelected("")
      setResetForm(new Date())
      protocolRef.current = []
      ipSrcRef.current = []
      ipDstRef.current = []
      portSrcRef.current = []
      portDstRef.current = []
    }
  };

  const onChainChange = (e: SelectChangeEvent<ChainType | string>) => {
    setChainSelected(e.target.value);
    setValue("chain", e.target.value);
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
                {chains?.map((chainItem: ChainType, idx: number) => {
                  if (chainItem.type !== "filter") return;
                  return (
                    <MenuItem key={idx} value={JSON.stringify(chainItem)}>
                      {chainItem.name}
                      <MenuSubTitle>
                        table: {chainItem.family} {chainItem.table}; hook: {chainItem.hook};
                        priority: {chainItem.priority}; policy: {chainItem.policy}
                      </MenuSubTitle>
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText error={!!(errors.chain as FieldError)?.message}>
                {(errors.chain as FieldError)?.message}
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
                placeholder='0.0.0.0'
                resetTrigger={resetForm}
              />
              <FormListControl
                title="Port source"
                type="textfield"
                onCallback={onPortSrc}
                resetTrigger={resetForm}
              />

            </Stack>

            <Stack direction={"row"}>
              <FormListControl
                title="IP destination"
                type="textfield"
                onCallback={onIpDst}
                placeholder='0.0.0.0'
                resetTrigger={resetForm}
              />
              <FormListControl
                title="Port destination"
                type="textfield"
                onCallback={onPortDst}
                resetTrigger={resetForm}
              />
            </Stack>
            <Stack direction='row' >
              <FormListControl
                title="Protocol"
                options={PROTOCOL}
                onCallback={onProtocol}
                resetTrigger={resetForm}
              />
              {/* <MultipleSelectChip ref={protocolRef} options={PROTOCOL} label="Protocol" /> */}
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
