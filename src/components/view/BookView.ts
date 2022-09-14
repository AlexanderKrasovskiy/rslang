import { createUserWord, updateUserWord } from '../model/helpers/apiHelpers';
import { Optional, WordPlusUserWord } from '../types';
import { Route } from '../types/appRoutes';
import { LoginData } from '../types/loginTypes';
import { Card } from './helpers/CardView';
import { createElement } from './helpers/renderHelpers';
import { statsModel } from '../model/StatsModel';

const LAST_PAGE = 29;
const WORD_ON_PAGE = 20;
const DEFAULT_PAGE = 0;

export class BookView {
  mainDiv;
  pageNumber: number;
  pageNumberViewBottom?: HTMLElement;
  lastPageNumber: number;
  levelNumber: number;
  pageNumberViewTop?: HTMLElement;
  learnAndDifficult: number;
  userRes: WordPlusUserWord[] = [];
  learnedMessage?: HTMLElement;
  games?: HTMLElement;
  cards?: HTMLElement;
  audioElems: HTMLAudioElement[] = [];

  constructor(mainDiv: HTMLElement) {
    this.mainDiv = mainDiv;
    this.pageNumber = 0;
    this.levelNumber = 0;
    this.learnAndDifficult = 0;
    this.lastPageNumber = LAST_PAGE;
  }

  render(res: WordPlusUserWord[], level?: number, page?: number, user?: LoginData, learnAndDifficult?: number) {
    this.userRes = res;
    if (learnAndDifficult || learnAndDifficult === 0) this.learnAndDifficult = learnAndDifficult;

    for (let i = 0; i < this.audioElems.length; i += 1) {
      this.audioElems[i].removeAttribute('src');
      this.audioElems[i].srcObject = null;
      this.audioElems[i].remove();
    }

    this.audioElems = [];

    this.mainDiv.innerHTML = '';

    if (level !== undefined) this.levelNumber = level;
    if (page !== undefined) this.pageNumber = page;

    const bookWrap = createElement('div', 'book-wrap', '', 'book-wrap');
    this.mainDiv.appendChild(bookWrap);
    const title = createElement('div', 'parallax-container valign-wrapper title-lang');
    title.innerHTML = `    <div class="section no-pad-bot title-lang-mobile">
      <div class="container">
        <h6 class="header center white-text h6-lang">Учебник. Multilevel coursebook</h6>
      </div>
    </div>
 
     <div class="parallax"><img src="" alt="violet" class = "img-parallax" id = "img-1"></div>`;

    bookWrap.appendChild(title);

    const section = createElement('div', 'section');
    bookWrap.appendChild(section);

    const row = createElement('div', 'row');
    section.appendChild(row);

    const levels = createElement('div', 'col s12 m2 levels');
    row.appendChild(levels);
    if (user) this.renderLevels(levels, user);
    else this.renderLevels(levels);

    const cardsWrap = createElement('div', 'col s12 m8 cards-wrap');
    row.appendChild(cardsWrap);

    if (this.levelNumber !== 6) {
      const paginationTop = createElement('div', 'pagination-top');
      cardsWrap.appendChild(paginationTop);
      this.renderPagination(paginationTop, 'top');
    }

    this.cards = createElement('div', 'cards');
    cardsWrap.appendChild(this.cards);
    if (user) this.renderCards(this.userRes, user);
    else this.renderCards(this.userRes);

    this.games = createElement('div', 'col s12 m2 games');
    row.appendChild(this.games);
    this.renderGames(this.games);

    if (this.levelNumber !== 6) {
      const pagination = createElement('div', 'pagination');
      bookWrap.appendChild(pagination);
      this.renderPagination(pagination, 'bottom');
    }

    const bottom = createElement('div', 'parallax-container valign-wrapper bottom-lang');
    bottom.innerHTML = `
     <div class="parallax"><img src="" alt="violet" class = "img-parallax" id = "img-3"></div>`;

    bookWrap.appendChild(bottom);

    if (level !== undefined) this.switchImages(level);

    this.learnedMessage = createElement('div', 'learned-message', 'Cлова на этой странице изучены!');
    bookWrap.appendChild(this.learnedMessage);

    if (user && this.learnAndDifficult === WORD_ON_PAGE && this.levelNumber !== 6) this.changePageStyle('learned');
    if (this.levelNumber === 6 && res.length === 0) {
      (<HTMLElement>this.games).style.pointerEvents = 'none';
      (<HTMLElement>this.games).classList.add('non-acceptable');
    }
  }

