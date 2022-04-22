import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Page } from "components/Layout/Page";
import { ChainType, request, RuleType, TableType } from "lib";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { getChains, setMessage } from "store/reducers";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";

const validate = yup.object({
  chain: yup.string().required("Chain is required"),
});

const POLICY_FILTER = ["accept", "drop", "reject"];
const PROTOCOL = ["tcp", "udp", "icmp"];
const PORT_PROTOCOL = ["tcp", "udp"];

export function AddRule() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chains = useSelector((state: RootState) => state.ruleset.chains);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RuleType>({
    defaultValues: {
      chain: {},
      ipSrc: "",
      portSrc: "",
      ipDst: "",
      portDst: "",
      portProt: "",
      protocol: "",
      policy: "accept",
    },
    // resolver: yupResolver(validate),
  });

  useEffect(() => {
    dispatch(getChains({}));
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      name === "portProt" && setValue("protocol", value.portProt as string);
      name === "chain" && setValue("policy", value.chain?.policy as string);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  let wchain = undefined as ChainType | undefined;
  if (Object.keys(watch("chain")).length) {
    wchain = JSON.parse(watch("chain") as unknown as string) as ChainType;
  }

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

  return (
    <>
      <KeyboardBackspaceIcon
        fontSize="large"
        sx={{ mb: 5, cursor: "pointer" }}
        onClick={() => {
          navigate("/rules");
        }}
      />
      <Page title="Add Rule">
        <Box
          p={5}
          display="flex"
          justifyContent="center"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack spacing={2} width="70%" minWidth="600px">
            <Stack direction={"row"} spacing={2}>
              <FormControl fullWidth>
                <FormLabel>Family</FormLabel>
                <TextField disabled variant="filled" value={wchain?.family} />
              </FormControl>
              <FormControl fullWidth>
                <FormLabel>Table</FormLabel>
                <TextField disabled variant="filled" value={wchain?.table} />
              </FormControl>
              <FormControl fullWidth>
                <FormLabel>Type</FormLabel>
                <TextField disabled variant="filled" value={wchain?.type} />
              </FormControl>
              <FormControl fullWidth>
                <FormLabel>Hook</FormLabel>
                <TextField disabled variant="filled" value={wchain?.hook} />
              </FormControl>
              <FormControl fullWidth>
                <FormLabel>Priority</FormLabel>
                <TextField disabled variant="filled" value={wchain?.priority} />
              </FormControl>
              <FormControl fullWidth>
                <FormLabel>Policy</FormLabel>
                <TextField disabled variant="filled" value={wchain?.policy} />
              </FormControl>
            </Stack>
            <FormControl fullWidth>
              <FormLabel>Chain</FormLabel>
              <Select value={watch("chain")} {...register("chain")}>
                <MenuItem value="" sx={{ opacity: 0.6 }}>
                  None
                </MenuItem>
                {chains.map((chain: ChainType, idx: number) => (
                  <MenuItem key={idx} value={JSON.stringify(chain)}>
                    {chain.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid container justifyContent={"space-between"}>
              <Grid item xs={5.5}>
                <FormControl fullWidth>
                  <FormLabel>IP source</FormLabel>
                  <TextField {...register("ipSrc")} />
                </FormControl>
                <Stack direction={"row"} spacing={2}>
                  <FormControl fullWidth>
                    <FormLabel>Port</FormLabel>
                    <TextField {...register("portSrc")} />
                  </FormControl>
                  <FormControl sx={{ width: "120px" }}>
                    <FormLabel>Protocol</FormLabel>
                    <Select value={watch("portProt")} {...register("portProt")}>
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
              </Grid>
              <Grid item xs={5.5}>
                <FormControl fullWidth>
                  <FormLabel>IP destination</FormLabel>
                  <TextField {...register("ipDst")} />
                </FormControl>
                <Stack direction={"row"} spacing={2}>
                  <FormControl fullWidth>
                    <FormLabel>Port</FormLabel>
                    <TextField {...register("portDst")} />
                  </FormControl>
                  <FormControl sx={{ width: "120px" }}>
                    <FormLabel>Protocol</FormLabel>
                    <Select value={watch("portProt")} {...register("portProt")}>
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
              </Grid>
            </Grid>
            <FormControl disabled={!!watch("portProt")}>
              <FormLabel>Protocol</FormLabel>
              <Select value={watch("protocol")} {...register("protocol")}>
                <MenuItem value="" sx={{ opacity: 0.6 }}>
                  All
                </MenuItem>
                {PROTOCOL.map((p: string) => {
                  return (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Policy</FormLabel>
              <Select value={watch("policy")} {...register("policy")}>
                <MenuItem value={wchain?.policy} sx={{ opacity: 0.6 }}>
                  Follow chain
                </MenuItem>
                {POLICY_FILTER.map((p: string) => {
                  return (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Button variant="contained" type="submit">
              Add
            </Button>
          </Stack>
        </Box>
      </Page>
    </>
  );
}
