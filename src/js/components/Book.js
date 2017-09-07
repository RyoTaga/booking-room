import $ from 'jquery';
import _ from 'lodash';
import Modal from './Modal';
import Vacancy from './Vacancy';
import Room from './Room';

export default class Book {
  constructor() {
    this.dataUrl = '../data/data.json';
    this.data = {};
    this.type = [];
    this.avalable = [];
    this.bookInfo = {};
    this.calendar = document.querySelectorAll('.calendar-date');
    this.roomDate = document.getElementById('roomDate');
    this.checkBtn = document.getElementById('checkVacancy');
    this.avalableList = document.getElementById('avalableList');
    this.name = document.getElementById('name');
    this.comment = document.getElementById('comment');
    this.submit = document.getElementById('submit');
    this.overlay = document.getElementById('modalOverlay');
    this.year = '';
    this.month = '';
    this.date = '';
    this.modal = new Modal();
    this.vacancy = new Vacancy();
    this.room = new Room();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('DOMContentLoaded', () => this.getData(), false);
    document.addEventListener('DOMContentLoaded', () => this.setModalEvent(), false);
    this.checkBtn.addEventListener('click', event => this.showAvalableList(event), false);
    this.submit.addEventListener('click', () => this.submitBookInfo(), false);
    this.overlay.addEventListener('click', () => this.deleteCanceledInfo(), false);
  }

  getData() {
    $.ajax({
      type: 'GET',
      url: this.dataUrl,
      dataType: 'json',
    })
    .then((data) => {
      this.data = data;
    })
    .catch(() => {
      console.log('fail');
    });
  }

  setModalEvent() {
    const calendarDate = document.querySelectorAll('.calendar-date');
    [...calendarDate].forEach(element => element.addEventListener('click', event => this.showBookModal(event), false));
    this.modal.closeEvents();
  }

  showBookModal(event) {
    event.preventDefault();
    this.modal.showModal('modal');
    this.setModaleTitle(event);
  }

  setModaleTitle(event) {
    this.year = event.target.getAttribute('data-year');
    this.month = event.target.getAttribute('data-month');
    this.date = event.target.getAttribute('data-date');
    this.roomDate.textContent = `${this.year}年${this.month}月${this.date}日`;
  }

  showAvalableList() {
    const type = this.room.getRoomType(this.data);
    const vacancy = this.vacancy.getVacancyRoom(this.data, this.year, this.month, this.date);
    this.getAvalableRooms(type, vacancy);
  }

  getAvalableRooms(type, vacancy) {
    console.log(`${type}`);
    console.log(`${vacancy}`);
    this.avalable = _.intersection(type, vacancy);
    console.log(this.avalable);
    if (this.avalable.length) {
      this.avalableList.innerHTML = this.createAvalableList(this.avalable);
      this.submit.classList.add('is-active');
    } else {
      this.avalableList.innerHTML = '<li>条件に合う部屋は空いていません。</li>';
    }
  }

  createAvalableList(list) {
    let html = '';
    list.forEach((room) => {
      html += `<li><input type="radio" name="room" value="${room}" data-value="${room}" id="room-${room}"><label for="room-${room}">${room}</label></li>`;
    });
    return html;
  }

  submitBookInfo() {
    if (this.name.value === '') {
      alert('名前を入力してください');
      return false;
    }
    const room = this.room.checkRadioValue('room');
    if (room === '') {
      alert('部屋を選択してください');
      return false;
    }
    this.bookInfo.date = `${this.year}/${this.month}/${this.date}`;
    this.bookInfo.name = this.name.value;
    this.bookInfo.comment = this.comment.value;
    this.bookInfo.type = this.room.checkRadioValue('type');
    this.bookInfo.room = room;
    console.log(this.bookInfo);
    return this.bookInfo;
  }

  deleteCanceledInfo() {
    this.submit.classList.remove('is-active');
    this.avalableList.innerHTML = '';
    this.name.value = '';
    this.comment.value = '';
  }
}