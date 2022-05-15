import React, { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import {
  Autocomplete,
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
import { ChainType, request, routes, TableType } from "lib";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { getTables, setMessage } from "store/reducers";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import Background from "components/Layout/Background";
import { useFetchData } from "lib/hooks";

const validate = yup.object({
  table: yup.string().required("Table is a required field"),
  name: yup.string().required("Name is a required field"),
  hook: yup.string().required('Hook is a required field'),
  priority: yup.number().typeError("you must specify a number"),
});

const TYPE = ["filter", "nat"];
const HOOK_FILTER = ["input", "forward", "output"];
const HOOK_NAT = ["prerouting", "output", "postrouting"];
const POLICY_FILTER = ["accept", "drop"];

export function AddChain() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tableSelected, setTableSelected] = useState<TableType | string>("");
  const [typeSelected, setTypeSelected] = useState<string>(TYPE[0]);

  const { data: tablesRes } = useFetchData<{ tables: TableType[] }>({
    path: '/tables',
    onError: (error) => {
      console.log(error)
    }
  })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ChainType>({
    defaultValues: {
      table: "",
      name: "",
      hook: "",
      priority: 0,
      policy: "accept",
    },
    resolver: yupResolver(validate),
  });
  const onSubmit: SubmitHandler<ChainType> = async (data) => {
    try {
      const payload = {
        ...data,
        table: JSON.parse(tableSelected as string),
        type: typeSelected
      }

      console.log(payload)

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
    } finally {
      reset()
      setTableSelected("")
      setTypeSelected(TYPE[0])
    }
  };

  const hooks = useMemo(() => {
    if (typeSelected === "nat") {
      return HOOK_NAT
    }
    return HOOK_FILTER
  }, [typeSelected]);

  const onTableChange = (e: SelectChangeEvent<TableType | string>) => {
    setTableSelected(e.target.value);
    setValue('table', e.target.value);
  }

  const onTypeChange = (e: SelectChangeEvent<string>) => {
    setTypeSelected(e.target.value);
    setValue('hook', '')
  }

  return (
    <Background onClick={() => { navigate(routes.CHAIN_ROUTE) }}>
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
          <Stack spacing={2} width="80%" >
            <FormControl fullWidth>
              <FormLabel>Table</FormLabel>
              <Select value={tableSelected} onChange={onTableChange} error={!!(errors.table as FieldError)?.message}>
                <MenuItem value="" sx={{ opacity: 0.6 }}>
                  None
                </MenuItem>
                {(tablesRes?.tables || []).map((table: TableType, idx: number) => (
                  <MenuItem key={idx} value={JSON.stringify(table)}>
                    {table.name}
                    <MenuSubTitle>
                      family: {table.family}
                    </MenuSubTitle>
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error={!!(errors.table as FieldError)?.message}>
                {(errors.table as FieldError)?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <TextField error={!!errors.name?.message} {...register("name")} />
              <FormHelperText error={!!errors.name?.message}>
                {errors.name?.message}
              </FormHelperText>
            </FormControl>
            <Stack direction={'row'} spacing={2}>
              <FormControl fullWidth>
                <FormLabel>Type</FormLabel>
                <Select value={typeSelected} onChange={onTypeChange}>
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
                <Select value={watch("hook")} {...register("hook")} error={!!errors.hook?.message} >
                  {hooks.map((hook: string) => (
                    <MenuItem key={hook} value={hook}>
                      {hook}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error={!!errors.hook?.message}>
                  {errors.hook?.message}
                </FormHelperText>
              </FormControl>
              <FormControl fullWidth>
                <FormLabel>Priority</FormLabel>
                <TextField
                  error={!!errors.priority?.message}
                  type="number"
                  value={watch("priority")}
                  {...register("priority")}
                />
                <FormHelperText error={!!errors.priority?.message}>
                  {errors.priority?.message}
                </FormHelperText>
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
            <Box textAlign={'center'} pt={5} >
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

const MenuSubTitle = styled('span')(() => ({
  marginLeft: '15px',
  opacity: 0.8,
  fontStyle: 'italic'
}))
