// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers'

type IProps = {
  name: string;
};

type Props = IProps & TextFieldProps;


export default function RHFDatePicker({ name, label }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          label={label}
          value={field.value}
          inputFormat="dd.MM.yyyy"
          onChange={(v: any) => {
            const date = (v instanceof Date) ? new Date(Date.UTC(v.getFullYear(), v.getMonth(), v.getDate())) : v;
            field.onChange(date);
          }}
          renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
            <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
          )}
        />
      )}
    />

  );
}