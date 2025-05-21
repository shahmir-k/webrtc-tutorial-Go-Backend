import styled from 'styled-components';

export const Container = styled.button<{ isActive: boolean, hangUp: boolean }>`
    width: 2.5rem;
    height: 2.5rem;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 9999px;
    border: none;
    transition: 0.2s;
    background-color: ${({ isActive, hangUp }) => isActive ? hangUp ? 'rgb(220, 38, 38)' : 'transparent' : 'rgb(71, 85, 105)'};
    color: ${({ isActive }) => isActive ? 'white' : 'rgb(148, 163, 184)'};
    opacity: ${({ isActive }) => isActive ? 1 : 0.6};

    cursor: ${({ isActive }) => {
        if (isActive) {
            return 'pointer';
        }

        return 'not-allowed';
    }};

    &:hover {
        background-color: ${({ isActive, hangUp }) => isActive ? hangUp ? "#b91c1c" : "#475569" : 'none'};
    }
`