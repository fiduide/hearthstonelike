import ProgressBarStyled from "./ProgressBar.styled";

const ProgressBar = (props) => {
  const { hp, maxHp } = props;
  return (
    <ProgressBarStyled hp={hp} maxHp={maxHp}>
      <div className="progress"></div>
    </ProgressBarStyled>
  );
};

export default ProgressBar;
