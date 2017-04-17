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
            getRow.innerHTML += `<input type="text" maxlength="1" id="${i}.${j}" class="crossBox crossFont" />`;
            };
        };
}

function addToColumns(rowSize){
    for (var j=1; j<rowSize; j++){
        var getRow = document.querySelector('#r-' + j);
            getRow.insertAdjacentHTML('beforeend', 
            `<input type="text" maxlength="1" id="${rowSize}.${j}" class="crossBox crossFont" />`);
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
    };
    console.log('rowSize = ' + rowSize);
    console.log('gridinit = ' + gridinit);
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
    
    console.log('rowSize = ' + rowSize);
    console.log('gridinit = ' + gridinit);
});


//adds listener to children of getCrossword
getCrossword.addEventListener('click', getBox, false);
function getBox(el) {
    if (el.target !== el.currentTarget) {
        var clickedItem = el.target;
        console.log(el.target.id);
    }
    el.stopPropagation();
}


//adds box ids to list
for (box of getBoxes){
    boxId = parseFloat(box.id);
    if (boxId){
        listBox.push(boxId);
    }; 
};


