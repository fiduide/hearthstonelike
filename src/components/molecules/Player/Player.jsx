import { Card } from "../Card";
import PlayerStyled from "./PlayerStyled.styled";

const Player = ({
  id,
  name,
  hp,
  maxHp,
  hand,
  discard,
  deck,
  maxMana,
  currentMana,
  onCardClick,
  onPlayerClick,
}) => {
  return (
    <PlayerStyled className={`player-${id}`}>
      <div className="blockHp" onClick={(e) => onPlayerClick(e, id)}>
        <div className="player-name">{name}</div>
        <div className="player-hp">
          {hp} / {maxHp}
        </div>
      </div>
      <div className="player-hand">
        {hand.map((card) => (
          <Card
            key={`player-card-${card.id}`}
            owner={id}
            onCardClick={onCardClick}
            {...card}
          />
        ))}
      </div>

      <div className="player-deck-size">{deck.length}</div>
      <div className="player-mana">
        {currentMana} / {maxMana}
      </div>
    </PlayerStyled>
  );
};

export default Player;
