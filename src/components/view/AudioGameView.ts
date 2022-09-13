import { createUserWord, getAllUserWords, getWords, HOST, updateUserWord } from '../model/helpers/apiHelpers';
import { MixWordsAudio, Optional, UserWordPlus, Word, WordPlusUserWord } from '../types';
import { LoginData } from '../types/loginTypes';
import { getMixWordsForAudio } from './helpers/appMixWords';
import { combineWords } from './helpers/combineArr';
import { createElement } from './helpers/renderHelpers';
import { statsModel } from '../model/StatsModel';

export class AudioGameView {
  mainDiv: HTMLElement;
  stateGame: HTMLElement;
  againGame: HTMLElement;
  sound: boolean;
  fullscreen: boolean;
  points: number;
  pointsTotal: number;
  soundImg: HTMLElement;
  controlBlock: HTMLElement;
  pointsResult: number[];
  pointsTotalResult: number[];
  learnedWords: string[][];
  unlearnedWords: string[][];
  countBestRes: number;
  bestResult: number[];
  audio: HTMLAudioElement;
  set1?: NodeJS.Timer;
  set2?: NodeJS.Timer;
  set3?: NodeJS.Timer;
  handleVolumepress: (el: KeyboardEvent) => void;
  handleKeypress: (el: KeyboardEvent) => void;
  handleMainKeypress: (el: KeyboardEvent) => void;

  constructor(mainDiv: HTMLElement) {
    this.mainDiv = mainDiv;
    this.stateGame = createElement('div', 'audio_game-content');
    this.controlBlock = createElement('div', 'audio_controll');
    this.againGame = createElement('button', 'waves-effect waves-light btn right-audio-btn end', 'сыграть еще раз');
    this.soundImg = createElement('button', 'audio_sound');
    this.sound = true;
    this.fullscreen = false;
    this.points = 10;
    this.pointsTotal = 0;
    this.pointsTotalResult = [];
    this.pointsResult = [];
    this.learnedWords = [];
    this.unlearnedWords = [];
    this.audio = new Audio();
    this.countBestRes = 0;
    this.bestResult = [0];
    this.handleVolumepress = () => {};
    this.handleKeypress = () => {};
    this.handleMainKeypress = () => {};
    this.set1 = setTimeout(() => {});
    this.set2 = setTimeout(() => {});
    this.set3 = setTimeout(() => {});
  }