  renderLevels(levels: HTMLElement, user?: LoginData) {
    const levelsTitle = createElement('h6', 'levels-title center', 'Разделы');
    levels.appendChild(levelsTitle);

    const level0 = createElement('div', 'level-btn z-depth-2 waves-effect waves-purple violet-border', 'A1');
    levels.appendChild(level0);
    level0.onclick = () => this.switchLevel(0);

    const level1 = createElement('div', 'level-btn z-depth-2 waves-effect waves-yellow yellow-border', 'A2');
    levels.appendChild(level1);
    level1.onclick = () => this.switchLevel(1);

    const level2 = createElement('div', 'level-btn z-depth-2 waves-effect waves-green green-border', 'B1');
    levels.appendChild(level2);
    level2.onclick = () => this.switchLevel(2);

    const level3 = createElement('div', 'level-btn z-depth-2 waves-effect waves-teal blue-border', 'B2');
    levels.appendChild(level3);
    level3.onclick = () => this.switchLevel(3);

    const level4 = createElement('div', 'level-btn z-depth-2 waves-effect waves-orange orange-border', 'C1');
    levels.appendChild(level4);
    level4.onclick = () => this.switchLevel(4);

    const level5 = createElement('div', 'level-btn z-depth-2 waves-effect waves-red red-border', 'C2');
    levels.appendChild(level5);
    level5.onclick = () => this.switchLevel(5);

    if (user) {
      const level6 = createElement(
        'div',
        'level-btn level-btn-difficult z-depth-2 waves-effect waves-light white-border',
        'Сложные слова',
      );
      levels.appendChild(level6);
      level6.onclick = () => this.switchLevel(6);
    }
  }

  renderGames(games: HTMLElement) {
    const gamesTitle = createElement('h6', 'games-title center', 'Игры');
    games.appendChild(gamesTitle);

    const game0 = createElement('a', 'games-btn z-depth-2 waves-effect') as HTMLAnchorElement;
    game0.href = `#sprint#${this.levelNumber}#${this.pageNumber}`;
    games.appendChild(game0);
    const game0Title = createElement('div', 'game-title', 'Спринт');
    game0.appendChild(game0Title);
    const game0Picture = createElement('div', 'game-picture btn-sprint');
    game0.appendChild(game0Picture);

    const game1 = createElement('a', 'games-btn z-depth-2 waves-effect') as HTMLAnchorElement;
    game1.href = `#audio#${this.levelNumber}#${this.pageNumber}`;
    games.appendChild(game1);
    const game1Title = createElement('div', 'game-title', 'Аудиовызов');
    game1.appendChild(game1Title);
    const game1Picture = createElement('div', 'game-picture btn-audio');
    game1.appendChild(game1Picture);

    const game2 = createElement('a', 'games-btn z-depth-2 waves-effect') as HTMLAnchorElement;
    game2.href = `#phrase#${this.levelNumber}#${this.pageNumber}`;
    games.appendChild(game2);
    const game2Title = createElement('div', 'game-title', 'Фразы');
    game2.appendChild(game2Title);
    const game2Picture = createElement('div', 'game-picture btn-collection');
    game2.appendChild(game2Picture);
  }

  switchLevel(level: number) {
    if (this.levelNumber === level) return;
    window.location.hash = `${Route.book}#${level}#${DEFAULT_PAGE}`;
  }

