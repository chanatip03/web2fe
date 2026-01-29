import { ReactNode } from "react";
import { Controller, FieldValues, Path, Control } from "react-hook-form";
import {
  TextField,
  Stack,
  FormLabel,
  InputAdornment,
  TextFieldProps,
} from "@mui/material";

interface RHFInputProps<T extends FieldValues>
  extends Omit<TextFieldProps, "name" | "slotProps"> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  requiredMark?: boolean;
  startIcon?: ReactNode; 
  endIcon?: ReactNode;
  slotProps?: TextFieldProps["slotProps"];
}
export function RHFTextField<T extends FieldValues>({
  name,
  control,
  label,
  requiredMark,
  startIcon,
  endIcon,
  slotProps,
  ...props
}: Readonly<RHFInputProps<T>>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
          <TextField
            {...props}
            {...field}
            label={label}
            value={field.value ?? ""}
            size="small"
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
