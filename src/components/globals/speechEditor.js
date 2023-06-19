import globalVariables from './globalVariables';

export default function spit(elem,id,text = "") {
    if (text == "") {
        if (!globalVariables.dotting) {
            var newLength;
            if (elem.innerHTML.length < 50) {
                newLength = elem.innerHTML.length - 1;
            } else if (elem.innerHTML.length < 100) {
                newLength = elem.innerHTML.length - 2;
            } else {
                newLength = elem.innerHTML.length - 4;
            }
            elem.innerHTML = elem.innerHTML.substring(0,newLength);
            if (elem.innerHTML == "") globalVariables.dotting = true;
        } else {
            if (globalVariables.dotDelay == 40) {
                globalVariables.dotDelay = 0;
                switch (elem.innerHTML) {
                    case "":
                        elem.innerHTML = ".";
                        break;
                    case ".":
                        elem.innerHTML = ". .";
                        break;
                    case ". .":
                        elem.innerHTML = ". . .";
                        break;
                    case ". . .":
                        elem.innerHTML = ".";
                        break;
                }
            } else globalVariables.dotDelay ++;
        }
    } else {
        elem.innerHTML = text.substring(0,elem.innerHTML.length + 1);
        if (elem.innerHTML == text) {
            clearInterval(id);
        }
    }
}