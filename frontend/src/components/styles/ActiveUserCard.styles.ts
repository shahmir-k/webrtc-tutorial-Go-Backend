import styled, { keyframes } from 'styled-components';

const popIn = keyframes`
    0% {
      transform: scale(0);
      opacity: 0;
    }
    80% {
      transform: scale(1.3);
      opacity: 1;
    }
    100% {
      transform: scale(1);
    }
`;

export const Container = styled.div<{ status: boolean }>`
  .card {
    width: 190px;
    height: 254px;
    background: ${({ status }) =>
    status
      ? 'linear-gradient(135deg, #FF4E50, #FF0000)'
      : 'linear-gradient(135deg, #32CD32, #2E8B57)'};
    transition: all 0.4s;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 5px  rgba(0, 0, 0, 0.705);
    font-size: 30px;
    font-weight: 900;

    animation: ${popIn} 0.2s ease-out;
  }

  .card:hover {
    border-radius: 15px;
    cursor: pointer;
    transform: scale(1.1);
    box-shadow: 0px 0px 10px 5px  rgba(0, 0, 0, 0.705);
    background: ${({ status }) =>
    status
      ? 'linear-gradient(135deg, #FF4E50, #FF0000)'
      : 'linear-gradient(135deg, #007FFF, #005DFF)'};
  }

  .first-content {
    height: 100%;
    width: 100%;
    transition: all 0.4s;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
    border-radius: 15px;
    color: white;
  }

  .card:hover .first-content {
    height: 0px;
    opacity: 0;
  }

  .second-content {
    height: 0%;
    width: 100%;
    opacity: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    transition: all 0.4s;
    font-size: 0px;
    transform: rotate(90deg) scale(-1);
    color: white;
  }

  .card:hover .second-content {
    opacity: 1;
    height: 100%;
    font-size: 1.8rem;
    transform: rotate(0deg);
  }`;
