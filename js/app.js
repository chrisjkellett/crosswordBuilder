
(function(){
  const root = {
    settings: function(){
      this.rows = 6;
      this.init = 1;
      this.max = 10;
      this.min = 4;
      this.sCurrentWord = '';
      this.clueCounter = 1;
      this.validationCounter = 0;
      this.orientation = 'across';
      this.currentIds = [];
      this.json = [];
      this.noreinits = [];
      this.reverse_reinit = [];
      this.savedCells = [];
      this.deadCells = [];
      this.associatedDeadCells = [];
      this.endPoints = [];
      this.crossPoints = [];
      this.noreinitsonreset = [];
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
      this.$undoBtn = this.$wrapper.find('#undoBtn');
      this.$allCells = this.$wrapper.find('.cell');
      this.$alertBox = this.$wrapper.find('#alertBox');
      this.$clueBox = this.$wrapper.find('#clueBox');
      this.$insertClue = this.$wrapper.find('#insertClue');
      this.$insertReference = this.$wrapper.find('#insertReference');
      this.$alertMessage = this.$wrapper.find('#alertMessage');
      this.$alertCancel = this.$wrapper.find('#alertCancel');
      this.$alertConfirm = this.$wrapper.find('#alertConfirm');
      this.$addWordBtn = this.$wrapper.find('#addWordBtn');
      this.$confirmClueBtn = this.$wrapper.find('#confirmClue');
      this.$clueEntry = this.$wrapper.find('#clueEntry');
      this.$cancelClueBtn = this.$wrapper.find('#cancelClue');
      this.$clueList = this.$wrapper.find('#clueList');
      this.$makeCrossword = this.$wrapper.find('#makeCrossword');
      this.$welcome = this.$wrapper.find('#welcomeInfo');
    },


    bindEvents: function(){
      this.$crossword.keyup(this.cellInputHandler.init.bind(this.cellInputHandler));
      this.$crossword.keyup(this.navigateGrid.bind(this));
      this.$crossword.keypress(this.validateInput.bind(this));
      this.$crossword.keypress(this.renderByEnter.bind(this));
      this.$increaseBtn.click(this.increaseSize.init.bind(this.increaseSize));
      this.$decreaseBtn.click(this.decreaseSize.init.bind(this.decreaseSize));
      this.$undoBtn.click(this.undoClue.init.bind(this.undoClue));
      this.$alertCancel.click(this.alertCancel.bind(this));
      this.$alertConfirm.click(this.undoClue.init.bind(this.undoClue, true));
      this.$addWordBtn.click(this.renderClue.init.bind(this.renderClue));
      this.$cancelClueBtn.click(this.renderClue.cancelClue.bind(this.renderClue));
      this.$confirmClueBtn.click(this.confirmClue.init.bind(this.confirmClue));
      this.$makeCrossword.click(this.makeCrossword.init.bind(this.makeCrossword));
      this.$clueEntry.change(this.confirmClue.init.bind(this.confirmClue));

    },
    
    generateGrid: function(){
      for (let i = 1; i < this.rows + 1; i++){
        let newItem = $(`<div id="r-${i}"></div>`);
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


    alertCancel: function(){
      this.$alertBox.css('display', 'none');
    },

    increaseSize: {
      init: function(){
        if (root.rows < root.max){
          this.addRow();
          root.makeCells();
          this.addCellstoColumn();
          root.cacheCells();
          this.revalidate();
          this.runNoReinits();
          this.checkinvalids();
          this.addInvalids();
        }else{
          const message = 'Exceeds maximum grid size';
          root.alertBox(message);
        }
      },

      addRow: function(){
        root.rows ++;
        const newItem = $(`<div id="r-${root.rows}"></div>`);
        root.$crossword.append(newItem);
      },

      addCellstoColumn: function(){
        for (let i = 1; i < root.rows; i++){
          let row = root.$wrapper.find('#r-' + i);
          let newItem = $(`<div class="cell-wrapper">\
          <input type="text" maxlength="1" id="${i}-${root.rows}"\
           class="cell row-${i} col-${root.rows}" /></div>`);
          row.append(newItem);
        }
      },

      revalidate: function(){
        for (let id of root.currentIds){
          root.validateGrid(id);
        }
      },

      runNoReinits: function(){
        if (root.currentIds.length !== 0){
          root.setNoReinits.init(root.currentIds[0]);
          //##flaw - needs to be cycled through?
        }
      },

      checkinvalids: function(){
        for (let id of root.reverse_reinit){
          const el = root.$wrapper.find('#' + id);
          el.removeClass('no-reinit-on-reset');
          el.prop('disabled', false);
          el.click(root.cellClickHandler.init.bind(root.cellClickHandler));
        }
      },

      addInvalids: function(){
        for(let id of root.deadCells){
          if(id.includes(root.rows)){
            let cell = root.$wrapper.find('#' + id);
            cell.removeClass('cell');
            cell.addClass('dead-cell');
            cell.prop('disabled', true);
          }
        }
      }
    },

    decreaseSize: {
      init: function(){
        if(this.checkSavedCells()){
          const message = 'Reducing size would delete clues.';
          root.alertBox(message);
        }else if(root.rows <= root.min){
          const message = 'Cannot reduce further. Minimum size for this crossword is set to 4.';
          root.alertBox(message);
        }else{
          this.deleteCells();
          this.updateSettings();
          this.updateGlobals();
        }
      },

      checkSavedCells: function(){
        for (let id of root.savedCells){
          if(id.includes(root.rows)){
            return true;
          }
        }
      },

      deleteCells: function(){
        const row = root.$wrapper.find('#r-' + (root.rows));
        row.remove();
        for (let i = 1; i < root.rows; i++){
          let row = root.$wrapper.find('#r-' + i);
          row.children().last().remove();
        }
      },
      
      updateSettings: function(){
        for (let id of root.reverse_reinit){
          const $cell = root.$wrapper.find('#' + id);
          $cell.addClass('no-reinit-on-reset');
          $cell.off();
          $cell.prop('disabled', 'true');
        }
      },

      updateGlobals: function(){
        root.rows --;
        root.init --;
        root.cacheCells();
      }
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

    cellInputHandler: {
      init: function(e){
        this.settings(e);
        this.toggleClasses();
        this.customSort();
        this.autoSelect();
      },

      settings: function(e){
        this.cell = e.target;
        this.id = this.cell.id;
        this.splitId = this.id.split("-");
        this.isSelected = this.cell.className.includes('selected');
        this.noValue = this.cell.value === '';
        this.inList = root.currentIds.includes(this.id);
        this.isTab = e.key === 'Tab';
      },

      toggleClasses: function(){
        if(!this.isSelected && !this.noValue && !this.inList && !this.isTab){
          this.cell.classList.add('selected');
          root.currentIds.push(this.id);
          this.validate(this.id);
        }else if (this.isSelected && this.noValue && !this.isTab){
          this.cell.classList.remove('selected');
          const i = root.currentIds.indexOf(this.id);
          root.currentIds.splice(i, 1);
          this.validate(this.id);
        }
      },

      customSort: function(){
        root.currentIds.sort(function(a, b){
          return a.split("-")[1] - b.split("-")[1];
        });
      },

      validate: function(id){
        root.validateGrid(id);
        root.validateWordLength();
        root.validateWordStructure.init();
        root.validateReset();
        root.validationCounter ++;
      },

      autoSelect: function(){
        this.cell.select();
      }

    },

    cellClickHandler: {
      init: function(e){
        this.settings(e);
        this.toggleClasses(e);
        this.autoFocus();
      },

      settings: function(e){
        this.cell = e.target;
        this.id = this.cell.id;
        this.splitId = this.id.split("-");
        this.isSelected = this.cell.className.includes('selected');
        this.isSaved = this.cell.className.includes('savedWord');
        this.noValue = this.cell.value === '';
        this.inList = root.currentIds.includes(this.id);
        this.isTab = e.key === 'Tab';
      },

      toggleClasses: function(e){
        if(!this.isSelected && this.isSaved){
          this.cell.classList.add('selected');
          this.cell.readOnly = true;
          root.currentIds.push(this.id);
          this.validate(this.id, true);
        }else if (this.isSelected && this.isSaved){
          this.cell.classList.remove('selected');
          const i = root.currentIds.indexOf(this.id);
          root.currentIds.splice(i, 1);
          this.validate(this.id, false);
        }
      },

      validate: function(id, required){
        root.validateGrid(id);
        root.validateWordLength();
        root.validateWordStructure.init();
        if(required ? root.setNoReinits.init(id) : root.resetNoReinits(id));
        root.validationCounter ++;
        if(root.json.length > 1 && !this.isSelected) root.validateByAxis.init(id);
        root.validateReset();
      },

      autoFocus: function(){
        if(root.currentIds.length > 0){
          if(root.orientation === 'down'){
            const nextId = this.splitId[0] + '-' + (+this.splitId[1] + 1);
            const nextCell = root.$wrapper.find('#' + nextId);
            nextCell.focus();
          }else{
            const nextId = (+this.splitId[0] + 1) + '-' + this.splitId[1];
            const nextCell = root.$wrapper.find('#' + nextId);
            nextCell.focus();
          }
        }
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


    validateByAxis: {
      init: function(targetId){
        this.settings(targetId);
        this.createArray();
        if (this.deadIdsArray.length > 0) this.prevalidate();
      },

      settings: function(targetId){
        this.sp = targetId.split("-");
        this.cell = root.$wrapper.find('#' + targetId);
        this.orientation = this.cell.hasClass('across') ? 'down' : 'across';
        this.index = this.orientation === 'down' ? 1 : 0;
        this.elsArray = [];
        this.deadIdsArray = [];
      },

      createArray: function(){
        for (let i = 1; i < root.rows + 1; i++){
          if(this.orientation === 'down'){
            let id = i + '-' + this.sp[this.index];
            let cell = root.$wrapper.find('#' + id);
            this.getDeadCells(cell, id);
            this.elsArray.push(cell);
          }else{
            let id = this.sp[this.index] + '-' + i;
            let cell = root.$wrapper.find('#' + id);
            this.getDeadCells(cell, id);
            this.elsArray.push(cell);
          }
        }
      },

      getDeadCells: function(cell, id){
        if (cell.hasClass('dead-cell')){ 
          this.deadIdsArray.push(id);
          }
      },

      prevalidate: function(){
        this.index = this.orientation === 'down' ? 0 : 1;
        const $sp = this.deadIdsArray[0].split("-");
        const target_ = this.sp[this.index];
        const dead_ = $sp[this.index];
        this.validate(+target_, +dead_);
      },

      validate: function(target_, dead_){
        if (target_ > dead_){
          for (let i = 0; i < dead_ - 1; i++){
           this.elsArray[i].prop('disabled', true);
          }
        }else{
          for (let i = target_ + 1; i < root.rows; i++){
            this.elsArray[i].prop('disabled', true);
          }
        }
      }
    },
    
    validateWordLength: function(){
      if (this.currentIds.length < 2)
        this.$addWordBtn.attr('disabled', true);
      else
        this.$addWordBtn.removeAttr('disabled');
    },

    validateWordStructure: {
      init: function(){
        let cols = []; 
        let rows = [];
        for (let id of root.currentIds){
          let sp = id.split("-");
          //push column reference to cols array
          cols.push(+sp[0]);
          cols.sort(function compareNumbers(a, b) {
            return a - b;
          });

          //push rows reference to rows array
          rows.push(+sp[1]);
          rows.sort(function compareNumbers(a, b) {
            return a - b;
          });
        }

        this.run(cols, rows);
      },

      run: function(cols, rows){
        let testFails, isRow, isColumn;
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

        this.update(testFails, isRow, isColumn, mustCross);
      },

      update: function(testFails, isRow, isColumn, mustCross){
        if(testFails){
          root.$addWordBtn.attr('disabled', true);
        }else if(isRow){
          root.orientation = 'across';
        }else if(isColumn){
          root.orientation = 'down';
        }
      }
    },


    validateInput: function(e){
      if (e.charCode < 64 && e.charCode !== 13|| e.charCode > 122 && e.charCode !== 13) {
        const message = 'Non alphanumeric characters cannot form part of a word';
        e.preventDefault();
        this.alertBox(message);
      }
    },


    validateReset: function(){
      if(this.currentIds.length < 2 && !this.newCrossPoint && this.validationCounter > 1){
        for (let cell of this.$allCells){
          cell.disabled = false;
        }

      }
      if (this.currentIds.length === 1){
        this.validateGrid(this.currentIds[0]);
      }

      if(this.currentIds.length === 0){
        root.validationCounter = 0;
      }
    },

    setNoReinits: {
      init: function(targetId){
        const sp = targetId.split("-");
        const cell = root.$wrapper.find('#' + targetId);
        if(root.$wrapper.find('#' + targetId).hasClass('across')){
          this.getOrientation(targetId, ref = sp[0], position = 'across');
          this.validateOtherCells(targetId, ref = sp[1], 1);
        }else{
          this.getOrientation(targetId, ref = sp[1], position = 'down');
          this.validateOtherCells(targetId, ref = sp[0], 0);
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
          cell.prop('disabled', true);
          cell.addClass('no-reinit');
          root.noreinits.push(id);
        }
      }
    },

    resetNoReinits: function(){
      for (let id of root.noreinits){
        const cell = root.$wrapper.find('#' + id);
        cell.removeClass('no-reinit');
        cell.prop('disabled', false);
      }
    },

    renderByEnter: function(e){
      if(e.charCode === 13){
      this.renderClue.init();
      root.$clueEntry.focus();
      }
    },

    renderClue: {
      init: function(){
        this.disableButtons(true, true);
        this.captureText();
        this.addClueAndReference();
        this.togglePromptBox('block');
        root.$clueEntry.focus();
      },

      disableButtons: function(b1, b2){
        root.$addWordBtn.attr('disabled', b1);
        root.$increaseBtn.attr('disabled', b2);
        root.$decreaseBtn.attr('disabled', b2);
      },

      captureText: function(){
        for(let id of root.currentIds){
          let letter = root.$wrapper.find('#' + id).val();
          root.sCurrentWord += letter.toLowerCase();
        }
      },

      addClueAndReference: function(){
        root.$insertClue.text(root.sCurrentWord);
        const firstCellHasNumber = this.checkFirstCell();
        if (firstCellHasNumber) root.clueCounter --;
        root.$insertReference.text(root.clueCounter + ' ' + root.orientation);
      },

      checkFirstCell: function(){
        const firstCell = root.$wrapper.find('#' + root.currentIds[0]);
        const firstCellHasNumber = firstCell.attr('data-ep') === 'sp';
        return firstCellHasNumber;
      },

      togglePromptBox: function(x){
        root.$clueBox.css('display', x);
      },

      cancelClue: function(){
        root.$clueBox.css('display', 'none');
        root.sCurrentWord = '';
        root.$clueEntry.val(" ");
        this.disableButtons(false, false);
        const firstCellHasNumber = this.checkFirstCell();
        if (firstCellHasNumber) root.clueCounter ++;
      },
    },

    confirmClue: {
      init: function(){
        root.renderClue.togglePromptBox('none');
        this.validateEndPoint();
        this.addNumber();
        this.addClasses();
        root.cacheCells();
        this.addAttributes();
        this.validateCrossPoint();
        const crosspointIds = this.saveAsJSON.checkForCrossPoints();   
        this.saveAsJSON.save(crosspointIds);   
        this.writeClueToPage.init();
        root.resetGrid.init();
      },

      addNumber: function(){
        const $firstLetter = root.$wrapper.find('#' + root.currentIds[0]);
        const newItem = (`<div class="number-wrapper">${root.clueCounter}</div>`);
        const hasSibling = $firstLetter.siblings().length === 1;
        if (!hasSibling){
          $firstLetter.parent().prepend(newItem);
        }
      },

      validateEndPoint: function(){
        const sp1 = root.currentIds[0].split("-");
        const sp2 = root.currentIds[root.currentIds.length - 1].split("-");
  
        function blackOutCell(id, ref){
          //if cell exists
          if (ref < root.rows){
            const cell = root.$wrapper.find('#' + id);
            cell.removeClass('cell');
            cell.addClass('dead-cell');
            cell.prop('disabled', true);
          }
          //stores plus 1s in db
          root.endPoints.push(id);
          root.deadCells.push(id);
          root.associatedDeadCells.push(id);
        }
    
        if (root.orientation === 'across') {
          const row = +sp1[0];
          const l = +sp1[1]; 
          const r = +sp2[1];
          const lId = row + "-" + (l - 1);
          const rId = row + '-' + (r + 1);
    
          //if (r < root.rows)
          blackOutCell(rId, r);
          if ((l - 1) !== 0) blackOutCell(lId);    
    
        }else if (root.orientation === 'down') {
          const col = +sp1[1];
          const u = +sp1[0];
          const d = +sp2[0];
          const dId = (d + 1) + '-' + col;
          const uId = (u - 1) + '-' + col;
    
          //if (d <= root.rows) 
          blackOutCell(dId, d);
          if ((u - 1) !== 0) blackOutCell(uId);
        }
        root.cacheCells();
      },

      validateCrossPoint: function(){
        for (let id of root.currentIds){
          const el = root.$wrapper.find('#' + id);
          const isCrossPoint = el.hasClass('cross-point');
          const ep = el.attr('data-ep');
          const x = id.split("-");
          let model;
          if (root.orientation === 'across' && isCrossPoint){
            if(id === root.currentIds[0]){
              if (ep === 'sp'){
                root.helperFunctions.deadCellsForCrossPoint.bottomRight(x);
                root.helperFunctions.noreinitOnReset(x, model = 1);
              }else if (ep === 'fp'){
                root.helperFunctions.deadCellsForCrossPoint.topRight(x);
                root.helperFunctions.noreinitOnReset(x, model = 7);
              }else{
                root.helperFunctions.deadCellsForCrossPoint.bottomRight(x);
                root.helperFunctions.deadCellsForCrossPoint.topRight(x);
                root.helperFunctions.noreinitOnReset(x, model = 4);
              }
            }else if(id === root.currentIds[root.currentIds.length - 1]){
              if (ep === 'sp'){
                root.helperFunctions.deadCellsForCrossPoint.bottomLeft(x);
                root.helperFunctions.noreinitOnReset(x, model = 3);
              }else if (ep === 'fp'){
                root.helperFunctions.deadCellsForCrossPoint.topLeft(x);
                root.helperFunctions.noreinitOnReset(x, model = 9);
              }else{
                root.helperFunctions.deadCellsForCrossPoint.bottomLeft(x);
                root.helperFunctions.deadCellsForCrossPoint.topLeft(x);
                root.helperFunctions.noreinitOnReset(x, model = 6);
              }
            }else{
              if (ep === 'sp'){
                root.helperFunctions.deadCellsForCrossPoint.bottomLeft(x);
                root.helperFunctions.deadCellsForCrossPoint.bottomRight(x);
                root.helperFunctions.noreinitOnReset(x, model = 2);
              }else if (ep === 'fp'){
                root.helperFunctions.deadCellsForCrossPoint.topLeft(x);
                root.helperFunctions.deadCellsForCrossPoint.topRight(x);
                root.helperFunctions.noreinitOnReset(x, model = 8);
              }else{
                root.helperFunctions.deadCellsForCrossPoint.bottomLeft(x);
                root.helperFunctions.deadCellsForCrossPoint.bottomRight(x);
                root.helperFunctions.deadCellsForCrossPoint.topLeft(x);
                root.helperFunctions.deadCellsForCrossPoint.topRight(x);
                root.helperFunctions.noreinitOnReset(x, model = 5);
              }
            }
          }else if (root.orientation === 'down' && isCrossPoint){
            if(id === root.currentIds[0]){
              if (ep === 'sp'){
                root.helperFunctions.deadCellsForCrossPoint.bottomRight(x);
                root.helperFunctions.noreinitOnReset(x, model = 1);
              }else if (ep === 'fp'){
                root.helperFunctions.deadCellsForCrossPoint.bottomLeft(x);
                root.helperFunctions.noreinitOnReset(x, model = 3);
              }else{
                root.helperFunctions.deadCellsForCrossPoint.bottomRight(x);
                root.helperFunctions.deadCellsForCrossPoint.bottomLeft(x);
                root.helperFunctions.noreinitOnReset(x, model = 2);
              }
            }else if(id === root.currentIds[root.currentIds.length - 1]){
              if (ep === 'sp'){
                root.helperFunctions.deadCellsForCrossPoint.topRight(x);
                root.helperFunctions.noreinitOnReset(x, model = 7);
              }else if (ep === 'fp'){
                root.helperFunctions.deadCellsForCrossPoint.topLeft(x);
                root.helperFunctions.noreinitOnReset(x, model = 9);
              }else{
                root.helperFunctions.deadCellsForCrossPoint.topRight(x);
                root.helperFunctions.deadCellsForCrossPoint.topLeft(x);
                root.helperFunctions.noreinitOnReset(x, model = 8);
              }
            }else{
              if (ep === 'sp'){
                root.helperFunctions.deadCellsForCrossPoint.topRight(x);
                root.helperFunctions.deadCellsForCrossPoint.bottomRight(x);
                root.helperFunctions.noreinitOnReset(x, model = 4);
              }else if (ep === 'fp'){
                root.helperFunctions.deadCellsForCrossPoint.topLeft(x);
                root.helperFunctions.deadCellsForCrossPoint.bottomLeft(x);
                root.helperFunctions.noreinitOnReset(x, model = 6);
              }else{
                root.helperFunctions.deadCellsForCrossPoint.bottomLeft(x);
                root.helperFunctions.deadCellsForCrossPoint.bottomRight(x);
                root.helperFunctions.deadCellsForCrossPoint.topLeft(x);
                root.helperFunctions.deadCellsForCrossPoint.topRight(x);
                root.helperFunctions.noreinitOnReset(x, model = 5);
              }
            }
          }    
        }
      },
  
      saveAsJSON:{
        newClue: function(word, reference, ids, clueEntry, crossPointCell, endPoints, crossPoints, noreinits){
          this.word = word;
          this.reference = reference;
          this.ids = ids;
          this.clueEntry = clueEntry;
          this.crossPointCell = crossPointCell;
          this.endPoints = endPoints;
          this.crossPoints = crossPoints;
          this.noreinits = noreinits;
        },
    
        save: function(crosspointIds){
          const clue = new this.newClue(root.sCurrentWord, 
                      (root.clueCounter) + '-' + root.orientation, 
                      root.currentIds,
                      root.$clueEntry.val(),
                      crosspointIds || [],
                      root.endPoints.sort(),
                      root.crossPoints.sort(),
                      root.noreinitsonreset.sort()
                      );
          root.json.push(clue);
        },

        checkForCrossPoints: function(){
          let cell, isCrossPoint;
          let crosspointArray = [];
          let crosspointIds = [];
          for (let id of root.currentIds){
            cell = root.$wrapper.find('#' + id);
            isCrossPoint = cell.hasClass('cross-point');
            if (isCrossPoint){
              crosspointArray.push(cell);
              crosspointIds.push(id);
            }
          }
          if (crosspointArray.length > 0) {
            this.assessCrossPoints(crosspointArray, crosspointIds);
            return crosspointIds;
          }
        },

        assessCrossPoints: function(crosspointArray, crosspointIds){
          let clueIdArray = [];
          for (let item of crosspointArray){
            clueIdArray.push(item.attr('clueId'));
          }
          this.loopCrossPoints(clueIdArray, crosspointIds);
        },

        loopCrossPoints: function(clueIdArray, crosspointIds){
          let getAssociation;
          let sp;
          let currentReference = root.clueCounter + '-' + root.orientation;
          for (let clueId of clueIdArray){
            sp = clueId.split('/');
            if (currentReference === sp[0]){
              this.getKey(sp[1], crosspointIds);
            }else{
              this.getKey(sp[0], crosspointIds);
            }
          }
        },

        getKey: function(clueId, crosspointIds){
          $.each(root.json, function(key, value){
            if (value.reference === clueId){
              root.confirmClue.saveAsJSON.getAssociatedCrossPoints(key, crosspointIds);
            }
          }); 
        },

        getAssociatedCrossPoints: function(key, crosspointIds){
          root.json[key].crossPointCell = crosspointIds;
          root.json[key].crossPoints = root.crossPoints.sort();
          root.json[key].noreinits = root.noreinitsonreset.sort();
        }
      },
  
      addClasses: function(){
        for(let id of root.currentIds){
          const cell = root.$wrapper.find('#' + id);
          const isSaved = cell.hasClass('savedWord');
          cell.removeClass('selected');
          cell.removeClass('cell');
          if(!isSaved){
            cell.addClass('savedWord');
            cell.addClass(root.orientation);
            cell.off(); 
            cell.click(root.cellClickHandler.init.bind(root.cellClickHandler));
            cell.attr('clueId', root.clueCounter + '-' + root.orientation);
            cell.val().toLowerCase();
          }else{
            cell.addClass('cross-point');
            const getOrientation = cell.hasClass('across') ? 'across' : 'down';
            cell.removeClass(getOrientation);
            cell.attr('clueId', function(i, val){
              return val + '/' + root.clueCounter + '-' + root.orientation;
            });
          }
        }
      },
  
      addAttributes: function(){
        for(let i = 0; i < root.currentIds.length; i++){
          const cell = root.$wrapper.find('#' + root.currentIds[i]);
          const hasAttr = cell.attr('data-ep');
          if (i === 0 && !hasAttr){
            cell.attr('data-ep', 'sp');
          }else if (i === root.currentIds.length - 1 && !hasAttr){
            cell.attr('data-ep', 'fp');
          }else if (!hasAttr){
            cell.attr('data-ep', 'mp');
          }
        }
      },
  
      writeClueToPage: {
        init: function(){
          const clueList = this.getClueList();
          const newItem = this.createElement();
          this.updateDOM(clueList, newItem);
        },
  
        getClueList: function(){
          const $clueList = root.$wrapper.find('#' + root.orientation);
          return $clueList;
        },
  
        createElement: function(){
          const newItem = $(`<div id="${root.clueCounter}-${root.orientation}" class="clue-wrapper"\>
                          <p class="font-clue">${root.clueCounter}. ${root.$clueEntry.val() || '-'}</p>\
                        </div>`);
          return newItem;
        },
  
        updateDOM: function(clueList, newItem){
          if(root.clueCounter === 1){
            root.$clueList.css('display', 'block');
            root.$welcome.css('display', 'none');
          }
          clueList.append(newItem);
        }
      }
    },

    undoClue: {
      init: function(e, confirmed){
        const i = root.json.length - 1;
        if (i !== -1){
          this.promptToDelete.init(i);
          if(confirmed){
            this.getHTML(i);
            this.getCells(i);
            this.removeAssociatedDeadCells.init(i);
            this.updateSettings(i);
            this.updateCounter();
            this.removeFromJSON(i);
            root.cacheCells();
            root.alertCancel();
            this.resetAlertMods();
          }
        }else{
          const message = 'No clues to be deleted';
          root.alertBox(message);
        }
      },

      promptToDelete: {
        init: function(i){
          this.modCancel();
          this.addConfirm();
          this.showAlert(this.getClueId(i));
        },

        modCancel: function(){
          root.$alertCancel.html('Cancel');
        },

        addConfirm: function(){
          root.$alertConfirm.css('display', 'inline');
        },

        getClueId: function(i){
          if (i !== -1){
            return root.json[i].reference;
          }else{
            return -1;
          }
        },

        showAlert: function(clueId){
          const message = 'Are you sure you want to delete ' + clueId + '?';
          root.alertBox(message);
        }
      },

      getHTML: function(i){
        const html = root.$clueList.find('#' + root.json[i].reference);
        html.remove();
      },

      getCells: function(index){
        const ids = root.json[index].ids;
        let $cell;
        for (let i = 0; i < ids.length; i++){
          $cell = root.$wrapper.find('#' + ids[i]);
          let isCrossPoint = this.isCrossPoint($cell);
          if(!isCrossPoint){
            if (i === 0) this.removeNumber($cell);
            this.updateClasses($cell);
            this.removeValue($cell);
            this.removeAttributes($cell, index);
          }else{
            if (i === 0 && this.numberFromOtherClue($cell)){
              this.removeNumber($cell);
            }
            $cell.removeClass('cross-point');
            this.updateXPAttributes($cell, index);
          }
        }
      },

      numberFromOtherClue: function($cell, index){
        const getAttr = $cell.attr('clueId').split("/");
        const ref1 = getAttr[0].split("-")[0];
        const ref2 = getAttr[1].split("-")[0];
        if(ref1 !== ref2){
          return true;
        }else{
          return false;
        }
      },

      isCrossPoint: function($cell){
        return $cell.hasClass('cross-point');
      },

      removeNumber: function($cell){
        const number = $cell.prev();
        number.remove();
      },

      updateClasses: function($cell){
        $cell.removeClass('savedWord');
        $cell.removeClass('across');
        $cell.removeClass('down');
        let reset = $cell.removeClass('no-reinit-on-reset');
        if(reset) $cell.prop('disabled', false);
        $cell.prop('readOnly', false);
        $cell.addClass('cell');
      },

      removeValue: function($cell){
        $cell.val("");
      },

      removeAttributes: function($cell, index){
        $cell.removeAttr('data-ep');
      },

      updateXPAttributes: function($cell, index){
        const getAttr = $cell.attr('clueId').split("/");
        let newAttr;
        if(getAttr[0] === root.json[index].reference){
          newAttr = getAttr[1];
        }else{
          newAttr = getAttr[0];
        }
        $cell.attr('clueId', newAttr);
        $cell.addClass(newAttr.split("-")[1]);
      },

      removeAssociatedDeadCells: {
        init: function(index){
          this.removeEndpoints(index);
          this.removeCrossPoints(index);
          if(index !== 0){
            this.removeReinits(index);
          }
        },

        removeEndpoints: function(index){
          let cell;
          for (let id of root.json[index].endPoints){
            cell = root.$wrapper.find('#' + id);
            cell.addClass('cell');
            cell.removeClass('dead-cell');
            cell.prop('disabled', false);
            let i = root.deadCells.indexOf(id);
            root.deadCells.splice(i, 1);
          }
        },

        removeCrossPoints: function(index){
          let cell;
          for (let id of root.json[index].crossPoints){
            cell = root.$wrapper.find('#' + id);
            if(this.notDependentCrossPoint(id)){
              cell.addClass('cell');
              cell.removeClass('dead-cell');
              cell.prop('disabled', false);
              let i = root.deadCells.indexOf(id);
              root.deadCells.splice(i, 1);
            }
          }
        },

        notDependentCrossPoint: function(id){
          $.each(root.json, function(key, value){
            if (!value.crossPoints.includes(id)){
              return false;
            }else{
              return true;
            }
          });
        },

        removeReinits: function(index){
          //compare arrays 
          let prevReinits = root.json[index - 1].ids.filter(function(item){
            return root.json[index].noreinits.includes(item);
          });
          //loop and change results
          for (let id of prevReinits){
            let cell = root.$wrapper.find('#' + id);
            cell.removeClass('no-reinit-on-reset');
            cell.prop('readOnly', true);
            cell.off(); 
            cell.click(root.cellClickHandler.init.bind(root.cellClickHandler));
          }
        }
      },

      updateSettings: function(index){
        for (let id of root.json[index].ids){
          if(!root.json[index].crossPointCell.includes(id)){
            let idIndex = root.savedCells.indexOf(id);
            root.savedCells.splice(idIndex, 1);
          }
        }
      },

      updateCounter: function(){
        //root.clueCounter --;
      },

      removeFromJSON: function(index){
        root.json.splice(index, 1);
      },

      resetAlertMods: function(){
        root.$alertCancel.html('Ok');
        root.$alertConfirm.css('display', 'none');
      }
    },

    resetGrid: {
      init: function(){
        this.enableAll();
        root.resetNoReinits();
        this.cacheSavedCells();
        this.resetSettings();
        this.validSize();
      },

      enableAll: function(){
        for (let cell of root.$allCells){
          cell.disabled = false;
        }
      },

      cacheSavedCells: function(){
        for (let id of root.currentIds){
          if (!root.savedCells.includes(id)) {
            root.savedCells.push(id);
          }
        }
      },

      resetSettings: function(){
        root.currentIds = [];
        root.$clueEntry.val(" ");
        root.clueCounter ++;
        root.sCurrentWord = '';
        root.$addWordBtn.attr('disabled', true);
        root.renderClue.disableButtons(true, false);
        root.newCrossPoint = false;
        root.validationCounter = 0;
        root.associatedDeadCells = [];
        root.endPoints = [];
        root.crossPoints = [];
        root.noreinitsonreset = [];
      },

      validSize: function(){
        if (root.json.length < 4)
          root.$makeCrossword.attr('disabled', true);
        else
          root.$makeCrossword.removeAttr('disabled');
      }
    },

    makeCrossword: {
      init: function(){
        const message = 'Work in progress. Clicking here generates a URL with the crossword to be completed';
        root.alertBox(message);
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
          root.reverse_reinit.push(t);
          root.reverse_reinit.push(d);
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
          root.noreinitsonreset.push(id);
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
          root.deadCells.push(id);
          root.associatedDeadCells.push(id);
          root.crossPoints.push(id);
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




