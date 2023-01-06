import { ProgressBar } from "components/atoms";
import { Card } from "../Card";
import PlayerStyled from "./PlayerStyled.styled";
import rockTexture from "assets/images/rock.png";

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
    <PlayerStyled bg={rockTexture} className={`player-${id}`}>
      <div id={id} className="blockHp" onClick={(e) => onPlayerClick(e, id)}>
        <div className="player-name">{name}</div>
        <div className="player-hp">
          {hp} / {maxHp}
          <ProgressBar hp={hp} maxHp={hp}></ProgressBar>
        </div>
      </div>
      <div className="player-hand">
        {hand.map((card) => (
          <Card
            key={`player-card-${card.id}`}
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
