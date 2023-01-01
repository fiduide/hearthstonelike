import React, { createContext, useEffect, useState } from "react";
import {
  generateRandomDeck,
  generateRandomHand,
  writeBoardAction,
} from "services/helpers";

export const PlayerManagerContext = createContext(false);

export const PlayerManagerProvider = ({ children }) => {
  const [computer, setComputer] = useState([]);
  const [player, setPlayer] = useState([]);
  const [playerDeath, setPlayerDeath] = useState(false);

  const [currentPlayer, setCurrentPlayer] = useState([]);

  useEffect(() => {
    const generatePlayer = () => {
      if (computer.length === 0) {
        setComputer({
          id: "computer",
          name: "Computer",
          hand: generateRandomHand("computer"),
          deck: generateRandomDeck("computer"),
          currentMana: 5,
          maxMana: 5,
          hp: 30,
          maxHp: 30,
        });
      }

      if (player.length === 0) {
        setPlayer({
          id: "player",
          name: "Bob",
          hand: generateRandomHand("player"),
          deck: generateRandomDeck("player"),
          currentMana: 5,
          maxMana: 5,
          hp: 30,
          maxHp: 30,
        });
      }
    };
    generatePlayer();
  }, []);

  useEffect(() => {
    if (currentPlayer.length === 0) {
      setCurrentPlayer(player);
    }
  }, [player]);

  const endTurn = () => {
    if (currentPlayer.maxMana < 10) {
      currentPlayer.maxMana += 1;
    }
    currentPlayer.currentMana = currentPlayer.maxMana;

    writeBoardAction(
      `${currentPlayer.id} met fin à son tour`,
      currentPlayer.id
    );
    setCurrentPlayer(currentPlayer.id === "player" ? computer : player);
  };

  return (
    <PlayerManagerContext.Provider
      value={{
        computer,
        player,
        currentPlayer,
        setCurrentPlayer,
        endTurn,
        playerDeath,
        setPlayerDeath,
      }}
    >
      {children}
    </PlayerManagerContext.Provider>
  );
};
