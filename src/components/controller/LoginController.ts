import { UserData, LoginData } from '../types/loginTypes';
import { LoginView } from '../view/LoginView';
import { LoginModel } from '../model/LoginModel';
import { loaderInstance } from '../view/helpers/Loader';

export class LoginController {
  view;
  model;
  loader = loaderInstance;

  constructor(mainDiv: HTMLElement) {
    this.view = new LoginView(mainDiv);
    this.model = new LoginModel();

    this.view.handleSignIn = this.handleSignIn.bind(this);
    this.view.handleCreateUser = this.handleCreateUser.bind(this);
  }

  public show(route: 'login' | 'register') {
    if (route === 'login') {
      this.view.renderLogin();
    } else {
      this.view.renderRegistry();
    }
  }

  private async handleSignIn(mail: string, pass: string) {
    this.loader.show();
    const res = await this.model.sendSignIn(mail, pass);

    if (res.data) {
      this.model.saveLoginData(res.data, mail);
      window.location.hash = 'main';
      this.view.showToast('Успешный вход в аккаунт :)');
    } else {
      this.view.showToast('Неверный логин/пароль :(');
      this.loader.hide();
    }
  }

  private async handleCreateUser(user: UserData) {
    this.loader.show();
    const res = await this.model.sendCreateUser(user);

    if (res.data) {
      this.view.showToast('Успешная регистрация :)');
      await this.handleSignIn(user.mail, user.pass);
    } else {
      this.view.showToast('Этот E-mail уже зарегистрирован');
      this.loader.hide();
    }
  }

  public async updateLoginStatus() {
    const userJSON = localStorage.getItem('user');

    if (!userJSON) return { logged: false, kicked: false };

    const user = JSON.parse(`${userJSON}`) as LoginData;
    const { loginTime } = user;
    const hoursPassed = (Date.now() - loginTime) / 1000 / 60 / 60;

    if (hoursPassed < 2.4) return { logged: true, kicked: false };

    if (hoursPassed < 4.4) {
      const { data } = await this.model.sendTokenRefresh(user);
      this.model.updateLoginData(user, data);
      this.view.showToast('ТОКЕН обновлен ;)');
      return {
        logged: true,
        kicked: false,
      };
    }

    localStorage.removeItem('user');
    this.view.showToast('Сервер нас забыл :( Пора зайти по-новой ;)');
    return {
      logged: false,
      kicked: true,
    };
  }
}
