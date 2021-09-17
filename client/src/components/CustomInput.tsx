import { TextField } from "@material-ui/core"
import { Control, FieldValues, Controller } from "react-hook-form"

interface ICustomInput {
    name: string,
    label: string,
    control: Control<FieldValues>
}
const CustomInput: React.FC<ICustomInput> = ({ name, label, control }) => {
    return <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
                label={label}
                variant="outlined"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
                fullWidth={true}
                size="small"
            />
        )}
    />
}

export default CustomInput