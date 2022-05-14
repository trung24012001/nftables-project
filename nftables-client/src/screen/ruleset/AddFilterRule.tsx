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
import { useFetchData } from "lib/hooks";


const ACTION_FILTER = ["accept", "drop"];
const PROTOCOL = ["tcp", "udp", "icmp", "sctp"];
// const PROTOCOL = ["tcp", "udp", "icmp", "sctp", "dccp", "gre", "icmpv6"];
const PORT_PROTOCOL = ["tcp", "udp", "sctp"];


export function AddFirewallRule() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [chainSelected, setChainSelected] = useState<ChainType | string>("");
  const [resetForm, setResetForm] = useState<Date | string | number | undefined>();
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

  const { data: chainsRes } = useFetchData<{ chains: ChainType[] }>({
    path: '/chains',
    onError: (error) => {
      console.log(error)
    }
  })


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

      console.log(payload)

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
                {(chainsRes?.chains || [])?.map((chainItem: ChainType, idx: number) => {
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
                placeholder='0.0.0.0'
                resetTrigger={resetForm}
                dataRef={ipSrcRef}
              />
              <FormListControl
                title="Port source"
                type="textfield"
                resetTrigger={resetForm}
                dataRef={portSrcRef}
              />
            </Stack>

            <Stack direction={"row"}>
              <FormListControl
                title="IP destination"
                type="textfield"
                placeholder='0.0.0.0'
                resetTrigger={resetForm}
                dataRef={ipDstRef}
              />
              <FormListControl
                title="Port destination"
                type="textfield"
                resetTrigger={resetForm}
                dataRef={portDstRef}
              />
            </Stack>
            <Stack direction='row'>
              <FormListControl
                title="Protocol"
                options={PROTOCOL}
                resetTrigger={resetForm}
                dataRef={protocolRef}
              />
              {/* <MultipleSelectChip ref={protocolRef} options={PROTOCOL} label="Protocol" /> */}
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
