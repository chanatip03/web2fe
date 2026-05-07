"use client";

import { ReactNode, useState } from "react";
import {
  Controller,
  FieldValues,
  Path,
  Control,
  RegisterOptions,
} from "react-hook-form";

import {
  TextField,
  InputAdornment,
  TextFieldProps,
  IconButton,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface RHFInputProps<T extends FieldValues> extends Omit<
  TextFieldProps,
  "name" | "slotProps"
> {
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
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = String(name).toLowerCase().includes("password");

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...props}
          {...field}
          type={
            isPasswordField ? (showPassword ? "text" : "password") : props.type
          }
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
                  <InputAdornment position="start">{startIcon}</InputAdornment>
                ),
              }),

              endAdornment: (
                <InputAdornment position="end">
                  {isPasswordField ? (
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ) : (
                    endIcon
                  )}
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
}
