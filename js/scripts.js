var getCrossword = document.querySelector('#crossword');
var reduceRows = document.querySelector('#rowMinus');
let cluebox = document.querySelector('.cluebox');
let rowSize = 6;
let gridinit = 1;
let orientation;
let counter = 0;
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
var allCells = document.querySelectorAll('.crossBox');


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
        allCells = document.querySelectorAll('.crossBox');
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
        allCells = document.querySelectorAll('.crossBox');
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
        validateCrossword(id);
        };
   };
    el.stopPropagation();
    for (let id of initWordId){
        var el = document.getElementById(id);
        if (!el.className.includes('selected')){
            initWordId.pop(id);
            };
        };
    initWordId.sort();
    word_length(initWordId);
    check_gaps(initWordId);
    if(initWordId.length <= 1){
        let getCells = document.querySelectorAll('.crossBox');
        for (cell of getCells){
            cell.disabled = false;
        };
        if (initWordId.length == 1){
        validateCrossword(initWordId[0]);
        };
    };   
}



function validateCrossword(id){
    var selectedIdRef = id.split(".");
    var col = selectedIdRef[0];
    var row = selectedIdRef[1];
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
    let getLetters = document.querySelectorAll('.selected');
    let clue = '';
    for (let cell of allCells){
            cell.disabled = true;
        };
    for (let letter of getLetters){
        clue += letter.value.toLowerCase();
        letter.style.background = 'white';  
    };
    addWordBtn.disabled = true;
    let insertClue = document.querySelector('#insertClue');
    insertClue.textContent = clue;
    counter += 1;
    let insertLocation = document.querySelector('#insertLocation');
    insertLocation.textContent = counter + " " + orientation;
    cluebox.style.display = 'block';
    makeClue(clue);
    
});


//4bi. check word length and return false if too short
function word_length(ids){
    if (ids.length < 2){
        addWordBtn.disabled = true;
    }else{
        addWordBtn.disabled = false;
    };
};


//4bii. make sure there are no gaps in words and return false if there is
function check_gaps(ids){
    let col_list = [];
    let row_list = [];
    let fail, row, column;
    for (id of ids){
        let splitId = id.split(".");
        col_list.push(parseInt(splitId[0]));
        row_list.push(parseInt(splitId[1]));
    };
    for (let i=col_list.length - 1; i > 0; i--){
        let j = i - 1;
        if (col_list[i] - col_list[j] > 1){
            fail = true;
        }else if (row_list[i] - row_list[j] > 1){
            fail = true;
        }else if (col_list[i] - col_list[j] == 0){
            row = true;
        }else if (row_list[i] - row_list[j] == 0){
            column = true;
        };
    };
    if(fail){
        addWordBtn.disabled = true;
    }else if(row){
        orientation = 'across';
    }else if(column){
        orientation = 'down';
    };

}
//5a. make clue
function makeClue(clue){
    console.log(clue);
}

//5b. confirm clue
let confirmClueBtn = document.querySelector('#confirmClue');
confirmClueBtn.addEventListener('click', function(){  
    let initLetterId = document.getElementById(initWordId[0]);
    for (let letter of initWordId){
        let getCell = document.getElementById(letter)
        getCell.classList += ` savedWord ${counter}-${orientation}`
        getCell.classList.remove('selected');
    };
    initLetterId.insertAdjacentHTML('beforeBegin', 
            `<div class="number-wrapper">${counter}</div>`);
    let getClueList = document.getElementById(`${orientation}`);
    let getFormInput = document.getElementById('clueEntry').value;
    cluebox.style.display = 'none';
    if (counter == 1){
        let clueListBlock = document.querySelector('#clueList');
        clueListBlock.style.display = 'block';
    };
    getClueList.insertAdjacentHTML('afterEnd', 
            `<p>${counter}: ${getFormInput}</p>`);
    console.log(getFormInput);
});

//5c. cancel clue
let cancelClueBtn = document.querySelector('#cancelClue');
cancelClueBtn.addEventListener('click', function(){  
    cluebox.style.display = 'none';
    insertClue = '';
    insertLocation ='';
});





