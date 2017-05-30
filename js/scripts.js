const getCrossword = document.querySelector('#crossword');
const reduceRows = document.querySelector('#rowMinus');
const cluebox = document.querySelector('.cluebox');
const addWordFromForm = document.querySelector('#addWordFromForm')
const answers = [];
const allIds = [];
const invalids = [];
const reverse_reinit = [];
let unselectables = [];
const maxSize = 9;
const minSize = 4;
let rowSize = 6;
let gridinit = 1;
let orientation;
let counter = 0;


// //generates grid
// function generateGrid(rowSize){
//     for (let i=1; i<rowSize + 1; i++){
//             getCrossword.innerHTML += `<div id="r-${i}" class="crossRow"></div>`;
//         };
//         makeCells(rowSize);
//     };
// generateGrid(rowSize);
// let allCells = document.querySelectorAll('.crossBox');


// function makeCells(rowSize){
//     for (let i=gridinit; i<rowSize + 1; i++){
//         let getRow = document.querySelector('#r-' + i);
//         gridinit = rowSize + 1;
//         for (let j=1; j<rowSize + 1; j++){
//             getRow.innerHTML += `<div class="cell-wrapper">
//             <input type="text" maxlength="1" id="${i}.${j}" class="crossBox row-${i} col-${j}" /></div>`;
//             };
//         };
// }

// function addToColumns(rowSize){
//     for (let j=1; j<rowSize; j++){
//         let getRow = document.querySelector('#r-' + j);
//             getRow.insertAdjacentHTML('beforeend', 
//             `<div class="cell-wrapper">
//             <input type="text" maxlength="1" id="${j}.${rowSize}" class="crossBox row-${j} col-${rowSize}" /></div>`);
//         };
// }

// function checkInvalids(){
//     for (id of invalids){
//         let deadCell = document.getElementById(id);
//         deadCell.classList.remove('crossBox');
//         deadCell.classList += ' deadCell';
//         deadCell.disabled = true;
//         // invalids.pop(id);
//     };
// }

// //increase grid rowSize
// const addRows = document.querySelector('#rowPlus');
// addRows.addEventListener('click', function(){
//     if (rowSize < maxSize){
//         rowSize += 1;
//         let addNewRow = getCrossword.insertAdjacentHTML('beforeend', `<div id="r-${rowSize}" class="crossRow"></div>`);
//         makeCells(rowSize);
//         addToColumns(rowSize);
//         allCells = document.querySelectorAll('.crossBox');
//         checkInvalids();
//         validateLoop(initWordId);
//         for (let i=0; i<initWordId.length; i++){
//             validateCrossword(initWordId[i]);
//         };
//         reactivateUnselectables(reverse_reinit);
//     };
// });

// //#F75 decrease grid size
// const minusRows = document.querySelector('#rowMinus');
// minusRows.addEventListener('click', function(){
//     if(!allIds.length === 0){
        
//     }

//     let lastRow = allIds[allIds.length - 1][2];
//     let lastCol = allIds[allIds.length - 1][0];
//     if (rowSize > minSize && lastCol < rowSize && lastRow < rowSize){
//         let row = document.querySelector('#r-' + (rowSize - 1));
//         row.nextElementSibling.remove();
//         for (let j=1; j<rowSize; j++){
//             let row = document.querySelector('#r-' + j);
//             row.lastElementChild.remove();
//         };
//         allCells = document.querySelectorAll('.crossBox');
//         rowSize -= 1;
//         gridinit -=1;
//         deactivateUnselectables(reverse_reinit);
//     }else if(rowSize > minSize){
//         console.log('reducing size would delete clues');
//     }else{
//         console.log('min size is currently set at 4');
//     };
// });

