import { createElement } from './renderHelpers';
import { Stats } from '../../types/statsTypes';

export const createTopImg = () => {
  const div = createElement('div', 'parallax-container valign-wrapper top-img-stat', '', 'index-banner');

  div.innerHTML = `
  <div class="section no-pad-bot ">
    <div class="container">
      <h4 class="header center white-text h4-lang">Статистика за сегодня</h4>
    </div>
  </div>

  <div class="parallax">
    <img src="assets/images/stat/circles-1.jpg" alt="circles" class = "img-parallax">
  </div>
  `;

  return div;
};

export const createTodayStats = (stats: Stats) => {
  const div = createElement('div', 'container scrollspy', '', 'day-stat');

  const { today, long, dateToday } = stats.optional;
  const { sprint, audio, phrase } = today;

  const sprintPercent = `${Math.round((sprint.wins / sprint.total) * 100) || 0}%`;
  const audioPercent = `${Math.round((audio.wins / audio.total) * 100) || 0}%`;
  const phrasePercent = `${Math.round((phrase.wins / phrase.total) * 100) || 0}%`;

  const totalWins = sprint.wins + audio.wins + phrase.wins;
  const totalGames = sprint.total + audio.total + phrase.total;
  const totalPercent = `${Math.round((totalWins / totalGames) * 100) || 0}%`;

  const totalNewWords = long[dateToday].newWords;
  const totalLearnedWords = long[dateToday].learnedWords;

  div.innerHTML = `
  <div class="center stat-day-wrap section-stat">
    <div class = "card z-depth-2 center stat-day">

      <div class="stat_card stat_card_total">
        <div class="stat_card_heading">
          <span class="stat_card_img"><div class="game-picture stat_btn-total"></div></span>
          <span class="stat_card_title">Итого по словам</span>
        </div>
        <div class="stats_list">
          <div class="stat_text_container"><span>Изученных слов</span><span class="stat_num orange-text text-darken-3">${totalLearnedWords}</span></div>
          <div class="stat_text_container"><span>Новых слов</span><span class="stat_num">${totalNewWords}</span></div>
          <div class="stat_text_container"><span>Правильных ответов</span><span class="stat_num">${totalPercent}</span></div>
        </div>
      </div>
      <div class="stat_card">
        <div class="stat_card_heading">
          <span class="stat_card_img"><div class="game-picture btn-sprint"></div></span>
          <span class="stat_card_title">Спринт</span>
        </div>
        <div class="stats_list">
        <div class="stat_text_container"><span>Лучшая серия</span><span class="stat_num light-green-text text-darken-3">${sprint.bestSeries}</span></div>
        <div class="stat_text_container"><span>Новых слов</span><span class="stat_num">${sprint.newWords}</span></div>
        <div class="stat_text_container"><span>Правильных ответов</span><span class="stat_num">${sprintPercent}</span></div>
        </div>
      </div>
      <div class="stat_card">
        <div class="stat_card_heading">
          <span class="stat_card_img"><div class="game-picture btn-audio"></div></span>
          <span class="stat_card_title">Аудио-Вызов</span>
        </div>
        <div class="stats_list">
        <div class="stat_text_container"><span>Лучшая серия</span><span class="stat_num light-green-text text-darken-3">${audio.bestSeries}</span></div>
          <div class="stat_text_container"><span>Новых слов</span><span class="stat_num">${audio.newWords}</span></div>
          <div class="stat_text_container"><span>Правильных ответов</span><span class="stat_num">${audioPercent}</span></div>
        </div>
      </div>
      <div class="stat_card">
        <div class="stat_card_heading">
          <span class="stat_card_img"><div class="game-picture btn-collection"></div></span>
          <span class="stat_card_title">Фразы</span>
        </div>
        <div class="stats_list">
        <div class="stat_text_container"><span>Лучшая серия</span><span class="stat_num light-green-text text-darken-3">${phrase.bestSeries}</span></div>
          <div class="stat_text_container"><span>Новых слов</span><span class="stat_num">${phrase.newWords}</span></div>
          <div class="stat_text_container"><span>Правильных ответов</span><span class="stat_num">${phrasePercent}</span></div>
        </div>
      </div>
     
    </div>
  </div>
  `;

  return div;
};

export const createMidImg = () => {
  const div = createElement('div', 'parallax-container valign-wrapper center-img-stat');

  div.innerHTML = `
  <div class="section no-pad-bot">
    <div class="container">
      <div class="row center">
        <h4 class="header center white-text h4-lang">Статистика за все время</h4>
      </div>
    </div>
  </div>
  <div class="parallax">
    <img src="assets/images/stat/houses.jpg" alt="big ben" class = "img-parallax">
  </div>
  `;

  return div;
};

export const createLongStats = () => {
  const div = createElement('div', 'container scrollspy', '', 'all-stat');

  div.innerHTML = `
  <div class="center stat-day-wrap section-stat">
    <div class = "card z-depth-2 center stat-day">

      <div class="stats_charts_container">
        <h4 class="stat_long_heading">Новых (уникальных) слов по дням</h4>
        <div id="stats_bar_chart" class="stats_chart"></div>
        <h4 class="stat_long_heading">Всего изучено слов (прогресс)</h4>
        <div id="stats_line_chart" class="stats_chart"></div>
      </div>

    </div>
  </div>
  `;

  return div;
};

export const createBottomImg = () => {
  const div = createElement('div', 'parallax-container valign-wrapper');

  div.innerHTML = `
  <div class="section no-pad-bot">
    <div class="container">
      <div class="row center">
        <h5 class="header light h5-lang">А теперь на тренировку :)</h5>
      </div>
    </div>
  </div>
  <div class="parallax">
    <img src="assets/images/stat/hogwards.jpg" alt="castle" class = "img-parallax">
  </div>
  `;

  return div;
};

export const createScrollSpy = () => {
  const div = createElement('div', 'col m3 l2 scroll-stat');

  div.innerHTML = `
  <ul class="section table-of-contents">
    <li><a href="#day-stat">За сегодня</a></li>
    <li><a href="#all-stat">За все время</a></li>
  </ul>
  `;

  return div;
};
