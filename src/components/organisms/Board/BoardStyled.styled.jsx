import styled from "styled-components";

const Board = styled.div`
  position: relative;
  width: 100%;
  background-image: url(${(props) => props.bg});
  background-repeat: no-repeat;
  background-size: cover;

  .current-player {
    position: fixed;
    left: 0;
    top: 0;
    background-color: whitesmoke;
    border: 1px solid gray;
    padding: 5px 10px;
    border-bottom-right-radius: 8px;
  }
  .container-player {
    display: flex;
    justify-content: center;
  }
  .box-card {
    border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 300px;

    hr {
      width: 100%;
    }
    .board-card {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  button {
    position: absolute;
    background-image: url(${(props) => props.buttonBg});
    border: none;
    border-radius: 8px;
    padding: 5px;
    top: 50%;
    right: 5%;
    z-index: 1;
    transform: scale(3);
  }

  #log {
    position: fixed;
    right: 0;
    top: 0;
    font-size: 10px;
    color: white;
    background-color: red;
    max-height: 300px !important;
    overflow-y: scroll;
    opacity: 0.7;
  }

  @media screen and (max-width: 1024px) {
    button {
      transform: scale(2);
      right: 10%;
      top: 45%;
    }
    #log {
      max-height: 300px !important;
      max-width: 200px;
    }
  }
`;

export default Board;
