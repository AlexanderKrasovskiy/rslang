import { MainView } from '../view/MainView';

export class MainController {
  mainDiv;
  view;

  constructor(mainDiv: HTMLElement) {
    this.mainDiv = mainDiv;

    this.view = new MainView(mainDiv);
  }

  show() {
    this.view.render();
  }
}
