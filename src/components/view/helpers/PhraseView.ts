import { createElement } from './renderHelpers';

export class Phrase {
  public onDragenter?: () => void;
  public onDragleave?: () => void;
  public onDrop?: () => Promise<void>;

  public onDragenterS?: () => void;
  public onDragoverS?: () => void;
  public onDragleaveS?: () => void;
  public onDropS?: () => void;

  public onDragstart?: () => void;
  public onDragend?: () => void;

  phraseWrap: HTMLElement;
  firstPart: HTMLElement;
  textExampleWrap: HTMLElement;
  back: HTMLElement;
  secondPart: HTMLElement;
  numPart: HTMLElement;
  wordWrap: HTMLElement;
  backStart: HTMLElement;
  item: HTMLElement;

  constructor(content: HTMLElement, textExample: string, word: { numb: number; word: string }, ii: number) {
    const textExampleArr = textExample.replace('</b>', '<b>').split('<b>');

    this.phraseWrap = createElement('div', 'z-depth-2 phrase-wrap');
    content.appendChild(this.phraseWrap);

    this.textExampleWrap = createElement('div', 'text-example-wrap');
    this.phraseWrap.appendChild(this.textExampleWrap);

    this.numPart = createElement('div', '', `${ii + 1}.`);
    this.textExampleWrap.appendChild(this.numPart);

    this.firstPart = createElement('div', '', `${textExampleArr[0]}`);
    this.textExampleWrap.appendChild(this.firstPart);

    this.back = createElement('div', 'back');
    this.textExampleWrap.appendChild(this.back);
    this.back.setAttribute('data-numb', `${ii}`);

    this.secondPart = createElement('div', '', `${textExampleArr[2]}`);
    this.textExampleWrap.appendChild(this.secondPart);

    this.wordWrap = createElement('div', 'word-wrap');
    this.phraseWrap.appendChild(this.wordWrap);

    this.backStart = createElement('div', 'back back-start');
    this.wordWrap.appendChild(this.backStart);

    this.item = createElement('div', 'item z-depth-3', `${word.word}`);
    this.backStart.append(this.item);
    this.item.draggable = true;
    this.item.setAttribute('data-numb', `${word.numb}`);

    this.setListeners();
  }

  private setListeners() {
    this.back.ondragenter = () => this.onDragenter?.();
    this.back.ondragleave = () => this.onDragleave?.();
    this.back.ondrop = async () => this.onDrop?.();
    this.back.addEventListener('dragover', (event) => event.preventDefault());

    this.backStart.ondragenter = () => this.onDragenterS?.();
    this.backStart.ondragleave = () => this.onDragleaveS?.();
    this.backStart.ondrop = () => this.onDropS?.();
    this.backStart.addEventListener('dragover', (event) => event.preventDefault());

    this.item.ondragstart = () => this.onDragstart?.();
    this.item.ondragend = () => this.onDragend?.();
  }
}
