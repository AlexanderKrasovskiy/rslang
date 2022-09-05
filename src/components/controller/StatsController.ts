import { statsModel } from '../model/StatsModel';
import { Stats } from '../types/statsTypes';
import { StatView } from '../view/StatsView';

export class StatsController {
  model;
  view;

  constructor(mainDiv: HTMLElement) {
    this.model = statsModel;
    this.view = new StatView(mainDiv);
  }

  public async show() {
    const isLogged = localStorage.getItem('user');
    let stats: Stats;

    if (isLogged) {
      stats = await this.model.getStats();
      this.handleEmptyStats(stats);
    } else {
      stats = this.model.getDefaultStats();
      const msg = 'Нет данных - нужно Войти ;)';
      M.toast({ html: msg });
    }

    this.view.render(stats);
  }

  private handleEmptyStats(stats: Stats) {
    const dates = Object.values(stats.optional.long);
    const { length } = dates;
    const { newWords, learnedWords } = dates[0];

    if (length === 1 && newWords === 0 && learnedWords === 0) {
      const msg = 'Рано ты - сначала поиграй ;)';
      M.toast({ html: msg });
    }
  }
}
