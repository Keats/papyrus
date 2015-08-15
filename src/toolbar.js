import { EventHandler } from "./events";
import { BUTTONS } from "./utils";


export default class Toolbar extends EventHandler {
  constructor(editorId, options) {
    super();
    this.options = options;
    this.selection = null;
    // TODO: check if we actually need the id
    this.element = this.createToolbar(editorId);
    this.bindEvents();
  }

  // This is responsible for creating and adding the toolbar
  // to the DOM.
  // Returns the element so we can bind events on it
  createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = this.options.className;
    toolbar.style.visibility = "hidden";

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = `${this.options.className}__buttons`;

    this.options.buttons.map((button) => {
      const buttonElement = document.createElement("button");
      buttonElement.innerHTML = button.innerHTML;
      buttonElement.dataset.action = button.name;
      buttonsContainer.appendChild(buttonElement);
    });

    toolbar.appendChild(buttonsContainer);
    document.body.appendChild(toolbar);
    return toolbar;
  }

  _positionToolbar() {
    // Reset the whole thing
    this.element.style.position = "absolute";
    this.element.style.left = 0;
    this.element.style.top = 0;

    const boundary = this.selection.range.getBoundingClientRect();
    const middleOfBoundary = (boundary.left + boundary.right) / 2;
    const middleOfToolbar = this.element.offsetWidth / 2;
    const toolbarHeight = this.element.offsetHeight;

    // diffTop represents how many pixels above/below the selection the toolbar is
    const diffTop = 10;
    let top = window.pageYOffset;
    // If there's no space for the toolbar above, we chuck it below
    if (boundary.top < (toolbarHeight + diffTop)) {
      top += boundary.bottom + diffTop;
      this.element.classList.add(`${this.options.className}--below`);
    } else {
      top += boundary.top - toolbarHeight - diffTop;
      this.element.classList.add(`${this.options.className}--above`);
    }

    // Now onto the X axis, same thing
    let left = 0;
    if (middleOfBoundary > middleOfToolbar) {
      left = middleOfBoundary - middleOfToolbar;
    }
    this.element.style.top = `${top}px`;
    this.element.style.left = `${left}px`;
  }

  show(selection) {
    this.selection = selection;
    this._positionToolbar();
    this.element.style.visibility = "visible";
    this.element.classList.add(`${this.options.className}--active`);
  }

  hide() {
    this.selection = null;
    this.element.style.visibility = "hidden";
    this.element.classList.remove(`${this.options.className}--active`);
    this.element.classList.remove(`${this.options.className}--below`);
    this.element.classList.remove(`${this.options.className}--above`);
  }

  bindEvents() {
    this.on("click", this.onClick.bind(this));
  }

  onClick(event) {
    // will need to change for the url form obviously
    switch (event.target.dataset.action) {
      case BUTTONS.italic:
        document.execCommand("italic", false, null);
        break;
      case BUTTONS.bold:
        document.execCommand("bold", false, null);
        break;
      case BUTTONS.h3:
        if (this.selection.isInHeader()) {
          document.execCommand("formatBlock", false, "p");
        } else {
          document.execCommand("formatBlock", false, "h3");
        }
        break;
      default:
        return;
    }
    this.selection.refresh();
  }

  destroy() {
    this.unbindEvents();
  }
}
