let invalids = [];
let savedBoxList = [];
const noreinits = [];
const reverse_reinit = [];
let noReinitOnReset = [];

//multiuse functions --------------------------------------------------------------------------
function setHTML(dir, sDir){
    const cells = document.querySelectorAll('.' + sDir + '-' + dir);
    for (let cell of cells){
        const c = cell.className; 
        const isSelected = c.includes('selected');
        const isCell = c.includes('cell');
        const isCross = c.includes('cross-point');
        if(isCell){
            cell.disabled = true;
        }else if(!isSelected && !isCross){
            updateClass(cell, 'no-reinit');
            if(!noreinits.includes(cell.id)){
                noreinits.push(cell.id);
                }
            }
        }
    }


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

//1c resets when clue length 1 or 0
function resetValidation(){
    const len = initWord.length;
    if(len < 2){
        for (let cell of allCells){
            if(!invalids.includes(cell.id)){
            cell.disabled = false;
            }
        }
        if (len == 1){
            validateCrossword(initWord[0]);
        }
    }
    // reactivateUnselectables(unselectables);
    // unselectables = [];
}

function validateClue(){
    if (savedBoxList.length == 1){
        setNoReinit(savedBoxList);
        inWordValidation(savedBoxList);
    }else if(savedBoxList.length == 0){
        for(let id of noreinits){
            cell = document.getElementById(id);
            removeClasses(cell, ['no-reinit']);
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


//5. endPoint validation (v5)
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
            if(!invalids.includes(rId)){
                invalids.push(rId);
            }  
        }else if (l != 0){
            if(!invalids.includes(rId)){
                invalids.push(rId);
            }
        }

        if ((l - 1) != 0){
            const cell = document.getElementById(lId);
            removeClasses(cell, ['cell']);
            updateClass(cell, 'dead-cell');
            if(!invalids.includes(lId)){
                invalids.push(lId);
            }
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
            if(!invalids.includes(dId)){
                invalids.push(dId);
            }
        }else if (u != 0){
            if(!invalids.includes(dId)){
                invalids.push(dId);
            }
        }


        if ((u - 1) != 0){
            const cell = document.getElementById(uId);
            removeClasses(cell, ['cell']);
            updateClass(cell, 'dead-cell');
            if(!invalids.includes(uId)){
                invalids.push(uId);
            }
        }
     }
}

//6. check invalids list on increase grid size or on clue reset
function checkInvalids(){
    for (let i = 0; i < invalids.length; i++){
        const cell = document.getElementById(invalids[i]);
        removeClasses(cell, ['cell']);
        updateClass(cell, 'dead-cell');
    }
    invalids.sort();
}

//7. set no reinits on selection 
function setNoReinit(ids){
    for (let id of ids){
        const sp = savedBoxList[0].split(".");
        const col = sp[1];
        const row = sp[0];
        const $cell = document.getElementById(savedBoxList[0]);
        const $class = $cell.className;
        const isAcross = $class.includes('across');
        const isCross = $class.includes('cross-point');
    if(!isCross){
        if(isAcross){
            setHTML(row, 'row');
        }else if (!isAcross){
            setHTML(col, 'col');
            }
        }
    }
}    
    


//7. check inword for no reinits
function inWordValidation($ids){
    function checkIds(i, $dir, $id){
        for (let id of allIds){
            const sp = id.split(".");
            const dir = sp[i];
            if(dir == $dir || id == $id){
                //console.log(id);
            }else{
                const cell = document.getElementById(id);
                const $class = cell.className;
                const noReinit = $class.includes('no-reinit');
                const isCross = $class.includes('cross-point');
                if(!(noReinit || isCross)){
                    updateClass(cell, 'no-reinit');
                }
            }
        }
    }

    for (let $id of $ids){
        const cell = document.getElementById($id);
        //console.log($ids);
        const $sp = $id.split(".");
        const isAcross = cell.className.includes('across');
        if(isAcross){
            checkIds(1, $sp[1], $id); //checks against cols
        }else{
            checkIds(0, $sp[0], $id); //checks against rows
        }
    }
}

function crossPoint(){
    function topLeft(x){
        let col = x[0] - 1;
        let row = x[1] - 1;
        let id = col + "." + row;
        let cell = document.getElementById(id);
        removeClasses(cell, ['cell']);
        updateClass(cell, 'dead-cell');
        }

    function topRight(x){
        let row = x[0] - 1;
        let col = parseInt(x[1]) + 1;
        let id =  row + "." + col;
        let cell = document.getElementById(id);
        removeClasses(cell, ['cell']);
        updateClass(cell, 'dead-cell');
        }

    function bottomLeft(x){
        let row = parseInt(x[0]) + 1;
        let col = x[1] - 1;
        let id =  row + "." + col;
        let cell = document.getElementById(id);
        removeClasses(cell, ['cell']);
        updateClass(cell, 'dead-cell');
    }

    function bottomRight(x){
        let row = parseInt(x[0]) + 1;
        let col = parseInt(x[1]) + 1;
        let id =  row + "." + col;
        let cell = document.getElementById(id);
        removeClasses(cell, ['cell']);
        updateClass(cell, 'dead-cell');
    }


    //--------------------------------------BODY--------------------------------------
    for (let id of initWord){
        if(!allIds.includes(id)){
            allIds.push(id);
        }else{
            const ep = document.getElementById(id).getAttribute('data-ep');
            const x = id.split(".");
            if (orientation == 'across'){
                if(id == initWord[0]){
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
                }else if(id == initWord[initWord.length - 1]){
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
                if(id == initWord[0]){
                    if (ep == 'sp'){
                        console.log("running model 1");
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
                }else if(id == initWord[initWord.length - 1]){
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
}
    
//cross-point for reinitialisation    
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
        console.log("model 1");
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
        console.log("model 2");
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
        }
    }

    for (let id of tlrd){
        let cell = document.getElementById(id);
        console.log(cell);
        updateClass(cell, 'no-reinit-on-reset'); 
        //noReinitOnReset.push(id);
        // el.classList += ' no-reinit';
        el.style.backgroundColor = '#e4e4e4';
    }
}



//-----------Listeners ----------------------------------
getCrossword.addEventListener('keypress', preventIllegalChars, false);