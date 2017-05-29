let invalids = [];
let savedBoxList = [];

//1. prevent caps and non-alphanumeric characters
function preventIllegalChars(e){
    const x = e.charCode;
    if(x != 13){
        if (x < 97 || x > 122) {
            e.preventDefault();
            console.log("PROMPT: illegal char found: ", x);
            }
        }
}

//2. not in row or col
function validateCrossword(id){
    const sp = id.split(".");
    const col = sp[0];
    const row = sp[1];
    for(cell of allCells){
        let $sp = cell.id.split(".");
        let $col = $sp[0];
        let $row = $sp[1];
        if (!(row == $row || col == $col) || cell.className.includes('dead')){
            cell.disabled = true;
        }
    }
}

//1c more validation
function validateLoop(){
//clue has no letters in it - a. new clue | b. first letter deleted
if(initWord.length <= 1){
        for (cell of allCells){
            cell.disabled = false;
        }
        // reactivateUnselectables(unselectables);
        // unselectables = [];
        if (initWord.length == 1){
        validateCrossword(initWord[0]);
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
                        // unselectables.push(el.id);
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
                        // unselectables.push(el.id);
                    }
                }
            }
        }
    }
}

//3. check word is at least 2 characters
function wordLength(){
    if (initWord.length < 2){
        addWordBtn.disabled = true;
    }else{
        addWordBtn.disabled = false;
    }
}

//4. make sure there are no gaps in words and return false if there is
function checkGaps(){
    let cols = [];
    let rows = [];
    let fail, row, column;
    for (id of initWord){
        let sp = id.split(".");
        cols.push(parseInt(sp[0]));
        rows.push(parseInt(sp[1]));
    }

    for (let i=cols.length - 1; i > 0; i--){
        let j = i - 1;
        if (cols[i] - cols[j] > 1){
            fail = true;
        }else if (rows[i] - rows[j] > 1){
            fail = true;
        }else if (cols[i] - cols[j] == 0){
            row = true;
        }else if (rows[i] - rows[j] == 0){
            column = true;
        }
    }

    if(fail){
        addWordBtn.disabled = true;
    }else if(row){
        orientation = 'across';
    }else if(column){
        orientation = 'down';
    }
}


//5. endPoint validation
function endPoint(){
    const sp1 = initWord[0].split(".");
    const sp2 = initWord[initWord.length - 1].split(".");

    if(orientation == 'across'){
        const row = parseInt(sp1[0]);
        const l = parseInt(sp1[1]); 
        const r = parseInt(sp2[1]);
        const lId = row + "." + (l - 1);
        const rId = row + '.' + (r + 1);

        if (r < rowSize){
            const cell = document.getElementById(rId);
            removeClasses(cell, ['cell']);
            updateClass(cell, 'dead-cell');
            invalids.push(rId);  
        }else if (l != 0){
            invalids.push(rId);
        }

        if ((l - 1) != 0){
            const cell = document.getElementById(lId);
            removeClasses(cell, ['cell']);
            updateClass(cell, 'dead-cell');
        }
    

    }else if(orientation == 'down'){
        const col = parseInt(sp1[1]);
        const u = parseInt(sp1[0]);
        const d = parseInt(sp2[0]);
        const dId = (d + 1) + '.' + col;
        const uId = (u - 1) + '.' + col;

        if (d <= rowSize){
            const cell = document.getElementById(dId);
            removeClasses(cell, ['cell']);
            updateClass(cell, 'dead-cell');
            invalids.push(dId);
        }else if (u != 0){
            invalids.push(dId);
        }


        if ((u - 1) != 0){
            const cell = document.getElementById(uId);
            removeClasses(cell, ['cell']);
            updateClass(cell, 'dead-cell');
            invalids.push(uId);
        }
     }
}

//6. check invalids list on increase grid size

function checkInvalids(){
    for (let id of invalids){
        let cell = document.getElementById(id);
        removeClasses(cell, ['cell']);
        updateClass(cell, 'dead-cell');
    }
}


//-----------Listeners ----------------------------------
getCrossword.addEventListener('keypress', preventIllegalChars, false);