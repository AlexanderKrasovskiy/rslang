import { getWords } from './helpers/apiHelpers';

export class BookModel {
  async getBookWords(level = 0, page = 0) {
    const res = await getWords(page, level);
    return res;
  }
}
