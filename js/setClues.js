let initWord = [];
const addWordBtn = document.querySelector('#addWord');
const cancelClueBtn = document.querySelector('#cancelClue');
const confirmClueBtn = document.querySelector('#confirmClue');

//-----------Multipurpose functions ----------------------------------------------------------------------------
//Fi. disables or enables cells not used for clue
//used in F2a (initialise clue) and F2b (cancel clue)

function disOrEnableAll(bool){
    let answer = '';
    addWordBtn.disabled = bool;
    increaseBtn.disabled = bool;
    decreaseBtn.disabled = bool;
        for (let cell of allCells){
            let isSelected = cell.className.includes('selected');
            if (isSelected){
                answer += cell.value;
            }else{
                cell.disabled = bool;
            }
        }
    return answer;
}

//Fii. displays/hides prompt box and updates its html content
//used in F2a (initialise clue) and F2b (cancel clue)

function promptClue(block, sum, answer){
    const $clue = document.getElementById('insertClue');
    const $location = document.getElementById('insertLocation');
    const cluebox = document.getElementById('cluebox');
    const notClue = !document.getElementById(initWord[0]).previousElementSibling;
        if (notClue){
            counter = sum;
        }
    $clue.textContent = answer;
    $location.textContent = counter + " " + orientation;
    cluebox.style.display = block;
}




//-----------Functions -------------------------------------------------------------------------------------------

//F1. select cells
function selectCell(e) {
    function sortAndValidate(id){
        initWord.sort();
        validateCrossword(id);
        wordLength();
        checkGaps();
    }

    if (e.target !== e.currentTarget) {
        const cell = e.target;
        const id = e.target.id;
        const isSelected = cell.className.includes('selected');
        const notInList = !initWord.includes(id);
        const $class = cell.classList;
        const hasValue = cell.value === '';

        if (!isSelected && !hasValue && notInList){
            $class.add('selected');
            initWord.push(id);
            sortAndValidate(id); 
        }else if (isSelected && hasValue){
            $class.remove('selected');
            initWord.pop(id);
            sortAndValidate(id);
            }
        }
   }  
   

//F2a. initialise clue
function initialiseClue() {
    const bool = true;
    const block = 'block';
    const sum = counter += 1;
    const answer = disOrEnableAll(bool);
    promptClue(block, sum, answer);

}      


//F2b. cancel clue
function cancelClue(){
    const clueInput = document.getElementById('clueEntry').value;
    const bool = false;  
    const block = '';
    const answer = '';
    const sum = (counter -= 1);
    disOrEnableAll(bool);
    promptClue(block, sum, answer);
    clueInput.value = '';
    // validateLoop(initWordId);
    // for (let i=0; i<initWordId.length; i++){
    //     validateCrossword(initWordId[i]);
    // };
}


//3. confirm clue and add to clueList
function confirmClue(){
    function addNumber(){
        const firstLetter = document.getElementById(initWord[0]);
        const hasNoClue = !firstLetter.previousElementSibling;
        if(hasNoClue){
        firstLetter.insertAdjacentHTML('beforeBegin', 
            `<div class="number-wrapper">${counter}</div>`);
        }
    }

    function writeClue(){
        const getClueList = document.getElementById(`${orientation}`);
        const $clue = document.getElementById('clueEntry');
        const clue = $clue.value;
        cluebox.style.display = '';
        $clue.value = '';    
        if (counter == 1){
            const clueListBlock = document.querySelector('#clueList');
            clueListBlock.style.display = 'block';
        }

        //create wrapper
        wrap = document.createElement('div');
        wrap.id = `${counter}-${orientation}`;
        wrap.className = 'clue-wrapper';

        //create p
        el = document.createElement('p');
        el.className = 'font-clue';
        el.textContent = `${counter}. ${clue}`;
        wrap.insertAdjacentElement('afterbegin', el);

        //create btn
        deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-button';
        deleteBtn.innerHTML = '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>';

        //add elements
        wrap.insertAdjacentElement('beforeend', deleteBtn);
        getClueList.appendChild(wrap);
    }

    for (let i=0; i<initWord.length; i++){
        let cell = document.getElementById(initWord[i]);
        const notEP = !cell.hasAttribute('data-ep');
        let isSaved  = cell.className.includes('savedWord');
        if(!isSaved){
            updateClass(cell, 'savedWord');
        }else{
            updateClass(cell, 'cross-point');
        }
        removeClasses(cell, ['selected', 'cell']);
        //refactor ends here
        if(i == 0){
            if(notEP){
                cell.setAttribute('data-ep', 'sp');
            }
        }else if (i == initWord.length - 1){
            if(notEP){
                cell.setAttribute('data-ep', 'fp');
            }
        }else{
            if(notEP){
            cell.setAttribute('data-ep', 'mp');
            }
        }
    }
    endPoint();

    //ii. adds number to firstLetter
    addNumber();

    //iii. adds clues to clueList
    writeClue();

    //iv. resets grid for next clue
    resetGrid();
}



//-----------Listeners ----------------------------------
getCrossword.addEventListener('keyup', selectCell, false);
addWordBtn.addEventListener('click', initialiseClue, false);
cancelClueBtn.addEventListener('click', cancelClue, false);
confirmClueBtn.addEventListener('click', confirmClue, false);