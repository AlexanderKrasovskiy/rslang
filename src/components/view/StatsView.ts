import { BarChart, LineChart, easings } from 'chartist';
import {
  createTopImg,
  createTodayStats,
  createMidImg,
  createLongStats,
  createBottomImg,
  createScrollSpy,
} from './helpers/statRenderHelpers';
import { Stats, SortedStatsArr } from '../types/statsTypes';

export class StatView {
  mainDiv;

  constructor(mainDiv: HTMLElement) {
    this.mainDiv = mainDiv;
  }

  public render(stats: Stats) {
    // Render_Page
    const topImg = createTopImg();
    const todayStats = createTodayStats(stats);
    const midImg = createMidImg();
    const longStats = createLongStats();
    const bottomImg = createBottomImg();
    const scrollSpy = createScrollSpy();

    this.mainDiv.innerHTML = '';
    this.mainDiv.append(topImg, todayStats, midImg, longStats, bottomImg, scrollSpy);

    // Handle_Graphs
    const sortedLongStats = this.sortLongStatsToArr(stats);

    const labels = this.makeLabels(sortedLongStats);
    const labelsToShow = this.generateLabelIdsToShow(labels);

    const barGraphData = this.makeBarGraphData(sortedLongStats); // New Words
    const lineGraphData = this.makeLineGraphData(sortedLongStats); // Learned

    this.activateBarChart(labels, barGraphData, labelsToShow);
    this.activateLineChart(labels, lineGraphData, labelsToShow);
  }

  private sortLongStatsToArr(stats: Stats) {
    const { long } = stats.optional;
    const entriesLong = Object.entries(long);

    function dateToNum(date: string) {
      const dateArr = date.split('.');
      const day = Number(dateArr[0]);
      const month = Number(dateArr[1]);
      const year = Number(dateArr[2]);
      return year * 12 * 31 + month * 31 + day;
    }

    entriesLong.sort((a, b) => dateToNum(a[0]) - dateToNum(b[0]));
    return entriesLong;
  }

  private makeLabels(sortedLongStats: SortedStatsArr) {
    function normalizeDate(date: string) {
      const dateArr = date.split('.');
      const day = dateArr[0].length > 1 ? dateArr[0] : `0${dateArr[0]}`;
      const month = dateArr[1].length > 1 ? dateArr[1] : `0${dateArr[1]}`;
      dateArr[0] = day;
      dateArr[1] = month;
      return dateArr.join('.');
    }

    const labels = sortedLongStats.map((e) => normalizeDate(e[0]));
    return labels;
  }

  private makeBarGraphData(sortedLongStats: SortedStatsArr) {
    const newWordsArr = sortedLongStats.map((e) => e[1].newWords);
    return newWordsArr;
  }

  private makeLineGraphData(sortedLongStats: SortedStatsArr) {
    const learnedArr = sortedLongStats.map((e) => e[1].learnedWords);

    const progressArr: number[] = [];
    learnedArr.forEach((e, i) => {
      if (i === 0) {
        progressArr.push(e);
      } else {
        progressArr.push(e + (progressArr.at(-1) as number));
      }
    });
    return progressArr;
  }

  private generateLabelIdsToShow(labels: string[]) {
    const MAX_LABELS = 7;
    const len = labels.length;

    if (len <= MAX_LABELS)
      return Array(len)
        .fill(0)
        .map((_, i) => i);

    const step = Math.ceil(len / MAX_LABELS);
    return labels.map((_, i) => (i % step === 0 ? i : '')).filter((e) => e !== '') as number[];
  }

  private activateBarChart(labels: string[], dataArr: number[], labelsToShow: number[]) {
    // eslint-disable-next-line no-new
    new BarChart(
      '#stats_bar_chart',
      {
        labels,
        series: dataArr,
      },
      {
        distributeSeries: true,
        chartPadding: {
          right: 50,
        },
        axisX: {
          labelInterpolationFnc: (value, index) => (labelsToShow.includes(index) ? value : null),
        },
      },
    );
  }

  private activateLineChart(labels: string[], dataArr: number[], labelsToShow: number[]) {
    const chart = new LineChart(
      '#stats_line_chart',
      {
        labels,
        series: [dataArr],
      },
      {
        fullWidth: true,
        chartPadding: {
          right: 50,
        },
        axisX: {
          labelInterpolationFnc: (value, index) => (labelsToShow.includes(index) ? value : null),
        },
        // low: 0,
      },
    );

    // Line Animation
    let seq = 0;

    chart.on('created', () => {
      seq = 0;
    });

    chart.on('draw', (data) => {
      if (data.type === 'point') {
        data.element.animate({
          opacity: {
            begin: (seq += 1 * 80),
            dur: 500,
            from: 0,
            to: 1,
          },
          x1: {
            begin: (seq += 1 * 80),
            dur: 500,
            from: data.x - 100,
            to: data.x,
            easing: easings.easeOutQuart,
          },
        });
      }
    });

    let timerId: NodeJS.Timeout;

    chart.on('created', () => {
      if (timerId) {
        clearTimeout(timerId);
      }

      timerId = setTimeout(chart.update.bind(chart), 8000);
    });
  }
}
