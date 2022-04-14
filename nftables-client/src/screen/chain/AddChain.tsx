import React, { useEffect } from "react";
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
      table: null,
      name: "",
      type: "filter",
      hook: "forward",
      priority: 0,
    },
    resolver: yupResolver(validate),
  });
  const onSubmit: SubmitHandler<ChainType> = async (data) => {
    console.log(data);

    try {
      const res = await request.post("/tables", data);
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
          content: "Add table error",
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
          navigate("/");
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
            <FormControl fullWidth>
              <FormLabel>Table</FormLabel>
              <Select value={watch("table")} {...register("table")}>
                {tables.map((table) => {
                  <MenuItem key={table.name} value={table.family + table.name}>
                    {table.name}
                  </MenuItem>;
                })}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <TextField error={!!errors.name?.message} {...register("name")} />
              <FormHelperText error={!!errors.name?.message}>
                {errors.name?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Type</FormLabel>
              <Select value={watch("type")} {...register("type")}>
                {TYPE.map((t) => {
                  return <MenuItem value={t}>{t}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Hook</FormLabel>
              <Select value={watch("hook")} {...register("hook")}>
                {HOOK_FILTER.map((hook) => {
                  <MenuItem key={hook} value={hook}>
                    {hook}
                  </MenuItem>;
                })}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Hook</FormLabel>
              <TextField
                type="number"
                value={watch("priority")}
                {...register("priority")}
              />
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
