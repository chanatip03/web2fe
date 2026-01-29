import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  SelectProps,
} from "@mui/material";
import Stack from "@mui/material/Stack";

type RHFSelectProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  requiredMark?: boolean;
} & Omit<SelectProps, "name" | "value" | "onChange">;

export function RHFSelect<T extends FieldValues>({
  name,
  control,
  label,
  requiredMark,
  children,
  ...props
}: RHFSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Stack spacing={0.5}>
          {label && (
            <FormLabel>{requiredMark ? `${label} *` : label}</FormLabel>
          )}

          <FormControl fullWidth error={!!fieldState.error}>
            <Select
              {...props}
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {children}
            </Select>

            {fieldState.error && (
              <FormHelperText>{fieldState.error.message}</FormHelperText>
            )}
          </FormControl>
        </Stack>
      )}
    />
  );
}
