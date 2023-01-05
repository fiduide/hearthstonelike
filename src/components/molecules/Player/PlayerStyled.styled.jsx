import styled from "styled-components";

const PlayerStyled = styled.div`
  background-image: url(${(props) => props.bg});
  background-repeat: no-repeat;
  background-size: cover;
  width: fit-content;
  border: 2px solid gray;
  text-align: center;
  color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

  .player {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-name {
      font-size: 24px;
      font-weight: bold;
      margin-top: 20px;
    }

    &-hand {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 20px;
      min-width: 800px;
    }

    &-discard {
      display: flex;
      flex-wrap: wrap;
      margin-top: 20px;
    }

    &-deck-size {
      font-size: 18px;
      margin-top: 20px;
    }
  }

  @media screen and (max-width: 1024px) {
    .player {
      &-hand {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 20px;
        max-width: 1024px !important;
        min-width: auto;
      }
    }
  }
`;

export default PlayerStyled;
