// HOST / Users/Statistic
export type Stats = {
  id?: string;
  learnedWords: number; // 0
  optional: {
    dateToday: string; // '29.8.22'
    today: {
      [game: string]: { newWords: number; bestSeries: number; wins: number; total: number }; // games: sprint | audio | phrase
    };
    long: {
      [date: string]: { newWords: number; learnedWords: number }; // date ex. '1.9.22'
    };
  };
};

export type SortedStatsArr = [
  string,
  {
    newWords: number;
    learnedWords: number;
  },
][];