//#F100 validates crossword at points that are clues is initialised
function validateLoop(initWordId){
//clue has no letters in it - a. new clue | b. first letter deleted
if(initWordId.length <= 1){
        let getCells = document.querySelectorAll('.crossBox');
        for (cell of getCells){
            cell.disabled = false;
        };
        reactivateUnselectables(unselectables);
        unselectables = [];
        if (initWordId.length == 1){
        validateCrossword(initWordId[0]);
        };
        if (savedBoxList.length == 1){
            let splitter = savedBoxList[0].split(".");
            let col = splitter[1];
            let row = splitter[0];
            let el = document.getElementById(savedBoxList[0]);
            if(el.className.includes('across')){
                let els = document.querySelectorAll('.row-' + row);
                for (el of els){
                    if (el.className.includes('crossBox')){
                        el.disabled = true;
                    }else if(!el.className.includes('selected') && !(el.className.includes('deadCell'))){
                        el.classList += ' no-reinit';
                        el.style.backgroundColor = '#e4e4e4';
                        unselectables.push(el.id);
                    };
                };  
            }else{
                let els = document.querySelectorAll('.col-' + col);
                for (el of els){
                    if (el.className.includes('crossBox')){
                        el.disabled = true;
                      }else if(!el.className.includes('selected') && !(el.className.includes('deadCell'))){
                        el.classList += ' no-reinit';
                        el.style.backgroundColor = '#e4e4e4';
                        unselectables.push(el.id);
                    };
                };
            };
        };
    };
}

// //prevent caps and non-alphanumeric characters
// getCrossword.addEventListener('keypress', function(e){
//         //logs unicode equiv of character
//         let charCode = event.charCode;
//         if(charCode != 13){
//             if (charCode < 97 || charCode > 122) {
//                 e.preventDefault();
//                 console.log("illegal char found: ", charCode);
//                 };
//             };
//         }, false);


// //adds listener to children of getCrossword
// let initWordId = [];
// getCrossword.addEventListener('keyup', getBox, false);
// function getBox(event) {
//     if (event.target !== event.currentTarget) {
//         let clickedItem = event.target;
//         if (!clickedItem.className.includes('selected') ){
//             clickedItem.className += ' selected';
//         };
//         if(clickedItem.value == '' && clickedItem.className.includes('selected')){
//             clickedItem.classList.remove('selected'); 
//         };
//         let id = event.target.id;
//         if (!initWordId.includes(id) && event.target.className.includes('selected')){
//         initWordId.push(id);
//         initWordId.sort();
//         validateCrossword(id);
//         };
//    };
//     event.stopPropagation();
//     for (let id of initWordId){
//         let el = document.getElementById(id);
//         if (!el.className.includes('selected')){
//             initWordId.pop(id);
//             };
//         };
//     initWordId.sort();
//     word_length(initWordId);
//     check_gaps(initWordId);
//     validateLoop(initWordId);
// }

// let savedBoxList = [];
// getCrossword.addEventListener('click', getSavedBox, false);
// function getSavedBox(el) {
//     let clickedItem = el.target;
//     let id = el.target.id;
//     let isCrossPoint = clickedItem.className.includes('cross-point');
//     let isNoReinit = clickedItem.className.includes('no-reinit');
//     if (clickedItem.className.includes('savedWord') && !(clickedItem.className.includes('selected')) && !(isCrossPoint || isNoReinit)){
//         clickedItem.className += ' selected';
//         initWordId.push(id);
//         initWordId.sort();
//         savedBoxList.push(id);
//     }else if(clickedItem.className.includes('savedWord') && clickedItem.className.includes('selected')){
//         clickedItem.classList.remove('selected');
//         initWordId.pop(id);
//         savedBoxList.pop(id);
//         };
//     el.stopPropagation();
//     validateLoop(initWordId);
//     }


// function validateCrossword(id){
//     let selectedIdRef = id.split(".");
//     let col = selectedIdRef[0];
//     let row = selectedIdRef[1];
//     for(cell of allCells){
//         let loopIdRef = cell.id.split(".");
//         let loopCol = loopIdRef[0];
//         let loopRow = loopIdRef[1];
//         if (!(row == loopRow || col == loopCol) || cell.className.includes('dead')){
//             cell.disabled = true;
//         };
//     };
// }

//F1. check word length and return false if too short
// function word_length(ids){
//     if (ids.length < 2){
//         addWordBtn.disabled = true;
//     }else{
//         addWordBtn.disabled = false;
//     };
// };


