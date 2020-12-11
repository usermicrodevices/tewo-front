/* eslint class-methods-use-this: off */

import { computed, action } from 'mobx';
import localStorage from 'mobx-localstorage';

const MENU_OPEN_STORAGE_KEY = 'is_menu_open';

class Menu {
  @computed get isOpen() {
    return !localStorage.getItem(MENU_OPEN_STORAGE_KEY);
  }

  set isOpen(val) {
    localStorage.setItem(MENU_OPEN_STORAGE_KEY, !val);
  }

  @action.bound open() {
    this.isOpen = true;
  }

  @action.bound close() {
    this.isOpen = false;
  }
}

export default Menu;
