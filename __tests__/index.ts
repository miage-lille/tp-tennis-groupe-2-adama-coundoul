import { describe, expect, test } from '@jest/globals';
import { otherPlayer, playerToString, score, scoreWhenAdvantage, scoreWhenDeuce, scoreWhenForty, scoreWhenPoint, stringToPoint } from '..';
import { Deuce,PointsData,Score,advantage, deuce, fifteen, forty, game, love, points, thirty } from '../types/score';
import { stringToPlayer } from '../types/player';

describe('Tests for tooling functions', () => {
  test('Given playerOne when playerToString', () => {
    expect(playerToString('PLAYER_ONE')).toStrictEqual('Player 1');
  });

  test('Given playerOne when otherPlayer', () => {
    expect(otherPlayer('PLAYER_ONE')).toStrictEqual('PLAYER_TWO');
  });
});

describe('Tests for transition functions', () => {
  test('Given deuce, score is advantage to winner', () => {
  ['PLAYER_ONE', 'PLAYER_TWO'].forEach((w) => {
    const score = scoreWhenDeuce(stringToPlayer(w));
    const scoreExpected = advantage(stringToPlayer(w));
    expect(score).toStrictEqual(scoreExpected);
  })
});

  test('Given advantage when advantagedPlayer wins, score is Game avantagedPlayer', () => {
  ['PLAYER_ONE', 'PLAYER_TWO'].forEach((advantaged) => {
    const advantagedPlayer = stringToPlayer(advantaged);
    const winner = advantagedPlayer;
    const score = scoreWhenAdvantage(advantagedPlayer, winner);
    const scoreExpected = game(winner);
    expect(score).toStrictEqual(scoreExpected);
  })
});

  test('Given advantage when otherPlayer wins, score is Deuce', () => {
  ['PLAYER_ONE', 'PLAYER_TWO'].forEach((advantaged) => {
    const advantagedPlayer = stringToPlayer(advantaged);
    const winner = otherPlayer(advantagedPlayer);
    const score = scoreWhenAdvantage(advantagedPlayer, winner);
    const scoreExpected = deuce();
    expect(score).toStrictEqual(scoreExpected);
  })
});

 test('Given a player at 40 when the same player wins, score is Game for this player', () => {
  ['PLAYER_ONE', 'PLAYER_TWO'].forEach((winner) => {
    const fortyData = {
      player: stringToPlayer(winner),
      otherPoint: stringToPoint('THIRTY'),
    };
    const score = scoreWhenForty(fortyData, stringToPlayer(winner));
    const scoreExpected = game(stringToPlayer(winner));
    expect(score).toStrictEqual(scoreExpected);
  })
});

 test('Given player at 40 and other at 30 when other wins, score is Deuce', () => {
  ['PLAYER_ONE', 'PLAYER_TWO'].forEach((winner) => {
    const fortyData = {
      player: otherPlayer(stringToPlayer(winner)),
      otherPoint: stringToPoint('THIRTY'),
    };
    const score = scoreWhenForty(fortyData, stringToPlayer(winner));
    const scoreExpected = deuce();
    expect(score).toStrictEqual(scoreExpected);
  })
});

  test('Given player at 40 and other at 15 when other wins, score is 40 - 30', () => {
  ['PLAYER_ONE', 'PLAYER_TWO'].forEach((winner) => {
    const fortyData = {
      player: otherPlayer(stringToPlayer(winner)),
      otherPoint: stringToPoint('FIFTEEN'),
    };
    const score = scoreWhenForty(fortyData, stringToPlayer(winner));
    const scoreExpected = forty(fortyData.player, thirty());
    expect(score).toStrictEqual(scoreExpected);
  })
});

  // -------------------------TESTS POINTS-------------------------- //
   test('Given players at 0 or 15 points score kind is still POINTS', () => {
 // 0-0 → 15-0
  const score1 = scoreWhenPoint(
    { PLAYER_ONE: love(), PLAYER_TWO: love() }, 
    stringToPlayer('PLAYER_ONE')
  );
  expect(score1.kind).toBe('POINTS');
  
  // 15-0 → 15-15
  const score2 = scoreWhenPoint(
    { PLAYER_ONE: fifteen(), PLAYER_TWO: love() }, 
    stringToPlayer('PLAYER_TWO')
  );
  expect(score2.kind).toBe('POINTS');
});

  test('Given one player at 30 and win, score kind is forty', () => {
  ['PLAYER_ONE', 'PLAYER_TWO'].forEach((winnerStr) => {
    const winner = stringToPlayer(winnerStr);
    const loser = otherPlayer(winner);
    
    // Le gagnant a 30, le perdant a 0
    const thirtyData: PointsData = {
      PLAYER_ONE: winner === stringToPlayer('PLAYER_ONE') ? thirty() : love(),
      PLAYER_TWO: winner === stringToPlayer('PLAYER_TWO') ? thirty() : love()
    };
    
    const score = scoreWhenPoint(thirtyData, winner);
    expect(score).toStrictEqual(forty(winner, thirtyData[loser]));
  });
});

test('Full game simulation from 0-0', () => {
  let currentScore: Score = points(love(), love()); 
  
  currentScore = score(currentScore, stringToPlayer('PLAYER_ONE')); 
  expect(currentScore.kind).toBe('POINTS');
  
  currentScore = score(currentScore, stringToPlayer('PLAYER_ONE'));  
  expect(currentScore.kind).toBe('POINTS');
  
  currentScore = score(currentScore, stringToPlayer('PLAYER_ONE')); 
  expect(currentScore.kind).toBe('FORTY');
});

});
