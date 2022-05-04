import React, { useState } from "react";
import {
  Box,
  FormLabel,
  Stack,
} from "@mui/material";
import FormItem from "./FormItem";


export function FormListControl({
  type = 'select',
  title,
  options,
  fullWidth,
  onCallback
}: {
  type?: 'select' | 'textfield',
  title: string,
  fullWidth?: boolean,
  options?: string[],
  onCallback: (selected: string[]) => void
}) {
  const [data, setData] = useState<string[]>(['']);

  return (
    <Box width={'100%'}>
      <FormLabel>{title}</FormLabel>
      <Stack spacing={2}>
        {
          data.map((s: string, idx: number) => (
            <FormItem key={idx} position={idx} options={options} setData={setData} data={data} onCallback={onCallback} type={type} />
          ))
        }
      </Stack>
    </Box>
  )
}
