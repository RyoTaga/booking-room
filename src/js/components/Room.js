import $ from 'jquery';
import _ from 'lodash';
import Modal from './Modal';

export default class Room {
  constructor() {
    this.dataUrl = '../data/data.json';
    this.data = {};
    this.type = [];
    this.avalable = [];
    this.calendar = document.querySelectorAll('.calendar-date');
    this.roomDate = document.getElementById('roomDate');
    this.checkBtn = document.getElementById('checkVacancy');
    this.avalableList = document.getElementById('avalableList');
    this.submit = document.getElementById('submit');
    this.form = document.getElementById('form');
    this.year = '';
    this.month = '';
    this.date = '';
    this.modal = new Modal();
  }

  init() {
    this.bindEvents();
    this.closeModal();
  }

  bindEvents() {
    document.addEventListener('DOMContentLoaded', () => this.getRoomData(), false);
    document.addEventListener('DOMContentLoaded', () => this.setRoomModalEvent(), false);
    this.checkBtn.addEventListener('click', event => this.showRoomList(event), false);
    this.submit.addEventListener('click', () => this.submitAvalableRoom(), false);
  }

  getRoomData() {
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

  closeModal() {
    this.modal.closeEvents();
    this.submit.classList.remove('is-active');
  }
  setRoomModalEvent() {
    const calendarDate = document.querySelectorAll('.calendar-date');
    [...calendarDate].forEach(element => element.addEventListener('click', event => this.showRoomModal(event), false));
  }

  showRoomModal(event) {
    event.preventDefault();
    this.modal.showModal('modal');
    this.setRoomModaleTitle(event);
  }

  setRoomModaleTitle(event) {
    this.year = event.target.getAttribute('data-year');
    this.month = event.target.getAttribute('data-month');
    this.date = event.target.getAttribute('data-date');
    this.roomDate.textContent = `${this.year}年${this.month}月${this.date}日`;
  }

  showRoomList() {
    const type = this.getRoomType();
    const vacancy = this.getVacancyRoom();
    this.getAvalableRooms(type, vacancy);
  }

  checkRadioValue(name) {
    const radios = document.getElementsByName(name);
    let value = '';
    radios.forEach((radio) => {
      if (radio.checked) {
        value = radio.getAttribute('data-value');
      }
    });
    return value;
  }
  getRoomType() {
    const typeList = [];
    const type = this.checkRadioValue('type');
    const rooms = this.data.rooms;
    Object.keys(rooms).forEach((room) => {
      if (rooms[room] === type) {
        typeList.push(room);
      }
    });
    return typeList;
  }

  getVacancyRoom() {
    const vacancyList = [];
    const formatedDate = `${this.year}/${this.month}/${this.date}`;
    const vacancies = this.data.vacancy[formatedDate];
    Object.keys(vacancies).forEach((vacancy) => {
      if (vacancies[vacancy]) {
        vacancyList.push(vacancy);
      }
    });
    return vacancyList;
  }

  getAvalableRooms(type, vacancy) {
    console.log(`${type}`);
    console.log(`${vacancy}`);
    this.avalable = _.intersection(type, vacancy);
    console.log(this.avalable);
    this.avalableList.innerHTML = this.createAvalableList(this.avalable);
    this.submit.classList.add('is-active');
  }

  createAvalableList(list) {
    let str = '';
    list.forEach((room) => {
      str += `<li><input type="radio" name="room" value="${room}" data-value="${room}" id="room-${room}"><label for="room-${room}">${room}</label></li>`;
    });
    return str;
  }

  submitAvalableRoom() {
    const date = `${this.year}/${this.month}/${this.date}`;
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;
    const type = this.checkRadioValue('type');
    const room = this.checkRadioValue('room');
    console.log(`date: ${date}`);
    console.log(`name: ${name}`);
    console.log(`comment: ${comment}`);
    console.log(`type: ${type}`);
    console.log(`room: ${room}`);
  }
}