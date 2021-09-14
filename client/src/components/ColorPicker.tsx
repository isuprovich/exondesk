import { Typography } from "@material-ui/core"
import { Control, Controller, FieldValues } from "react-hook-form"
import { HexColorPicker } from 'react-colorful'

interface IColorPicker {
    control: Control<FieldValues>
    color?: string
    name: string
}

const ColorPicker: React.FC<IColorPicker> = ({control, color, name}) => {
    return <>
        <Typography>Выберите цвет для тега</Typography>
        <Controller
            name={name}
            control={control}
            defaultValue={color}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <HexColorPicker color={value} onChange={onChange} style={{width: '100%', height: '100px'}}/>
        )}/>
    </>
}

export default ColorPicker