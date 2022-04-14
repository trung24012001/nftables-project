import React from "react";
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
import { request, TableType } from "lib";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { setMessage } from "store/reducers";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";

const validate = yup.object({
  family: yup.string().required("required family"),
  name: yup.string().required(),
});

export function AddRule() {
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
              <FormLabel>Family</FormLabel>
              <Select value={watch("family")} {...register("family")}>
                <MenuItem value="ip">ip</MenuItem>
                <MenuItem value="ip6">ip6</MenuItem>
                <MenuItem value="inet">inet</MenuItem>
                <MenuItem value="bridge">bridge</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <TextField {...register("name")} />
              {errors.name && errors.name.type === "required" && (
                <Typography color="error">{errors.name.message}</Typography>
              )}
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
