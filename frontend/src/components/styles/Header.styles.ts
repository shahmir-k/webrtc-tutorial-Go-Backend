import styled from 'styled-components';

export const Container = styled.header`
    width: 100%;
    height: 80px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`

export const NameBox = styled.div`
    font-family: inherit;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 6em;
    height: 2.6em;
    line-height: 2.5em;
    overflow: hidden;
    cursor: pointer;
    margin: 20px;
    font-size: 17px;
    font-weight: 700;
    z-index: 1;
    border: 2px solid black;
    border-radius: 6px;
    position: relative;
    background: black;
    color: white;
`