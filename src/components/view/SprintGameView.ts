import { createUserWord, getAllUserWords, getRandomWords, HOST, updateUserWord } from '../model/helpers/apiHelpers';
import { statsModel } from '../model/StatsModel';
import { MixWordsSprint, Optional, UserWordPlus, Word, WordPlusUserWord } from '../types';
import { LoginData } from '../types/loginTypes';
import { getMixWordsForSprint } from './helpers/appMixWords';
import { combineWords } from './helpers/combineArr';
import { createElement } from './helpers/renderHelpers';

export class SprintGameView {
  mainDiv: HTMLElement;
  stateGame: HTMLElement;
  againGame: HTMLElement;
  sound: boolean;
  fullscreen: boolean;
  timeleft: number;
  points: number;
  pointsTotal: number;
  soundImg: HTMLElement;
  controlBlock: HTMLElement;
  pointsResult: number[];
  countBestRes: number;
  bestResult: number[];
  pointsTotalResult: number[];
  learnedWords: string[][];
  unlearnedWords: string[][];
  handleKeypress: (event: KeyboardEvent) => void;
  downloadTimer?: NodeJS.Timer;

  constructor(mainDiv: HTMLElement) {
    this.mainDiv = mainDiv;
    this.stateGame = createElement('div', 'sprint_game-content');
    this.controlBlock = createElement('div', 'sprint_controll');
    this.againGame = createElement('button', 'waves-effect waves-light btn right-sptint-btn end', 'сыграть еще раз');
    this.soundImg = createElement('button', 'sprint_sound');
    this.sound = true;
    this.fullscreen = false;
    this.timeleft = 60;
    this.points = 10;
    this.pointsTotal = 0;
    this.pointsTotalResult = [];
    this.pointsResult = [];
    this.learnedWords = [];
    this.unlearnedWords = [];
    this.countBestRes = 0;
    this.bestResult = [0];
    this.handleKeypress = () => {};
    this.downloadTimer = setTimeout(() => {});
  }

