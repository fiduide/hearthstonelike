import styled from "styled-components";

const CardStyled = styled.div`
  background-image: url(${(props) => props.bg});
  background-repeat: no-repeat;
  background-size: contain;
  height: 200px;
  width: 150px;
  position: relative;
  transition: ease-in-out all 0.25s;
  transform: ${(props) => (props.selectedCard ? "scale(1.10)" : "scale(1)")};
  border: ${(props) => (props.provocation ? "6px solid gray" : "none")};

  .selected {
    border: 5px inset red;
  }

  .name {
    color: white;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding-top: 60%;
    font-size: 12px;
  }

  .type {
    font-size: 9px;
    color: white;
    position: absolute;
    top: 0;
    right: 25px;
    text-align: center;
  }

  .card-description {
    color: white;
    text-align: center;
    font-size: 9px;
    padding: 0 25px;
    margin-top: 15%;
  }

  .card-stats {
    color: whitesmoke;
    font-size: 24px;
    font-weight: 900;
    .hp {
      position: absolute;
      right: 20px;
      bottom: 10px;
    }
    .attack {
      position: absolute;
      left: 12px;
      bottom: 10px;
    }
    .cost {
      position: absolute;
      left: 8px;
      top: 0px;
    }

    @media screen and (max-width: 1024px) {
      max-height: 100px !important;
      max-width: 50px !important;
    }
  }
`;

export default CardStyled;
