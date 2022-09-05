import { createUserWord, getAllUserWords, getWordsFromBook, HOST, updateUserWord } from '../model/helpers/apiHelpers';
import { Optional, UserWordPlus, WordPlusUserWord } from '../types';
import { LoginData } from '../types/loginTypes';
import { getMixWordForDrag, getMixWordsForPhrase } from './helpers/appMixWords';
import { combineWords } from './helpers/combineArr';
import { Phrase } from './helpers/PhraseView';
import { createElement } from './helpers/renderHelpers';
import { statsModel } from '../model/StatsModel';

const WORDS_FOR_PHRASE = 10;

export class PhraseGameView {
  mainDiv: HTMLElement;
  stateGame: HTMLElement;
  againGame: HTMLElement;
  sound: boolean;
  fullscreen: boolean;
  points: number;
  pointsTotal: number;
  controlBlock: HTMLElement;
  pointsResult: number[];
  pointsTotalResult: number[];
  learnedWords: string[][];
  unlearnedWords: string[][];
  itemT?: HTMLElement;
  soundImg: HTMLElement;

  constructor(mainDiv: HTMLElement) {
    this.mainDiv = mainDiv;
    this.stateGame = createElement('div', 'phrase_game-content z-depth-2');
    this.controlBlock = createElement('div', 'phrase_controll');
    this.soundImg = createElement('button', 'phrase_sound');
    this.againGame = createElement('button', 'waves-effect waves-light btn right-phrase-btn end', 'сыграть еще раз');
    this.sound = true;
    this.fullscreen = false;
    this.points = 10;
    this.pointsTotal = 0;
    this.pointsTotalResult = [];
    this.pointsResult = [];
    this.learnedWords = [];
    this.unlearnedWords = [];
  }

  public render(data?: WordPlusUserWord[], user?: LoginData): void {
    this.controlBlock.innerHTML = '';
    this.mainDiv.innerHTML = '';
    const adioGame = createElement('div', 'phrase-game');
    const mainImg = createElement('div', 'img-phrase');
    const fullscreenImg = createElement('button', 'phrase_fullscreen');
    const crossImg = createElement('button', 'phrase_cross');
    this.sound = true;
    this.soundImg.classList.remove('phrase_not-sound');

    fullscreenImg.onclick = () => {
      if (!this.fullscreen) {
        this.mainDiv.requestFullscreen();
        this.fullscreen = true;
      } else {
        document.exitFullscreen();
        this.fullscreen = false;
      }
    };

    this.soundImg.onclick = () => {
      if (this.sound) {
        this.sound = false;
        this.soundImg.classList.add('phrase_not-sound');
      } else {
        this.sound = true;
        this.soundImg.classList.remove('phrase_not-sound');
      }
    };

    crossImg.onclick = () => {
      window.location.hash = 'main';
      this.stopGame();
    };

    this.soundImg.onmouseout = () => {
      this.soundImg.blur();
    };
    fullscreenImg.onmouseout = () => {
      fullscreenImg.blur();
    };

    this.againGame.tabIndex = 0;
    crossImg.tabIndex = 0;
    this.soundImg.tabIndex = 0;
    fullscreenImg.tabIndex = 0;
    adioGame.append(mainImg);
    this.controlBlock.appendChild(this.soundImg);
    this.controlBlock.append(fullscreenImg);
    this.controlBlock.appendChild(crossImg);
    this.mainDiv.append(this.controlBlock);
    this.mainDiv.append(adioGame);
    if (data && user) {
      this.mainDiv.append(this.startGameFromBook(data, user));
      this.againGame.onclick = () => {
        this.startGameFromBook(data, user);
      };
    } else if (data && !user) {
      this.mainDiv.append(this.startGameFromBook(data));
      this.againGame.onclick = () => {
        this.startGameFromBook(data);
      };
    } else if (!data && user) {
      this.mainDiv.append(this.startGameFromMenu(user));
      this.againGame.onclick = () => {
        this.startGameFromMenu(user);
      };
    } else if (!data && !user) {
      this.mainDiv.append(this.startGameFromMenu());
      this.againGame.onclick = () => {
        this.startGameFromMenu();
      };
    }
  }

