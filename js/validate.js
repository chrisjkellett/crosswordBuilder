var getCrossword = document.querySelector('#crossword');
var getBoxes = document.querySelectorAll('.crossBox');
var reduceRows = document.querySelector('#rowMinus');
var listBox = [];
let rowSize = 6;
let gridinit = 1;
const maxSize = 10;
const minSize = 4;

//generates grid
function generateGrid(rowSize){
    for (var i=1; i<rowSize + 1; i++){
            getCrossword.innerHTML += `<div id="r-${i}" class="crossRow"></div>`;
        };
        makeCells(rowSize);
    };
generateGrid(rowSize);


function makeCells(rowSize){
    for (var i=gridinit; i<rowSize + 1; i++){
        var getRow = document.querySelector('#r-' + i);
        gridinit = rowSize + 1;
        for (var j=1; j<rowSize + 1; j++){
            getRow.innerHTML += `<div class="cell-wrapper">
            <input type="text" maxlength="1" id="${i}.${j}" class="crossBox crossFont" /></div>`;
            };
        };
}

function addToColumns(rowSize){
    for (var j=1; j<rowSize; j++){
        var getRow = document.querySelector('#r-' + j);
            getRow.insertAdjacentHTML('beforeend', 
            `<div class="cell-wrapper">
            <input type="text" maxlength="1" id="${j}.${rowSize}" class="crossBox crossFont" /></div>`);
        };
}


//increase grid rowSize
var addRows = document.querySelector('#rowPlus');
addRows.addEventListener('click', function(){
    if (rowSize < maxSize){
        rowSize += 1;
        var addNewRow = getCrossword.insertAdjacentHTML('beforeend', `<div id="r-${rowSize}" class="crossRow"></div>`);
        makeCells(rowSize);
        addToColumns(rowSize);
        for (var i=0; i<initWordId.length; i++){
            validateCrossword(initWordId[i]);
        };
    };
});

//decrease grid size
var minusRows = document.querySelector('#rowMinus');
minusRows.addEventListener('click', function(){
    if (rowSize > minSize){
        var row = document.querySelector('#r-' + (rowSize - 1));
        row.nextElementSibling.remove();
        for (var j=1; j<rowSize; j++){
            var row = document.querySelector('#r-' + j);
            row.lastElementChild.remove();
        };
        rowSize -= 1;
        gridinit -=1;
    };
});


//adds listener to children of getCrossword
initWordId = [];
getCrossword.addEventListener('keyup', getBox, false);
function getBox(el) {
    if (el.target !== el.currentTarget) {
        var clickedItem = el.target;
        if (!clickedItem.className.includes('selected')){
            clickedItem.className += ' selected';
        };
        if(clickedItem.value == '' && clickedItem.className.includes('selected')){
            clickedItem.classList.remove('selected'); 
        };
        id = el.target.id;
        if (!initWordId.includes(id)){
        initWordId.push(id);
        validateCrossword(el.target.id);
        }
   };
    el.stopPropagation();
}

function validateCrossword(id){
    var selectedIdRef = id.split(".");
    var col = selectedIdRef[0];
    var row = selectedIdRef[1];
    console.log(col, row);
    var allCells = document.querySelectorAll('.crossBox');
    for(cell of allCells){
        var loopIdRef = cell.id.split(".");
        var loopCol = loopIdRef[0];
        var loopRow = loopIdRef[1];
        if (!(row == loopRow || col == loopCol)){
            cell.disabled = true;
        };
    };
}


//adds box ids to list
for (box of getBoxes){
    boxId = parseFloat(box.id);
    if (boxId){
        listBox.push(boxId);
    }; 
};


