export const WHEEL_CONFIG = {
  SPACES: 24,
  CASH_VALUES: [500, 550, 600, 650, 700, 800, 850, 900],
  HEXS: ["#0000FF", "#008000", "#ffaebcff", "#800080", "#FF0000", "#FFA500"],
  TOP_CASH: {
    R1: 2500,
    R2: 3500,
    R3: 3500,
    R: 5000, 
  },
  TOP_HEX: "#FFD700",
  BR: 2,               
  BR_VAL: "BANKRUPT",  
  BR_HEX: "#000000",   
  LT: 1,              
  LT_VAL: "LOSE TURN",
  LT_HEX: "#FFFFFF",
  MY_VAL: "MYSTERY",   
  MY_HEX: "#ccff00",   

  // Mystery wedge
  // If the player does NOT flip
  // Player will get $1000 per consonant
  MY_SAFE_CASH: 1000,

  // If player does flip and wins
  // $10000 bonus gets added directly to roundBank
  MY_BONUS_CASH: 10000,
};