  private startGameFromMenu(user?: LoginData): HTMLElement {
    this.stateGame.innerHTML = '';
    this.pointsResult = [];
    this.points = 10;
    this.pointsTotal = 0;
    this.learnedWords = [];
    this.unlearnedWords = [];
    const title: HTMLElement = createElement('h1', 'title-phrase h1-lang', 'Фразы');
    const subTitle: HTMLElement = createElement(
      'h5',
      'subtitle-phrase h5-lang',
      'Соедини слова и фразы в правильном порядке',
    );
    const levelBlock: HTMLElement = createElement('div', 'level-phrase');

    const levelArr: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    const classArr: string[] = [
      'waves-purple violet-border',
      'waves-yellow yellow-border',
      'waves-green green-border',
      'waves-teal blue-border',
      'waves-orange orange-border',
      'waves-red red-border',
    ];

    for (let i = 0; i <= 5; i += 1) {
      const btnLevel = createElement(
        'button',
        `phrase-level-btn z-depth-2 waves-effect ${classArr[i]}`,
        `${levelArr[i]}`,
      );
      btnLevel.tabIndex = 0;
      btnLevel.onclick = async () => {
        const randomPage = Math.floor(Math.random() * 29);
        const words = await getWordsFromBook(randomPage, i);
        this.stateGame.innerHTML = '';
        if (user) {
          const userWords: UserWordPlus[] = await getAllUserWords(user.id, user.token);
          const tempObj = combineWords(words, userWords);
          const userRes: WordPlusUserWord[] = tempObj.combinedArr;
          this.mainDiv.append(this.showGame(userRes, user));
        } else this.mainDiv.append(this.showGame(words));
      };

      levelBlock.append(btnLevel);
    }

    this.stateGame.append(title);
    this.stateGame.append(subTitle);
    this.stateGame.append(levelBlock);
    return this.stateGame;
  }

  private startGameFromBook(data: WordPlusUserWord[], user?: LoginData): HTMLElement {
    this.stateGame.innerHTML = '';
    this.pointsResult = [];
    this.points = 10;
    this.pointsTotal = 0;
    this.learnedWords = [];
    this.unlearnedWords = [];
    const title: HTMLElement = createElement('h1', 'title-phrase h1-lang', 'Фразы');
    const subTitle: HTMLElement = createElement(
      'h5',
      'subtitle-phrase h5-lang',
      'Соедини слова и фразы в правильном порядке',
    );

    const btnStart = createElement('button', `phrase_start-btn z-depth-1 waves-effect`, 'НАЧАТЬ');
    btnStart.tabIndex = 0;

    const data1 = data.filter(
      (item) => !(<Optional>item.optional) || (<Optional>item.optional && <Optional>item.optional).learned === 'no',
    );

    btnStart.onclick = () => {
      this.stateGame.innerHTML = '';
      if (user) this.showGame(data1, user);
      else this.showGame(data1);
    };

    this.stateGame.append(title);
    this.stateGame.append(subTitle);
    this.stateGame.append(btnStart);
    return this.stateGame;
  }

