const getCrossword = document.querySelector('#crossword');
const reduceRows = document.querySelector('#rowMinus');
const cluebox = document.querySelector('.cluebox');
const answers = [];
const maxSize = 10;
const minSize = 4;
let rowSize = 6;
let gridinit = 1;
let orientation;
let counter = 0;


//generates grid
function generateGrid(rowSize){
    for (let i=1; i<rowSize + 1; i++){
            getCrossword.innerHTML += `<div id="r-${i}" class="crossRow"></div>`;
        };
        makeCells(rowSize);
    };
generateGrid(rowSize);
let allCells = document.querySelectorAll('.crossBox');


function makeCells(rowSize){
    for (let i=gridinit; i<rowSize + 1; i++){
        let getRow = document.querySelector('#r-' + i);
        gridinit = rowSize + 1;
        for (let j=1; j<rowSize + 1; j++){
            getRow.innerHTML += `<div class="cell-wrapper">
            <input type="text" maxlength="1" id="${i}.${j}" class="crossBox crossFont" /></div>`;
            };
        };
}

function addToColumns(rowSize){
    for (let j=1; j<rowSize; j++){
        let getRow = document.querySelector('#r-' + j);
            getRow.insertAdjacentHTML('beforeend', 
            `<div class="cell-wrapper">
            <input type="text" maxlength="1" id="${j}.${rowSize}" class="crossBox crossFont" /></div>`);
        };
}


//increase grid rowSize
const addRows = document.querySelector('#rowPlus');
addRows.addEventListener('click', function(){
    if (rowSize < maxSize){
        rowSize += 1;
        let addNewRow = getCrossword.insertAdjacentHTML('beforeend', `<div id="r-${rowSize}" class="crossRow"></div>`);
        makeCells(rowSize);
        addToColumns(rowSize);
        allCells = document.querySelectorAll('.crossBox');
        for (let i=0; i<initWordId.length; i++){
            validateCrossword(initWordId[i]);
        };
    };
});

//decrease grid size
const minusRows = document.querySelector('#rowMinus');
minusRows.addEventListener('click', function(){
    if (rowSize > minSize){
        let row = document.querySelector('#r-' + (rowSize - 1));
        row.nextElementSibling.remove();
        for (let j=1; j<rowSize; j++){
            let row = document.querySelector('#r-' + j);
            row.lastElementChild.remove();
        };
        allCells = document.querySelectorAll('.crossBox');
        rowSize -= 1;
        gridinit -=1;
    };
});


function validateLoop(initWordId){
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

//adds listener to children of getCrossword
let initWordId = [];
getCrossword.addEventListener('keyup', getBox, false);
function getBox(el) {
    if (el.target !== el.currentTarget) {
        let clickedItem = el.target;
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
        let el = document.getElementById(id);
        if (!el.className.includes('selected')){
            initWordId.pop(id);
            };
        };
    initWordId.sort();
    word_length(initWordId);
    check_gaps(initWordId);
    validateLoop(initWordId);
    //validatedeadCells
}

getCrossword.addEventListener('click', getSavedBox, false);
function getSavedBox(el) {
    let clickedItem = el.target;
    let id = el.target.id;
    if (clickedItem.className.includes('savedWord') && !(clickedItem.className.includes('selected')) && initWordId.length == 0){
        clickedItem.className += ' selected';
        initWordId.push(id);
    }else if(clickedItem.className.includes('selected')){
        clickedItem.classList.remove('selected');
        initWordId.pop(id);
        };
    el.stopPropagation();
    validateLoop(initWordId);
    }


function validateCrossword(id){
    let selectedIdRef = id.split(".");
    let col = selectedIdRef[0];
    let row = selectedIdRef[1];
    for(cell of allCells){
        let loopIdRef = cell.id.split(".");
        let loopCol = loopIdRef[0];
        let loopRow = loopIdRef[1];
        if (!(row == loopRow || col == loopCol) || cell.className.includes('dead')){
            cell.disabled = true;
        };
    };
}

//F1. check word length and return false if too short
function word_length(ids){
    if (ids.length < 2){
        addWordBtn.disabled = true;
    }else{
        addWordBtn.disabled = false;
    };
};


//F2. make sure there are no gaps in words and return false if there is
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

//F.reset grid
function resetGrid(){
    //i. enable all cells except savedWord
    let getCells = document.querySelectorAll('.crossBox');
        for (cell of getCells){
            cell.disabled = false;
        };
    initWordId = [];
}



//3. add/initialise clue
const addWordBtn = document.querySelector('#addWord');
addWordBtn.addEventListener('click', function(){
    //i get all cells with clue
    let getLetters = document.querySelectorAll('.selected');

    //ii. init clue variable
    let clue = '';

    //iii.disable everything
    for (let cell of allCells){
            cell.disabled = true;
        };
    addWordBtn.disabled = true;

    //iv.change style for clue cells
    for (let letter of getLetters){
        clue += letter.value.toLowerCase();
        letter.style.background = 'white';  
    };

    //v. increase counter if required
    if (!document.getElementById(initWordId[0]).previousElementSibling){
        counter += 1;
    };

    //vi. insert clue into clueBox
    let insertClue = document.querySelector('#insertClue');
    insertClue.textContent = clue;
    let insertLocation = document.querySelector('#insertLocation');
    insertLocation.textContent = counter + " " + orientation;

    //vii. show clueBox
    cluebox.style.display = 'block';

    //viii.push clue to answer list
    answers.push(clue);
});



//4. confirm clue and add to clueList
let confirmClueBtn = document.querySelector('#confirmClue');
confirmClueBtn.addEventListener('click', function(){
    //i. adds and removes classes  
    let initLetterId = document.getElementById(initWordId[0]);
    for (let letter of initWordId){
        let getCell = document.getElementById(letter);
        getCell.classList += ` savedWord ${counter}-${orientation}`;
        getCell.classList.remove('selected');
        getCell.classList.remove('crossBox');
    };

    //ia. remove crossBox for deadCells
    let x = initWordId.length;
    let lastCell = document.getElementById(initWordId[x - 1]);
    if(orientation == 'across' && x != rowSize){
        let row = initWordId[0][0];
        let lastCellId = row + "." + rowSize;
        let checkLastCell = document.getElementById(lastCellId);
        if (checkLastCell.value == ""){
            let deadCell = lastCell.parentElement.nextElementSibling.firstElementChild;
            deadCell.classList.remove('crossBox');
            deadCell.classList += ' deadCell';
        };
    };

    //ii. adds number to firstLetter
    initLetterId.insertAdjacentHTML('beforeBegin', 
            `<div class="number-wrapper">${counter}</div>`);

    //iii. adds clues to clueList
    let getClueList = document.getElementById(`${orientation}`);
    const getInput = document.getElementById('clueEntry');
    let getInputVal = getInput.value;
    cluebox.style.display = 'none';
    getInput.value = '';    
    if (counter == 1){
        let clueListBlock = document.querySelector('#clueList');
        clueListBlock.style.display = 'block';
    };
    el = document.createElement('p');
    el.className = 'font-clue';
    el.textContent = `${counter}. ${getInputVal}`;
    console.log(el);
    getClueList.appendChild(el);

    //iv. resets grid for next clue
    resetGrid();
});


//5b. cancel clue
let cancelClueBtn = document.querySelector('#cancelClue');
cancelClueBtn.addEventListener('click', function(){  
    cluebox.style.display = 'none';
    insertClue = '';
    insertLocation ='';
});





