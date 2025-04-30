/***************************************************************
                       Session Object
***************************************************************/
class Session {
  constructor(gameId, position, isoTimeLastQuestionStarted, players, questions, active, status, answerAvailable) {
    this.gameId = gameId;
    this.position = position;
    this.active = active; // true or false
    this.status = status; // ['started', 'advanced', 'ended']
    this.players = players;
    this.questions = questions;
    this.isoTimeLastQuestionStarted = isoTimeLastQuestionStarted;
    this.answerAvailable = answerAvailable;
  }
}
const MutationTypeMap = {
  'START': 'started',
  'ADVANCE': 'advanced',
  'END': 'ended',
}

/***************************************************************
                      Start Game Session
***************************************************************/
// On starting a new game session, map the response data
export const mapSessionData = (data) => {
  const { status, sessionId, position } = data;
  return {
    sessionId: sessionId ?? null, // null for 'ended'
    position: position ?? -1,     // only for advanced
    status: status,               // ['started', 'advanced', 'ended']
  };
}

export const createSession = (gameId, status = 'started', position = -1) => {
  return {
    gameId: gameId,
    status: MutationTypeMap[status] ?? 'started', // 'started' | 'advanced' | 'ended'
    position: position || -1, // -1 for 'started'
    active: true,
    isoTimeLastQuestionStarted: null,
    answerAvailable: false,
    players: [],
  };
};

export const endSession = (session) => {
  return {
    ...session,
    active: false,
    status: MutationTypeMap['END'] ?? 'ended',
    position: -1,
    isoTimeLastQuestionStarted: null,
    answerAvailable: false,
  };
}




/**
 * Example session object
 * "sessions": {
    "129938": {
      "gameId": "345681",
      "position": 0,
      "isoTimeLastQuestionStarted": "2025-04-29T06:24:55.561Z",
      "players": {},
      "questions": [],
      "active": false,
      "answerAvailable": false
    },
    "160107": {
      "gameId": "331155",
      "position": 0,
      "isoTimeLastQuestionStarted": "2025-04-29T22:14:53.088Z",
      "players": {},
      "questions": [],
      "active": false,
      "answerAvailable": false
    },
    "290984": {
      "gameId": "331155",
      "position": -1,
      "isoTimeLastQuestionStarted": null,
      "players": {},
      "questions": [],
      "active": true,
      "answerAvailable": false
    },
    "367174": {
      "gameId": "848967",
      "position": -1,
      "isoTimeLastQuestionStarted": null,
      "players": {},
      "questions": [],
      "active": true,
      "answerAvailable": false
    },
 */