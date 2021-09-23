import { Accordion, AccordionDetails, AccordionSummary, Typography, Grid } from "@material-ui/core"
import { Control, Controller, FieldValues, UseFormWatch, useWatch } from "react-hook-form"
import { HexColorPicker } from 'react-colorful'

interface IColorPicker {
    control: Control<FieldValues>
    color?: string
    name: string
    watch?: UseFormWatch<FieldValues>
}

const ColorPicker: React.FC<IColorPicker> = ({ control, color, name }) => {
    const smth = useWatch({name: name, control: control})
    return <>
        <Accordion variant="outlined">
            <AccordionSummary style={{backgroundColor: smth !== undefined ? smth : color}}>
                <Typography align="center" style={{width: '100%'}}>Цвет тега</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container direction="column" spacing={1}>
                    <Grid item>
                        <Typography align="center" variant="subtitle2">Выберите цвет для тега</Typography>
                    </Grid>
                    <Grid item>
                        <Controller
                            name={name}
                            control={control}
                            defaultValue={color}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <HexColorPicker color={value} onChange={onChange} style={{ width: '100%', height: '100px' }} />
                            )} />
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    </>
}

export default ColorPicker