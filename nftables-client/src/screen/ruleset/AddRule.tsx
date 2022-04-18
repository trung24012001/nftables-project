import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
  Typography,
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
  family: yup.string().required("required family"),
  name: yup.string().required(),
});

const POLICY_FILTER = ["accept", "drop", "reject"];
const PROTOCOL = ["all", "tcp", "udp", "icmp"];

export function AddRule() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chains = useSelector((state: RootState) => state.ruleset.chains);
  useEffect(() => {
    dispatch(getChains({}));
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RuleType>({
    defaultValues: {
      chain: {},
      ipSrc: '',
      portSrc: '',
      ipDst: '',
      portDst: '',
      protocol: '',
      policy: 'accept',
    },
    resolver: yupResolver(validate),
  });
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
          noValidate
          autoComplete="off"
        >
          <Stack spacing={3} width="70%" minWidth="600px">
            <FormControl>
              <FormLabel>Family</FormLabel>
              <TextField disabled value={watch('chain')?.table?.family} />
            </FormControl>
            <FormControl>
              <FormLabel>Table</FormLabel>
              <TextField disabled value={watch('chain')?.table?.name} />
            </FormControl>
            <FormControl>
              <FormLabel>Type</FormLabel>
              <TextField disabled value={watch('chain')?.type} />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Chain</FormLabel>
              {chains.length &&
                <Select value={watch('chain')}
                  {...register("chain")}>
                  {chains.map((chain: ChainType, idx: number) => (
                    <MenuItem key={idx} value={JSON.stringify(chain)} >
                      {chain.name}
                    </MenuItem>
                  ))}
                </Select>
              }
            </FormControl>
            <FormControl>
              <FormLabel>IP source</FormLabel>
              <TextField {...register("ipSrc")} />
            </FormControl>
            <FormControl>
              <FormLabel>Port source</FormLabel>
              <TextField {...register("portSrc")} />
            </FormControl>
            <FormControl>
              <FormLabel>Protocol source</FormLabel>
              <TextField {...register("portSrc")} />
            </FormControl>
            <FormControl>
              <FormLabel>IP destination</FormLabel>
              <TextField {...register("ipDst")} />
            </FormControl>
            <FormControl>
              <FormLabel>Port destination</FormLabel>
              <TextField {...register("portDst")} />
            </FormControl>
            <FormControl>
              <FormLabel>Protocol destination</FormLabel>
              <TextField {...register("portSrc")} />
            </FormControl>
            <FormControl>
              <FormLabel>Protocol</FormLabel>
              <Select value={watch("protocol")} {...register("protocol")}>
                {PROTOCOL.map((p: string) => {
                  return <MenuItem key={p} value={p}>{p}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Policy</FormLabel>
              <Select value={watch("policy")} {...register("policy")}>
                {POLICY_FILTER.map((p: string) => {
                  return <MenuItem key={p} value={p}>{p}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <Grid container justifyContent="flex-end" mb={3}>
              <Button variant="contained" type="submit">
                Add
              </Button>
            </Grid>
          </Stack>
        </Box>
      </Page>
    </>
  );
}