  switchImages(level: number) {
    let color = '';
    const picture1 = document.getElementById('img-1') as HTMLImageElement;
    const picture3 = document.getElementById('img-3') as HTMLImageElement;
    const bookWrap = document.getElementById('book-wrap') as HTMLElement;

    if (level === 0) color = 'violet';
    if (level === 1) color = 'yellow';
    if (level === 2) color = 'green';
    if (level === 3) color = 'blue';
    if (level === 4) color = 'orange';
    if (level === 5) color = 'red';
    if (level === 6) color = 'white';

    picture1.src = `assets/images/${color}-1.jpg`;
    picture3.src = `assets/images/${color}-3.jpg`;
    bookWrap.style.backgroundImage = `url(./assets/images/${color}-2.jpg)`;
  }

  renderPagination(pagination: HTMLElement, position: string) {
    const pageWrap = createElement('div', 'page-wrap');
    pagination.appendChild(pageWrap);

    const first = createElement('div', 'page-btn z-depth-1 waves-effect first', '<<');
    pageWrap.appendChild(first);
    first.onclick = () => this.changePageNumber('first');

    const previous = createElement('div', 'page-btn z-depth-1 waves-effect previous', '<');
    pageWrap.appendChild(previous);
    previous.onclick = () => this.changePageNumber('prev');

    if (position === 'top') {
      this.pageNumberViewTop = createElement('div', 'page-number', `${this.pageNumber}`);
      this.pageNumberViewTop.setAttribute('readonly', 'readonly');
      pageWrap.appendChild(this.pageNumberViewTop);
      (<HTMLElement>this.pageNumberViewTop).innerHTML = (this.pageNumber + 1).toString();
    } else {
      this.pageNumberViewBottom = createElement('div', 'page-number', `${this.pageNumber}`);
      this.pageNumberViewBottom.setAttribute('readonly', 'readonly');
      pageWrap.appendChild(this.pageNumberViewBottom);
      (<HTMLElement>this.pageNumberViewBottom).innerHTML = (this.pageNumber + 1).toString();
    }

    const next = createElement('div', 'page-btn z-depth-1 waves-effect next', '>');
    pageWrap.appendChild(next);
    next.onclick = () => this.changePageNumber('next');

    const last = createElement('div', 'page-btn z-depth-1 waves-effect last', '>>');
    pageWrap.appendChild(last);
    last.onclick = () => this.changePageNumber('last');

    if (this.pageNumber === 0) {
      first.classList.add('btn-blocked');
      first.classList.remove('waves-effect');
      previous.classList.add('btn-blocked');
      previous.classList.remove('waves-effect');
    }
    if (this.pageNumber === this.lastPageNumber) {
      last.classList.add('btn-blocked');
      last.classList.remove('waves-effect');
      next.classList.add('btn-blocked');
      next.classList.remove('waves-effect');
    }
  }

  changePageNumber(marker: string) {
    if (marker === 'next' && this.pageNumber < this.lastPageNumber) this.pageNumber += 1;
    if (marker === 'prev' && this.pageNumber > 0) this.pageNumber -= 1;
    if (marker === 'first') this.pageNumber = 0;
    if (marker === 'last') this.pageNumber = this.lastPageNumber;

    (<HTMLElement>this.pageNumberViewTop).innerHTML = (this.pageNumber + 1).toString();
    (<HTMLElement>this.pageNumberViewBottom).innerHTML = (this.pageNumber + 1).toString();

    window.location.hash = `${Route.book}#${this.levelNumber}#${this.pageNumber}`;
  }

