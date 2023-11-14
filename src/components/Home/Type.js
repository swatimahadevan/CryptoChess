import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <Typewriter
      options={{
        strings: [
          "GAMIFIED CRYPTOCURRENCY",
          "CHESS",
          "BLOCKCHAIN",
          "EE4032 PROJECT",
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 60,
      }}
    />
  );
}

export default Type;
