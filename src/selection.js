
// See https://developer.mozilla.org/en-US/docs/Web/API/Selection
// for complete docs on the selection object
// TODO: see if we need a class or if a basic function is enough
export default class Selection {
  constructor(container) {
    this.container = container;
    this.refresh();
  }

  refresh() {
    this.selection = document.getSelection();
    this.range = null;
    if (this.selection.rangeCount === 0) {
      return;
    }
    this.range = this.selection.getRangeAt(0);
  }

  isEmpty() {
    if (this.range === null) {
      return true;
    }
    return this.selection.toString().trim() === "";
  }

  isInHeader() {
    const tagName = this.range.commonAncestorContainer.parentNode.tagName;
    console.log(tagName);
    return ["h1", "h2", "h3", "h4", "h5", "h6"].indexOf(tagName.toLowerCase()) > -1;
  }

  // Since we listen to the whole document, we need
  // to figure out if our selection is actually in contenteditable
  isOutsideContentEditable() {
    let parentNode = this.range.commonAncestorContainer;

    while (parentNode !== null) {
      if (parentNode === this.container) {
        return false;
      }
      // whoa
      parentNode = parentNode.parentNode;
    }

    return true;
  }
}