  renderCards(res: WordPlusUserWord[], user?: LoginData) {
    const materialTooltipTags = document.querySelectorAll('.material-tooltip');
    const materialTooltipArr = [...materialTooltipTags];
    for (let i = 0; i < materialTooltipArr.length; i += 1) {
      materialTooltipArr[i].remove();
    }

    if (this.levelNumber === 6 && res.length === 0) {
      const noDifficultCard = createElement('p', 'no-difficult-card', 'Сложных слов нет. Для тебя всё просто :)');
      (<HTMLElement>this.cards).appendChild(noDifficultCard);
      return;
    }

    for (let i = 0; i < res.length; i += 1) {
      const card = new Card(<HTMLElement>this.cards, res[i], this.levelNumber);

      const { audio, audioMeaning, audioExample } = card;
      this.audioElems.push(audio, audioMeaning, audioExample);

      card.onVolume = () => {
        if (card.audio.paused === false) {
          card.audio.pause();
          card.audio.currentTime = 0;
          card.volume.classList.remove('volume-active');
          return;
        }
        if (card.audioMeaning.paused === false) {
          card.audioMeaning.pause();
          card.audioMeaning.currentTime = 0;
          card.volume.classList.remove('volume-active');
          return;
        }
        if (card.audioExample.paused === false) {
          card.audioExample.pause();
          card.audioExample.currentTime = 0;
          card.volume.classList.remove('volume-active');
          return;
        }

        card.volume.classList.add('volume-active');
        card.audio.play();
        card.audio.onended = () => card.audioMeaning.play();
        card.audioMeaning.onended = () => card.audioExample.play();
        card.audioExample.onended = () => card.volume.classList.remove('volume-active');
      };

      card.onDifficult = async () => {
        await statsModel.handleOnDifficult(res[i]);
        if (!res[i].difficulty) {
          card.difficult.style.backgroundImage = `url(./assets/svg/difficult-colored.svg)`;
          card.learn.style.backgroundImage = `url(./assets/svg/learn.svg)`;

          res[i].difficulty = 'difficult';
          res[i].optional = {
            learned: 'no',
            learnDate: Date.now(),
            games: {
              sprint: { wins: 0, total: 0 },
              audio: { wins: 0, total: 0 },
              phrase: { wins: 0, total: 0 },
            },
            markedAsNew: false,
          };
          await createUserWord((<LoginData>user).id, res[i].id, (<LoginData>user).token, {
            difficulty: res[i].difficulty as string,
            optional: res[i].optional,
          });

          this.learnAndDifficult += 1;
          if (this.learnAndDifficult >= WORD_ON_PAGE) this.changePageStyle('learned');
        } else if (res[i].difficulty && res[i].difficulty === 'difficult') {
          card.difficult.style.backgroundImage = `url(./assets/svg/difficult.svg)`;
          card.learn.style.backgroundImage = `url(./assets/svg/learn.svg)`;

          res[i].difficulty = 'normal';
          (<Optional>res[i].optional).learned = 'no';
          (<Optional>res[i].optional).learnDate = Date.now();

          await this.makeWordNormal(res[i], <LoginData>user);
        } else if (res[i].difficulty && res[i].difficulty !== 'difficult') {
          card.difficult.style.backgroundImage = `url(./assets/svg/difficult-colored.svg)`;
          card.learn.style.backgroundImage = `url(./assets/svg/learn.svg)`;

          if (res[i].difficulty === 'normal') {
            this.learnAndDifficult += 1;
            if (this.learnAndDifficult >= WORD_ON_PAGE) this.changePageStyle('learned');
          }
          res[i].difficulty = 'difficult';
          (<Optional>res[i].optional).learned = 'no';
          (<Optional>res[i].optional).learnDate = Date.now();

          await updateUserWord((<LoginData>user).id, res[i].id, (<LoginData>user).token, {
            difficulty: res[i].difficulty as string,
            optional: res[i].optional,
          });
        }
      };

      card.onLearn = async () => {
        await statsModel.handleOnLearn(res[i]);
        if (!res[i].optional) {
          card.difficult.style.backgroundImage = `url(./assets/svg/difficult.svg)`;
          card.learn.style.backgroundImage = `url(./assets/svg/learn-colored.svg)`;

          res[i].difficulty = 'easy';
          res[i].optional = {
            learned: 'yes',
            learnDate: Date.now(),
            games: {
              sprint: { wins: 0, total: 0 },
              audio: { wins: 0, total: 0 },
              phrase: { wins: 0, total: 0 },
            },
            markedAsNew: false,
          };
          await createUserWord((<LoginData>user).id, res[i].id, (<LoginData>user).token, {
            difficulty: res[i].difficulty as string,
            optional: res[i].optional,
          });
          this.learnAndDifficult += 1;
          if (this.learnAndDifficult >= WORD_ON_PAGE) this.changePageStyle('learned');
        } else if (res[i].optional && res[i].optional?.learned === 'yes') {
          card.difficult.style.backgroundImage = `url(./assets/svg/difficult.svg)`;
          card.learn.style.backgroundImage = `url(./assets/svg/learn.svg)`;

          res[i].difficulty = 'normal';
          (<Optional>res[i].optional).learned = 'no';
          (<Optional>res[i].optional).learnDate = Date.now();

          await this.makeWordNormal(res[i], <LoginData>user);
        } else if (res[i].optional && res[i].optional?.learned === 'no') {
          card.difficult.style.backgroundImage = `url(./assets/svg/difficult.svg)`;
          card.learn.style.backgroundImage = `url(./assets/svg/learn-colored.svg)`;

          if (res[i].difficulty === 'normal') {
            this.learnAndDifficult += 1;
            if (this.learnAndDifficult >= WORD_ON_PAGE) this.changePageStyle('learned');
          }
          res[i].difficulty = 'easy';
          (<Optional>res[i].optional).learned = 'yes';
          (<Optional>res[i].optional).learnDate = Date.now();

          await updateUserWord((<LoginData>user).id, res[i].id, (<LoginData>user).token, {
            difficulty: res[i].difficulty as string,
            optional: res[i].optional,
          });
        }
      };

      card.onLearnDifficultLevel = async () => {
        (<Optional>res[i].optional).learned = 'yes';
        (<Optional>res[i].optional).learnDate = Date.now();
        card.learnDifficultLevel.style.backgroundImage = `url(./assets/svg/learn-colored.svg)`;
        await updateUserWord((<LoginData>user).id, res[i].id, (<LoginData>user).token, {
          difficulty: 'easy',
          optional: res[i].optional,
        });
        res.splice(i, 1);
        (<HTMLElement>this.cards).innerHTML = '';
        this.renderCards(res, user);
      };

      card.onDiffDifficultLevel = async () => {
        card.diffDifficultLevel.style.backgroundImage = `url(./assets/svg/difficult.svg)`;
        await updateUserWord((<LoginData>user).id, res[i].id, (<LoginData>user).token, {
          difficulty: 'normal',
          optional: res[i].optional,
        });
        res.splice(i, 1);
        (<HTMLElement>this.cards).innerHTML = '';
        this.renderCards(res, user);
      };
    }
    M.AutoInit();
  }

