var getCrossword = document.querySelector('#crossword');
var getBoxes = document.querySelectorAll('.crossBox');
var reduceRows = document.querySelector('#rowMinus');
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
var initWordId = [];
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
        if (!initWordId.includes(id) && el.target.className.includes('selected')){
        initWordId.push(id);
        validateCrossword(el.target.id);
        }
   };
    el.stopPropagation();
    for (let id of initWordId){
        var el = document.getElementById(id);
        if (!el.className.includes('selected')){
            initWordId.pop(id);
            };
        };
    initWordId.sort();
    console.log(initWordId);
}



function validateCrossword(id){
    var selectedIdRef = id.split(".");
    console.log(selectedIdRef);
    var col = selectedIdRef[0];
    var row = selectedIdRef[1];
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


//4a. add word button listener
var addWordBtn = document.querySelector('#addWord');
addWordBtn.addEventListener('click', function(){
    word_length(initWordId);
    if (len_test){
        console.log('passed length test');
    }else{
        console.log('failed length test');
    };
});


//4bi. check word length and return false if too short
function word_length(ids){
    if (ids.length < 2){
        len_test = false;
    }else{
        len_test = true;
    };
};


//4bii. make sure there are no gaps in words and return false if there is
function validateWord_gaps(ids){
    var col_list = [];
    var row_list = [];
    for (id of ids){
        var splitId = id.split(".");
        col_list.push(parseInt(splitId[0]));
        row_list.push(parseInt(splitId[1]));
    };
    console.log("column:" + col_list + ", row: " + row_list);
    for (var i=col_list.length - 1; i > 0; i--){
        var j = i - 1;
        if (col_list[i] - col_list[j] > 1){
            console.log("failed validation as col_list greater than 1");
        }else if (row_list[i] - row_list[j] > 1){
            console.log("failed validation as row_list greater than 1");
        }else if (col_list[i] - col_list[j] == 0){
            console.log("set up clue for row");
        }else if (row_list[i] - row_list[j] == 0){
            console.log("set up clue for col");
        };
    };
}



