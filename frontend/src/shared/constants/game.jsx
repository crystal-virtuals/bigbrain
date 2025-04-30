/***************************************************************
                        Game
***************************************************************/
class Game {
  constructor(data) {
    this.id = data.id || uid();
    this.owner = data.owner;
    this.active = data.active || null;
    this.oldSessions = data.oldSessions || [];
    this.name = data.name;
    this.questions = data.questions.map((q) => new Question(q));
    this.thumbnail = data.thumbnail || '';
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}
/***************************************************************
                        Game Question
***************************************************************/

const QuestionTypesMap = {
  'singleChoice': 'singleChoice',
  'multipleChoice': 'multipleChoice',
  'judgement': 'judgement',
}

const QuestionDurationsMap = {
  '5': 5,
  '10': 10,
  '20': 20,
  '45': 45,
  '80': 80
}

const QuestionPointsMap = {
  '0': 0,
  '1': 1,
  '2': 2
}

class Question {
  constructor(data) {
    this.id = data.id || uid();
    this.name = data.name || '';
    this.thumbnail = data.thumbnail || '';
    this.type = QuestionTypesMap[data.type] || 'singleChoice';
    this.duration = QuestionDurationsMap[data.duration] || 10;
    this.points = QuestionPointsMap[data.points] || 1;
    this.answers = data.answers.map((a) => new Answer(a));
    this.correctAnswers = data.correctAnswers || [];
  }
}

// game id 355963
// session 864381
/***************************************************************
                        Game Question Answer
***************************************************************/
class Answer {
  constructor(data) {
    this.id = data.id || uid();
    this.name = data.name || '';
    this.correct = data.correct || false;
  }
}

/***************************************************************
                        Game Session
***************************************************************/
const GameStatusMap = {
  'started': 'started',
  'advanced': 'advanced',
  'ended': 'ended',
}

class Session {
  constructor(data) {
    this.status = GameStatusMap[data.status] || 'started';
    this.sessionId = data.sessionId;
    this.gameId = data.gameId;
    this.position = data.position || 0;
  }
}