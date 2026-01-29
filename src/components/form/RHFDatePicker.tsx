import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import {
  DatePicker,
  LocalizationProvider,
  DatePickerProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import FormLabel from "@mui/material/FormLabel";
import "dayjs/locale/th";


type RHFDatePickerProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  adapterLocale?: string;
  requiredMark?: boolean;
  required?: boolean;
} & Omit<DatePickerProps, "value" | "onChange" | "label">;

export function RHFDatePickerDayjs<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  adapterLocale = "th",
  requiredMark,
  required,
  ...props
}: RHFDatePickerProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Stack spacing={0.5}>
          {label && (
            <FormLabel>
              {requiredMark || required ? `${label} *` : label}
            </FormLabel>
          )}

          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={adapterLocale}
          >
            <DatePicker
              {...props}
              value={field.value ? dayjs(field.value) : null}
              onChange={(val) => field.onChange(val ? val.toISOString() : "")}
              slotProps={{
                textField: {
                  required: required,
                  placeholder,
                  fullWidth: true,
                  variant: "outlined",
                  error: !!fieldState.error,
                  helperText: fieldState.error?.message,
                },
              }}
            />
          </LocalizationProvider>
        </Stack>
      )}
    />
  );
}
