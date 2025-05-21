import styled from 'styled-components';

export const Container = styled.div`
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
`;

export const OverlayBox = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    position: relative;
`

export const FloatBox = styled.div`
    width: 30%;
    height: 30%;
    top:10px;
    right: 10px;

    display: flex;
    flex-direction: row;

    border-radius: 10px;
    position: absolute;
    background-color: transparent;
`

export const VideoBox = styled.div<{ defaultView: boolean }>`
    /* width: 100%; */
    width: ${({ defaultView }) => defaultView ? 'auto' : '100%'};
    height: ${({ defaultView }) => defaultView ? '100%' : 'auto'};
    aspect-ratio: 16/9;
    object-fit: contain;
    

    display: flex;
    flex-direction: column;
    
    position: relative;

    @media (max-width: 900px) {
        width: auto;
        height: 100%;
    }

    ${({ defaultView }) =>
        defaultView &&
        `
    @media (max-width: 1200px) {
        width: 100%;
        height: auto;
    }
`}

`

export const Video = styled.video`
    width: 100%;
    height: 100%;
    border-radius: 10px;
    transform: scaleX(-1);

    @media (max-width: 800px) {
        width: 100%;
    }

    
`

export const Name = styled.div`
    padding: 4px 12px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 8px;

    font-size: 16px;
    color: white;

    position: absolute;
    left: 10px;
    bottom: 10px;
`

export const VerticalBox = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 20px;

    @media (max-width: 900px) {
        flex-direction: column;
    }
`

export const VerticalSingleBox = styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media (max-width: 900px) {
        width: 100%;
        height: 50%;
    }
`