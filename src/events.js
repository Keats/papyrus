export const KEY_CODES = {
  Backspace: 8,
  Enter: 13,
  B: 66,
  I: 73,
  U: 85,
};


export class EventHandler {
  constructor() {
    this.events = [];
  }

  on(type, listener) {
    this.events.push({type, listener});
    this.element.addEventListener(type, listener, false);
  }

  unbindEvents() {
    this.events.map((event) => {
      this.element.removeEventListener(event.type, event.listener);
    });
  }
}
