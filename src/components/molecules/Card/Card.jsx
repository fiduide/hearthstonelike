import CardStyled from "./CardStyled.styled";

import { useSpring, animated } from "react-spring";
import cardBg from "assets/images/cards.png";

import { useRef } from "react";

const Card = (props) => {
  const {
    id,
    type,
    name,
    attack,
    hp,
    cost,
    description,
    onCardClick,
    owner,
    hasAttacked,
    isAttacking,
    selectedCard,
    provocation,
  } = props;

  const cardSpring = useSpring({
    from: {
      transform: `translate3d(-350px, ${
        owner === "player" ? "500px" : "-500px"
      }, 0)`,
    },
    to: { transform: `translate3d(0, 0, 0)` },
  });

  const attackSpring = useSpring({
    transform: `translate3d(${
      isAttacking && isAttacking.boolean ? isAttacking.card.y + "px" : 0
    }px, ${
      isAttacking && isAttacking.boolean ? isAttacking.card.x + "px" : 0
    }px, 0)`,
  });

  return (
    <animated.div
      style={isAttacking && isAttacking.boolean ? attackSpring : cardSpring}
      id={id}
      onClick={() => onCardClick(props)}
    >
      <CardStyled
        provocation={provocation ? provocation : false}
        bg={cardBg}
        selectedCard={selectedCard}
      >
        <img
          src={process.env.PUBLIC_URL + "/assets/images/cards/" + name + ".png"}
          alt=""
        />
        <div className="card-text name">{name}</div>
        <div className="card-description">{description}</div>
        <div className="card-stats">
          <div className="card-stat hp">{hp}</div>
          <div className="card-stat attack">{attack}</div>
          <div className="card-stat cost">{cost}</div>
        </div>
        <div className="card-text type">{type}</div>
      </CardStyled>
    </animated.div>
  );
};

export default Card;
