
const gridParent = document.querySelector("#gridParent");


document.querySelector("body").ondragstart = () => false;
window.mouseDown = false;
document.onmousedown = () => { window.mouseDown = true };
document.onmouseup = () => { window.mouseDown = false };
let globalSize;
let noBlockedLeft;
let globalPercolates;


function start(nSize) {
    noBlockedLeft = false;
    globalSize = nSize;
    globalPercolates = false;
    const randomNums = document.querySelector("#randomNums");
    const displayRandNums = document.querySelector("#displayRandomNums");
    randomNums.setAttribute("max", nSize**2 + "");
    randomNums.value = "1";
    randomNums.addEventListener("input", () => {
        displayRandNums.innerText = randomNums.value;
    });

    const grid = document.createElement("div");
    grid.id = "grid";
    gridParent.appendChild(grid);

    const perc = new Percolation(nSize);
    let num;
    for (let i = 0; i < nSize * nSize; i++) {
        const gridSquare = document.createElement("div");
        gridSquare.classList.add("square");
        gridSquare.classList.add("blocked");
        gridSquare.style.width = (100 / nSize) + "%";
        gridSquare.style.height = (100 / nSize) + "%";
        gridSquare.id = i + "";
        grid.appendChild(gridSquare);
    }

    const [...allSquares] = document.querySelectorAll(".square");

    let row;
    let col;

    for (let square of allSquares) {
        for (let eve of ["mouseover", "click", "mousedown"]) {
            square.addEventListener(eve, e => {
                if (window.mouseDown || e.type === "click" || e.type === "mousedown") {
                    square.classList.remove("blocked");
                    square.classList.add("open");
                    row = Math.floor(+square.id / nSize) + 1;
                    col = +square.id % nSize + 1;
                    perc.open(row, col);
                    document.querySelector("#numOpen").innerText = perc.numberOfOpen + " squares opened";
                    randomNums.setAttribute("max", ((nSize**2) - perc.numberOfOpen) + "");
                    if (perc.numberOfOpen === nSize**2) {
                        noBlockedLeft = true;
                        displayRandNums.innerText = "0";
                        randomNums.value = "0";
                    }

                    if (perc.percolates) {
                        globalPercolates = true;
                        document.querySelector("#percolates").innerText = "Percolation at: " + (num + 1);
                    }
                    else {
                        document.querySelector("#percolates").innerText = "Does not percolates";
                        num = perc.numberOfOpen;
                    }

                    for (let check of allSquares) {
                        row = Math.floor(+check.id / nSize) + 1;
                        col = +check.id % nSize + 1;
                        if (perc.isFull(row, col)) {
                            check.classList.add("full");
                        }
                    }
                }
            });
        }
    }
}



const slider = document.querySelector("#slider");
const sliderNum = document.querySelector("#sliderNum");
const submitSlider = document.querySelector("#submitSlider");

slider.addEventListener("input", () => {
    sliderNum.innerHTML = slider.value;
});

submitSlider.addEventListener("click", () => {
    grid.parentElement.removeChild(grid);
    document.querySelector("#percolates").innerText = "Does not percolates";
    document.querySelector("#numOpen").innerText = "0 squares opened"
   start(slider.value);
});

const randomNums = document.querySelector("#randomNums");
const randomCoordinate = document.querySelector("#randomCoordinate");
randomCoordinate.addEventListener("click", () => {
    if (!noBlockedLeft) {
        let rand;
        let randomSquare;
        let repeat = +randomNums.value;
        let openTimeout = setInterval( () => {
                randomNums.value = repeat + "";
                document.querySelector("#displayRandomNums").innerText = repeat + "";
                rand = Math.floor(Math.random() * (globalSize**2));
                randomSquare = document.getElementById("" + rand);
                while (!randomSquare.classList.contains("blocked")) {
                    rand = Math.floor(Math.random() * (globalSize**2));
                    randomSquare = document.getElementById("" + rand);
                }
                randomSquare.click();
                repeat--;
            if (repeat < 1) clearInterval(openTimeout);
            }, 100);
        }
    }
);

const untilPercolates = document.querySelector("#untilPercolates");

untilPercolates.addEventListener("click", () => {
        if (!noBlockedLeft && !globalPercolates) {
            let rand;
            let randomSquare;
            let openTimeout = setInterval( () => {
                rand = Math.floor(Math.random() * (globalSize**2));
                randomSquare = document.getElementById("" + rand);
                while (!randomSquare.classList.contains("blocked")) {
                    rand = Math.floor(Math.random() * (globalSize**2));
                    randomSquare = document.getElementById("" + rand);
                }
                randomSquare.click();
                if (globalPercolates) clearInterval(openTimeout);
            }, 100);
        }
    }
);


start(slider.value);
