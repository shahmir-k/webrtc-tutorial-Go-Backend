import styled, { css } from 'styled-components';

export const Container = styled.div`
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    background-color: #020617;
`;

export const Body = styled.div`
    margin: 30px;
    width: calc(100% - 60px);
    height: calc(100% - 60px);

    border-radius: 15px;
    background: rgb(15, 23, 42);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`

export const MainBox = styled.div`
    padding: 32px;
    width: calc(100% - 64px);
    height: calc(100% - 74px - 64px);

    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-y: scroll;
    scrollbar-width: none; 
    -ms-overflow-style: none; 
    
    &::-webkit-scrollbar { 
        display: none;
    }
`

export const Title = styled.h2`
    margin: 0;
    margin-bottom: 16px;

    color: white;
    font-size: 24px;
`

export const SubTitle = styled.p`
    margin: 0;
    margin-bottom: 32px;

    font-size: 16px;
    color: rgb(148, 163, 184);
`

export const StepBoxContainer = styled.div`
    margin-bottom: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    gap: 16px;
`

export const StartButton = styled.button<{ isActive: boolean }>`
    padding: 10px 40px;
    width: fit-content;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${({ isActive }) => isActive ? 'transparent' : 'rgb(71, 85, 105)'};
    gap: 8px;

    border-radius: 6px;
    border:none;
    
    transition: all 0.2s;
    color: white;
    font-size: 17px;
    font-weight: 500;

    cursor: ${({ isActive }) => {
        if (isActive) {
            return 'pointer';
        }

        return 'not-allowed';
    }};


    ${({ isActive }) =>
        isActive &&
        css`
            &:hover {
                background-color: rgb(34, 197, 94);
            }
        `}

    opacity: ${({ isActive }) => isActive ? '1' : '0.6'};
`

export const Footer = styled.div`
    padding: 16px;
    width: calc(100% - 32px);
    height: 42px;

    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-between;
    position: relative;

    background-color: rgb(30, 41, 59);
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
`


export const CallStatusBox = styled.div`
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

export const CallTitle = styled.p`
    margin: 0;
    color: white;
    font-size: 16px;
    font-weight: 700;
`

export const CallStatus = styled.p`
    margin: 0;
    font-size: 12px;
    color: rgb(203, 213, 225);
`

export const OptionButtonBox = styled.div`
    height: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
`