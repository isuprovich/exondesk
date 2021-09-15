import { Button } from '@material-ui/core';
import React, { ReactElement } from 'react';
import styled from 'styled-components';

interface ICustomTagButtonStyled {
    $color?: string | undefined
}
const CustomTagButtonStyled = styled(Button) <ICustomTagButtonStyled> `
    border-bottom: 4px solid ${props => props.$color === undefined ? "grey" : props.$color};
    border-radius: 0;
    text-transform: none;
`;

interface ICustomTagButton {
    color?: string,
    label?: string,
    onClick: () => void,
    avatar?: ReactElement
}

export const CustomTagButton: React.FC<ICustomTagButton> = ({color, label, onClick, avatar}) => {
    return <>
        <CustomTagButtonStyled
            startIcon={avatar}
            variant="text"
            size="small"
            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                onClick()
                event.stopPropagation()
            }}
            $color={color}
        >
            {label}
        </CustomTagButtonStyled>
    </>
}