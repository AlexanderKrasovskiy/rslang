import { createElement } from './helpers/renderHelpers';

export class MainView {
  mainDiv;

  constructor(mainDiv: HTMLElement) {
    this.mainDiv = mainDiv;
  }

  render() {
    this.mainDiv.innerHTML = `<div id="index-banner" class="parallax-container valign-wrapper top-img-lang">
    <div class="section no-pad-bot">
      <div class="container">
        <br><br>
        <h2 class="header center white-text h2-lang">English train</h2>
        <div class="row center">
          <h5 class="header light h5-lang">Твой друг в мире английского языка</h5>
        </div>
        <br><br>
      </div>
    </div>
       <div class="parallax"><img src="assets/images/train.jpg" alt="train" class = "img-parallax"></div>
  </div>

  <div class="container">
    <div class="section">
     <div class="row">
      <div class="col s12">
        <h4 class = "center">О приложении</h4>
        <p class="center main-text-lang">
        <span class = "about-app-phrase1">Можно ли выучить английский, играя? Да, легко! <br></span>
        <span class = "about-app-phrase3">Преимущества - с нами быстро, просто, весело<br></span>
        <span class = "about-app-phrase4">Всего 15 минут в день и ты заговоришь, как носитель<br></span>
        <span class = "about-app-phrase2">Осторожно! Вызывает привыкание<br></span>
        </p>

      <div class = " about-app-wrap">
        <div class="about-app-wrap__small">
          <div class = "card about-app-book">
           <div class="about-app-title-btn">
             <div class="about-app-title">Учебник</div>
             <div id = "book" ></div>
           </div>

             <ul class="ul-main">
               <li class="grey-text text-darken-2 list-lang"> более 3,5 тысяч часто употребляемых слов</li>
               <li class="grey-text text-darken-2 list-lang"> разделы по уровню сложности</li>
               <li class="grey-text text-darken-2 list-lang"> удобная навигация</li>
               <li class="grey-text text-darken-2 list-lang"> озвучка, картинка-ассоциация, примеры</li>
               <li class="grey-text text-darken-2 list-lang"> персональный раздел для сложных слов</li>
             </ul>

          </div>

          <div class = "card about-app-stat">
           <div class="about-app-title-btn">
             <div class="about-app-title">Статистика</div>
             <div id = "stat" ></div>
           </div>
             <ul class="">
               <li class="grey-text text-darken-2 list-lang"> даёт возможность оценить прогресс в учёбе</li>
               <li class="grey-text text-darken-2 list-lang"> мотивирует тебя идти вперед и не останавливаться</li>
             </ul>
           </div>
        </div>

        <div class = "card about-app-games">
        <div class="about-app-title-btn">
          <div class="about-app-title about-app-title_games">Игры</div>
        </div>
          <ul class="">
            <li class="grey-text text-darken-2 list-lang"> Спринт - поможет запомнить слова, научит мгновенно переводить</li>
            <li class="grey-text text-darken-2 list-lang"> Аудиовызов - разовьет твои навыки аудирования</li>
            <li class="grey-text text-darken-2 list-lang"> Фразы - научит использовать слова в контексте предложения</li>
          </ul>
        <div id = "games" class = "main-games"></div>
       </div>

      </div>
      </div>
      </div>
      </div>
      </div>

  <div class="parallax-container valign-wrapper">
    <div class="section no-pad-bot">
      <div class="container">
        <div class="row center">
          <h5 class="header light h5-lang">Твой друг в мире английского языка</h5>
        </div>
      </div>
    </div>
    <div class="parallax"><img src="assets/images/big-ben-2.jpg" alt="big ben" class = "img-parallax"></div>
  </div>

  <div class="container">
    <div class="section">

      <div class="row">
      <h4 class="center">О нас</h4>
        <div class="col s12 m4">
          <div class="icon-block">
            <h2 class="center avatar-wrap"><div class="alexander"></div></h2>
            <h5 class="center main-github">Саша
              <a href="https://github.com/AlexanderKrasovskiy" class = "main-github__link">
                <div class="main-github__image"></div>
              </a>
            </h5>
            <div class="lang_team_tags">
              <div class="chip">Teamlead</div>
              <div class="chip">Frontend</div>
            </div>
            <p class="light team-info">Разработчик. Создал архитектуру приложения.
            Разработал роутинг, страницы входа и регистрации, авторизацию пользователей с автопродлением.
            Собрал статистику со всего проекта и объединил её на странице статистики.
            Сделал часть методов API.
            </p>
          </div>
        </div>

        <div class="col s12 m4">
          <div class="icon-block">
            <h2 class="center avatar-wrap avatar-wrap-alla"><div class="alla"></div></h2>
            <h5 class="center main-github">Алла
              <a href="https://github.com/ALLaTk" class = "main-github__link">
                <div class="main-github__image"></div>
              </a>
            </h5>
            <div class="lang_team_tags">
              <div class="chip">Backend</div>
              <div class="chip">Frontend</div>
            </div>
            <p class="light team-info">Разработчик. Обеспечила команду данными: полностью настроила бэк-энд и победила API.
            Разработала две игры с анимацией и звуковым оформлением: "Спринт" для тех, кто хочет попробовать себя
            в скорости угадывания слов и "Аудиовызов" для тренировки звукового восприятия. </p>
            </div>
        </div>

        <div class="col s12 m4">
          <div class="icon-block">
            <h2 class="center avatar-wrap"><div class="svetlana"></div></h2>
            <h5 class="center main-github">Светлана
              <a href="https://github.com/Svt1108" class = "main-github__link">
                <div class="main-github__image"></div>
              </a>
            </h5>
            <div class="lang_team_tags">
              <div class="chip">Design</div>
              <div class="chip">Frontend</div>
            </div>
            <p class="light team-info">Разработчик и по совместительству дизайнер проекта. Сделала главную страницу,
            панель навигации, учебник со всеми 3600 словами и разноцветными страничками, а также бонусную игру "Фразы",
            в которой можно потренироваться подбирать слова к нужному контексту.</p>
            </div>
        </div>
      </div>

    </div>
  </div>

  <div class="parallax-container valign-wrapper">
    <div class="section no-pad-bot">
      <div class="container">
        <div class="row center">
          <h5 class="header light h5-lang">Твой друг в мире английского языка</h5>
        </div>
      </div>
    </div>
    <div class="parallax"><img src="assets/images/castle.jpg" alt="castle" class = "img-parallax"></div>
  </div>`;

    const games = document.getElementById('games') as HTMLElement;

    const game0 = createElement('a', 'games-btn main-btn z-depth-2 waves-effect waves-teal') as HTMLAnchorElement;
    game0.href = `#sprint`;
    games.appendChild(game0);
    const game0Title = createElement('div', 'game-title', ' ');
    game0.appendChild(game0Title);
    const game0Picture = createElement('div', 'game-picture btn-sprint');
    game0.appendChild(game0Picture);

    const game1 = createElement('a', 'games-btn main-btn z-depth-2 waves-effect waves-teal') as HTMLAnchorElement;
    game1.href = `#audio`;
    games.appendChild(game1);
    const game1Title = createElement('div', 'game-title', ' ');
    game1.appendChild(game1Title);
    const game1Picture = createElement('div', 'game-picture btn-audio');
    game1.appendChild(game1Picture);

    const game2 = createElement('a', 'games-btn main-btn z-depth-2 waves-effect waves-teal') as HTMLAnchorElement;
    game2.href = `#phrase`;
    games.appendChild(game2);
    const game2Title = createElement('div', 'game-title', ' ');
    game2.appendChild(game2Title);
    const game2Picture = createElement('div', 'game-picture btn-collection');
    game2.appendChild(game2Picture);

    const book = document.getElementById('book') as HTMLElement;

    const book0 = createElement('a', 'games-btn main-btn z-depth-2 waves-effect waves-teal') as HTMLAnchorElement;
    book0.href = `#book`;
    book.appendChild(book0);
    const book0Title = createElement('div', 'game-title', ' ');
    book0.appendChild(book0Title);
    const book0Picture = createElement('div', 'game-picture btn-book');
    book0.appendChild(book0Picture);

    const stat = document.getElementById('stat') as HTMLElement;

    const stat0 = createElement('a', 'games-btn main-btn z-depth-2 waves-effect waves-teal') as HTMLAnchorElement;
    stat0.href = `#stats`;
    stat.appendChild(stat0);
    const stat0Title = createElement('div', 'game-title', ' ');
    stat0.appendChild(stat0Title);
    const stat0Picture = createElement('div', 'game-picture btn-stat');
    stat0.appendChild(stat0Picture);
  }
}