  private showGame(data: WordPlusUserWord[], user?: LoginData): HTMLElement {
    if (data.length < 10) {
      const noDifficultCard = createElement(
        'p',
        'no-words-card',
        'Недостаточно слов для игры! :)\n Попробуйте зайти с другой страницы',
      );
      this.stateGame.appendChild(noDifficultCard);
      const backBtn = createElement(
        'a',
        'btn-large waves-effect waves-light grey lighten-3 z-depth-3 btn-lang',
        'Назад',
      );
      backBtn.onclick = () => window.history.back();
      this.stateGame.appendChild(backBtn);
      return this.stateGame;
    }

    const mixDataPhrase = getMixWordsForPhrase(data);

    const phraseTitle = createElement('h5', 'h5-lang phrase-all-title', 'Перетяни слова в правильные фразы');
    this.stateGame.appendChild(phraseTitle);

    const content = createElement('div', 'phrase-all-wrap');
    this.stateGame.appendChild(content);

    const wordArr = [];

    const itemArr = new Array(10);
    itemArr.fill(undefined);

    for (let i = 0; i < mixDataPhrase.length; i += 1) {
      const textExampleArr = mixDataPhrase[i].textExample.replace('</b>', '<b>').split('<b>');
      wordArr.push({ numb: i, word: textExampleArr[1].toLowerCase() });
    }

    const mixWordForDrag = getMixWordForDrag(wordArr);

    for (let i = 0; i < mixDataPhrase.length; i += 1) {
      const phrase = new Phrase(content, mixDataPhrase[i].textExample, mixWordForDrag[i], i);

      phrase.onDragenter = () => phrase.back.classList.add('hovered');

      phrase.onDragleave = () => phrase.back.classList.remove('hovered');
      phrase.onDrop = async () => {
        if (this.itemT) {
          const numbBack = Number(phrase.back.getAttribute('data-numb'));
          const numbItem = Number(this.itemT.getAttribute('data-numb'));
          if (itemArr[numbBack] === undefined) {
            for (let j = 0; j < itemArr.length; j += 1) {
              if (itemArr[j] === numbItem) itemArr[j] = undefined;
            }
            itemArr[numbBack] = numbItem;
            phrase.back.append(this.itemT);
            this.createSounds(this.sound);
          }
        }
        phrase.back.classList.remove('hovered');
        if (itemArr.filter((value) => value !== undefined).length === WORDS_FOR_PHRASE) {
          const rightItemArr = itemArr.filter((value, index) => value === index);
          const wrongItemArr = itemArr.filter((value, index) => value !== index);
          const rightDataPhrase = mixDataPhrase.filter((_value, index) => rightItemArr.includes(index));
          const wrongDataPhrase = mixDataPhrase.filter((_value, index) => wrongItemArr.includes(index));
          if (user) await this.sendInfoToServer(rightDataPhrase, wrongDataPhrase, user);
          this.endGame(rightDataPhrase, wrongDataPhrase);
        }
      };

      phrase.onDragenterS = () => phrase.backStart.classList.add('hovered');
      phrase.onDragleaveS = () => phrase.backStart.classList.remove('hovered');
      phrase.onDropS = () => {
        if (phrase.backStart.firstElementChild) return;
        if (this.itemT) {
          const numbItem = Number(this.itemT.getAttribute('data-numb'));
          for (let j = 0; j < itemArr.length; j += 1) {
            if (itemArr[j] === numbItem) {
              itemArr[j] = undefined;
            }
          }
          phrase.backStart.append(this.itemT);
        }
        phrase.backStart.classList.remove('hovered');
      };

      phrase.onDragstart = () => {
        this.itemT = phrase.item;
        phrase.item.classList.add('hold');
        setTimeout(() => phrase.item.classList.add('hide'), 0);
      };
      phrase.onDragend = () => phrase.item.classList.remove('hide', 'hold');
    }

    return this.stateGame;
  }

  private endGame(rightDataPhrase: WordPlusUserWord[], wrongDataPhrase: WordPlusUserWord[]): void {
    this.stateGame.innerHTML = '';
    const winBlock = createElement('div', 'phrase_over card');
    const showTotalRes = createElement('div', 'sprint_result');
    const showExperience = createElement('div', 'sprint_show-resultexperience');
    const gameOver = <HTMLAudioElement>new Audio('./assets/audio/over.mp3');
    const learnWords = createElement('ul', 'phrase_list-words');
    const unlearnWords = createElement('ul', 'phrase_list-words');
    const headerBlock = createElement('div', 'sprint_header-result');
    const allWords = createElement('ul', 'sprint_all-words');
    const headerListLerned = createElement('div', 'phrase_header-learn', `Угаданные слова - ${rightDataPhrase.length}`);
    const headerListUnlerned = createElement(
      'div',
      'phrase_header-unlearn',
      `Слова с ошибками - ${wrongDataPhrase.length}`,
    );
    learnWords.append(headerListLerned);
    unlearnWords.append(headerListUnlerned);
    showTotalRes.innerHTML = `Набрано ${rightDataPhrase.length * 10} очков`;
    showExperience.innerHTML = `Получено +10 опыта`;
    const blockBtn = createElement('div', 'sprint_btn-block-over');
    const endGame = createElement('button', 'waves-effect waves-light btn left-sptint-btn end', 'перейти в учебник');
    gameOver.pause();
    endGame.tabIndex = 0;

    for (let i = 0; i < rightDataPhrase.length; i += 1) {
      const audio = new Audio();
      const audioBlock = createElement(
        'i',
        'tiny grey-text text-darken-2 material-icons volume-up sprint-phrase',
        'volume_up',
      );
      audioBlock.onclick = () => {
        audio.play();
      };
      const list = createElement(
        'li',
        'sprint_list',
        `${rightDataPhrase[i].word} ${rightDataPhrase[i].transcription} - ${rightDataPhrase[i].wordTranslate}`,
      );
      audio.src = `${HOST}/${rightDataPhrase[i].audio}`;
      list.append(audioBlock);
      learnWords.append(list);
    }

    for (let i = 0; i < wrongDataPhrase.length; i += 1) {
      const audio = new Audio();
      const audioBlock = createElement(
        'i',
        'tiny grey-text text-darken-2 material-icons volume-up sprint-phrase',
        'volume_up',
      );
      audioBlock.onclick = () => {
        audio.play();
      };
      const list = createElement(
        'li',
        'sprint_list',
        `${wrongDataPhrase[i].word} ${wrongDataPhrase[i].transcription} - ${wrongDataPhrase[i].wordTranslate}`,
      );
      audio.src = `${HOST}/${wrongDataPhrase[i].audio}`;
      list.append(audioBlock);
      unlearnWords.append(list);
    }

    endGame.onclick = () => {
      const hashArr = window.location.hash.slice(1).split('#');
      if (hashArr[1] !== undefined) window.location.hash = `book#${hashArr[1]}#${hashArr[2]}`;
      else window.location.hash = `book`;
      this.stopGame();
    };

    if (this.sound) gameOver.play();
    blockBtn.append(endGame);
    blockBtn.append(this.againGame);
    headerBlock.append(showTotalRes);
    headerBlock.append(showExperience);
    winBlock.append(headerBlock);
    allWords.append(unlearnWords);
    allWords.append(learnWords);
    winBlock.append(allWords);
    winBlock.append(blockBtn);
    this.stateGame.append(winBlock);
  }

