import styled from "styled-components";

const Board = styled.div`
  position: relative;
  width: 100%;
  background-image: url("assets/images/wood.png");
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
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .board-card {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  button {
    position: absolute;
    background-image: ${(props) =>
      props.currentPlayer === "player"
        ? 'url("assets/images/button/ambre.jpg")'
        : 'url("assets/images/button/ambre-gray.jpg");'};
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
  }
`;

export default Board;
