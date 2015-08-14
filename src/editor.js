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

    this.insertInitialParagraph();
    this.bindEvents();
  }

  bindEvents() {
    this.on("keydown", this.onKeyDown.bind(this));

    // We listen on the document to catch mouseups outside
    // of the editor since the user could have started it inside
    // Note: there is a bug where clicking in a selection would not update
    // the range. Setting a timeout of 0 fixes it
    this.onDocument("mouseup", () => {
      setTimeout(this.onMouseUp.bind(this), 0);
    });
  }

  // So by default we have a contenteditable div but we
  // don't want to write in the div directly so we put
  // a p with a br inside so the user will click
  insertInitialParagraph() {
    this.element.innerHTML = "<p><br></p>";
    const range = document.createRange();
    const selection = document.getSelection();
    const p = this.element.getElementsByTagName("p")[0];
    range.setStart(p, 0);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  onMouseUp() {
    const selection = new Selection(this.element);
    // It could be empty, aka collapsed, have only empty
    // string in it or be completely outside of the editor
    if (selection.isEmpty() || selection.isOutsideContentEditable()) {
      this.toolbar.hide();
      return;
    }

    this.toolbar.show(selection);
  }

  // 2 types of possible events: normal typing and shortcuts.
  // We assume it's a shortcut if meta/ctrl is pressed
  // TODO: handle escape on url toolbar
  onKeyDown(event) {
    // This is pretty much only there to prevent us from removing
    // the first paragraph
    if (event.which === KEY_CODES.Backspace) {
      // This is a bit ugly but works in firefox/chrome.
      // Will need to be tested in IE/safari
      if (this.element.innerHTML === "<p><br></p>") {
        event.preventDefault();
        return;
      }
    }

    // And now let's have a look for shortcuts
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
