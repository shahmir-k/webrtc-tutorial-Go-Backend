import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 7px;
    position: relative;
    color: white;
`;

export const Label = styled.label`
    font-size: 16px;
    font-weight: 700;
    padding-left: 10px;
    position: absolute;
    top: 13px;
    transition: 0.3s;
    pointer-events: none;

    color: black;
`;

export const Input = styled.input`
    width: 200px;
    height: 45px;
    border: none;
    outline: none;
    padding: 0px 17px;
    border-radius: 6px;
    color: black;

    font-size: 16px;
    background-color: transparent;
    box-shadow:
        3px 3px 10px rgba(0, 0, 0, 1),
        -1px -1px 6px rgba(255, 255, 255, 0.4);

    &:valid + ${Label},
    &:focus + ${Label} {
        transition: 0.3s;
        padding-left: 2px;
        transform: translateY(-35px);
    }

    &:valid,
    &:focus {
        box-shadow:
        3px 3px 10px rgba(0, 0, 0, 1),
        -1px -1px 6px rgba(255, 255, 255, 0.4),
        inset 3px 3px 10px rgba(0, 0, 0, 1),
        inset -1px -1px 6px rgba(255, 255, 255, 0.4);
     }
`;
