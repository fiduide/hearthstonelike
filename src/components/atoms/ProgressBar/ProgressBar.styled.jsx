import styled from "styled-components";

const ProgressBarStyled = styled.div`
  width: ${(props) => props.maxHp + "%"};
  height: 15px;
  margin: auto;
  background-color: gray;
  .progress {
    background-color: red;
    height: 100%;
    width: ${(props) => props.hp * (100 / props.maxHp) + "%"};
  }
`;

export default ProgressBarStyled;
