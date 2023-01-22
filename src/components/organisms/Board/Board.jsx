import { Loader } from "components/atoms";
import { Card } from "components/molecules/Card";
import { Player } from "components/molecules/Player";
import { CardManagerContext } from "context/cardManagerContext";
import { PlayerManagerContext } from "context/playerManagerContext";
import { useContext, useEffect, useState } from "react";
import BoardStyled from "./BoardStyled.styled";
import { Death } from "components/molecules/Death";

const Board = () => {
  const { computer, player, currentPlayer, playerDeath } =
    useContext(PlayerManagerContext);

  const {
    handleCardClick,
    onPlayerClick,
    handleEndTurnClick,
    selectedCard,
    cardsInPlay,
    setCardsInPlay,
    isAttacking,
    handleClickGiveButton,
    handleClickLog,
  } = useContext(CardManagerContext);

  const computerCardsInPlay = cardsInPlay.filter(
    (card) => card.owner === "computer"
  );

  const playerCardsInPlay = cardsInPlay.filter(
    (card) => card.owner === "player"
  );

  if (currentPlayer.length === 0) {
    return <Loader />;
  } else if (playerDeath) {
    return <Death currentPlayer={currentPlayer} />;
  } else {
    return (
      <BoardStyled
        buttonBg={currentPlayer.id === "player" ? true : false}
        currentPlayer={currentPlayer.id}
      >
        <div className="current-player">
          <p>Current player : {currentPlayer.id}</p>
        </div>
        <div className="container-player">
          <Player
            key="computer"
            onCardClick={handleCardClick}
            onPlayerClick={onPlayerClick}
            {...computer}
          />
        </div>
        <div id="boardGame" className="box-card">
          <div className="board-card ">
            {computerCardsInPlay &&
              computerCardsInPlay.map((card) => (
                <Card
                  selectedCard={selectedCard && selectedCard.id === card.id}
                  isAttacking={
                    selectedCard &&
                    selectedCard.id === card.id &&
                    isAttacking &&
                    isAttacking.boolean
                      ? isAttacking
                      : null
                  }
                  key={card.id}
                  {...card}
                  onCardClick={() => handleCardClick(card)}
                />
              ))}
          </div>
          <hr />
          <div className="board-card">
            {playerCardsInPlay &&
              playerCardsInPlay.map((card) => (
                <Card
                  selectedCard={selectedCard && selectedCard.id === card.id}
                  isAttacking={
                    selectedCard &&
                    selectedCard.id === card.id &&
                    isAttacking &&
                    isAttacking.boolean
                      ? isAttacking
                      : null
                  }
                  key={card.id}
                  {...card}
                  onCardClick={() => handleCardClick(card)}
                />
              ))}
          </div>
        </div>
        <div className="container-player">
          <Player
            key="player"
            onCardClick={handleCardClick}
            onPlayerClick={onPlayerClick}
            {...player}
          />
        </div>
        <button onClick={handleEndTurnClick}>Passer</button>
        {/* <a onClick={handleClickGiveButton}>Give Card</a> */}
        <div onClick={(e) => handleClickLog(e)} id="log"></div>
      </BoardStyled>
    );
  }
};

export default Board;
