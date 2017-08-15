
(function(){
  const module = {
    settings: function(){
      this.rows = 6;
      this.init = 1;
      this.max = 10;
      this.min = 4;
      this.currentWord = [];
      this.orientation = 'across';
      this.myKeyCommands = false;
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
    },


    bindEvents: function(){
      this.$crossword.keyup(this.validateCells.bind(this));
      this.$crossword.keyup(this.navigateGrid.bind(this));
      this.$crossword.keypress(this.validateInput.bind(this));
      this.$increaseBtn.click(this.increaseSize.bind(this));
      this.$decreaseBtn.click(this.decreaseSize.bind(this));
      this.$alertConfirm.click(this.alertBoxConfirm.bind(this));
      this.$addWordBtn.click(this.renderClue.bind(this));
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
          <input type="text" maxlength="1" id="${i}.${j}" class="cell row-${i} col-${j}" /></div>`);
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
          <input type="text" maxlength="1" id="${i}.${this.rows}"\
           class="cell row-${i} col-${this.rows}" /></div>`);
          $row.append(newItem);
        }
        this.makeCells(this.rows, this.init);
        for (let id of this.currentWord){
          this.validateGrid(id);
        }
      }
      
      else{
        const message = 'Exceeds maximum grid size';
        this.alertBox(message);
      }
    },


    decreaseSize: function(){
      const message = 'Not currently working';
      this.alertBox(message);
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
      const c = this.currentWord.includes(id);

      if (!a && !b && !c){
        cell.classList.add('selected');
        this.currentWord.push(id);
        this.validateGrid(id);
        this.validateWordLength();
        this.validateWordStructure();
        this.validateReset();
      }
      else if (a && b){
        cell.classList.remove('selected');
        const i = this.currentWord.indexOf(id);
        this.currentWord.splice(i, 1);
        this.validateGrid(id);
        this.validateWordLength();
        this.validateWordStructure();
        this.validateReset();
      }
      //console.log(this.currentWord);
    },


    validateGrid: function(id){
      const sp = id.split(".");
      const col = sp[0];
      const row = sp[1];
      let list = [];
      for (let cell of this.$allCells){
        let $sp = cell.id.split(".");
        let $col = $sp[0];
        let $row = $sp[1];
        if (!(row === $row || col === $col) || cell.className.includes('dead'))
          cell.disabled = true;
      }
    },


    validateWordLength: function(){
      if (this.currentWord.length < 2)
        this.$addWordBtn.attr('disabled', true);
      else
        this.$addWordBtn.removeAttr('disabled');
    },


    validateWordStructure: function(){
      this.currentWord.sort();
      let cols = []; 
      let rows = [];
      let testFails, isRow, isColumn;
      for (let id of this.currentWord){
        let sp = id.split(".");
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
      if(this.currentWord.length < 2){
        for (let cell of this.$allCells){
          cell.disabled = false;
          //##this area needs work to avoid unnecessary 2 step resets
        }
      }
      if (this.currentWord.length === 1)
        this.validateGrid(this.currentWord[0]);
    },


    renderClue: function(){
      this.addClueAndReference();
      this.showPromptBox();
    },


    captureClue: function(){
      for (let id of this.currentWord){
        let el = this.$wrapper.find('#1.1');
        console.log(el);
      }
    },


    addClueAndReference: function(){
      this.$insertClue = this.captureClue();
    },


    showPromptBox: function(){
      this.$clueBox.css('display', 'block');
    }

  }//end object

  module.init();
})();




