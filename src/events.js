export const KEY_CODES = {
  Backspace: 8,
  Enter: 13,  // not used right now
  B: 66,
  I: 73,
  U: 85,
};


export class EventHandler {
  constructor() {
    this.events = [];
    this.documentEvents = [];
  }

  on(type, listener) {
    this.events.push({type, listener});
    this.element.addEventListener(type, listener, false);
  }

  onDocument(type, listener) {
    this.documentEvents.push({type, listener});
    document.documentElement.addEventListener(type, listener, false);
  }

  unbindEvents() {
    this.events.map((event) => {
      this.element.removeEventListener(event.type, event.listener, false);
    });

    this.documentEvents.map((event) => {
      document.documentElement.removeEventListener(event.type, event.listener, false);
    });
  }
}
