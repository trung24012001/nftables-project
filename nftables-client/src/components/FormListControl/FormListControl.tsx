import React, { useEffect, useState } from "react";
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
  onCallback,
  placeholder,
  resetTrigger
}: {
  type?: 'select' | 'textfield',
  title: string,
  options?: string[],
  onCallback: (data: string[]) => void,
  placeholder?: string,
  resetTrigger?: Date | string | number
}) {
  const [data, setData] = useState<string[]>(['']);

  useEffect(() => {
    setData([''])
  }, [resetTrigger])

  return (
    <Box width={'100%'}>
      <FormLabel>{title}</FormLabel>
      <Stack spacing={2}>
        {
          data.map((_: string, idx: number) => (
            <FormItem key={idx}
              position={idx}
              options={options}
              setData={setData}
              data={data}
              onCallback={onCallback}
              type={type}
              placeholder={placeholder} />
          ))
        }
      </Stack>
    </Box>
  )
}
