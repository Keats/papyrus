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

  show(selection) {
    this.selection = selection;
    this.element.style.visibility = "visible";
    this.element.classList.add(`${this.options.className}--active`);
  }

  hide() {
    this.selection = null;
    this.element.style.visibility = "hidden";
    this.element.classList.remove(`${this.options.className}--active`);
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
