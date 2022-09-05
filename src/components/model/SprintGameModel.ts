import { getWordsFromBook } from './helpers/apiHelpers';

export class SprintGameModel {
  async getGameData(page: number, level: number) {
    const res = await getWordsFromBook(page, level);
    return res;
  }
}
