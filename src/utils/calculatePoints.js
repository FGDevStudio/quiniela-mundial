export function calculatePoints(
  realA,
  realB,
  predA,
  predB
){

  if(
    realA === predA &&
    realB === predB
  ){
    return 5;
  }

  const realWinner =
    realA > realB
      ? "A"
      : realB > realA
      ? "B"
      : "DRAW";

  const predWinner =
    predA > predB
      ? "A"
      : predB > predA
      ? "B"
      : "DRAW";

  if(realWinner === predWinner){
    return 3;
  }

  return 0;
}