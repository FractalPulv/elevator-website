"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Deck = "italian" | "poker";

const DeckCtx = createContext<{ deck: Deck; setDeck: (d: Deck) => void }>({
  deck: "italian",
  setDeck: () => {},
});

export function DeckProvider({ children }: { children: ReactNode }) {
  const [deck, setDeck] = useState<Deck>("italian");
  return <DeckCtx.Provider value={{ deck, setDeck }}>{children}</DeckCtx.Provider>;
}

export const useDeck = () => useContext(DeckCtx);
