import styled, { css } from 'styled-components';

import { Status } from '../../types/StepStatus';



export const Container = styled.div<{ status: Status }>`
    padding: 16px;
    width: 560px;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;

    border: 1px solid rgb(59, 130, 246);
    border-radius: 8px;
    box-sizing: border-box;
 
    background-color: ${({ status }) => {
        switch (status) {
            case 'active':
                return 'rgba(59, 130, 246, 0.1);';
            case 'inactive':
                return 'rgb(30, 41, 59)';
            case 'done':
                return 'rgba(16, 185, 129, 0.1)';
        }
    }};


    border: ${({ status }) => {
        switch (status) {
            case 'active':
                return '1px solid rgb(59, 130, 246)';
            case 'inactive':
                return '1px solid transparent';
            case 'done':
                return '1px solid rgb(34, 197, 94)';
        }
    }};

    transition: all 0.2s;
`

export const OrderIcon = styled.div<{ status: Status }>`
    width: 32px;
    height: 32px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; 

    border-radius: 50%;
    
    background-color: rgb(59, 130, 246);
    
    color: white;
    font-size: 16px;
    font-weight: 700;

    background-color: ${({ status }) => {
        switch (status) {
            case 'active':
                return 'rgb(59, 130, 246)';
            case 'inactive':
                return 'rgb(71, 85, 105)';
            case 'done':
                return 'rgb(34, 197, 94)';
        }
    }};
`

export const ContentBox = styled.div` 
    width: calc(100% - 32px - 16px);

    display: flex;
    flex-direction: column;
    gap: 12px;
`

export const Title = styled.h3`
    margin: 0;


    color: white;
`

export const Description = styled.p`
    margin: 0;
    font-size: 14px;

    color: rgb(148, 163, 184);
`

export const SendButton = styled.button<{ status: Status }>`
    padding: 8px 16px;
    width: fit-content;
    display: flex;
    flex-direction: row;
    
    align-items: center;
    background-color: ${({ status }) => {
        switch (status) {
            case 'active':
                return 'rgb(59, 130, 246)';
            case 'inactive':
                return 'rgb(71, 85, 105)';
            case 'done':
                return 'rgb(71, 85, 105);';
        }
    }};
    gap: 8px;

    border-radius: 6px;
    border:none;
    
    transition: all 0.2s;
    
    cursor: ${({ status }) => {
        switch (status) {
            case 'active':
                return 'pointer';
            case 'inactive':
                return 'not-allowed';
            case 'done':
                return 'pointer';
        }
    }};

    ${({ status }) =>
        status === 'active' &&
        css`
            &:hover {
                background-color: rgb(37, 99, 235);
            }
        `}

    opacity: ${({ status }) => status === 'active' ? '1' : '0.6'};
`

export const ButtonText = styled.p`
    margin: 0;
    color: white;
    font-size: 16px;
    font-weight: 500;
`

export const LocalVideo = styled.video<{ status: string }>`
    width: 50%;
    border-radius: 10px;
    transform: scaleX(-1);

    display: ${({ status }) => status === 'done' ? 'block' : 'none'};
`

