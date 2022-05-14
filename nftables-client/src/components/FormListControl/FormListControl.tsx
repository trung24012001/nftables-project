import React, { MutableRefObject, useEffect, useState } from "react";
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
  onChange,
  placeholder,
  resetTrigger,
  dataRef
}: {
  type?: 'select' | 'textfield',
  title: string,
  options?: string[],
  onChange?: (data: string[]) => void,
  placeholder?: string,
  resetTrigger?: Date | string | number,
  dataRef: MutableRefObject<string[]>
}) {
  const [data, setData] = useState<string[]>(['']);

  useEffect(() => {
    setData([''])
    dataRef.current = []
  }, [resetTrigger])

  const onCallback = (items: string[]) => {
    dataRef.current = items
    onChange && onChange(items)
  }

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
