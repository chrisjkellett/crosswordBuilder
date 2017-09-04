
(function(){
  const root = {
    settings: function(){
      this.rows = 6;
      this.init = 1;
      this.max = 10;
      this.min = 4;
      this.sCurrentWord = '';
      this.clueCounter = 1;
      this.orientation = 'across';
      this.currentIds = [];
      this.json = [];
      this.noreinits = [];
      this.reverse_reinit = [];
      this.savedCells = [];
      this.newCrossPoint = false;
    },

    
    init: function(){
      this.settings();
      this.cacheDOM();
      this.bindEvents();
      this.generateGrid();
    },


    cacheDOM: function(){
      this.$wrapper = $('#crosswordWrapper');
      this.$crossword = this.$wrapper.find('#crossword');
      this.$increaseBtn = this.$wrapper.find('#increaseBtn');
      this.$decreaseBtn = this.$wrapper.find('#decreaseBtn');
      this.$allCells = this.$wrapper.find('.cell');
      this.$alertBox = this.$wrapper.find('#alertBox');
      this.$clueBox = this.$wrapper.find('#clueBox');
      this.$insertClue = this.$wrapper.find('#insertClue');
      this.$insertReference = this.$wrapper.find('#insertReference');
      this.$alertMessage = this.$wrapper.find('#alertMessage');
      this.$alertConfirm = this.$wrapper.find('#okAlert');
      this.$addWordBtn = this.$wrapper.find('#addWordBtn');
      this.$confirmClueBtn = this.$wrapper.find('#confirmClue');
      this.$clueEntry = this.$wrapper.find('#clueEntry');
      this.$cancelClueBtn = this.$wrapper.find('#cancelClue');
      this.$clueList = this.$wrapper.find('#clueList');
    },


    bindEvents: function(){
      this.$crossword.keyup(this.validateCells.bind(this));
      this.$crossword.keyup(this.navigateGrid.bind(this));
      this.$crossword.keypress(this.validateInput.bind(this));
      this.$increaseBtn.click(this.increaseSize.bind(this));
      this.$decreaseBtn.click(this.decreaseSize.bind(this));
      this.$alertConfirm.click(this.alertBoxConfirm.bind(this));
      this.$addWordBtn.click(this.renderClue.bind(this));
      this.$cancelClueBtn.click(this.cancelClue.bind(this));
      this.$confirmClueBtn.click(this.confirmClue.bind(this));
    },


    runCrosswordEvents: function(e){
      this.validateCells(e);
      this.navigateGrid(e);
    },
    
    generateGrid: function(){
      for (let i = 1; i < this.rows + 1; i++){
        let newItem = $(`<div id="r-${i}" class="_row"></div>`);
        this.$crossword.append(newItem);
      }
      this.makeCells();
    },


    makeCells: function(){
      for (let i = this.init; i < this.rows + 1; i++){
        let $row = this.$wrapper.find('#r-' + i);
        this.init = this.rows + 1;
        for (let j = 1; j < this.rows + 1; j++){
          let newItem = $(`<div class="cell-wrapper">\
          <input type="text" maxlength="1" id="${i}-${j}" class="cell row-${i} col-${j}" /></div>`);
          $row.append(newItem);
        }
      }
      this.cacheCells();
    },


    cacheCells: function(){
      this.$allCells = this.$wrapper.find('.cell');
    },


    alertBox: function(message){
      this.$alertMessage.text(message);
      this.$alertBox.css('display', 'block');
    },


    alertBoxConfirm: function(){
      this.$alertBox.css('display', 'none');
    },


    increaseSize: function(){
      if (this.rows < this.max){
        this.rows ++;
        let newItem = $(`<div id="r-${this.rows}" class="_row"></div>`);
        this.$crossword.append(newItem);
        for (let i = 1; i < this.rows; i++){
          let $row = this.$wrapper.find('#r-' + i);
          let newItem = $(`<div class="cell-wrapper">\
          <input type="text" maxlength="1" id="${i}-${this.rows}"\
           class="cell row-${i} col-${this.rows}" /></div>`);
          $row.append(newItem);
        }
        this.makeCells(this.rows, this.init);
        for (let id of this.currentIds){
          this.validateGrid(id);
        }

        for (let id of this.reverse_reinit){
          const el = this.$wrapper.find('#' + id);
          el.removeClass('no-reinit-on-reset');
          el.prop('disabled', false);
          el.click(this.validateClicks.bind(this));
        }
      }
      
      else{
        const message = 'Exceeds maximum grid size';
        this.alertBox(message);
      }
    },


    decreaseSize: function(){
      function decreaseSize(){
        const row = root.$wrapper.find('#r-' + (root.rows));
        row.remove();
        for (let i = 1; i < root.rows; i++){
          let row = root.$wrapper.find('#r-' + i);
          row.children().last().remove();
        } 

        for (let id of root.reverse_reinit){
          const el = root.$wrapper.find('#' + id);
          el.addClass('no-reinit-on-reset');
          el.off();
          el.prop('disabled', 'true');
        }

        root.rows --;
        root.init --;
        root.cacheCells();
      }

      if(this.currentIds.length > 0){
        let sp = this.currentIds[this.currentIds.length - 1].split("-");
        let lastRow = sp[1];
        let lastCol = sp[0];
        if ((this.rows > this.min) && (lastCol < this.rows) && (lastRow < this.rows))
          decreaseSize();
        else if(this.rows >= this.min){
          const message = 'Reducing size would delete clues.';
          this.alertBox(message);
        }
        else if (this.rows <= this.min){
          const message = 'Cannot reduce further. Minimum size for this crossword is set to 4.';
          this.alertBox(message);
        }
      }
      else if(this.rows <= this.min){
        const message = 'Cannot reduce further. Minimum size for this crossword is set to 4.';
        this.alertBox(message);
      }
      else
          decreaseSize();
    },


    navigateGrid: function(e){
      if (e.keyCode === 37){
        const i = this.$allCells.index(e.target);
        const item = this.$allCells.get(i - 1);
        item.focus();
      }
      else if (e.keyCode === 38){
        const i = this.$allCells.index(e.target);
        const item = this.$allCells.get(i - this.rows);
        item.focus();
      }
      else if (e.keyCode === 39){
        const i = this.$allCells.index(e.target);
        const item = this.$allCells.get(i + 1);
        if (item ? item.focus() : console.log('cannot go further'));
      }
      else if (e.keyCode === 40){
        const i = this.$allCells.index(e.target);
        const item = this.$allCells.get(i + this.rows);
        if (item ? item.focus() : console.log('cannot go further'));
      }
    },

    validateCells: function(e){
      const cell = e.target;
      const id = cell.id;
      const a = cell.className.includes('selected');
      const b = e.target.value === '';
      const c = this.currentIds.includes(id);
      const isTab = e.key === 'Tab';

      if (!a && !b && !c && !isTab){
        cell.classList.add('selected');
        this.currentIds.push(id);
        this.validateGrid(id);
        this.validateWordLength();
        this.validateWordStructure();
        this.validateReset();
      }
      else if (a && b && !isTab){
        cell.classList.remove('selected');
        const i = this.currentIds.indexOf(id);
        this.currentIds.splice(i, 1);
        this.validateGrid(id);
        this.validateWordLength();
        this.validateWordStructure();
        this.validateReset();
      }
    },

    validateClicks: function(e){
      const $el = this.$wrapper.find('#' + e.target.id);
      const isSaved = $el.hasClass('savedWord');
      const isSelected = $el.hasClass('selected');
      if (isSaved && !isSelected && !this.newCrossPoint){
        $el.addClass('selected');
        this.newCrossPoint = true;
        this.currentIds.push(e.target.id);
        this.currentIds.sort();
        this.validateGrid(e.target.id);
        this.validateWordLength();
        this.validateWordStructure();
        this.setNoReinits.init(e.target.id);
        // this.validateInWord.setup(e.target.id);
        this.validateReset();
      }else if(isSaved && isSelected){
        $el.removeClass('selected');
        this.newCrossPoint = false;
        const i = this.currentIds.indexOf(e.target.id);
        this.currentIds.splice(i, 1);
        this.validateGrid(e.target.id);
        this.validateWordLength();
        this.validateWordStructure();
        this.resetNoReinits(e.target.id);
        this.validateReset();
      }
    },

    validateGrid: function(id){
      const sp = id.split("-");
      const col = sp[0];
      const row = sp[1];
      for (let cell of this.$allCells){
        let $sp = cell.id.split("-");
        let $col = $sp[0];
        let $row = $sp[1];
        if (!(row === $row || col === $col) || cell.className.includes('dead'))
          cell.disabled = true;
      }
    },


    validateWordLength: function(){
      if (this.currentIds.length < 2)
        this.$addWordBtn.attr('disabled', true);
      else
        this.$addWordBtn.removeAttr('disabled');
    },


    validateWordStructure: function(){
      this.currentIds.sort();
      let cols = []; 
      let rows = [];
      let testFails, isRow, isColumn;
      for (let id of this.currentIds){
        let sp = id.split("-");
        cols.push(parseInt(sp[0]));
        rows.push(parseInt(sp[1]));
      }
      for (let i = cols.length - 1; i > 0; i--){
        let j = i - 1;
        if (cols[i] - cols[j] > 1)
          testFails = true;
        else if (rows[i] - rows[j] > 1)
          testFails = true;
        else if (cols[i] - cols[j] === 0)
          isRow = true;
        else if (rows[i] - rows[j] === 0)
          isColumn = true;
      }
      if(testFails)
        this.$addWordBtn.attr('disabled', true);
      else if(isRow){
        this.orientation = 'across';
      }
      else if(isColumn){
        this.orientation = 'down';
      }
    },


    validateInput: function(e){
      if (e.charCode < 64 || e.charCode > 122) {
        const message = 'Non alphanumeric characters cannot form part of a word';
        e.preventDefault();
        this.alertBox(message);
      }
    },


    validateReset: function(){
      //to clear validation there must be 1 or 0 cells selected (and one deleted)
      //to ensure noreinits runs there must be no selected crosspoints
      if(this.currentIds.length < 2 && !this.newCrossPoint){
        for (let cell of this.$allCells){
          cell.disabled = false;
          //##this area needs work to avoid unnecessary 2 step resets
        }

      }
      if (this.currentIds.length === 1)
        this.validateGrid(this.currentIds[0]);
    },

    validateInWord: {
      setup: function(targetId){
        for (let id of root.savedCells){
          let obj = {
            cell: root.$wrapper.find('#' + id),
            id: id,
            sp: id.split("-"),
            $id: targetId,
            $sp: targetId.split("-"),
          }
        if (obj.cell.hasClass('across') ? this.run(col = 0, obj) : this.run(row = 1, obj));
        }
      },

      run: function(index, obj){
        if (obj.$id !== obj.id){
          if (obj.$sp[index] !== obj.sp[index]){
            //obj.cell.addClass('no-reinit');
            //console.log(obj.$sp[index] + " " + obj.$id + " / " + obj.sp[index] + " " + obj.id + ' tested');
          }
        }
      }
    },

    setNoReinits: {
      init: function(targetId){
        const sp = targetId.split("-");
        const cell = root.$wrapper.find('#' + targetId);
        if(root.$wrapper.find('#' + targetId).hasClass('across')){
          this.getOrientation(targetId, ref = sp[0], position = 'across');
          this.validateOtherCells(targetId, ref = sp[0], 0);
        }else{
          this.getOrientation(targetId, ref = sp[1], position = 'down');
          this.validateOtherCells(targetId, ref = sp[1], 1);
        }
      },

      getOrientation: function(targetId, ref, position){
        const sp = targetId.split("-");
        for (let i = 1; i < root.rows + 1; i++){
          if(position === 'across'){
            this.validateLine(id = ref + '-' + i, index = ref + '-' + i);
          }else{
            this.validateLine(id = i + '-' + ref, index = i + '-' + ref);
            }
          }
        },

      validateLine: function(id, index){
        const cell = root.$wrapper.find('#' + id);
        if (cell.hasClass('cell')){
          cell.prop('disabled', true);
        } else if (!cell.hasClass('selected') && !cell.hasClass('dead-cell') && !cell.hasClass('cross-point')){
          this.updateDOM(id);
        }
      },

      validateOtherCells: function(targetId, ref, i){
        for (let id of root.savedCells){
          if (targetId !== id){
            let loopedRef = id.split("-");
            if(ref !== loopedRef[i]){
              this.updateDOM(id);
            }
          }
        }
      },

      updateDOM: function(id){
        const cell = root.$wrapper.find('#' + id);
        if(!cell.hasClass('no-reinit-on-reset')){
          console.log(cell);
          cell.prop('disabled', true);
          cell.addClass('no-reinit');
          root.noreinits.push(id);
        }
      }
    },

    resetNoReinits: function(xpid){
      function checkIds(ref, pos){
        for (let i = 1; i < root.rows + 1; i++){
          if(pos === 'across'){
            const cell = root.$wrapper.find('#' + ref + '-' + i);
            cell.removeClass('no-reinit');
          }else{
            const cell = root.$wrapper.find('#' + i + '-' + ref);
            cell.removeClass('no-reinit');
          }
        }
      }

      const cell = this.$wrapper.find('#' + xpid);
      if(cell.hasClass('across')){
        const colRef = (xpid.split("-"))[0];
        checkIds(colRef, 'across');
      }else{
        const rowRef = (xpid.split("-"))[1];
        checkIds(rowRef, 'down');
      }
    },


    renderClue: function(){
      this.disableButtons(true, true);
      this.captureClue();
      this.addClueAndReference();
      this.togglePromptBox('block');
    },


    disableButtons: function(b1, b2){
      this.$addWordBtn.attr('disabled', b1);
      this.$increaseBtn.attr('disabled', b2);
      this.$decreaseBtn.attr('disabled', b2);
    },

    captureClue: function(){
      for(let id of this.currentIds){
        let letter = this.$wrapper.find('#' + id).val();
        this.sCurrentWord += letter.toLowerCase();
      }
    },


    addClueAndReference: function(){
      this.$insertClue.text(this.sCurrentWord);
      this.$insertReference.text(this.clueCounter + ' ' + this.orientation);
    },


    togglePromptBox: function(x){
      this.$clueBox.css('display', x);
    },


    confirmClue: function(){
      this.saveAsJSON.save();
      this.togglePromptBox('none');
      this.validateEndPoint();
      this.addNumber();
      this.addClasses();
      this.addAttributes();
      this.validateCrossPoint();
      this.writeClueToPage();
      this.resetGrid.init();
    },

    saveAsJSON:{
      newClue: function(word, reference, ids, clueEntry){
        this.word = word;
        this.reference = reference;
        this.ids = ids;
        this.clueEntry = clueEntry;
      },
  
      save: function(){
        const clue = new this.newClue(root.sCurrentWord, 
                    (root.clueCounter) + ' ' + root.orientation, 
                    root.currentIds,
                    root.$clueEntry.val());
        root.json.push(clue);
      }
    },

    addNumber: function(){
      const $firstLetter = this.$wrapper.find('#' + this.currentIds[0]);
      const newItem = (`<div class="number-wrapper">${this.clueCounter}</div>`);
      const hasSibling = $firstLetter.siblings().length === 1;
      if (!hasSibling){
        $firstLetter.parent().prepend(newItem);
      }
    },

    validateEndPoint: function(){
      const sp1 = this.currentIds[0].split("-");
      const sp2 = this.currentIds[this.currentIds.length - 1].split("-");

      function blackOutCell(id){
        const cell = root.$wrapper.find('#' + id);
        cell.removeClass('cell');
        cell.addClass('dead-cell');
        cell.prop('disabled', true);
      }
  
      if (this.orientation === 'across') {
        const row = +sp1[0];
        const l = +sp1[1]; 
        const r = +sp2[1];
        const lId = row + "-" + (l - 1);
        const rId = row + '-' + (r + 1);
  
        if (r < this.rows) blackOutCell(rId);
        if ((l - 1) !== 0) blackOutCell(lId);    
  
      }else if (this.orientation === 'down') {
        const col = +sp1[1];
        const u = +sp1[0];
        const d = +sp2[0];
        const dId = (d + 1) + '-' + col;
        const uId = (u - 1) + '-' + col;
  
        if (d <= this.rows) blackOutCell(dId);
        if ((u - 1) !== 0) blackOutCell(uId);
      }
      this.cacheCells();
    },

    validateCrossPoint: function(){
      for (let id of this.currentIds){
        const el = this.$wrapper.find('#' + id);
        const isCrossPoint = el.hasClass('cross-point');
        const ep = el.attr('data-ep');
        const x = id.split("-");
        let model;
        if (this.orientation === 'across' && isCrossPoint){
          if(id === this.currentIds[0]){
            if (ep === 'sp'){
              this.helperFunctions.deadCellsForCrossPoint.bottomRight(x);
              this.helperFunctions.noreinitOnReset(x, model = 1);
            }else if (ep === 'fp'){
              this.helperFunctions.deadCellsForCrossPoint.topRight(x);
              this.helperFunctions.noreinitOnReset(x, model = 7);
            }else{
              this.helperFunctions.deadCellsForCrossPoint.bottomRight(x);
              this.helperFunctions.deadCellsForCrossPoint.topRight(x);
              this.helperFunctions.noreinitOnReset(x, model = 4);
            }
          }else if(id === this.currentIds[this.currentIds.length - 1]){
            if (ep === 'sp'){
              this.helperFunctions.deadCellsForCrossPoint.bottomLeft(x);
              this.helperFunctions.noreinitOnReset(x, model = 3);
            }else if (ep === 'fp'){
              this.helperFunctions.deadCellsForCrossPoint.topLeft(x);
              this.helperFunctions.noreinitOnReset(x, model = 9);
            }else{
              this.helperFunctions.deadCellsForCrossPoint.bottomLeft(x);
              this.helperFunctions.deadCellsForCrossPoint.topLeft(x);
              this.helperFunctions.noreinitOnReset(x, model = 6);
            }
          }else{
            if (ep === 'sp'){
              this.helperFunctions.deadCellsForCrossPoint.bottomLeft(x);
              this.helperFunctions.deadCellsForCrossPoint.bottomRight(x);
              this.helperFunctions.noreinitOnReset(x, model = 2);
            }else if (ep === 'fp'){
              this.helperFunctions.deadCellsForCrossPoint.topLeft(x);
              this.helperFunctions.deadCellsForCrossPoint.topRight(x);
              this.helperFunctions.noreinitOnReset(x, model = 8);
            }else{
              this.helperFunctions.deadCellsForCrossPoint.bottomLeft(x);
              this.helperFunctions.deadCellsForCrossPoint.bottomRight(x);
              this.helperFunctions.deadCellsForCrossPoint.topLeft(x);
              this.helperFunctions.deadCellsForCrossPoint.topRight(x);
              this.helperFunctions.noreinitOnReset(x, model = 5);
            }
          }
        }else if (this.orientation === 'down' && isCrossPoint){
          if(id === this.currentIds[0]){
            if (ep === 'sp'){
              this.helperFunctions.deadCellsForCrossPoint.bottomRight(x);
              this.helperFunctions.noreinitOnReset(x, model = 1);
            }else if (ep === 'fp'){
              this.helperFunctions.deadCellsForCrossPoint.bottomLeft(x);
              this.helperFunctions.noreinitOnReset(x, model = 3);
            }else{
              this.helperFunctions.deadCellsForCrossPoint.bottomRight(x);
              this.helperFunctions.deadCellsForCrossPoint.bottomLeft(x);
              this.helperFunctions.noreinitOnReset(x, model = 2);
            }
          }else if(id === this.currentIds[this.currentIds.length - 1]){
            if (ep === 'sp'){
              this.helperFunctions.deadCellsForCrossPoint.topRight(x);
              this.helperFunctions.noreinitOnReset(x, model = 7);
            }else if (ep === 'fp'){
              this.helperFunctions.deadCellsForCrossPoint.topLeft(x);
              this.helperFunctions.noreinitOnReset(x, model = 9);
            }else{
              this.helperFunctions.deadCellsForCrossPoint.topRight(x);
              this.helperFunctions.deadCellsForCrossPoint.topLeft(x);
              this.helperFunctions.noreinitOnReset(x, model = 8);
            }
          }else{
            if (ep === 'sp'){
              this.helperFunctions.deadCellsForCrossPoint.topRight(x);
              this.helperFunctions.deadCellsForCrossPoint.bottomRight(x);
              this.helperFunctions.noreinitOnReset(x, model = 4);
            }else if (ep === 'fp'){
              this.helperFunctions.deadCellsForCrossPoint.topLeft(x);
              this.helperFunctions.deadCellsForCrossPoint.bottomLeft(x);
              this.helperFunctions.noreinitOnReset(x, model = 6);
            }else{
              this.helperFunctions.deadCellsForCrossPoint.bottomLeft(x);
              this.helperFunctions.deadCellsForCrossPoint.bottomRight(x);
              this.helperFunctions.deadCellsForCrossPoint.topLeft(x);
              this.helperFunctions.deadCellsForCrossPoint.topRight(x);
              this.helperFunctions.noreinitOnReset(x, model = 5);
            }
          }
        }    
      }
    },

    addClasses: function(){
      for(let id of this.currentIds){
        const cell = this.$wrapper.find('#' + id);
        const isSaved = cell.hasClass('savedWord');
        cell.removeClass('selected');
        cell.removeClass('cell');
        if(!isSaved){
          cell.addClass('savedWord');
          cell.addClass(this.orientation);
          cell.click(this.validateClicks.bind(this));
        }else{
          cell.addClass('cross-point');
          const getOrientation = cell.hasClass('across') ? 'across' : 'down';
          cell.removeClass(getOrientation);
          cell.off();
        }
      }
    },

    addAttributes: function(){
      for(let i = 0; i < this.currentIds.length; i++){
        const cell = this.$wrapper.find('#' + this.currentIds[i]);
        const hasAttr = cell.attr('data-ep');
        if (i === 0 && !hasAttr){
          cell.attr('data-ep', 'sp');
        }else if (i === this.currentIds.length - 1 && !hasAttr){
          cell.attr('data-ep', 'fp');
        }else if (!hasAttr){
          cell.attr('data-ep', 'mp');
        }
      }
    },

    writeClueToPage: function(){
      const $clueList = this.$wrapper.find('#' + this.orientation);
      const newItem = (`<div id="${this.clueCounter}-${this.orientation}" class="clue-wrapper"\>
                          <p class="font-clue">${root.clueCounter}. ${this.$clueEntry.val() || '-'}</p>\
                          <div>\
                            <button class="delete-button">\
                            <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>\
                            </button>\
                          </div>\
                        </div>`);
      if(this.clueCounter === 1) this.$clueList.css('display', 'block');
      $clueList.append(newItem);
    },

    cancelClue: function(){
      this.$clueBox.css('display', 'none');
      this.sCurrentWord = '';
      this.disableButtons(false, false);
    },

    resetGrid: {
      init: function(){
        this.disableAll();
        this.resetNoReinits();
        this.cacheSavedCells();
        this.resetSettings();
      },

      disableAll: function(){
        for (let cell of root.$allCells){
          cell.disabled = false;
        }
      },

      resetNoReinits: function(){
        for (let id of root.noreinits){
          const cell = root.$wrapper.find('#' + id);
          cell.removeClass('no-reinit');
          cell.prop('disabled', false);
        }
      },

      cacheSavedCells: function(){
        for (let id of root.currentIds){
          if (!root.savedCells.includes(id)) root.savedCells.push(id);
        }
      },

      resetSettings: function(){
        root.currentIds = [];
        if (root.newCrossPoint) this.clueCounter ++;
        root.sCurrentWord = '';
        root.$addWordBtn.attr('disabled', true);
        root.disableButtons(true, false);
        root.newCrossPoint = false;
      }
    },

    helperFunctions: {
      noreinitOnReset: function(x, model){
        const row = +x[0];
        const col = +x[1];
        const t = (row - 1) + "-" + col;
        const l = row + "-" + (col - 1);
        const r = row + "-" + (col + 1);
        const d = (row + 1) + "-" + col;
        const colSub = col - 1;
        const colAdd = col + 1;
        const rowSub = row - 1;
        const rowAdd = row + 1;
        let tlrd = [];
    
        if(model === 1){
          if(colSub < 1 && rowSub < 1){
            tlrd.push(d); 
            tlrd.push(r);
          }else if(colSub < 1){
            tlrd.push(d);
          }else if(rowAdd < 1){
            tlrd.push(r)
          }
        }else if(model === 2){
          if(rowSub < 1){
              tlrd.push(l);
              tlrd.push(r);
              tlrd.push(d);
          }else{
              tlrd.push(d);
          }
        }else if(model === 3){
            root.reverse_reinit.push(d);
          if (colAdd > root.rows && rowSub < 1){
              tlrd.push(l);
              tlrd.push(d);
          }else if(colAdd > root.rows){
              tlrd.push(d);
          }else if (rowSub < 1){
              tlrd.push(l);
          }   
        }else if(model === 4){
          if(colAdd < 3){
            tlrd.push(t);
            tlrd.push(r);
            tlrd.push(d);
          }else{
            tlrd.push(r);
          }
        }else if(model === 5){
          tlrd.push(t);
          tlrd.push(l);
          tlrd.push(r);
          tlrd.push(d);
        }else if(model === 6){
          console.log('running model 6');
          root.reverse_reinit.push(t);
          root.reverse_reinit.push(d);
          console.log(root.reverse_reinit);
          if(colAdd > root.rows){
            tlrd.push(t);
            tlrd.push(l);
            tlrd.push(d);
          }else{
            tlrd.push(l);
          }
        }else if(model === 7){
          if(colSub < 1 && rowAdd > root.rows){
            tlrd.push(t);
            tlrd.push(r);
          }else if(colSub < 1){
            tlrd.push(t);
          }else if(rowAdd > root.rows){
            tlrd.push(r)
          }
        }else if(model === 8){
          root.reverse_reinit.push(r);
          root.reverse_reinit.push(l);
          if(rowAdd > root.rows){
            tlrd.push(t);
            tlrd.push(l);
            tlrd.push(r);
          }else{
            tlrd.push(t);
          }
        }else if(model === 9){
          if (colAdd > root.rows && rowAdd > root.rows){
            tlrd.push(l);
            tlrd.push(t);
            root.reverse_reinit.push(l);
            root.reverse_reinit.push(t);
          }else if(colAdd > root.rows){
            tlrd.push(t);
            root.reverse_reinit.push(t);
          }else if (rowAdd > root.rows){
            tlrd.push(l);
            root.reverse_reinit.push(l);
          }else{
            root.reverse_reinit.push(l);
            root.reverse_reinit.push(t);
          }
        }
    
        for (let id of tlrd){
          const cell = root.$wrapper.find('#' + id);
          cell.removeClass('no-reinit');
          cell.addClass('no-reinit-on-reset');
          cell.off();
          cell.prop('disabled', true);
          const i = root.noreinits.indexOf(id);
          if (i !== -1) root.noreinits.splice(i, 1);
        }

      },//end helperFunctions.noreinitOnReset
    
      deadCellsForCrossPoint: {
        updateClassesAndCache: function(id){
          const cell = root.$wrapper.find('#' + id);
          cell.removeClass('cell');
          cell.addClass('dead-cell');
          root.cacheCells();
        },

        topLeft: function(x){
          const col = +x[0] - 1;
          const row = +x[1] - 1;
          this.updateClassesAndCache(col + "-" + row);
        },

        topRight: function(x){
          const row = +x[0] - 1;
          const col = +x[1] + 1;
          this.updateClassesAndCache(row + "-" + col);
        },

        bottomLeft: function(x){
          const row = +x[0] + 1;
          const col = +x[1] - 1;
          this.updateClassesAndCache(row + "-" + col);
        },

        bottomRight: function(x){
          const row = +x[0] + 1;
          const col = +x[1] + 1;  
          this.updateClassesAndCache(row + "-" + col);
        }
      }//end helperFunctions.deadCellsForCrossPoint
    
    },

  }//end object

  root.init();
})();