// //F2. make sure there are no gaps in words and return false if there is
// function check_gaps(ids){
//     let col_list = [];
//     let row_list = [];
//     let fail, row, column;
//     for (id of ids){
//         let splitId = id.split(".");
//         col_list.push(parseInt(splitId[0]));
//         row_list.push(parseInt(splitId[1]));
//     };
//     for (let i=col_list.length - 1; i > 0; i--){
//         let j = i - 1;
//         if (col_list[i] - col_list[j] > 1){
//             fail = true;
//         }else if (row_list[i] - row_list[j] > 1){
//             fail = true;
//         }else if (col_list[i] - col_list[j] == 0){
//             row = true;
//         }else if (row_list[i] - row_list[j] == 0){
//             column = true;
//         };
//     };
//     if(fail){
//         addWordBtn.disabled = true;
//     }else if(row){
//         orientation = 'across';
//     }else if(column){
//         orientation = 'down';
//     };
// }

//F.reset grid
function resetGrid(){
    //i. enable all cells except savedWord
    let getCells = document.querySelectorAll('.crossBox');
        for (cell of getCells){
            cell.disabled = false;
        };
    initWordId = [];
    savedBoxList = [];
}

//reactivate unselectable cells due to increase grid size #F246
function reactivateUnselectables(ids){
    for (id of ids){
        let el = document.getElementById(id);
        el.classList.remove('no-reinit');
        el.style.backgroundColor = 'white';
    };
}

//deactivate unselectable cells due to increase grid size #F256
function deactivateUnselectables(ids){
    for (id of ids){
        const x = id.split(".");
        const lastRow = parseInt(x[0]);
        const lastCol = parseInt(x[1]); 
        if(lastRow == rowSize || lastCol == rowSize){
        let el = document.getElementById(id);
            el.classList += ' no-reinit';
            el.style.backgroundColor = '#e4e4e4';
        };
    };
}


// //3. add/initialise clue
// const addWordBtn = document.querySelector('#addWord');
// addWordBtn.addEventListener('click', (e) => {
//     //prevents form submission
//     e.preventDefault();

//     let getLetters = document.querySelectorAll('.selected');
//     for (let cell of allCells){
//             cell.disabled = true;
//         };
//     addWordBtn.disabled = true;

//     let answer = '';
//     for (let letter of getLetters){
//         answer += letter.value.toLowerCase();
//         letter.style.background = 'white';  
//     };

//     //v. increase counter if required
//     if (!document.getElementById(initWordId[0]).previousElementSibling){
//         counter += 1;
//     };

//     //vi. insert clue into clueBox
//     let insertClue = document.querySelector('#insertClue');
//     insertClue.textContent = answer;
//     let insertLocation = document.querySelector('#insertLocation');
//     insertLocation.textContent = counter + " " + orientation;

//     //vii. show clueBox
//     cluebox.style.display = 'block';

//     //viii.push clue to answer list
//     answers.push(answer);
// });

// //3b. cancel clue
// const cancelClueBtn = document.querySelector('#cancelClue');
// cancelClueBtn.addEventListener('click', function(){  
//     cluebox.style.display = 'none';
//     insertClue = '';
//     insertLocation ='';
//      for (let cell of allCells){
//             cell.disabled = false;
//         };
//     addWordBtn.disabled = false;
//     if (!document.getElementById(initWordId[0]).previousElementSibling){
//         counter -= 1;
//     };

//     const clueInput = document.getElementById('clueEntry').value;
//     clueInput.value = '';
//     validateLoop(initWordId);
//     for (let i=0; i<initWordId.length; i++){
//         validateCrossword(initWordId[i]);
//     };
// });

