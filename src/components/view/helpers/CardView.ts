import { HOST } from '../../model/helpers/apiHelpers';
import { WordPlusUserWord } from '../../types';
import { createElement } from './renderHelpers';

export class Card {
  public onVolume?: () => void;
  data: WordPlusUserWord;
  volume: HTMLElement;
  audio: HTMLAudioElement;
  audioMeaning: HTMLAudioElement;
  audioExample: HTMLAudioElement;
  difficult: HTMLElement;
  learn: HTMLElement;

  public onDifficult?: () => void;
  public onLearn?: () => void;
  public onLearnDifficultLevel?: () => void;
  public onDiffDifficultLevel?: () => void;
  word: HTMLElement;
  card: HTMLElement;
  learnDifficultLevel: HTMLElement;
  diffDifficultLevel: HTMLElement;

  constructor(content: HTMLElement, data: WordPlusUserWord, level: number) {
    const userJSON = localStorage.getItem('user');
    this.data = data;

    this.card = createElement('div', 'card z-depth-2');
    content.appendChild(this.card);

    const wordImgWrap = createElement('div', 'word-img-wrap');
    this.card.appendChild(wordImgWrap);

    this.difficult = createElement('div', 'difficult tooltipped');
    if (userJSON && level !== 6) {
      if (this.data.difficulty && this.data.difficulty === 'difficult')
        this.difficult.style.backgroundImage = `url(./assets/svg/difficult-colored.svg)`;
      else this.difficult.style.backgroundImage = `url(./assets/svg/difficult.svg)`;
      this.difficult.setAttribute('data-position', 'left');
      this.difficult.setAttribute('data-tooltip', 'Сложно!');
      wordImgWrap.appendChild(this.difficult);
    }

    this.learn = createElement('div', 'learn tooltipped');
    if (userJSON && level !== 6) {
      if (this.data.optional && this.data.optional.learned === 'yes')
        this.learn.style.backgroundImage = `url(./assets/svg/learn-colored.svg)`;
      else this.learn.style.backgroundImage = `url(./assets/svg/learn.svg)`;
      this.learn.setAttribute('data-position', 'right');
      this.learn.setAttribute('data-tooltip', 'Изучено :)');
      wordImgWrap.appendChild(this.learn);
    }

    this.diffDifficultLevel = createElement('div', 'diff-difficult-level tooltipped');
    if (userJSON && level === 6) {
      this.diffDifficultLevel.style.backgroundImage = `url(./assets/svg/difficult-colored.svg)`;
      this.diffDifficultLevel.setAttribute('data-position', 'right');
      this.diffDifficultLevel.setAttribute('data-tooltip', 'Не сложно!');
      wordImgWrap.appendChild(this.diffDifficultLevel);
    }

    this.learnDifficultLevel = createElement('div', 'learn-difficult-level tooltipped');
    if (userJSON && level === 6) {
      this.learnDifficultLevel.style.backgroundImage = `url(./assets/svg/learn.svg)`;
      this.learnDifficultLevel.setAttribute('data-position', 'right');
      this.learnDifficultLevel.setAttribute('data-tooltip', 'Изучено :)');
      wordImgWrap.appendChild(this.learnDifficultLevel);
    }

    const wordWrap = createElement('div', 'words-wrap');
    wordImgWrap.appendChild(wordWrap);

    this.word = createElement('p', 'grey-text text-darken-2 word', `${this.data.word}`);
    wordWrap.appendChild(this.word);

    const transcription = createElement('p', 'grey-text text-darken-2 p-lang', `${this.data.transcription}`);
    wordWrap.appendChild(transcription);

    this.volume = createElement('i', 'tiny material-icons volume-up', `volume_up`);
    transcription.appendChild(this.volume);

    this.audio = createElement('audio', '') as HTMLAudioElement;
    this.audio.src = `${HOST}/${this.data.audio}`;
    this.volume.appendChild(this.audio);

    this.audioMeaning = createElement('audio', '') as HTMLAudioElement;
    this.audioMeaning.src = `${HOST}/${this.data.audioMeaning}`;
    this.volume.appendChild(this.audioMeaning);

    this.audioExample = createElement('audio', '') as HTMLAudioElement;
    this.audioExample.src = `${HOST}/${this.data.audioExample}`;
    this.volume.appendChild(this.audioExample);

    const wordTranslate = createElement('p', 'grey-text text-darken-2 word-translate');
    wordTranslate.innerHTML = `${this.data.wordTranslate}`;
    wordWrap.appendChild(wordTranslate);

    const cardImage = createElement('div', 'z-depth-1 card-image');
    cardImage.style.backgroundImage = `url(${HOST}/${this.data.image})`;
    wordImgWrap.appendChild(cardImage);

    const cardContent = createElement('div', 'card-content');
    this.card.appendChild(cardContent);

    const meaning = createElement('p', 'grey-text text-darken-2 meaning p-lang', `Значение:`);
    cardContent.appendChild(meaning);

    const textMeaning = createElement('p', 'grey-text text-darken-2 p-lang');
    textMeaning.innerHTML = this.data.textMeaning;
    cardContent.appendChild(textMeaning);

    const textMeaningTranslate = createElement(
      'p',
      'grey-text text-darken-2 p-lang',
      `${this.data.textMeaningTranslate}`,
    );
    cardContent.appendChild(textMeaningTranslate);

    const divider1 = createElement('div', 'divider divider-lang');
    cardContent.appendChild(divider1);

    const example = createElement('p', 'grey-text text-darken-2 example p-lang', `Пример:`);
    cardContent.appendChild(example);

    const textExample = createElement('p', 'grey-text text-darken-2 p-lang');
    textExample.innerHTML = this.data.textExample;
    cardContent.appendChild(textExample);

    const textExampleTranslate = createElement(
      'p',
      'grey-text text-darken-2 p-lang',
      `${this.data.textExampleTranslate}`,
    );
    cardContent.appendChild(textExampleTranslate);

    if (userJSON) {
      const wordProgress = createElement('div', 'word-progress');
      wordProgress.innerHTML = `  <ul class="collapsible collapsible-lang">
    <li>
      <div class="collapsible-header collapsible-header-lang"><i class="material-icons grey-text text-darken-2">add_circle_outline</i>Статистика в играх</div>
      <div class="collapsible-body collapsible-body-lang"><span>Спринт: ${
        this.data.optional?.games.sprint.wins === undefined ? 0 : this.data.optional?.games.sprint.wins
      }/ ${this.data.optional?.games.sprint.total === undefined ? 0 : this.data.optional?.games.sprint.total}<br>
      Аудиовызов: ${this.data.optional?.games.audio.wins === undefined ? 0 : this.data.optional?.games.audio.wins}/ ${
        this.data.optional?.games.audio.total === undefined ? 0 : this.data.optional?.games.audio.total
      }<br>
      Фразы: ${this.data.optional?.games.phrase.wins === undefined ? 0 : this.data.optional?.games.phrase.wins}/ ${
        this.data.optional?.games.phrase.total === undefined ? 0 : this.data.optional?.games.phrase.total
      }</span></div>
    </li>
    </ul>`;
      cardContent.appendChild(wordProgress);
    }

    this.setListeners();
  }

  private setListeners() {
    this.volume.onclick = () => this.onVolume?.();

    this.difficult.onclick = () => this.onDifficult?.();

    this.learn.onclick = () => this.onLearn?.();

    this.learnDifficultLevel.onclick = () => this.onLearnDifficultLevel?.();

    this.diffDifficultLevel.onclick = () => this.onDiffDifficultLevel?.();
  }
}
