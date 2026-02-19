import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import {
    DateTimePicker,
    LocalizationProvider,
    DateTimePickerProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/th";

type RHFDateTimePickerProps<T extends FieldValues> = {
    name: FieldPath<T>;
    control: Control<T>;
    label?: string;
    placeholder?: string;
    adapterLocale?: string;
    requiredMark?: boolean;
    required?: boolean;
} & Omit<DateTimePickerProps<any>, "value" | "onChange" | "label">;

export function RHFDateTimePickerDayjs<T extends FieldValues>({
    name,
    control,
    label,
    placeholder,
    adapterLocale = "th",
    requiredMark,
    required,
    ...props
}: RHFDateTimePickerProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale={adapterLocale}
                >
                    <DateTimePicker
                        {...props}
                        label={label}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(val) =>
                            field.onChange(val ? val.toISOString() : "")
                        }
                        timeSteps={{
                            minutes: 1,
                        }}
                        slotProps={{
                            textField: {
                                required: required,
                                placeholder,
                                fullWidth: true,
                                variant: "outlined",
                                size: "small",
                                error: !!fieldState.error,
                                helperText: fieldState.error?.message,
                                InputProps: {
                                    sx: {
                                        borderRadius: "4px",
                                    },
                                },
                            },
                        }}
                    />
                </LocalizationProvider>
            )}
        />
    );
}
