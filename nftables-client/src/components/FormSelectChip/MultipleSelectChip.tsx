import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { FormLabel } from '@mui/material';
import { MutableRefObject } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(value: string, values: readonly string[], theme: Theme) {
  return {
    fontWeight:
      values.indexOf(value) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export function MultipleSelectChip({ options, label, ref }: {
  options: string[],
  label?: string,
  ref: MutableRefObject<string[]>,
}) {
  const theme = useTheme();
  const [values, setValues] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof values>) => {
    const data = event.target.value;
    ref.current = typeof data === 'string' ? data.split(',') : data;
    setValues(
      // On autofill we get a stringified value.
      typeof data === 'string' ? data.split(',') : data,
    );
  };

  return (
    <FormControl fullWidth>
      <FormLabel>{label}</FormLabel>
      <Select
        multiple
        value={values}
        onChange={handleChange}
        input={<OutlinedInput label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {options.map((value) => (
          <MenuItem
            key={value}
            value={value}
            style={getStyles(value, values, theme)}
          >
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
