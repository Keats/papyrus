import { EventHandler, KEY_CODES } from "./events";
import { BUTTONS } from "./utils";
import Toolbar from "./toolbar";
import Selection from "./selection";


const defaultOptions = {
  toolbar: {
    className: "papyrus-toolbar",
    buttons: [
      {name: BUTTONS.bold, innerHTML: "b"},
      {name: BUTTONS.italic, innerHTML: "i"},
      {name: BUTTONS.h3, innerHTML: "h3"},
    ],
  },
};

export default class Editor extends EventHandler {
  constructor(element) {
    super();
    this.element = element;
    this.options = defaultOptions;
    // A bit roundabout way to figure out how many instances there are
    this.id = document.querySelectorAll(`.${this.options.toolbar.className}`).length;
    this.toolbar = new Toolbar(this.id, this.options.toolbar);
    this.bindEvents();
  }

  bindEvents() {
    this.on("keydown", this.onKeyDown.bind(this));

    // There is a bug where clicking in a selection would not update
    // the range. Setting a timeout of 0 fixes it
    this.on("mouseup", () => {
      setTimeout(this.onMouseUp.bind(this), 0);
    });
  }

  onMouseUp() {
    const selection = new Selection(this.element);
    // It could be empty, aka collapsed or have only empty
    // string in it
    if (selection.isEmpty()) {
      this.toolbar.hide();
      return;
    }

    this.toolbar.show(selection);
  }

  // 2 types of possible events: normal typing and shortcuts.
  // We assume it's a shortcut if meta/ctrl is pressed
  // TODO: handle escape on url toolbar
  onKeyDown(event) {
    const isControlPressed = event.metaKey || event.ctrlKey;
    if (!isControlPressed) {
      return;
    }

    switch (event.which) {
      case KEY_CODES.B:
        event.preventDefault();
        document.execCommand("bold", false, null);
        break;
      case KEY_CODES.I:
        event.preventDefault();
        document.execCommand("italic", false, null);
        break;
      case KEY_CODES.U:
        event.preventDefault();
        break;
      default:
        return;
    }
  }

  // Removes all the events handlers associated with this editor
  destroy() {
    this.unbindEvents();
  }
}
