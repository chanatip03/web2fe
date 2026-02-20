import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  SelectProps,
} from "@mui/material";

type RHFSelectProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
} & Omit<SelectProps, "name" | "value" | "onChange">;

export function RHFSelect<T extends FieldValues>({
  name,
  control,
  label,
  children,
  required,
  ...props
}: RHFSelectProps<T>) {

  const labelId = `${name}-label`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl
          fullWidth
          error={!!fieldState.error}
          required={required}>
            
          {label && (
            <InputLabel id={labelId}>
              {label}
            </InputLabel>
          )}
          <Select
            size="small"
            {...props}
            {...field}
            labelId={labelId}
            label={label}
            value={field.value ?? ""}
            onChange={(e) => field.onChange(e.target.value)}
          >
            {children}
          </Select>

          {fieldState.error && (
            <FormHelperText>
              {fieldState.error.message}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
