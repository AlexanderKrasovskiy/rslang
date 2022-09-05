import { createElement } from './renderHelpers';

class Loader {
  header?: HTMLElement | null;
  loader = createElement('div', 'progress');

  public show() {
    this.header?.append(this.loader);
  }

  public hide() {
    this.loader.remove();
  }

  public init() {
    this.header = document.querySelector('.header-lang');
    this.loader.innerHTML = '<div class="indeterminate"></div>';
  }
}

export const loaderInstance = new Loader();
