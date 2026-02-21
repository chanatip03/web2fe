import { ReactNode } from "react";
import { Controller, FieldValues, Path, Control, RegisterOptions } from "react-hook-form";
import {
  TextField,
  InputAdornment,
  TextFieldProps,
} from "@mui/material";

interface RHFInputProps<T extends FieldValues>
  extends Omit<TextFieldProps, "name" | "slotProps"> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  startIcon?: ReactNode; 
  endIcon?: ReactNode;
  slotProps?: TextFieldProps["slotProps"];
  rules?: RegisterOptions<T>;
}
export function RHFTextField<T extends FieldValues>({
  name,
  control,
  label,
  required,
  startIcon,
  endIcon,
  slotProps,
  rules,
  ...props
}: Readonly<RHFInputProps<T>>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
          <TextField
            {...props}
            {...field}
            label={label}
            value={field.value ?? ""}
            size="small"
            required={required}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
            slotProps={{
              ...slotProps,
              input: {
                ...slotProps?.input,
                ...(startIcon && {
                  startAdornment: (
                    <InputAdornment position="start">
                      {startIcon}
                    </InputAdornment>
                  ),
                }),
                ...(endIcon && {
                  endAdornment: (
                    <InputAdornment position="end">{endIcon}</InputAdornment>
                  ),
                }),
              },
            }}
          />
      )}
    />
  );
}
