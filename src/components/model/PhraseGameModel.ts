import { getWordsFromBook } from './helpers/apiHelpers';

export class PhraseGameModel {
  async getGameData(page: number, level: number) {
    const res = await getWordsFromBook(page, level);
    return res;
  }
}
