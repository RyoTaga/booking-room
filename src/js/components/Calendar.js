import $ from 'jquery';

export default class Calendar {
  constructor() {
    this.$title = $('#calendarTitle');
    this.$body = $('#calendarBody');
    this.date = new Date();
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('DOMContentLoaded', () => this.setCalendarTitle(), false);
    document.addEventListener('DOMContentLoaded', () => this.setCalenderBody(), false);
  }
  setCalendarTitle() {
    this.$title.text(`${this.year}年${this.month + 1}月`);
  }

  setCalenderBody() {
    const startDate = new Date(this.year, this.month, 1);
    const endDate = new Date(this.year, this.month + 1, 0);
    const startDay = startDate.getDay();
    const endDay = endDate.getDate();
    let blank = true;
    let count = 1;
    let body = '';
    for (let row = 0; row < 6; row += 1) {
      body += '<tr>';
      for (let col = 0; col < 7; col += 1) {
        if (row === 0 && startDay === col) {
          blank = false;
        }
        if (count > endDay) {
          blank = true;
        }
        const date = blank ? '&nbsp;' : count;
        if (!blank) {
          body += `<td><a href="#" class="calendar-date" data-year="${this.year}" data-month="${this.month + 1}" data-date="${date}">${date}</a></td>`;
          count += 1;
        } else {
          body += `<td><span>${date}</span></td>`;
        }
      }
      body += '</tr>';
    }
    this.$body.html(body);
  }
}
