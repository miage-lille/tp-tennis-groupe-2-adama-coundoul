import { isSamePlayer, Player, stringToPlayer } from './types/player';
import { Advantage,advantage, deuce, fifteen, forty, FortyData, game, love, Point, PointsData, Score, thirty } from './types/score';
import { pipe, Option } from 'effect'

// -------- Tooling functions --------- //

export const playerToString = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return 'Player 1';
    case 'PLAYER_TWO':
      return 'Player 2';
  }
};
export const otherPlayer = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return stringToPlayer('PLAYER_TWO');
    case 'PLAYER_TWO':
      return stringToPlayer('PLAYER_ONE');
  }
};
// Exercice 1 :
export const pointToString = (point: Point): string => {
  switch (point.kind) {
    case 'LOVE': return 'Love';
    case 'FIFTEEN': return '15';
    case 'THIRTY': return '30';
  }
};

export const stringToPoint = (str: string): Point => {
  switch (str) {
    case 'Love':
    case 'LOVE': return love();
    case '15':
    case 'FIFTEEN': return fifteen();
    case '30':
    case 'THIRTY': return thirty();
    default: throw new Error(`Unknown point: ${str}`);
  }
};



export const scoreToString = (score: Score): string => {
  switch (score.kind) {
    case 'POINTS': {
      const { PLAYER_ONE, PLAYER_TWO } = score.pointsData;
      return `${pointToString(PLAYER_ONE)} - ${pointToString(PLAYER_TWO)}`;
    }
    case 'FORTY': {
      const { player, otherPoint } = score.fortyData;
      const otherStr = pointToString(otherPoint);
      return player === 'PLAYER_ONE' ? `40 - ${otherStr}` : `${otherStr} - 40`;
    }
    case 'DEUCE':
      return 'Deuce';
    case 'ADVANTAGE':
      return `Advantage ${playerToString(score.player)}`;
    case 'GAME':
      return `Game ${playerToString(score.player)}`;
  }
};

export const scoreWhenDeuce = (winner: Player): Score => advantage(winner);

export const scoreWhenAdvantage = (
  advantagedPlayed: Player,
  winner: Player
): Score => {
  if (isSamePlayer(advantagedPlayed, winner)) return game(winner);
  return deuce();
};

export const incrementPoint = (point: Point) : Option.Option<Point> => {
  switch (point.kind) {
    case 'LOVE':
      return Option.some(fifteen());
    case 'FIFTEEN':
      return Option.some(thirty());
    case 'THIRTY':
      return Option.none();
  }
};

export const scoreWhenForty = (
  currentForty: FortyData,
  winner: Player
): Score => {
  if (isSamePlayer(currentForty.player, winner)) return game(winner);
  return pipe(
    incrementPoint(currentForty.otherPoint),
    Option.match({
      onNone: () => deuce(),
      onSome: p => forty(currentForty.player, p) as Score
    })
  );
};



// Exercice 2
// Tip: You can use pipe function from Effect to improve readability.
// See scoreWhenForty function above.
export const scoreWhenPoint = (current: PointsData, winner: Player): Score => {
  throw new Error('not implemented');
};

// Exercice 3
export const scoreWhenGame = (winner: Player): Score => {
  throw new Error('not implemented');
};

export const score = (currentScore: Score, winner: Player): Score => {
  throw new Error('not implemented');
};
