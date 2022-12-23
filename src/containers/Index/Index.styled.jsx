import styled from "styled-components";

const IndexStyled = styled.div`
  .bottomHeader {
    .text-under-search {
      p {
        text-align: center;
        margin-top: 100px;
        color: white;
        font-family: "Roboto";
        line-height: 28px;
      }
      .chooseRecipe {
        margin-top: 25px;
        text-align: center;
        span {
          font-family: "Dancing Script", cursive;
          font-size: 28px;
          color: #f55138;
          text-align: center;
        }
      }
    }

    .carousel-img {
      display: grid;
      grid-template-columns: repeat(4, 2fr);
      column-gap: 20px;
      row-gap: 25px;

      .recipeSalmon {
        grid-column: 1;
        grid-row: 2 / 5;
      }
      .recipePizza {
        grid-column: 4;
        grid-row: 2 / 5;
      }
      .recipeNoodle {
        grid-column: 2;
        grid-row: 3 / 5;
      }
      .recipeSteack {
        grid-column: 4;
        grid-row: 3 / 5;
      }
      .recipePottage {
        grid-column: 3;
        grid-row: 3 / 5;
      }
      .recipeSalade {
        grid-column: 2 / 4;
        grid-row: 2 / 5;
      }
    }
  }
`;

export default IndexStyled;
