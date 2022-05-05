import React, { useEffect, useMemo, useState } from "react";
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
import { ChainType, request, TableType } from "lib";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { getTables, setMessage } from "store/reducers";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import Background from "components/Layout/Background";

const validate = yup.object({
  table_name: yup.string().required("Table is a required field"),
  name: yup.string().required("Name is a required field"),
  type: yup.string().required(),
  hook: yup.string().required(),
  priority: yup.number().required(),
});

const TYPE = ["filter", "nat"];
const HOOK_FILTER = ["input", "forward", "output"];
const HOOK_NAT = ["prerouting", "output", "postrouting"];
const POLICY_FILTER = ["accept", "drop"];

export function AddChain() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tables = useSelector((state: RootState) => state.ruleset.tables);
  const [tableSelected, setTableSelected] = useState<TableType | string>("");

  useEffect(() => {
    dispatch(getTables({}));
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ChainType>({
    defaultValues: {
      table_name: "",
      name: "",
      type: "filter",
      hook: "",
      priority: 0,
      policy: "accept",
    },
    resolver: yupResolver(validate),
  });
  const onSubmit: SubmitHandler<ChainType> = async (data) => {

    const payload = {
      ...data,
      table: JSON.parse(tableSelected as string)
    }

    delete payload.table_name;

    console.log(payload)

    try {
      const res = await request.post("/chains", payload);
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
  };

  const hooksFromType = useMemo(() => {
    switch (watch("type")) {
      case "filter":
        return HOOK_FILTER;
      case "nat":
        return HOOK_NAT;
    }
  }, [watch("type")]);

  const onTableChange = (e: SelectChangeEvent<TableType | string>) => {
    setTableSelected(e.target.value);
    setValue('table_name', e.target.value as string);
  }

  return (
    <Background onClick={() => { navigate('/chains') }}>
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
          <Stack spacing={2} width="70%" minWidth="600px">
            <FormControl>
              <FormLabel>Name</FormLabel>
              <TextField error={!!errors.name?.message} {...register("name")} />
              <FormHelperText error={!!errors.name?.message}>
                {errors.name?.message}
              </FormHelperText>
              
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Table</FormLabel>
              <Select value={tableSelected} onChange={onTableChange} error={!!errors.table_name?.message}>
                <MenuItem value="" sx={{ opacity: 0.6 }}>
                  None
                </MenuItem>
                {tables.map((table: TableType, idx: number) => (
                  <MenuItem key={idx} value={JSON.stringify(table)}>
                    {table.name}
                    <MenuSubTitle>
                      family: {table.family}
                    </MenuSubTitle>
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error={!!errors.table_name?.message}>
                {errors.table_name?.message}
              </FormHelperText>
            </FormControl>
            <Stack direction={'row'} spacing={2}>
              <FormControl fullWidth>
                <FormLabel>Type</FormLabel>
                <Select value={watch("type")} {...register("type")} >
                  {TYPE.map((t: string) => {
                    return (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <FormLabel>Hook</FormLabel>
                {hooksFromType && (
                  <Select value={watch("hook")} {...register("hook")} >
                    {hooksFromType.map((hook: string) => (
                      <MenuItem key={hook} value={hook}>
                        {hook}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </FormControl>
              <FormControl fullWidth>
                <FormLabel>Priority</FormLabel>
                <TextField
                  type="number"
                  value={watch("priority")}
                  {...register("priority")}
                />
              </FormControl>
              <FormControl fullWidth>
                <FormLabel>Policy</FormLabel>
                <Select value={watch("policy")} {...register("policy")}>
                  {POLICY_FILTER.map((p: string) => (
                    <MenuItem key={p} value={p}>
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

const MenuSubTitle = styled('span')(() => ({
  marginLeft: '15px',
  opacity: 0.8,
  fontStyle: 'italic'
}))