  private sendInfoToServer = async (
    rightDataPhrase: WordPlusUserWord[],
    wrongDataPhrase: WordPlusUserWord[],
    user: LoginData,
  ) => {
    await statsModel.postPhraseResults(rightDataPhrase, wrongDataPhrase);
    await Promise.all(
      rightDataPhrase.map((item) => {
        const item1 = item;
        if (!item1.difficulty) {
          item1.difficulty = 'normal';
          item1.optional = {
            learned: 'no',
            learnDate: Date.now(),
            games: {
              sprint: { wins: 0, total: 0 },
              audio: { wins: 0, total: 0 },
              phrase: { wins: 1, total: 1 },
            },
            markedAsNew: true,
          };
          return createUserWord(user.id, item1.id, user.token, {
            difficulty: item1.difficulty as string,
            optional: item1.optional,
          });
        }
        if (item1.difficulty === 'difficult' && ((<Optional>item1.optional).games.phrase.wins + 1) % 5 === 0) {
          item1.difficulty = 'easy';
          (<Optional>item1.optional).learned = 'yes';
          (<Optional>item1.optional).learnDate = Date.now();
        }

        if (item1.difficulty === 'normal' && ((<Optional>item1.optional).games.phrase.wins + 1) % 3 === 0) {
          item1.difficulty = 'easy';
          (<Optional>item1.optional).learned = 'yes';
          (<Optional>item1.optional).learnDate = Date.now();
        }

        (<Optional>item1.optional).markedAsNew = true;
        (<Optional>item1.optional).games.phrase.total += 1;
        (<Optional>item1.optional).games.phrase.wins += 1;

        return updateUserWord((<LoginData>user).id, item1.id, (<LoginData>user).token, {
          difficulty: item1.difficulty as string,
          optional: item1.optional,
        });
      }),
    );

    await Promise.all(
      wrongDataPhrase.map((item) => {
        const item1 = item;
        if (!item1.difficulty) {
          item1.difficulty = 'normal';
          item1.optional = {
            learned: 'no',
            learnDate: Date.now(),
            games: {
              sprint: { wins: 0, total: 0 },
              audio: { wins: 0, total: 0 },
              phrase: { wins: 0, total: 1 },
            },
            markedAsNew: true,
          };
          return createUserWord(user.id, item1.id, user.token, {
            difficulty: item1.difficulty as string,
            optional: item1.optional,
          });
        }

        if ((<Optional>item1.optional).learned === 'yes') {
          item1.difficulty = 'normal';
          (<Optional>item1.optional).learned = 'no';
          (<Optional>item1.optional).learnDate = Date.now();
        }

        (<Optional>item1.optional).markedAsNew = true;
        (<Optional>item1.optional).games.phrase.total += 1;

        return updateUserWord((<LoginData>user).id, item1.id, (<LoginData>user).token, {
          difficulty: item1.difficulty as string,
          optional: item1.optional,
        });
      }),
    );
  };

  private createSounds(sound: boolean): void {
    const moveCard: HTMLAudioElement = new Audio('./assets/audio/card-on-place-1.mp3');
    if (!sound) {
      moveCard.pause();
    } else {
      moveCard.play();
    }
  }

  stopGame() {
    this.sound = true;
    this.soundImg.classList.remove('phrase_not-sound');
    this.fullscreen = false;
    this.points = 10;
    this.pointsTotal = 0;
    this.pointsTotalResult = [];
    this.pointsResult = [];
    this.learnedWords = [];
    this.unlearnedWords = [];
    if (document.fullscreenElement) document.exitFullscreen();
  }
}
