import ErrorStyled from "./Error.styled";

const Error = ({ ingredient }) => {
  return (
    <ErrorStyled>
      <div className="sign">&#9888;</div>
      <p>Our API has decided to take a rest, please wait until tomorrow </p>
    </ErrorStyled>
  );
};

export default Error;
