import styled from 'styled-components';

export const Container = styled.div`
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;  
  
`;

export const Body = styled.div`
    width: 100%;
    height: calc(100% - 80.63px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export const CardBox = styled.div`
    padding-top: 80px;
    padding-bottom: 80px;
    width: 100%;
    height: 100%;
    
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 30px;

    overflow-y: scroll;
`

export const CallBackground = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    position: fixed;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    z-index: 1;
`