  public render(data?: WordPlusUserWord[], user?: LoginData): void {
    this.controlBlock.innerHTML = '';
    this.mainDiv.innerHTML = '';
    const adioGame = createElement('div', 'audio-game');
    const mainImg = <HTMLImageElement>createElement('img', 'img-audio');
    const fullscreenImg = createElement('button', 'audio_fullscreen');
    const crossImg = createElement('button', 'audio_cross');

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
        this.soundImg.classList.add('audio_not-sound');
      } else {
        this.sound = true;
        this.soundImg.classList.remove('audio_not-sound');
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
    adioGame.append(mainImg);
    this.controlBlock.appendChild(this.soundImg);
    this.controlBlock.append(fullscreenImg);
    this.controlBlock.appendChild(crossImg);
    this.mainDiv.append(this.controlBlock);
    this.mainDiv.append(adioGame);
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
        this.audio.remove();
        this.sound = true;
      };
    } else if (!data && user) {
      this.mainDiv.append(this.startGameFromMenu(user));
      this.againGame.onclick = () => {
        this.stopGame();
        this.startGameFromMenu(user);
        this.audio.remove();
        this.sound = true;
      };
    } else if (!data && !user) {
      this.mainDiv.append(this.startGameFromMenu());
      this.againGame.onclick = () => {
        this.stopGame();
        this.startGameFromMenu();
        this.audio.remove();
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
    const title: HTMLElement = createElement('h1', 'title-audio h1-lang', 'Аудиовызов');
    const subTitle: HTMLElement = createElement(
      'h5',
      'subtitle-audio h5-lang',
      'Попробуй угадать как можно больше слов на слух',
    );

    const navHeader: HTMLElement = createElement('ul', 'nav-audio h6-lang', 'Инструкция для игры на клавиатуре:');
    const navList1: HTMLElement = createElement(
      'li',
      'nav_list-audio ul-lang',
      ' - цифровые клавиши от 1 до 5 для выбора ответа',
    );
    const navList2: HTMLElement = createElement(
      'li',
      'nav_list-audio ul-lang',
      ' - клавиша Enter для подсказки или для перехода к следующему слову',
    );
    const navList3: HTMLElement = createElement(
      'li',
      'nav_list-audio ul-lang',
      ' - пробел для повторного звучания слова',
    );

    const levelBlock: HTMLElement = createElement('div', 'level-audio');

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
        `audio-level-btn z-depth-2 waves-effect ${classArr[i]}`,
        `${levelArr[i]}`,
      );
      btnLevel.tabIndex = 0;
      btnLevel.onclick = async () => {
        const randomPage = Math.floor(Math.random() * 29);
        const words = await getWords(randomPage, i);
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

    navHeader.append(navList1);
    navHeader.append(navList2);
    navHeader.append(navList3);
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
    const title: HTMLElement = createElement('h1', 'title-audio h1-lang', 'Аудиовызов');
    const subTitle: HTMLElement = createElement(
      'h5',
      'subtitle-audio h5-lang',
      'Попробуй угадать как можно больше слов на слух',
    );

    const navHeader: HTMLElement = createElement('ul', 'nav-audio h6-lang', 'Инструкция для игры на клавиатуре:');
    const navList1: HTMLElement = createElement(
      'li',
      'nav_list-audio ul-lang',
      ' - цифровые клавиши от 1 до 5 для выбора ответа',
    );
    const navList2: HTMLElement = createElement(
      'li',
      'nav_list-audio ul-lang',
      ' - клавиша Enter для подсказки или для перехода к следующему слову',
    );
    const navList3: HTMLElement = createElement(
      'li',
      'nav_list-audio ul-lang',
      ' - пробел для повторного звучания слова',
    );

    const btnStart = createElement('button', `audio_start-btn z-depth-1 waves-effect`, 'НАЧАТЬ');
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

    navHeader.append(navList1);
    navHeader.append(navList2);
    navHeader.append(navList3);
    this.stateGame.append(title);
    this.stateGame.append(subTitle);
    this.stateGame.append(navHeader);
    this.stateGame.append(btnStart);
    return this.stateGame;
  }

  private showGame(data: WordPlusUserWord[], user?: LoginData): HTMLElement {
    const mixData = getMixWordsForAudio(data);
    const contentGame = createElement('div', 'audio_game-container');
    const lineResult = createElement('div', 'audio_line-result');
    const innerLineRes = createElement('div', 'audio_line-inner');
    const word = createElement('div', 'audio_word card');
    const wordName = createElement('div', 'audio_word-name');
    const audioBlock = createElement(
      'i',
      'tiny grey-text text-darken-2 material-icons volume-up audio_game-audio',
      'volume_up',
    );
    const blockBtn = createElement('div', 'audio_btn-block');
    const mainBtn = <HTMLButtonElement>createElement('button', `audio_main-btn z-depth-1 waves-effect`, `НЕ ЗНАЮ`);
    const mainBlock = createElement('div', 'audio_main-block');
    const volumeBtn = createElement(
      'i',
      'tiny grey-text text-darken-2 material-icons volume-up audio_volume',
      'volume_up',
    );
    const imgDiv = createElement('div', 'audio_img-word');
    volumeBtn.tabIndex = 0;
    let index = 0;
    let widthLineRes = 100 / mixData.length;
    imgDiv.style.backgroundImage = `url(${HOST}/${mixData[0].image})`;
    this.audio.src = `${HOST}/${mixData[index].audio}`;
    audioBlock.onclick = () => {
      this.audio.play();
    };
    volumeBtn.onclick = () => {
      this.audio.play();
    };
    this.audio.play();
    setTimeout(() => {
      contentGame.classList.add('stop');
    }, 200);
    wordName.innerHTML = `${mixData[index].en}  ${mixData[index].tr}`;
    let flag = true;
    let flagRes = true;
    const blockWodsArr: HTMLButtonElement[] = [];
    const keyCode = ['1', '2', '3', '4', '5'];

    for (let i = 0; i < mixData[index].ruRandom.length; i += 1) {
      const wordContainer = <HTMLButtonElement>(
        createElement('button', `audio_block-word z-depth-1 waves-effect`, `${i + 1} ${mixData[index].ruRandom[i]}`)
      );
      wordContainer.id = `${i + 1}`;
      blockWodsArr.push(wordContainer);
      blockBtn.append(wordContainer);
    }

    this.handleVolumepress = (el: KeyboardEvent) => {
      if (el.code === 'Space') {
        this.audio.play();
      }
      if (index === mixData.length) window.removeEventListener('keyup', this.handleVolumepress);
    };

    this.handleKeypress = (el: KeyboardEvent) => {
      if (index <= mixData.length) {
        keyCode.forEach((key) => {
          if (el.key === key) {
            blockWodsArr.forEach((v) => {
              if (v.textContent?.split(' ').slice(1).join(' ') === mixData[index].ru) v.classList.add('correct');
              const text = v.textContent?.split(' ').slice(1).join(' ');
              if (flagRes) {
                if (v.id === el.key) {
                  window.removeEventListener('keyup', this.handleKeypress);
                  window.removeEventListener('keyup', this.handleMainKeypress);
                  if (text !== mixData[index].ru) {
                    this.createWrongResult(data, mixData[index].en);
                    const userWord = this.findWord(data, mixData[index].en);
                    if (userWord && user) this.createNewUserWord(userWord, user);
                    v.classList.add('wrong');
                    if (userWord && user) {
                      this.bestResult.push(this.countBestRes);
                      this.countBestRes = 0;
                      this.incorrectUserWord(userWord, user);
                    }
                    this.createSounds(this.sound, 'false');
                  } else {
                    this.createCorrectResult(data, mixData[index].en);
                    const userWord = this.findWord(data, mixData[index].en);
                    if (userWord && user) {
                      this.countBestRes += 1;
                      this.bestResult.push(this.countBestRes);
                      this.correctUserWord(userWord, user);
                    }
                    this.createSounds(this.sound, 'true');
                    this.pointsTotal += 10;
                  }
                  flagRes = false;
                }
              }

              this.set1 = setTimeout(() => {
                window.addEventListener('keyup', this.handleMainKeypress);
              }, 800);
              setTimeout(() => {
                window.addEventListener('keyup', this.handleKeypress);
              }, 3000);
              mainBtn.innerText = 'ДАЛЬШЕ';
              mainBlock.innerHTML = '';
              this.renderWordCard(mixData, index, imgDiv, wordName);
              mainBlock.innerHTML = '';
              wordName.appendChild(audioBlock);
              mainBlock.append(word);
              flag = false;
              if (index === mixData.length) {
                this.endGame();
                index = 0;
              }
              blockWodsArr.forEach((w) => {
                const btnActiv = w;
                btnActiv.disabled = true;
              });
            });
          }
        });
      } else {
        window.removeEventListener('keyup', this.handleKeypress);
      }
    };

    this.handleMainKeypress = (el: KeyboardEvent) => {
      mainBtn.disabled = false;
      if (index <= mixData.length) {
        if (el.key === 'Enter') {
          if (flag) {
            flag = false;
            this.set3 = setTimeout(() => {
              window.addEventListener('keyup', this.handleMainKeypress);
            }, 0);
            this.pressMainButtonAnswer(
              mainBtn,
              data,
              index,
              mixData,
              mainBlock,
              imgDiv,
              wordName,
              audioBlock,
              word,
              blockWodsArr,
            );
            const userWord = this.findWord(data, mixData[index].en);
            if (userWord && user) {
              this.bestResult.push(this.countBestRes);
              this.countBestRes = 0;
              this.createNewUserWord(userWord, user);
              this.incorrectUserWord(userWord, user);
            }
          } else {
            index += 1;
            innerLineRes.style.width = `${widthLineRes}%`;
            widthLineRes += 100 / mixData.length;
            setTimeout(() => {
              window.addEventListener('keyup', this.handleKeypress);
              window.removeEventListener('keyup', this.handleMainKeypress);
            }, 2000);
            this.addAnimation(contentGame, mixData, index);
            flag = true;
            flagRes = true;
            mainBtn.disabled = true;
            setTimeout(() => {
              this.pressMainButtonNext(mainBtn, index, mixData, mainBlock, blockWodsArr, volumeBtn, this.audio);
              mainBtn.disabled = false;
            }, 800);
          }
        }
        if (index === mixData.length) {
          this.endGame();
          window.removeEventListener('keyup', this.handleKeypress);
          window.removeEventListener('keyup', this.handleMainKeypress);
          index = 0;
        }
      }
    };

    setTimeout(() => {
      mainBtn.disabled = false;
    }, 500);
    mainBtn.disabled = true;
    mainBtn.onclick = () => {
      if (index <= mixData.length) {
        if (flag) {
          flag = false;
          mainBtn.disabled = false;
          this.pressMainButtonAnswer(
            mainBtn,
            data,
            index,
            mixData,
            mainBlock,
            imgDiv,
            wordName,
            audioBlock,
            word,
            blockWodsArr,
          );
          window.removeEventListener('keyup', this.handleKeypress);
          const userWord = this.findWord(data, mixData[index].en);
          if (userWord && user) {
            this.bestResult.push(this.countBestRes);
            this.countBestRes = 0;
            this.createNewUserWord(userWord, user);
            this.incorrectUserWord(userWord, user);
          }
        } else {
          index += 1;
          innerLineRes.style.width = `${widthLineRes}%`;
          widthLineRes += 100 / mixData.length;
          this.addAnimation(contentGame, mixData, index);
          flag = true;
          flagRes = true;
          mainBtn.disabled = true;
          setTimeout(() => {
            window.addEventListener('keyup', this.handleKeypress);
            this.pressMainButtonNext(mainBtn, index, mixData, mainBlock, blockWodsArr, volumeBtn, this.audio);
            mainBtn.disabled = false;
          }, 800);
        }
      }
      if (index === mixData.length) {
        window.removeEventListener('keyup', this.handleKeypress);
        window.removeEventListener('keyup', this.handleMainKeypress);
        this.endGame();
        this.stopGame();
        index = 0;
      }
    };

    blockWodsArr.forEach((el) => {
      const btn = el;
      btn.onclick = () => {
        blockWodsArr.forEach((v) => {
          const click = v;
          if (click.textContent?.split(' ').slice(1).join(' ') === mixData[index].ru) v.classList.add('correct');
          click.disabled = true;
        });
        const text = btn.textContent?.split(' ').slice(1).join(' ');
        if (flagRes) {
          const userWord = this.findWord(data, mixData[index].en);
          if (userWord && user) this.createNewUserWord(userWord, user);
          if (text !== mixData[index].ru) {
            btn.classList.add('wrong');
            if (userWord && user) {
              this.bestResult.push(this.countBestRes);
              this.countBestRes = 0;
              this.incorrectUserWord(userWord, user);
            }
            this.createWrongResult(data, mixData[index].en);
            this.createSounds(this.sound, 'false');
          } else {
            if (userWord && user) {
              this.countBestRes += 1;
              this.bestResult.push(this.countBestRes);
              this.correctUserWord(userWord, user);
            }
            this.createCorrectResult(data, mixData[index].en);
            this.createSounds(this.sound, 'true');
            this.pointsTotal += 10;
          }
          flagRes = false;
        }
        mainBtn.disabled = true;
        setTimeout(() => {
          mainBtn.disabled = false;
        }, 500);

        mainBtn.innerText = 'ДАЛЬШЕ';
        mainBlock.innerHTML = '';
        this.renderWordCard(mixData, index, imgDiv, wordName);
        mainBlock.innerHTML = '';
        wordName.appendChild(audioBlock);
        mainBlock.append(word);
        flag = false;
        if (index === mixData.length) {
          this.endGame();
          index = 0;
        }
      };
    });

    mainBtn.onmouseout = () => {
      mainBtn.blur();
    };

    window.addEventListener('keyup', this.handleKeypress);
    setTimeout(() => {
      window.addEventListener('keyup', this.handleMainKeypress);
    }, 2300);
    window.addEventListener('keyup', this.handleVolumepress);
    lineResult.append(innerLineRes);
    wordName.appendChild(audioBlock);
    word.append(imgDiv);
    word.append(wordName);
    mainBlock.append(volumeBtn);
    contentGame.append(mainBlock);
    contentGame.append(blockBtn);
    contentGame.append(mainBtn);
    this.stateGame.append(lineResult);
    this.stateGame.append(contentGame);
    return this.stateGame;
  }

  addAnimation(contentGameDiv: HTMLElement, mixData: MixWordsAudio[], index: number) {
    const contentGame = contentGameDiv;
    contentGame.classList.remove('stop');
    contentGame.classList.add('move');
    window.removeEventListener('keyup', this.handleMainKeypress);

    setTimeout(() => {
      contentGame.style.display = 'none';
      contentGame.classList.remove('move');
    }, 500);
    setTimeout(() => {
      contentGame.style.display = 'flex';
    }, 700);
    setTimeout(() => {
      contentGame.classList.add('stop');
    }, 1000);
    const imt1 = setTimeout(() => {
      window.addEventListener('keyup', this.handleKeypress);
    }, 2000);
    this.set2 = setTimeout(() => {
      window.addEventListener('keyup', this.handleMainKeypress);
    }, 2200);

    if (index === mixData.length) {
      clearInterval(this.set2);
      clearInterval(imt1);
      window.removeEventListener('keyup', this.handleMainKeypress);
      window.removeEventListener('keyup', this.handleMainKeypress);
    }
  }

  private pressMainButtonAnswer = (
    mainBtnDiv: HTMLButtonElement,
    data: WordPlusUserWord[],
    index: number,
    mixData: MixWordsAudio[],
    mainBlockDiv: HTMLElement,
    imgDiv: HTMLElement,
    wordName: HTMLElement,
    audioBlock: HTMLElement,
    word: HTMLElement,
    blockWodsArr: HTMLButtonElement[],
  ) => {
    const mainBlock = mainBlockDiv;
    const mainBtn = mainBtnDiv;
    mainBtn.innerText = 'ДАЛЬШЕ';
    this.renderWordCard(mixData, index, imgDiv, wordName);
    mainBlock.innerHTML = '';
    wordName.appendChild(audioBlock);
    mainBlock.append(word);
    blockWodsArr.forEach((v) => {
      const btn = v;
      if (btn.textContent?.split(' ').slice(1).join(' ') === mixData[index].ru) {
        btn.classList.add('correct');
        this.createWrongResult(data, mixData[index].en);
      }
      btn.disabled = true;
    });
  };

  private pressMainButtonNext = (
    mainBtnDiv: HTMLButtonElement,
    index: number,
    mixData: MixWordsAudio[],
    mainBlockDiv: HTMLElement,
    blockWodsArr: HTMLButtonElement[],
    volumeBtn: HTMLElement,
    volume: HTMLAudioElement,
  ) => {
    const mainBlock = mainBlockDiv;
    const mainBtn = mainBtnDiv;
    blockWodsArr.forEach((el) => {
      el.classList.remove('correct');
      el.classList.remove('wrong');
      const btn = el;
      btn.disabled = false;
    });
    mainBtn.innerText = 'НЕ ЗНАЮ';

    this.renderRandomWords(blockWodsArr, mixData, index, volume);
    mainBlock.innerHTML = '';
    mainBlock.append(volumeBtn);
  };

  private renderRandomWords(
    blockWodsArr: HTMLButtonElement[],
    data: MixWordsAudio[],
    index: number,
    volumeEl: HTMLAudioElement,
  ) {
    const volumeBtn = volumeEl;
    if (index > 0 && index < data.length) {
      for (let i = 0; i < blockWodsArr.length; i += 1) {
        const word = blockWodsArr[i];
        word.innerHTML = `${i + 1} ${data[index].ruRandom[i]}`;
      }
      volumeBtn.src = `${HOST}/${data[index].audio}`;
      this.audio.src = `${HOST}/${data[index].audio}`;
      this.audio.play();
    }
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
    (<UserWordPlus>userWord).optional.games.audio.wins += 1;
    (<UserWordPlus>userWord).optional.games.audio.total += 1;

    if (
      (<UserWordPlus>userWord).difficulty === 'normal' &&
      (<UserWordPlus>userWord).optional.games.audio.wins % 3 === 0
    ) {
      (<UserWordPlus>userWord).difficulty = 'easy';
      (<UserWordPlus>userWord).optional.learned = 'yes';
      (<UserWordPlus>userWord).optional.learnDate = Date.now();
    } else if (
      (<UserWordPlus>userWord).difficulty === 'difficult' &&
      (<UserWordPlus>userWord).optional.games.audio.wins % 5 === 0
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
    (<UserWordPlus>userWord).optional.games.audio.total += 1;
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

  private renderWordCard(data: MixWordsAudio[], index: number, imgDiv: HTMLElement, wordName: HTMLElement) {
    const wordBlock = wordName;
    const img = imgDiv;
    this.audio.src = `${HOST}/${data[index].audio}`;
    img.style.backgroundImage = `url(${HOST}/${data[index].image})`;
    wordBlock.innerHTML = `${data[index].en}  ${data[index].tr}`;
  }

  private endGame(): void {
    statsModel.postBestSeries(Math.max(...this.bestResult));
    this.countBestRes = 0;
    this.bestResult = [0];
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
    const headerListLerned = createElement('div', 'sprint_header-learn', `Угаданные слова - ${learnedWords.length}`);
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

  private createCorrectResult(data: WordPlusUserWord[], word: string) {
    data.filter((el) =>
      el.word === word ? this.learnedWords.push([el.word, el.transcription, el.wordTranslate, el.audio]) : [],
    );
  }

  private createWrongResult(data: WordPlusUserWord[], word: string) {
    data.filter((el) =>
      el.word === word ? this.unlearnedWords.push([el.word, el.transcription, el.wordTranslate, el.audio]) : [],
    );
  }

  private findWord(data: WordPlusUserWord[], word: string) {
    return data.find((el) => el.word === word);
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

  stopGame() {
    this.sound = true;
    this.audio.remove();
    this.fullscreen = false;
    this.soundImg.classList.remove('audio_not-sound');
    this.countBestRes = 0;
    this.bestResult = [0];
    this.points = 10;
    this.pointsTotal = 0;
    this.pointsTotalResult = [];
    this.pointsResult = [];
    this.learnedWords = [];
    this.unlearnedWords = [];
    clearInterval(this.set1);
    clearInterval(this.set2);
    clearInterval(this.set3);
    window.removeEventListener('keyup', this.handleMainKeypress);
    window.removeEventListener('keyup', this.handleKeypress);
    window.removeEventListener('keyup', this.handleVolumepress);
    if (document.fullscreenElement) document.exitFullscreen();
  }
}
