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


//-----------Listeners ----------------------------------
getCrossword.addEventListener('keypress', preventIllegalChars, false);