//4. confirm clue and add to clueList
// const confirmClueBtn = document.querySelector('#confirmClue');
// confirmClueBtn.addEventListener('click', function(){
//     //i. adds and removes classes  
//     let initLetterEl = document.getElementById(initWordId[0]);
//     for (let i=0; i<initWordId.length; i++){
//         let getCell = document.getElementById(initWordId[i]);
//         if(!getCell.className.includes('savedWord')){
//             getCell.classList += ` savedWord ${counter}-${orientation}`;
//         }else{
//             getCell.classList += ` cross-point ${counter}-${orientation}`;
//             getCell.style.backgroundColor = '#e4e4e4';
//         };
//         getCell.classList.remove('selected');
//         getCell.classList.remove('crossBox');
//         if(i == 0){
//             if(!getCell.hasAttribute('data-ep')){
//                 getCell.setAttribute('data-ep', 'sp');
//             };
//         }else if (i == initWordId.length - 1){
//             if(!getCell.hasAttribute('data-ep')){
//             getCell.setAttribute('data-ep', 'fp');
//             };
//         }else{
//             if(!getCell.hasAttribute('data-ep')){
//             getCell.setAttribute('data-ep', 'mp');
//             };
//         };
//     };

    // //ia - 1. endPoint validation
    // let len = initWordId.length;
    // let lastCell = document.getElementById(initWordId[len - 1]);
    // if(orientation == 'across'){
    //     let row = initWordId[0][0];
    //     let lastCol = (parseInt(initWordId[len - 1][2])) + 1;
    //     let endPointCellId = row + '.' + lastCol;
    //     if (lastCol <= rowSize){
    //         let deadCell = document.getElementById(endPointCellId);
    //         deadCell.classList.remove('crossBox');
    //         deadCell.classList += ' deadCell';
    //         invalids.push(endPointCellId);
    //     }else if (!endPointCellId.includes(0)){
    //         invalids.push(endPointCellId);
    //     };

    //     let firstCol = initWordId[0][2];
    //     let precedingCellId = row + "." + (firstCol - 1);
    //     if (!precedingCellId.includes(0)){
    //         let precedingCell = document.getElementById(precedingCellId);
    //         precedingCell.classList.remove('crossBox');
    //         precedingCell.classList += ' deadCell';
    //     };
    // };

    // //ia - 2. vertical validation for deadCells //#001 fix
    //  if(orientation == 'down'){
    //     let col = initWordId[0][2];
    //     let endPointCellId = (parseInt(initWordId[len - 1][0]) + 1) + '.' + col;
    //     if (endPointCellId <= rowSize){
    //         let deadCell = document.getElementById(endPointCellId);
    //         deadCell.classList.remove('crossBox');
    //         deadCell.classList += ' deadCell';
    //         }else if (!endPointCellId.includes(0)){
    //             invalids.push(endPointCellId);
    //         };

    //     let firstCol = initWordId[0][2];
    //     let precedingCellId = (parseInt(initWordId[0][0]) - 1) + '.' + col;
    //     if (!precedingCellId.includes(0)){
    //         let precedingCell = document.getElementById(precedingCellId);
    //         precedingCell.classList.remove('crossBox');
    //         precedingCell.classList += ' deadCell';
    //     };
    //  };
        

    //ia - 3. crossPoint validation for deadCells
    for (id of initWordId){
        if(!allIds.includes(id)){
        allIds.push(id);
    }else{
        let ep = document.getElementById(id).getAttribute('data-ep');
        let x = id.split(".");
        if (orientation == 'across'){
            if(id == initWordId[0]){
                if (ep == 'sp'){
                    bottomRight(x);
                    const model = 1;
                    reinit(x, model);
                    //top left L shaped clue - model 1
                }else if(ep == 'fp'){
                    topRight(x);
                    const model = 7;
                    reinit(x, model);
                    //bottom left L shaped clue - model 7 (3)
                }else{
                    topRight(x);
                    bottomRight(x);
                    const model = 4;
                    reinit(x, model);
                    //mid left T - model 2 (4)
                };
            }else if(id == initWordId[initWordId.length - 1]){
                if (ep == 'sp'){
                    bottomLeft(x);
                    let model = 3;
                    reinit(x, model);
                    //top right L - model 3 (7)
                }else if(ep == 'fp'){
                    topLeft(x);
                    const model = 9;
                    reinit(x, model);
                    //bottom right L - model 9
                }else{
                    bottomLeft(x);
                    topLeft(x);
                    const model = 6;
                    reinit(x, model);
                    //mid right T - model 6 (8)
                };
            }else{
                if (ep == 'sp'){
                    bottomLeft(x);
                    bottomRight(x);
                    let model = 2;
                    reinit(x, model);
                    //top mid T - model 2 (4)
                }else if(ep == 'fp'){
                    topLeft(x);
                    topRight(x);
                    const model = 8;
                    reinit(x, model);
                   //bottom mid T - model 8 (6)
                }else{
                    bottomLeft(x);
                    bottomRight(x);
                    topLeft(x);
                    topRight(x);
                    const model = 5;
                    reinit(x, model);
                   //center - model 5'
                    };
                };
        }else if (orientation == 'down'){
            if(id == initWordId[0]){
                if (ep == 'sp'){
                    bottomRight(x);
                    const model = 1;
                    reinit(x, model);
                    //top left L shaped clue - model 1
                }else if(ep == 'fp'){
                    bottomLeft(x);
                    let model = 3;
                    reinit(x, model);
                    //top-right L - model 7
                }else{
                    bottomLeft(x);
                    bottomRight(x);
                    const model = 2;
                    reinit(x, model);
                    //top mid T - model 2
                };
            }else if(id == initWordId[initWordId.length - 1]){
                if (ep == 'sp'){
                    topRight(x);
                    const model = 7;
                    reinit(x, model);
                    //bottom left L - model 7
                }else if(ep == 'fp'){
                    topLeft(x);
                    const model = 9;
                    reinit(x, model);
                    //bottom right L - model 9
                }else{
                    topRight(x);
                    topLeft(x);
                    const model = 8;
                    reinit(x, model);
                    //bottom mid T - model 8
                };
            }else{
                if (ep == 'sp'){
                    topRight(x);
                    bottomRight(x);
                    const model = 4;
                    reinit(x, model);
                    //mid left T - model 4 (2)
                }else if(ep == 'fp'){
                    topLeft(x);
                    bottomLeft(x);
                    const model = 6;
                    reinit(x, model);
                   //right mid T - model 6 (8)
                }else{
                    bottomLeft(x);
                    bottomRight(x);
                    topLeft(x);
                    topRight(x);
                    const model = 5;
                    reinit(x, model);
                   //center - model 5'
                    };
                };
            };
        };
    };
    allIds.sort();
    
    function topLeft(x){
        let col = x[0] - 1;
        let row = x[1] - 1;
        let id = col + "." + row;
        let deadCell = document.getElementById(id);
        deadCell.classList.remove('crossBox');
        deadCell.classList += ' deadCell';
        }

    function topRight(x){
        let row = x[0] - 1;
        let col = parseInt(x[1]) + 1;
        let id =  row + "." + col;
        let deadCell = document.getElementById(id);
        deadCell.classList.remove('crossBox');
        deadCell.classList += ' deadCell';
        }

    function bottomLeft(x){
        let row = parseInt(x[0]) + 1;
        let col = x[1] - 1;
        let id =  row + "." + col;
        let deadCell = document.getElementById(id);
        deadCell.classList.remove('crossBox');
        deadCell.classList += ' deadCell';
    }

    function bottomRight(x){
        let row = parseInt(x[0]) + 1;
        let col = parseInt(x[1]) + 1;
        let id =  row + "." + col;
        let deadCell = document.getElementById(id);
        deadCell.classList.remove('crossBox');
        deadCell.classList += ' deadCell';
    }


    //#F542 validation on existing clues for reinitialisation 
    function reinit(x, model){
        let row = x[0];
        let col = x[1];
        let t = (row - 1) + "." + col;
        let l = row + "." + (col - 1);
        let r = row + "." + (parseInt(col) + 1);
        let d = (parseInt(row) + 1) + "." + col;
        let colSub = col - 1;
        let colAdd = parseInt(col) + 1;
        let rowSub = row - 1;
        let rowAdd = parseInt(row) + 1;
        let tlrd = [];


        if(model == '1'){
            if(colSub < 1 && rowSub < 1){
                //model 1.1
                tlrd.push(d);
                tlrd.push(r);
            }else if(colSub < 1){
                //model 1.2
                tlrd.push(d);
            }else if(rowAdd < 1){
                //model 1.3
                tlrd.push(r)
            };


        }else if(model == '2'){
            if(rowSub < 1){
                //model 2.1
                tlrd.push(l);
                tlrd.push(r);
                tlrd.push(d);
            }else{
                //model 2.2 
                tlrd.push(d);
        };

        }else if(model == '3'){
            reverse_reinit.push(d);
            if (colAdd > rowSize && rowSub < 1){
                //model 3.1
                tlrd.push(l);
                tlrd.push(d);
            }else if(colAdd > rowSize){
                //model 3.2
                tlrd.push(d);
            }else if (rowSub < 1){
                //model 3.3
                tlrd.push(l);
        };
            
        }else if(model == '4'){
            if(colAdd < 1){
                //model 4.1
                tlrd.push(t);
                tlrd.push(r);
                tlrd.push(d);
            }else{
                //model 4.2 
                tlrd.push(r);
        };

        }else if(model == '5'){
                //model 5
                tlrd.push(t);
                tlrd.push(l);
                tlrd.push(r);
                tlrd.push(d);
        
        }else if(model == '6'){
            reverse_reinit.push(t);
            reverse_reinit.push(d);
            if(colAdd > rowSize){
                //model 6.1
                tlrd.push(t);
                tlrd.push(l);
                tlrd.push(d);
            }else{
                //model 6.2
                tlrd.push(l);
            };

        }else if(model == '7'){
            if(colSub < 1 && rowAdd > rowSize){
                //model 7.1
                tlrd.push(t);
                tlrd.push(r);
            }else if(colSub < 1){
                //model 7.2
                tlrd.push(t);
            }else if(rowAdd > rowSize){
                //model 7.3
                tlrd.push(r)
            };

        }else if(model == '8'){
            reverse_reinit.push(r);
            reverse_reinit.push(l);
            if(rowAdd > rowSize){
                //model 8.1
                tlrd.push(t);
                tlrd.push(l);
                tlrd.push(r);
            }else{
                //model 8.2
                tlrd.push(t);
            };

        }else if(model == '9'){
            if (colAdd > rowSize && rowAdd > rowSize){
                //model 9.1
                tlrd.push(l);
                tlrd.push(t);
                reverse_reinit.push(l);
                reverse_reinit.push(t);
            }else if(colAdd > rowSize){
                //model 9.2
                tlrd.push(t);
                reverse_reinit.push(t);
            }else if (rowAdd > rowSize){
                //model 9.3
                tlrd.push(l);
                reverse_reinit.push(l);
            }else{
                //model 9.4
                reverse_reinit.push(l);
                reverse_reinit.push(t);
            };
        };

        for (let id of tlrd){
            let el = document.getElementById(id); 
            el.classList += ' no-reinit';
            el.style.backgroundColor = '#e4e4e4';
        };
    }

