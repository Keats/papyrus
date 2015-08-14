import Papyrus from "./editor";


export default Papyrus;

// test for now, make it nicer later
const div = document.getElementById("editor");
const editor = new Papyrus(div);
console.log(editor);
