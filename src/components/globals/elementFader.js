export default function fade(elem,step,toEnd,toBegin = []) {
    elem.style.opacity = String(parseFloat(elem.style.opacity) + step);
    if (elem.style.opacity > 1 || elem.style.opacity < 0) {
        for (var id of toEnd) {
            clearInterval(id);
        }
        for (var func of toBegin) {
            func();
        }
        return;
    }
}