import { getRandomWords} from '../model/helpers/apiHelpers';
import {  Word } from '../types';
import { getMixWords } from './helpers/appMixWords';
import { createElement } from './helpers/renderHelpers';

export class SprintGameView {
  mainDiv: HTMLElement;
  stateGame: HTMLElement;
  sound: boolean;
  fullscreen: boolean;
  timeleft: number;
  points: number;
  pointsTotal: number;
  controlBlock: HTMLElement;
  pointsResult: number[];
  pointsTotalResult: number[];
  learnedWords: string[][]
  unlearnedWords: string[][];

  constructor(mainDiv: HTMLElement) {
    this.mainDiv = mainDiv;
    this.stateGame = createElement('div', 'game-content');
    this.controlBlock = createElement('div', 'controll');
    this.sound = true;
    this.fullscreen = false;
    this.timeleft = 60;
    this.points = 10;
    this.pointsTotal = 0;
    this.pointsTotalResult = [];
    this.pointsResult = [];
    this.learnedWords = [];
    this.unlearnedWords = [];
  }

  public render(data?: Word[]): void {

    this.controlBlock.innerHTML = '';
    this.sound = true;
    this.mainDiv.innerHTML = '';
    const sprint = createElement('div', 'sprint');
    const mainImg = <HTMLImageElement>createElement('img', 'img-sprint');
    const soundImg = createElement('div', 'sound');
    const fullscreenImg = createElement('div', 'fullscreen');
    const crossImg = createElement('div', 'cross');
    mainImg.src = "./assets/images/bridge.jpg";

    fullscreenImg.onclick = () => {
      if(!this.fullscreen) { 
        this.mainDiv.requestFullscreen();
        this.fullscreen = true;
      }
      else { 
        document.exitFullscreen();
        this.fullscreen = false;
      }
    }

    soundImg.onclick = () => {
      if(this.sound) {
        this.sound = false;
        soundImg.classList.add('not-sound');
      }
      else {
        this.sound = true;
        soundImg.classList.remove('not-sound');
      }
      this.createSounds(this.sound);
    }
    
    crossImg.onclick = () => {window.location.hash = 'main'}

    sprint.append(mainImg);
    this.controlBlock.appendChild(soundImg);
    this.controlBlock.append(fullscreenImg);
    this.controlBlock.appendChild(crossImg);
    this.mainDiv.append(this.controlBlock);
    this.mainDiv.append(sprint);
    if (data) this.mainDiv.append(this.showGame(data));
    else this.mainDiv.append(this.startGame());

  }

  private startGame(): HTMLElement {

    this.stateGame.innerHTML = '';
    this.pointsResult = [];
    this.points = 10;
    this.pointsTotal = 0;
    this.learnedWords = [];
    this.unlearnedWords = [];
    const randomPageArr: number[] = [];
    const title: HTMLElement = createElement('h1', 'title-sprint', 'Sprint');
    const subTitle: HTMLElement = createElement(
      'h5',
      'subtitle-sprint',
      'Попробуй угадать как можно больше слов за минуту',
    );
    const levelBlock: HTMLElement = createElement('div', 'level-sprint');

    while(randomPageArr.length < 7) {
    const randomPage = Math.floor(Math.random() * 29);
      if(!randomPageArr.includes(randomPage)) {
        randomPageArr.push(randomPage); 
      }
    }

    for (let i = 0; i <= 5; i += 1) {

      const levelArr: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      const classArr: string[] = ['waves-purple', 'waves-yellow', 'waves-green',
                                  'waves-teal', 'waves-orange','waves-red']                       
      const btnLevel = createElement('button', `sprint-level-btn z-depth-1 waves-effect ${classArr[i]}`, 
                       `${levelArr[i]}`);   

      btnLevel.onclick = async () => {   
        const words = await getRandomWords(randomPageArr, i);
        this.stateGame.innerHTML = '';
        this.mainDiv.append(this.showGame(words));
      };

      levelBlock.append(btnLevel);

    }
     
    this.stateGame.append(title);
    this.stateGame.append(subTitle);
    this.stateGame.append(levelBlock);
    return this.stateGame;

  }

  

}

// const start = <HTMLButtonElement>createElement('button', 'waves-effect waves-light btn-large start', 'Начать');
  // start.disabled = true;
  // start.onclick = async () => {
  //   this.stateGame.innerHTML = '';
  //   const words = await getWords(0, level[level.length - 1]);
  //   this.mainDiv.append(this.showGame(words));
  // };