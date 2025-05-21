import styled, { keyframes } from 'styled-components';


const popUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  60% {
    opacity: 1;
    transform: translateY(-5px) scale(1.02);
  }
  80% {
    transform: translateY(3px) scale(0.98);
  }
  100% {
    transform: translateY(0px) scale(1);
  }
`;



export const Container = styled.div`
  .card {
    width: 400px;
    height: 600px;
    border-radius: 1em;
    flex-direction: column;
    justify-content: space-evenly;
    background-color: #080808;
    box-shadow: 0 0 2rem rgba(0, 0, 0, 0.8);
    cursor: pointer;
    transition: 0.2s ease-in-out;
    padding: 5px;
    color: #fff;

    animation: ${popUp} 0.6s ease-out;
  }

  .card, .imgBox, .caller {
    display: flex;
    align-items: center;
  }

  .imgBox {
    width: 6em;
    height: 6em;
    box-shadow: 0px 0.25em 1rem rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    justify-content: center;
  }

  .imgBox svg {
    width: 100%;
    height: 100%;
  }

  .name {
    width: 100%;
    text-align: center;
    font-weight: 900;
    transition: 1s ease-in-out;
  }

  .name .p1 {
    font-size: 30px;
  }

  .name .p2 {
    font-size: 20px;
    color: rgb(50, 146, 255);
  }

  .caller {
    width: 100%;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .callerBtn {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    transition: 0.1s ease-in-out;
    animation: animate linear infinite 2s;
  }

  .callerBtn:hover {
    scale: 1.1;
  }

  #pick {
    background-color: #28ff28;
    box-shadow: 0px 3px 10px #28ff28;
  }

  #end {
    background-color: #ff2828;
    box-shadow: 0px 3px 10px #ff2828;
  }

  #end svg {
    rotate: 135deg;
  }

  @keyframes animate {
    0% {
      transform: translateY(0px);
    }

    50% {
      transform: translateY(3px) rotate(-10deg);
    }

    100% {
      transform: translateY(0px);
    }
  }`;
