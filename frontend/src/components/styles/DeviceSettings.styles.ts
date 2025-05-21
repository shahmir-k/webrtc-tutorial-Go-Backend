import styled from 'styled-components';

export const Container = styled.div`
    width: 288px;

    display: flex;
    flex-direction: column;

    right: 16px;
    bottom: calc(100% + 16px);
    position: absolute;

    border-radius: 8px;
    background-color: rgb(30, 41, 59);
`;

export const Header = styled.div`
    padding: 12px 16px;
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;

    box-sizing: border-box; 
    border-bottom: 1px solid rgb(51, 65, 85);
`

export const Title = styled.h3`
    padding: 0;
    margin: 0;

    color: white;
    font-size: 16px;
`

export const Body = styled.div`
    padding: 16px;
    width: 100%;

    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    gap: 16px;
`

export const OptionBox = styled.div`
    width: 100%;

    display: flex;
    flex-direction: column;
    position: relative;
    gap: 8px;
`

export const OptionLabel = styled.label`
    font-size: 14px;
    color: rgb(148, 163, 184);
`

export const SelectedOption = styled.div`
    padding: 8px 12px;
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: relative;

    border-radius: 6px;
    background-color: rgb(51, 65, 85);
    box-sizing: border-box;

    &:hover {
        background-color: rgb(71, 85, 105);
    }

    cursor: pointer;
`

export const OptionName = styled.div`
    color: white;
    font-size: 16px;
    line-height: 1.5;
`

export const OptionList = styled.div`
    width: 100%;
    max-height: 120px;

    left: 0;
    top: calc(100% + 5px);
    position: absolute;
    

    display: flex;
    flex-direction: column; 
    align-items: center;



    border-radius: 6px;
    background-color: rgb(51, 65, 85);
    box-sizing: border-box;

    z-index: 1;

    overflow-y: scroll;
    scrollbar-width: none; 
    -ms-overflow-style: none; 
    
    &::-webkit-scrollbar { 
        display: none;
    }
`

export const Option = styled.div<{ selected: boolean }>`
    padding: 8px 12px;
    width: 100%;


    color: white;
    font-size: 16px;

    
    border-radius: 6px;
    background-color: ${({ selected }) => selected ? 'rgb(75, 85, 99)' : 'rgb(51, 65, 85)'};
    box-sizing: border-box;
    line-height: 1.5;

    &:hover {
        background-color: rgb(75, 85, 99);
    }

    cursor: pointer;
`
