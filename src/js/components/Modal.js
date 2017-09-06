import $ from 'jquery';

export default class Modal {
  constructor() {
    this.overlay = document.getElementById('modalOverlay');
    this.$cancel = $('.modalClose');
    this.target = '';
  }

  showOverlay() {
    this.overlay.classList.add('is-active');
  }

  hideOverlay() {
    this.overlay.classList.remove('is-active');
  }

  showModal(modalName) {
    this.showOverlay();
    this.target = document.getElementById(modalName);
    this.target.classList.add('is-active');
  }

  hideModal(modalName) {
    this.target = document.getElementById(modalName);
    this.target.classList.remove('is-active');
    this.hideOverlay();
  }
  closeEvents() {
    this.overlay.addEventListener('click', event => this.closeModal(event), false);
    this.$cancel.on('click', () => this.closeModal());
  }
  closeModal() {
    this.hideOverlay();
    $('.modal.is-active').removeClass('is-active');
  }
}
