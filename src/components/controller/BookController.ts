import { BookView } from '../view/BookView';
import { BookModel } from '../model/BookModel';
import { AggregatedWord, Optional, UserWordPlus, Word, WordPlusUserWord } from '../types';
import { getAggregatedHardWords, getAllUserWords } from '../model/helpers/apiHelpers';
import { LoginData } from '../types/loginTypes';
import { combineWords } from '../view/helpers/combineArr';
import { refactorResponse } from './helpers/controlHelpers';

export class BookController {
  mainDiv;
  view: BookView;
  model: BookModel;

  constructor(mainDiv: HTMLElement) {
    this.mainDiv = mainDiv;
    this.model = new BookModel();
    this.view = new BookView(mainDiv);
  }

  async show(level?: number, page?: number) {
    const userJSON = localStorage.getItem('user');

    let res: Word[];

    if (userJSON) {
      const user: LoginData = JSON.parse(localStorage.getItem('user') as string);
      if (level === 6) {
        const temp = await getAggregatedHardWords(user.id, user.token);
        const userRes: AggregatedWord[] = temp[0].paginatedResults;

        const userResNew = refactorResponse(userRes).sort(
          (a, b) => (<Optional>b.optional).learnDate - (<Optional>a.optional).learnDate,
        );

        this.view.render(userResNew, level, page, user);
      } else {
        res = await this.model.getBookWords(level, page);

        const userWords: UserWordPlus[] = await getAllUserWords(user.id, user.token);
        const tempObj = combineWords(res, userWords);
        const userRes: WordPlusUserWord[] = tempObj.combinedArr;
        const learnAndDifficult: number = tempObj.num;
        this.view.render(userRes, level, page, user, learnAndDifficult);
      }
    } else {
      res = await this.model.getBookWords(level, page);
      this.view.render(res, level, page);
    }
  }
}
