const maxSize = 12;
const minSize = 4;
let rowSize = 6;
let orientation;
let counter = 0;

//generate cells
function makeCells(){
    let gridinit = 1;
    for (let i=gridinit; i<rowSize + 1; i++){
        let getRow = document.querySelector('#r-' + i);
        gridinit = rowSize + 1;
        for (let j=1; j<rowSize + 1; j++){
            getRow.innerHTML += `<div class="cell-wrapper">
            <input type="text" maxlength="1" id="${i}.${j}" class="cell row-${i} col-${j}" /></div>`;
            }
        }
}

//1. generate grid with cells
function generateGrid(){
    const getCrossword = document.querySelector('#crossword');
    for (let i=1; i<rowSize + 1; i++){
            getCrossword.innerHTML += `<div id="r-${i}" class="crossRow"></div>`;
        }
        makeCells();
    }

generateGrid();




