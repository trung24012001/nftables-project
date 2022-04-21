import React, { useEffect, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Page } from "components/Layout/Page";
import { ChainType, request, TableType } from "lib";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { getTables, setMessage } from "store/reducers";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";

const validate = yup.object({
  table: yup.string().required("required table"),
  name: yup.string().required(),
  type: yup.string().required(),
  hook: yup.string().required(),
  priority: yup.number().required(),
});

const TYPE = ["filter", "nat"];
const HOOK_FILTER = ["input", "forward", "output"];
const HOOK_NAT = ["prerouting", "output", "postrouting"];
const POLICY_FILTER = ["accept", "drop", "reject"];

export function AddChain() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tables = useSelector((state: RootState) => state.ruleset.tables);

  useEffect(() => {
    dispatch(getTables({}));
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChainType>({
    defaultValues: {
      table: {},
      name: "",
      type: "filter",
      hook: "",
      priority: 0,
      policy: "accept",
    },
    resolver: yupResolver(validate),
  });
  const onSubmit: SubmitHandler<ChainType> = async (data) => {
    console.log(data);

    try {
      const res = await request.post("/chains", data);
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
          content: "Add chain error",
          type: "error",
        })
      );
    }
    reset();
  };

  const hooksFromType = useMemo(() => {
    switch (watch("type")) {
      case "filter":
        return HOOK_FILTER;
      case "nat":
        return HOOK_NAT;
    }
  }, [watch("type")]);

  return (
    <>
      <KeyboardBackspaceIcon
        fontSize="large"
        sx={{ mb: 5, cursor: "pointer" }}
        onClick={() => {
          navigate("/chains");
        }}
      />
      <Page title="Add chain">
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
              <FormLabel>Name</FormLabel>
              <TextField error={!!errors.name?.message} {...register("name")} />
              <FormHelperText error={!!errors.name?.message}>
                {errors.name?.message}
              </FormHelperText>
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Table</FormLabel>
              {tables.length && (
                <Select value={watch("table")} {...register("table")}>
                  {tables.map((table: TableType) => (
                    <MenuItem key={table.name} value={JSON.stringify(table)}>
                      {table.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Type</FormLabel>
              <Select value={watch("type")} {...register("type")}>
                {TYPE.map((t: string) => {
                  return (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Hook</FormLabel>
              {hooksFromType && (
                <Select value={watch("hook")} {...register("hook")}>
                  {hooksFromType.map((hook: string) => (
                    <MenuItem key={hook} value={hook}>
                      {hook}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Priority</FormLabel>
              <TextField
                type="number"
                value={watch("priority")}
                {...register("priority")}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Policy</FormLabel>
              <Select value={watch("policy")} {...register("policy")}>
                {POLICY_FILTER.map((p: string) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
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
