import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { getThemeColors } from '../../theme';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label: string;
  theme?: 'user' | 'admin';
  fullWidth?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

export default function SelectField({
  value,
  onChange,
  options,
  label,
  theme = 'user',
  fullWidth = true,
  disabled = false,
  size = 'medium'
}: SelectFieldProps) {
  const colors = getThemeColors(theme);

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl
      fullWidth={fullWidth}
      disabled={disabled}
      size={size}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: colors.border
          },
          '&:hover fieldset': {
            borderColor: colors.primary
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.primary
          }
        },
        '& .MuiInputLabel-root': {
          color: colors.textSecondary,
          '&.Mui-focused': {
            color: colors.primary
          }
        },
        '& .MuiSelect-select': {
          color: colors.text
        }
      }}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={handleChange}
        sx={{
          '& .MuiSelect-icon': {
            color: colors.textSecondary
          }
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
} 