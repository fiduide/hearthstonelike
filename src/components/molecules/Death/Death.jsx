import DeathStyled from "./DeathStyled.styled";

const Death = ({ currentPlayer }) => {
  if (currentPlayer.id === "player") {
    return <DeathStyled>Félicitation, vous avez gagné !</DeathStyled>;
  } else {
    return (
      <DeathStyled>
        Vous aurez plus de chance une prochaine fois, vous avez perdu !
      </DeathStyled>
    );
  }
};

export default Death;
