export interface Word {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
}

export interface Assets {
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
}

export interface User {
  email: string;
  password: string;
  name?: string;
}

export type ObjType = {
  [key: string]: string;
};

export enum Path {
  words = '/words',
  users = '/users',
  aggregatedWords = '/aggregatedWords',
  statistics = '/statistics',
  settings = '/settings',
  signin = '/signin',
  tokens = '/tokens',
}

export enum Method {
  get = 'GET',
  create = 'POST',
  update = 'PUT',
  delete = 'DELETE',
  updatePatch = 'PATCH',
}

export interface UserWord {
  difficulty: string;
  optional?: {
    learned: 'yes' | 'no';
    learnDate: number;
    games: {
      sprint: { wins: number; total: number };
      audio: { wins: number; total: number };
      phrase: { wins: number; total: number };
    };
    markedAsNew: boolean;
  };
}

export interface MixWordsSprint {
  audio: string;
  en: string;
  ru: string;
  match: boolean;
}

export interface MixWordsAudio {
  image: string;
  audio: string;
  en: string;
  tr: string;
  ru: string;
  ruRandom: string[];
}

export interface UserWordPlus {
  id: string; // userId
  wordId: string;
  difficulty: 'easy' | 'difficult' | 'normal';
  optional: {
    learned: 'yes' | 'no';
    learnDate: number;
    games: {
      sprint: { wins: number; total: number };
      audio: { wins: number; total: number };
      phrase: { wins: number; total: number };
    };
    markedAsNew: boolean;
  };
}

export interface WordPlusUserWord {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
  difficulty?: 'easy' | 'difficult' | 'normal';
  optional?: {
    learned: 'yes' | 'no';
    learnDate: number;
    games: {
      sprint: { wins: number; total: number };
      audio: { wins: number; total: number };
      phrase: { wins: number; total: number };
    };
    markedAsNew: boolean;
  };
}

export interface Optional {
  learned: 'yes' | 'no';
  learnDate: number;
  games: {
    sprint: { wins: number; total: number };
    audio: { wins: number; total: number };
    phrase: { wins: number; total: number };
  };
  markedAsNew: boolean;
}

export enum Difficulty {
  'difficult',
  'easy',
}

export enum Learn {
  'yes',
  'no',
}

export interface AggregatedWord {
  word: string;
  wordTranslate: string;
  _id?: string;
  audio: string;
  audioExample: string;
  audioMeaning: string;
  group: number;
  image: string;
  page: number;
  textExample: string;
  textExampleTranslate: string;
  textMeaning: string;
  textMeaningTranslate: string;
  transcription: string;
  userWord?: {
    difficulty?: 'easy' | 'difficult' | 'normal';
    optional?: {
      learned: 'yes' | 'no';
      learnDate: number;
      games: {
        sprint: { wins: number; total: number };
        audio: { wins: number; total: number };
        phrase: { wins: number; total: number };
      };
      markedAsNew: boolean;
    };
  };
}
