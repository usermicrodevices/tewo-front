/* eslint class-methods-use-this: "off" */

import { computed } from 'mobx';
import localStorage from 'mobx-localstorage';

const MENU_OPEN_STORAGE_KEY = 'is_menu_open';

class Menu {
  @computed get isOpen() {
    return !localStorage.getItem(MENU_OPEN_STORAGE_KEY);
  }

  set isOpen(val) {
    localStorage.setItem(MENU_OPEN_STORAGE_KEY, !val);
  }

  @computed get mode() { return this.isOpen ? 'inline' : 'vertical'; }
}

export default Menu;
