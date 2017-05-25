const getCrossword = document.querySelector('#crossword');
const increaseBtn = document.querySelector('#rowPlus');
const decreaseBtn = document.querySelector('#rowMinus');
const allIds = [];
const maxSize = 12;
const minSize = 4;
let rowSize = 6;
let gridinit = 1;
let orientation;
let counter = 0;

//-----------Multiuse functions ----------------------------------
function makeCells(){
    for (let i=gridinit; i<rowSize + 1; i++){
        let getRow = document.querySelector('#r-' + i);
        gridinit = rowSize + 1;
        for (let j=1; j<rowSize + 1; j++){
            getRow.innerHTML += `<div class="cell-wrapper">
            <input type="text" maxlength="1" id="${i}.${j}" class="cell row-${i} col-${j}" /></div>`;
            }
        }
}


//-----------Generate grid ----------------------------------
function generateGrid(){
    for (let i=1; i<rowSize + 1; i++){
            getCrossword.innerHTML += `<div id="r-${i}" class="crossRow"></div>`;
        }
        makeCells();
    }

generateGrid();


//-----------Change grid size ----------------------------------
function increaseGridSize(){
if (rowSize < maxSize){
        rowSize += 1;
        let addNewRow = getCrossword.insertAdjacentHTML('beforeend', 
        `<div id="r-${rowSize}" class="crossRow"></div>`);
        for (let i=1; i<rowSize; i++){
        let getRow = document.querySelector('#r-' + i);
            getRow.insertAdjacentHTML('beforeend', 
            `<div class="cell-wrapper">
            <input type="text" maxlength="1" id="$i}.${rowSize}" class="cell row-${i} col-${rowSize}" /></div>`);
        };
        makeCells();
    }
}

function decreaseGridSize(){
    function decreaseSize(){
        let row = document.querySelector('#r-' + (rowSize - 1));
        row.nextElementSibling.remove();
        for (let i=1; i<rowSize; i++){
            let row = document.querySelector('#r-' + i);
            row.lastElementChild.remove();
        }
        rowSize -= 1;
        gridinit -=1;
    }

    if(!allIds.length == 0){
        let $sp = allIds[allIds.length - 1].split(".");
        let lastRow = $sp[1];
        let lastCol = $sp[0];
        if ((rowSize > minSize) && (lastCol < rowSize) && (lastRow < rowSize)){
            decreaseSize();
        }else if(rowSize > minSize){
            console.log('reducing size would delete clues');
        }else if (rowSize <= minSize){
            console.log('min size is currently set at 4');
        }
    }else if(rowSize <= minSize){
        console.log('min size is currently set at 4');
    }else{
        decreaseSize();
    }
}




//-----------Listeners ----------------------------------
increaseBtn.addEventListener('click', () => {
    increaseGridSize();
});

decreaseBtn.addEventListener('click', () => {
    decreaseGridSize();
});

