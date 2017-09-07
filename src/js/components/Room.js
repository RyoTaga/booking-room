import $ from 'jquery';
import _ from 'lodash';

export default class Room {
  constructor() {
    this.typeList = [];
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
  getRoomType(data) {
    const type = this.checkRadioValue('type');
    const rooms = data.rooms;
    Object.keys(rooms).forEach((room) => {
      if (rooms[room] === type) {
        this.typeList.push(room);
      }
    });
    return this.typeList;
  }
}