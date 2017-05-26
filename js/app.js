const getCrossword = document.querySelector('#crossword');
const increaseBtn = document.querySelector('#rowPlus');
const decreaseBtn = document.querySelector('#rowMinus');
const allIds = [];
const maxSize = 12;
const minSize = 4;
let allCells;
let rowSize = 6;
let gridinit = 1;
let orientation;
let counter = 0;


//-----------Multiuse functions --------------------------------------------------------------------------
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

function updateAllCells(){
    allCells = document.querySelectorAll('.cell');
}


function removeClasses(cell, $class){
        for (let i = 0; i < $class.length; i++){
            cell.classList.remove($class[i]);
        }
    }

function updateClass(cell, newClass){
        cell.classList.add(newClass);
        // cell.classList += ` ${counter}-${orientation}`;
        if(newClass == 'cross-point'){
            cell.style.backgroundColor = '#e4e4e4';
        }
    }

//-----------Generate grid --------------------------------------------------------------------------
function generateGrid(){
    for (let i=1; i<rowSize + 1; i++){
            getCrossword.innerHTML += `<div id="r-${i}" class="_row"></div>`;
        }
        makeCells();
        updateAllCells();
    }


//-----------Change grid size --------------------------------------------------------------------------
function increaseGridSize(){
if (rowSize < maxSize){
        rowSize += 1;
        const addNewRow = getCrossword.insertAdjacentHTML('beforeend', 
        `<div id="r-${rowSize}" class="_row"></div>`);
        for (let i=1; i<rowSize; i++){
        let getRow = document.querySelector('#r-' + i);
            getRow.insertAdjacentHTML('beforeend', 
            `<div class="cell-wrapper">
            <input type="text" maxlength="1" id="$i}.${rowSize}" class="cell row-${i} col-${rowSize}" /></div>`);
        };
        makeCells();
        updateAllCells();
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
        updateAllCells();
    }

    if(!allIds.length == 0){
        let sp = allIds[allIds.length - 1].split(".");
        let lastRow = sp[1];
        let lastCol = sp[0];
        if ((rowSize > minSize) && (lastCol < rowSize) && (lastRow < rowSize)){
            decreaseSize();
        }else if(rowSize > minSize){
            console.log('PROMPT: reducing size would delete clues');
        }else if (rowSize <= minSize){
            console.log('PROMPT: min size is currently set at 4');
        }
    }else if(rowSize <= minSize){
        console.log('PROMPT: min size is currently set at 4');
    }else{
        decreaseSize();
    }
}

function resetGrid(){
    let getCells = document.querySelectorAll('.cell');
        for (cell of getCells){
            cell.disabled = false;
        }
    initWordId = [];
}



//-----------Listeners --------------------------------------------------------------------------
increaseBtn.addEventListener('click', increaseGridSize, false);
decreaseBtn.addEventListener('click', decreaseGridSize, false);


//-----------run APP --------------------------------------------------------------------------
generateGrid();