  changePageStyle(mark: string) {
    if (mark === 'learned') {
      (<HTMLElement>this.learnedMessage).classList.add('non-transparent');
      (<HTMLElement>this.pageNumberViewTop).style.color = 'rgba(1, 37, 19, 0.9)';
      (<HTMLElement>this.pageNumberViewBottom).style.color = 'rgba(1, 37, 19, 0.9)';
      (<HTMLElement>this.pageNumberViewBottom).style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      (<HTMLElement>this.games).style.pointerEvents = 'none';
      (<HTMLElement>this.games).classList.add('non-acceptable');
    } else {
      (<HTMLElement>this.learnedMessage).classList.remove('non-transparent');
      (<HTMLElement>this.pageNumberViewTop).style.color = 'rgb(255, 255, 255)';
      (<HTMLElement>this.pageNumberViewBottom).style.color = 'rgb(255, 255, 255)';
      (<HTMLElement>this.pageNumberViewBottom).style.backgroundColor = '';
      (<HTMLElement>this.games).style.pointerEvents = 'auto';
      (<HTMLElement>this.games).classList.remove('non-acceptable');
    }
  }

  async makeWordNormal(word: WordPlusUserWord, user: LoginData) {
    await updateUserWord((<LoginData>user).id, word.id, (<LoginData>user).token, {
      difficulty: word.difficulty as string,
      optional: word.optional,
    });
    this.learnAndDifficult -= 1;
    if (this.learnAndDifficult < WORD_ON_PAGE) this.changePageStyle('not-learned');
  }
}
