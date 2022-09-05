import { UserData } from '../types/loginTypes';
import { createElement } from './helpers/renderHelpers';
import {
  createHeading,
  createParagraphWithLink,
  createLoginFormContent,
  createRegistryFormContent,
} from './helpers/loginRenderHelpers';

export class LoginView {
  mainDiv;
  form?: HTMLFormElement;
  handleSignIn?: (mail: string, pass: string) => Promise<void>;
  handleCreateUser?: (obj: UserData) => Promise<void>;

  constructor(mainDiv: HTMLElement) {
    this.mainDiv = mainDiv;
  }

  public renderLogin() {
    const loginPageDiv = createElement('div', 'lang_login');
    const imgContainer = createElement('div', 'lang_login_img_container lang_door');
    const formContainer = createElement('div', 'lang_login_form_container');
    loginPageDiv.append(imgContainer, formContainer);

    const heading = createHeading('Уже с нами?', 'Войди в аккаунт!');
    const row = createElement('div', 'row');
    const linkText = createParagraphWithLink('register', 'Впервые тут?', 'Зарегистрируйся!');
    formContainer.append(heading, row, linkText);

    this.form = createElement('form', 'col lang_login_form') as HTMLFormElement;
    const formContent = createLoginFormContent();
    this.form.append(formContent);
    row.append(this.form);

    this.form.onsubmit = (e) => this.handleLogin(e);

    this.mainDiv.innerHTML = '';
    this.mainDiv.append(loginPageDiv);
  }

  private async handleLogin(e: Event) {
    e.preventDefault();
    const formData = new FormData(this.form);

    const mail = formData.get('mail');
    const pass = formData.get('pass');

    await this.handleSignIn?.(`${mail}`, `${pass}`);
  }

  public showToast(text: string) {
    M.toast({ html: text });
  }

  public renderRegistry() {
    const registryPageDiv = createElement('div', 'lang_login');
    const imgContainer = createElement('div', 'lang_login_img_container lang_telephone');
    const formContainer = createElement('div', 'lang_login_form_container');
    registryPageDiv.append(imgContainer, formContainer);

    const heading = createHeading('Впервые тут?', 'Зарегистрируйся!');
    const row = createElement('div', 'row');
    const linkText = createParagraphWithLink('login', 'Уже с нами?', 'Войди в аккаунт!');
    formContainer.append(heading, row, linkText);

    this.form = createElement('form', 'col lang_login_form') as HTMLFormElement;
    const formContent = createRegistryFormContent();
    this.form.append(formContent);
    row.append(this.form);

    this.form.onsubmit = (e) => this.handleRegistry(e);

    this.mainDiv.innerHTML = '';
    this.mainDiv.append(registryPageDiv);
  }

  private async handleRegistry(e: Event) {
    e.preventDefault();
    const formData = new FormData(this.form);

    const name = formData.get('name') || 'Аноним';
    const mail = formData.get('mail');
    const pass1 = formData.get('pass_1');
    const pass2 = formData.get('pass_2');

    if (pass1 !== pass2) {
      this.showToast('Пароли должны совпадать');
    } else {
      await this.handleCreateUser?.({
        name: `${name}`,
        mail: `${mail}`,
        pass: `${pass1}`,
      });
    }
  }
}
