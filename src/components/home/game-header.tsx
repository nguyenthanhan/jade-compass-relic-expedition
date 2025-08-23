import React from "react";

export function GameHeader() {
  return (
    <div className="text-center space-y-4 mb-8">
      <h1
        className="font-pixel text-8xl text-[var(--primary)]"
        style={{ fontSize: "4rem" }}
      >
        JADE COMPASS
      </h1>
      <p className="font-pixel text-lg text-[var(--accent)] float">
        Relic Expedition
      </p>
      <p className="font-retro text-3xl text-[var(--muted-foreground)]">
        A treasure hunting adventure awaits...
      </p>
    </div>
  );
}
