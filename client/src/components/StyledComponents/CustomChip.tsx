import { Chip } from '@material-ui/core';
import styled from 'styled-components';
import { TChipStyleProps } from '../../pages/TasksListPage';

export const CustomChip = styled(Chip) <TChipStyleProps> `
    margin-right: 8px;
    border-radius: 5px;
    color: white;
    background-color: ${props => props.$color === undefined ? "grey" : props.$color};
    transition: opacity .3s ease;
    &:hover {
        opacity: 70%;
        background-color: ${props => props.$color === undefined ? "black" : props.$color};
    };
    &:focus {
        opacity: 70%;
        background-color: ${props => props.$color === undefined ? "black" : props.$color};
    }
`;
