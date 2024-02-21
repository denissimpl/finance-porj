
let status = true

burger.onclick = function () {
    if (status) {
        status = false
        burger.style.opacity = 0
        menu.style.top = "80px";
        setTimeout(() => {
            menu.style.zIndex = 1
            burger.style.display = "none"
            cross.style.display = "block"
            setTimeout(() => {
                cross.style.opacity = 1
                status = true
            }, 0);
        }, 300);
    }
}

cross.onclick = function () {
    if (status) {
        status = false
        cross.style.opacity = 0;
        menu.style.zIndex = -1
        menu.style.top = "0px";
        setTimeout(() => {
            cross.style.display = "none"
            burger.style.display = "block"
            setTimeout(() => {
                burger.style.opacity = 1
                status = true
            }, 0);
        }, 300);
    }
}