//     //ii. adds number to firstLetter
//     if(!initLetterEl.previousElementSibling){
//     initLetterEl.insertAdjacentHTML('beforeBegin', 
//             `<div class="number-wrapper">${counter}</div>`);
//     };

//     //iii. adds clues to clueList
//     let getClueList = document.getElementById(`${orientation}`);
//     const getInput = document.getElementById('clueEntry');
//     let getInputVal = getInput.value;
//     cluebox.style.display = 'none';
//     getInput.value = '';    
//     if (counter == 1){
//         let clueListBlock = document.querySelector('#clueList');
//         clueListBlock.style.display = 'block';
//     };
//     wrap = document.createElement('div');
//     wrap.id = `${counter}-${orientation}`;
//     wrap.className = 'clue-wrapper';
//     el = document.createElement('p');
//     el.className = 'font-clue';
//     el.textContent = `${counter}. ${getInputVal}`;
//     wrap.insertAdjacentElement('afterbegin', el);
//     deleteBtn = document.createElement('button');
//     deleteBtn.className = 'delete-button';
//     deleteBtn.innerHTML = '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>';
//     wrap.insertAdjacentElement('beforeend', deleteBtn);
//     getClueList.appendChild(wrap);

//     deleteBtn.addEventListener('click', (e) =>{
//         const el = e.target.parentNode.parentNode;
//         const clueId = el.id;
//         const clue = el.textContent;
//         console.log(clueId);
//         //getClueList.removeChild(el);
//         for (id of allIds){
//             let el = document.getElementById(id);
//             let letterOfClue = el.className.includes(clueId);
//             let crossPoint = el.className.includes('cross-point');
//             if(letterOfClue && !crossPoint){
//                 console.log(el);
//                 el.value = '';
//                 el.classList.remove(clueId);
//                 el.classList.remove('savedWord');
//                 el.className += ' crossBox';
//                 allIds.pop(el.id);
//             };
//             if(letterOfClue && crossPoint){
//                 let el = document.getElementById(id);
//                 el.classList.remove(clueId);
//                 el.classList.remove('cross-point');
//             };
//         };
//     });

//     //iv. resets grid for next clue
//     resetGrid();
// });








