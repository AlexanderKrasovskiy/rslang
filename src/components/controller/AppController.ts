import { AppView } from '../view/AppView';
import { MainController } from './MainController';
import { BookController } from './BookController';
import { createElement } from '../view/helpers/renderHelpers';
import { Route } from '../types/appRoutes';
import { LoginController } from './LoginController';
import { SprintGameController } from './SprintGameController';
import { loaderInstance } from '../view/helpers/Loader';
import { AudioGameController } from './AudioGameController';
import { PhraseGameController } from './PhraseGameController';
import { StatsController } from './StatsController';

export class AppController {
  mainDiv;
  appView;
  main;
  book;
  login;
  sprint;
  audio;
  phrase;
  loader = loaderInstance;
  prevRoute = '';
  stats;

  constructor() {
    this.mainDiv = createElement('main');
    this.appView = new AppView(this.mainDiv);

    this.main = new MainController(this.mainDiv);
    this.login = new LoginController(this.mainDiv);
    this.book = new BookController(this.mainDiv);
    this.audio = new AudioGameController(this.mainDiv);
    this.sprint = new SprintGameController(this.mainDiv);
    this.phrase = new PhraseGameController(this.mainDiv);
    this.stats = new StatsController(this.mainDiv);
  }

  public async start() {
    const [route, level, page] = window.location.hash.slice(1).split('#');
    this.appView.render(route);

    this.loader.init();
    this.enableRouting();
    this.updateLoginStatusOnFocus();
    this.prevRoute = route;

    await this.renderNewPage([route, level, page]);
  }

  private enableRouting() {
    window.addEventListener('hashchange', () => {
      const [route, level, page] = window.location.hash.slice(1).split('#');

      if (this.prevRoute === Route.sprint) this.sprint.stopGame();
      if (this.prevRoute === Route.audio) this.audio.stopGame();
      if (this.prevRoute === Route.book && route !== Route.book) this.appView.cleanAppBody();
      this.prevRoute = route;

      this.renderNewPage([route, level, page]);
    });
  }

  private async renderNewPage([route, level = '', page = '']: string[]) {
    this.loader.show();

    const status = await this.login.updateLoginStatus();
    this.appView.updateLoginBtnText(status);

    if (route === Route.login || route === Route.register) {
      this.login.show(route);
    } else if (route === Route.book) {
      if (level !== '') {
        await this.book.show(Number(level), Number(page));
      } else {
        await this.book.show(0, 0);
      }
    } else if (route === Route.audio) {
      if (level !== '') {
        await this.audio.show(Number(level), Number(page));
      } else {
        await this.audio.show();
      }
    } else if (route === Route.sprint) {
      if (level !== '') {
        await this.sprint.show(Number(level), Number(page));
      } else {
        await this.sprint.show();
      }
    } else if (route === Route.phrase) {
      if (level !== '') {
        await this.phrase.show(Number(level), Number(page));
      } else {
        await this.phrase.show();
      }
    } else if (route === Route.stats) {
      await this.stats.show();
    } else {
      this.main.show();
    }

    this.handleFooter(route);
    this.loader.hide();
    document.documentElement.scrollTop = 0;
    M.AutoInit();
  }

  private updateLoginStatusOnFocus() {
    window.addEventListener('focus', async () => {
      this.loader.show();
      const status = await this.login.updateLoginStatus();
      this.appView.updateLoginBtnText(status);
      this.loader.hide();
    });
  }

  private handleFooter(route: string) {
    const games = ['sprint', 'audio', 'phrase'];
    if (games.includes(route)) {
      this.appView.hideFooter();
    } else {
      this.appView.showFooter();
    }
  }
}