  public render(data?: Word[], user?: LoginData): void {
    this.controlBlock.innerHTML = '';
    this.mainDiv.innerHTML = '';
    const sprint = createElement('div', 'sprint');
    const mainImg = <HTMLImageElement>createElement('img', 'img-sprint');
    const fullscreenImg = createElement('button', 'sprint_fullscreen');
    const crossImg = createElement('button', 'sprint_cross');

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
        this.soundImg.classList.add('sprint_not-sound');
      } else {
        this.sound = true;
        this.soundImg.classList.remove('sprint_not-sound');
      }
      this.createSounds(this.sound);
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
    sprint.append(mainImg);
    this.controlBlock.appendChild(this.soundImg);
    this.controlBlock.append(fullscreenImg);
    this.controlBlock.appendChild(crossImg);
    this.mainDiv.append(this.controlBlock);
    this.mainDiv.append(sprint);
    if (data && user) {
      this.mainDiv.append(this.startGameFromBook(data, user));
      this.againGame.onclick = () => {
        this.stopGame();
        this.startGameFromBook(data, user);
        this.sound = true;
      };
    } else if (data && !user) {
      this.mainDiv.append(this.startGameFromBook(data));
      this.againGame.onclick = () => {
        this.stopGame();
        this.startGameFromBook(data);
        this.sound = true;
      };
    } else if (!data && user) {
      this.mainDiv.append(this.startGameFromMenu(user));
      this.againGame.onclick = () => {
        this.stopGame();
        this.startGameFromMenu(user);
        this.sound = true;
      };
    } else if (!data && !user) {
      this.mainDiv.append(this.startGameFromMenu());
      this.againGame.onclick = () => {
        this.stopGame();
        this.startGameFromMenu();
        this.sound = true;
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
    const randomPageArr: number[] = [];
    const title: HTMLElement = createElement('h1', 'title-sprint h1-lang', 'Спринт');
    const subTitle: HTMLElement = createElement(
      'h5',
      'subtitle-sprint h5-lang',
      'Попробуй угадать как можно больше слов за минуту',
    );

    const navHeader: HTMLElement = createElement('ul', 'nav-sprint h6-lang', 'Инструкция для игры на клавиатуре:');
    const navList: HTMLElement = createElement(
      'li',
      'nav_list-sprint ul-lang',
      ' - клавиши влево и вправо для выбора ответа',
    );

    const levelBlock: HTMLElement = createElement('div', 'level-sprint');

    while (randomPageArr.length < 15) {
      const randomPage = Math.floor(Math.random() * 29);
      if (!randomPageArr.includes(randomPage)) {
        randomPageArr.push(randomPage);
      }
    }

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
        `sprint-level-btn z-depth-2 waves-effect ${classArr[i]}`,
        `${levelArr[i]}`,
      );

      btnLevel.onclick = async () => {
        const words = await getRandomWords(randomPageArr, i);
        this.stateGame.innerHTML = '';
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

    navHeader.append(navList);
    this.stateGame.append(title);
    this.stateGame.append(subTitle);
    this.stateGame.append(navHeader);
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
    const title: HTMLElement = createElement('h1', 'title-sprint h1-lang', 'Спринт');
    const subTitle: HTMLElement = createElement(
      'h5',
      'subtitle-sprint h5-lang',
      'Попробуй угадать как можно больше слов за минуту',
    );

    const navHeader: HTMLElement = createElement('ul', 'nav-sprint h6-lang', 'Инструкция для игры на клавиатуре:');
    const navList: HTMLElement = createElement(
      'li',
      'nav_list-sprint ul-lang',
      ' - клавиши влево и вправо для выбора ответа',
    );

    const btnStart = createElement('button', `sprint-start-btn z-depth-1 waves-effect`, 'НАЧАТЬ');
    btnStart.tabIndex = 0;

    const data1 = data.filter(
      (item) => !(<Optional>item.optional) || (<Optional>item.optional && <Optional>item.optional).learned === 'no',
    );

    btnStart.onclick = () => {
      this.stateGame.innerHTML = '';
      if (!data1.length) window.location.hash = 'book';
      if (data1.length && user) this.showGame(data1, user);
      if (data1.length && !user) this.showGame(data1);
    };

    navHeader.append(navList);
    this.stateGame.append(title);
    this.stateGame.append(subTitle);
    this.stateGame.append(navHeader);
    this.stateGame.append(btnStart);
    return this.stateGame;
  }

  private showGame(data: WordPlusUserWord[], user?: LoginData): HTMLElement {
    this.timeleft = 60;
    const mixData = getMixWordsForSprint(data);
    const word = createElement('div', 'sprint_word card');
    const wordName = createElement('div', 'sprint_word-name');
    const audioBlock = createElement(
      'i',
      'tiny grey-text text-darken-2 material-icons volume-up sprint-audio',
      'volume_up',
    );
    const crowsBlock = createElement('div', 'sprint_crows');
    const points = createElement('div', 'sprint_points', `+${this.points} очков за слово`);
    const totalPoints = createElement('div', 'sprint_total-points', `${0}`);
    const blockBtn = createElement('div', 'sprint_btn-block');
    const timeBlock = createElement('div', 'sprint_time');
    const timeImg = createElement('div', 'sprint_clock');
    const seconds = createElement('div', 'sprint_seconds card', `:${this.timeleft}`);
    const btnRight = <HTMLButtonElement>(
      createElement('button', 'waves-effect waves-light btn right-sptint-btn', 'верно')
    );
    const btnWrong = <HTMLButtonElement>(
      createElement('button', 'waves-effect waves-light btn left-sptint-btn', 'неверно')
    );
    const crow1 = createElement('div', `sprint_crow`);
    const crow2 = createElement('div', `sprint_crow`);
    const crow3 = createElement('div', `sprint_crow`);
    const audio = new Audio();
    let index = 0;

    audio.src = `${HOST}/${mixData[0].audio}`;
    audioBlock.onclick = () => {
      audio.play();
    };

    wordName.innerHTML = `${mixData[0].en}   -   ${mixData[0].ru}`;
    wordName.appendChild(audioBlock);

    this.downloadTimer = setInterval(() => {
      seconds.innerHTML = `:${this.timeleft}`;
      if (this.timeleft <= 0) {
        clearInterval(this.downloadTimer);
        this.endGame();
      }
      this.timeleft -= 1;
    }, 1000);

    this.handleKeypress = (el: KeyboardEvent) => {
      if (index < mixData.length) {
        if (el.code === 'ArrowRight') {
          this.rightChoice(
            index,
            mixData,
            data,
            crow1,
            crow2,
            crow3,
            points,
            totalPoints,
            wordName,
            audio,
            audioBlock,
            user,
          );
        }

        if (el.code === 'ArrowLeft') {
          this.wrongChoice(
            index,
            mixData,
            data,
            crow1,
            crow2,
            crow3,
            points,
            totalPoints,
            wordName,
            audio,
            audioBlock,
            user,
          );
        }
        index += 1;
      } else {
        window.removeEventListener('keyup', this.handleKeypress);
      }
    };

    window.addEventListener('keyup', this.handleKeypress);

    btnRight.onclick = () => {
      this.rightChoice(
        index,
        mixData,
        data,
        crow1,
        crow2,
        crow3,
        points,
        totalPoints,
        wordName,
        audio,
        audioBlock,
        user,
      );
      index += 1;
    };

    btnWrong.onclick = () => {
      this.wrongChoice(
        index,
        mixData,
        data,
        crow1,
        crow2,
        crow3,
        points,
        totalPoints,
        wordName,
        audio,
        audioBlock,
        user,
      );
      index += 1;
    };

    crowsBlock.append(crow1);
    crowsBlock.append(crow2);
    crowsBlock.append(crow3);
    timeBlock.append(timeImg);
    timeBlock.append(seconds);
    blockBtn.append(btnWrong);
    blockBtn.append(btnRight);
    word.append(crowsBlock);
    word.append(points);
    word.append(wordName);
    this.stateGame.append(totalPoints);
    this.stateGame.append(timeBlock);
    this.stateGame.append(word);
    this.stateGame.append(blockBtn);
    return this.stateGame;
  }

  rightChoice(
    index: number,
    mixData: MixWordsSprint[],
    data: WordPlusUserWord[],
    crow1: HTMLElement,
    crow2: HTMLElement,
    crow3: HTMLElement,
    pointsDiv: HTMLElement,
    totalPointsDiv: HTMLElement,
    wordNameDiv: HTMLElement,
    audioTag: HTMLAudioElement,
    audioBlock: HTMLElement,
    user?: LoginData,
  ) {
    const points = pointsDiv;
    const totalPoints = totalPointsDiv;
    const wordName = wordNameDiv;
    const audio = audioTag;

    if (index < mixData.length) {
      const userWord = this.findWord(data, mixData[index].en);
      if (userWord && user) this.createNewUserWord(userWord, user);
      if (!mixData[index].match) {
        if (userWord && user) {
          this.bestResult.push(this.countBestRes);
          this.countBestRes = 0;
          this.incorrectUserWord(userWord, user);
        }
        this.createSounds(this.sound, 'false');
        this.createWrongResult(data, mixData[index].en);
        this.pointsTotalResult = [];
        this.points = 10;
        this.styleCrow([crow1, crow2, crow3], true);
        points.innerHTML = `+${this.points} очков за слово`;
      } else {
        if (userWord && user) {
          this.countBestRes += 1;
          this.bestResult.push(this.countBestRes);
          this.correctUserWord(userWord, user);
        }
        this.createSounds(this.sound, 'true');
        this.createCorrectResult(data, mixData[index].en);
        this.countResult(totalPoints, points);
        this.styleCrow([crow1, crow2, crow3]);
      }
    }
    if (index < mixData.length - 1) {
      wordName.innerHTML = `${mixData[index + 1].en}   -   ${mixData[index + 1].ru}`;
      audio.src = `${HOST}/${mixData[index + 1].audio}`;
    }
    if (index === mixData.length - 1) {
      setTimeout(() => {
        this.timeleft = 0;
      }, 500);
    }
    wordName.appendChild(audioBlock);
  }

  wrongChoice(
    index: number,
    mixData: MixWordsSprint[],
    data: WordPlusUserWord[],
    crow1: HTMLElement,
    crow2: HTMLElement,
    crow3: HTMLElement,
    pointsDiv: HTMLElement,
    totalPointsDiv: HTMLElement,
    wordNameDiv: HTMLElement,
    audioTag: HTMLAudioElement,
    audioBlock: HTMLElement,
    user?: LoginData,
  ) {
    const points = pointsDiv;
    const totalPoints = totalPointsDiv;
    const wordName = wordNameDiv;
    const audio = audioTag;

    if (index < mixData.length) {
      const userWord = this.findWord(data, mixData[index].en);
      if (userWord && user) this.createNewUserWord(userWord, user);
      if (!mixData[index].match) {
        if (userWord && user) {
          this.countBestRes += 1;
          this.bestResult.push(this.countBestRes);
          this.correctUserWord(userWord, user);
        }
        this.createSounds(this.sound, 'true');
        this.createCorrectResult(data, mixData[index].en);
        this.countResult(totalPoints, points);
        this.styleCrow([crow1, crow2, crow3]);
      } else {
        if (userWord && user) {
          this.bestResult.push(this.countBestRes);
          this.countBestRes = 0;
          this.incorrectUserWord(userWord, user);
        }
        this.createSounds(this.sound, 'false');
        this.createWrongResult(data, mixData[index].en);
        this.pointsTotalResult = [];
        this.points = 10;
        points.innerHTML = `+${this.points} очков за слово`;
        this.styleCrow([crow1, crow2, crow3], true);
      }
    }
    if (index < mixData.length - 1) {
      wordName.innerHTML = `${mixData[index + 1].en}   -   ${mixData[index + 1].ru}`;
      audio.src = `${HOST}/${mixData[index + 1].audio}`;
    }
    if (index === mixData.length - 1) {
      setTimeout(() => {
        this.timeleft = 0;
      }, 500);
    }
    wordName.appendChild(audioBlock);
  }

  private async createNewUserWord(word: Word | UserWordPlus, user: LoginData) {
    const userWord = word;
    if ((<UserWordPlus>userWord).optional?.markedAsNew === undefined) {
      (<UserWordPlus>userWord).difficulty = 'normal';
      (<UserWordPlus>userWord).optional = {
        learned: 'no',
        learnDate: Date.now(),
        games: {
          sprint: { wins: 0, total: 0 },
          audio: { wins: 0, total: 0 },
          phrase: { wins: 0, total: 0 },
        },
        markedAsNew: true,
      };
      await createUserWord((<LoginData>user).id, (<UserWordPlus>userWord).id, (<LoginData>user).token, {
        difficulty: (<UserWordPlus>userWord).difficulty as string,
        optional: (<UserWordPlus>userWord).optional,
      });
    }
    if ((<UserWordPlus>userWord).optional?.markedAsNew === false) {
      (<UserWordPlus>userWord).optional.markedAsNew = true;
      await updateUserWord((<LoginData>user).id, (<UserWordPlus>userWord).id, (<LoginData>user).token, {
        difficulty: (<UserWordPlus>userWord).difficulty as string,
        optional: (<UserWordPlus>userWord).optional,
      });
    }
  }

  private async correctUserWord(word: Word | UserWordPlus, user: LoginData) {
    const userWord = word;
    await statsModel.postCorrect(userWord);
    (<UserWordPlus>userWord).optional.games.sprint.wins += 1;
    (<UserWordPlus>userWord).optional.games.sprint.total += 1;

    if (
      (<UserWordPlus>userWord).difficulty === 'normal' &&
      (<UserWordPlus>userWord).optional.games.sprint.wins % 3 === 0
    ) {
      (<UserWordPlus>userWord).difficulty = 'easy';
      (<UserWordPlus>userWord).optional.learned = 'yes';
      (<UserWordPlus>userWord).optional.learnDate = Date.now();
    } else if (
      (<UserWordPlus>userWord).difficulty === 'difficult' &&
      (<UserWordPlus>userWord).optional.games.sprint.wins % 5 === 0
    ) {
      (<UserWordPlus>userWord).difficulty = 'easy';
      (<UserWordPlus>userWord).optional.learned = 'yes';
      (<UserWordPlus>userWord).optional.learnDate = Date.now();
    }

    await updateUserWord((<LoginData>user).id, (<UserWordPlus>userWord).id, (<LoginData>user).token, {
      difficulty: (<UserWordPlus>userWord).difficulty as string,
      optional: (<UserWordPlus>userWord).optional,
    });
  }

  private async incorrectUserWord(word: Word | UserWordPlus, user: LoginData) {
    const userWord = word;
    await statsModel.postWrong(userWord);
    (<UserWordPlus>userWord).optional.games.sprint.total += 1;
    if ((<UserWordPlus>userWord).optional.learned === 'yes') {
      (<UserWordPlus>userWord).difficulty = 'normal';
      (<UserWordPlus>userWord).optional.learned = 'no';
      (<UserWordPlus>userWord).optional.learnDate = Date.now();
    }

    await updateUserWord((<LoginData>user).id, (<UserWordPlus>userWord).id, (<LoginData>user).token, {
      difficulty: (<UserWordPlus>userWord).difficulty as string,
      optional: (<UserWordPlus>userWord).optional,
    });
  }

  private endGame(): void {
    statsModel.postBestSeries(Math.max(...this.bestResult));
    this.stateGame.innerHTML = '';
    const winBlock = createElement('div', 'sprint_over card');
    const showTotalRes = createElement('div', 'sprint_result');
    const showExperience = createElement('div', 'sprint_show-resultexperience');
    const gameOver = <HTMLAudioElement>new Audio('./assets/audio/over.mp3');
    const learnWords = createElement('ul', 'sprint_list-words');
    const unlearnWords = createElement('ul', 'sprint_list-words');
    const headerBlock = createElement('div', 'sprint_header-result');
    const allWords = createElement('ul', 'sprint_all-words');
    const arrStr1 = this.learnedWords.map((a) => JSON.stringify(a));
    const learnedWords = [...new Set(arrStr1)].map((e) => JSON.parse(e));
    const arrStr2 = this.unlearnedWords.map((a) => JSON.stringify(a));
    const unlearnedWords = [...new Set(arrStr2)].map((e) => JSON.parse(e));
    const headerListLerned = createElement(
      'div',
      'sprint_header-learn',
      `Угаданные слова - ${learnedWords.length}`,
    );
    const headerListUnlerned = createElement(
      'div',
      'sprint_header-unlearn',
      `Слова с ошибками - ${unlearnedWords.length}`,
    );
    showTotalRes.innerHTML = `Набрано ${this.pointsTotal} очков`;
    showExperience.innerHTML = `Получено +${learnedWords.length + unlearnedWords.length} опыта`;
    const blockBtn = createElement('div', 'sprint_btn-block-over');
    const endGame = createElement('button', 'waves-effect waves-light btn left-sptint-btn end', 'перейти в учебник');
    gameOver.pause();
    endGame.tabIndex = 0;

    if (learnedWords.length) {
      Promise.all(learnedWords).then((res) => {
        for (let i = 0; i < res.length; i += 1) {
          const audio = new Audio();
          const audioBlock = createElement(
            'i',
            'tiny grey-text text-darken-2 material-icons volume-up sprint-audio',
            'volume_up',
          );
          audioBlock.onclick = () => {
            audio.play();
          };
          const list = createElement('li', 'sprint_list', `${res[i][0]} ${res[i][1]} - ${res[i][2]}`);
          audio.src = `${HOST}/${res[i][3]}`;
          list.append(audioBlock);
          learnWords.append(list);
        }
      });
    }

    if (unlearnedWords.length) {
      Promise.all(unlearnedWords).then((res) => {
        for (let i = 0; i < res.length; i += 1) {
          const audio = new Audio();
          const audioBlock = createElement(
            'i',
            'tiny grey-text text-darken-2 material-icons volume-up sprint-audio',
            'volume_up',
          );
          audioBlock.onclick = () => {
            audio.play();
          };
          const list = createElement('li', 'sprint_list', `${res[i][0]} ${res[i][1]} - ${res[i][2]}`);
          audio.src = `${HOST}/${res[i][3]}`;
          list.append(audioBlock);
          unlearnWords.append(list);
        }
      });
    }

    endGame.onclick = () => {
      const hashArr = window.location.hash.slice(1).split('#');
      if (hashArr[1] !== undefined) window.location.hash = `book#${hashArr[1]}#${hashArr[2]}`;
      else window.location.hash = `book`;
      this.stopGame();
    };

    if (this.sound) gameOver.play();
    this.sound = false;
    blockBtn.append(endGame);
    blockBtn.append(this.againGame);
    headerBlock.append(showTotalRes);
    headerBlock.append(showExperience);
    winBlock.append(headerBlock);
    learnWords.append(headerListLerned);
    unlearnWords.append(headerListUnlerned);
    allWords.append(unlearnWords);
    allWords.append(learnWords);
    winBlock.append(allWords);
    winBlock.append(blockBtn);
    this.stateGame.append(winBlock);
  }

  private findWord(data: WordPlusUserWord[], word: string) {
    return data.find((el) => el.word === word);
  }

  private createCorrectResult(data: WordPlusUserWord[], word: string): void {
    data.filter((el) =>
      el.word === word ? this.learnedWords.push([el.word, el.transcription, el.wordTranslate, el.audio]) : [],
    );
  }

  private createWrongResult(data: WordPlusUserWord[], word: string): void {
    data.filter((el) =>
      el.word === word ? this.unlearnedWords.push([el.word, el.transcription, el.wordTranslate, el.audio]) : [],
    );
  }

  private createSounds(sound: boolean, flag?: string): void {
    const rightAnswer: HTMLAudioElement = new Audio('./assets/audio/cool.mp3');
    const wrongAnswer: HTMLAudioElement = new Audio('./assets/audio/bug.mp3');
    if (!sound) {
      rightAnswer.pause();
      wrongAnswer.pause();
    } else {
      if (flag === 'true') rightAnswer.play();
      if (flag === 'false') wrongAnswer.play();
    }
  }

  private styleCrow(crowArr: HTMLElement[], removeClass?: boolean): void {
    if (removeClass) {
      crowArr.forEach((el) => el.classList.remove('active'));
      this.pointsResult = [];
    } else {
      if (this.pointsResult.length) crowArr[this.pointsResult.length - 1].classList.add('active');
      if (this.pointsResult.length === 1) {
        crowArr.forEach((el) => el.classList.remove('active'));
        crowArr[this.pointsResult.length - 1].classList.add('active');
      }
    }
  }

  private countResult(totalPointsDiv: HTMLElement, pointsDiv: HTMLElement): void {
    const totalPoints = totalPointsDiv;
    const points = pointsDiv;

    if (this.pointsResult.length >= 3) this.pointsResult = [];
    this.pointsTotalResult.push(this.points);
    this.pointsTotal += this.points;

    if (this.pointsTotalResult.length === 3) this.points = 20;
    if (this.pointsTotalResult.length === 6) this.points = 40;
    if (this.pointsTotalResult.length === 9) this.points = 80;

    totalPoints.innerHTML = `${this.pointsTotal}`;
    this.pointsResult.push(this.points);
    points.innerHTML = `+${this.points} очков за слово`;
  }

  stopGame() {
    this.sound = true;
    this.fullscreen = false;
    this.soundImg.classList.remove('sprint_not-sound');
    this.bestResult = [0];
    this.countBestRes = 0;
    clearInterval(this.downloadTimer);
    this.points = 10;
    this.pointsTotal = 0;
    this.pointsTotalResult = [];
    this.pointsResult = [];
    this.learnedWords = [];
    this.unlearnedWords = [];
    window.removeEventListener('keyup', this.handleKeypress);
    if (document.fullscreenElement) document.exitFullscreen();
  }
}
