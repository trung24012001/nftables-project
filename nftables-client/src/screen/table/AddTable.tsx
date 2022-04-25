import React from "react";
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
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { Page } from "components/Layout/Page";
import { request, TableType } from "lib";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { setMessage } from "store/reducers";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import Background from "components/Layout/Background";

const validate = yup.object({
  family: yup.string().required("Family is required"),
  name: yup.string().required("Name is required"),
});

const FAMILY = ["ip", "ip6", "inet", "bridge"];

export function AddTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TableType>({
    defaultValues: {
      family: "ip",
      name: "",
    },
    resolver: yupResolver(validate),
  });
  const onSubmit: SubmitHandler<TableType> = async (data) => {
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
    <Background onClick={() => { navigate('/') }}>
      <Page title="Add Table">
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
              <FormLabel>Family</FormLabel>
              <Select value={watch("family")} {...register("family")}>
                {FAMILY.map((fam) => (
                  <MenuItem key={fam} value={fam}>
                    {fam}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <TextField error={!!errors.name?.message} {...register("name")} />
              <FormHelperText error={!!errors.name?.message}>
                {errors.name?.message}
              </FormHelperText>
            </FormControl>
            <Button variant="contained" type="submit">
              Add
            </Button>
          </Stack>
        </Box>
      </Page>
    </Background>
  );
}
