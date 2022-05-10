import { MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React, { useState } from 'react'
import ActionContainer from './ActionContainer';

export default function FormItem({
  type,
  options,
  position,
  data,
  setData,
  onCallback,
  placeholder
}: {
  type?: 'select' | 'textfield',
  options?: string[],
  position: number,
  data: string[],
  setData: React.Dispatch<React.SetStateAction<string[]>>,
  onCallback: (selected: string[]) => void,
  placeholder?: string
}) {

  const onSelectChange = (e: SelectChangeEvent<unknown>) => {
    setData(items => {
      items.splice(position, 1, e.target.value as string);
      onCallback(items.filter(item => item.length));
      return [...items];
    })
  }

  const onTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(items => {
      items.splice(position, 1, e.target.value as string);
      onCallback(items.filter(item => item.length));
      return [...items];
    })
  }

  const handleAdd = () => {
    setData((items: string[]) => [...items, ''])
  }

  const handleDelete = (pos: number) => {
    setData((items: string[]) => {
      items.splice(pos, 1);
      onCallback(items.filter(item => item.length));
      return [...items];
    })
  }

  return (
    <ActionContainer hasDelete={position > 0}
      hasAdd={position === 0}
      onAdd={handleAdd}
      onDelete={() => handleDelete(position)}>
      {
        type === 'select' &&
        <Select value={data[position]} onChange={onSelectChange} fullWidth placeholder={placeholder} >
          <MenuItem value="" sx={{ opacity: 0.6 }}>
            Any
          </MenuItem>
          {options?.map((opt: string) => {
            return (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            );
          })}
        </Select>
      }
      {type === 'textfield' &&
        <TextField value={data[position]} onChange={onTextFieldChange} fullWidth placeholder={placeholder} />
      }
    </ActionContainer>
  )
}
