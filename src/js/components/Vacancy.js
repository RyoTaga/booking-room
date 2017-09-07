import $ from 'jquery';
import _ from 'lodash';

export default class Vacancy {
  constructor() {
    this.vacancyList = [];
  }
  getVacancyRoom(data, year, month, date) {
    const formatedDate = `${year}/${month}/${date}`;
    const vacancies = data.vacancy[formatedDate];
    Object.keys(vacancies).forEach((vacancy) => {
      if (vacancies[vacancy]) {
        this.vacancyList.push(vacancy);
      }
    });
    return this.vacancyList;
  }
}