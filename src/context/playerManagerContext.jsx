import React, { createContext, useEffect, useState } from "react";
import { generateRandomDeck, generateRandomHand } from "services/helpers";

export const PlayerManagerContext = createContext(false);

export const PlayerManagerProvider = ({ children }) => {
  const [computer, setComputer] = useState([]);
  const [player, setPlayer] = useState([]);

  const [currentPlayer, setCurrentPlayer] = useState([]);

  useEffect(() => {
    const generatePlayer = async () => {
      if (computer.length === 0) {
        setComputer({
          id: "computer",
          name: "Computer",
          hand: generateRandomHand(),
          played: [],
          deck: generateRandomDeck(),
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
          hand: generateRandomHand(),
          played: [],
          deck: generateRandomDeck(),
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

  // useEffect(() => {
  //   if (currentPlayer.id === "player") {
  //     setPlayer(currentPlayer);
  //   } else if (currentPlayer.id === "computer") {
  //     setComputer(currentPlayer);
  //   }
  // }, [currentPlayer]);

  const endTurn = () => {
    setCurrentPlayer(currentPlayer.id === "player" ? computer : player);
  };

  return (
    <PlayerManagerContext.Provider
      value={{
        computer,
        player,
        currentPlayer,
        endTurn,
      }}
    >
      {children}
    </PlayerManagerContext.Provider>
  );
};
