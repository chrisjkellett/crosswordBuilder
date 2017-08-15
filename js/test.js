
(function(){
  const module = {
    settings: function(){
      this.rows = 6;
      this.init = 1;
      this.max = 10;
      this.min = 4;
      this.currentWord = [];
      this.orientation = 'across';
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
      this.$allCells = this.$wrapper.find('.cell');
      this.$alertBox = this.$wrapper.find('#alertBox');
      this.$alertMessage = this.$wrapper.find('#alertMessage');
      this.$alertConfirm = this.$wrapper.find('#okAlert');
      this.$addWordBtn = this.$wrapper.find('#addWordBtn');
    },

    bindEvents: function(){
      this.$crossword.keyup(this.runCrosswordEvents.bind(this));
      this.$increaseBtn.click(this.increaseSize.bind(this));
      this.$alertConfirm.click(this.alertBoxConfirm.bind(this));
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
      }
      
      else{
        const message = 'Exceeds maximum grid size';
        this.alertBox(message);
      }
    },

    runCrosswordEvents: function(e){
      this.selectCells(e);
      this.navigateGrid(e);
    },

    selectCells: function(e){
      const cell = e.target;
      const id = cell.id;
      const a = cell.className.includes('selected');
      const b = cell.value === '';
      const c = !this.currentWord.includes(id);

      if (!a && !b && c){
        cell.classList.add('selected');
        this.currentWord.push(id);
      }

      else if (a && b){
        cell.classList.remove('selected');
        this.currentWord.pop(id);
      }

      this.validateGrid(id);
      this.validateWordLength();
      this.validateCompleteWord();
      console.log(this.currentWord);
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

    validateGrid: function(id){
      const sp = id.split(".");
      const col = sp[0];
      const row = sp[1];
      for (let cell of this.$allCells){
        let $sp = cell.id.split(".");
        let $col = $sp[0];
        let $row = $sp[1];
        if (!(row == $row || col == $col) || cell.className.includes('dead'))
          cell.disabled = true;
      }
    },

    validateWordLength: function(){
      if (this.currentWord.length < 2)
        this.$addWordBtn.attr('disabled', true);
      else
        this.$addWordBtn.removeAttr('disabled');
    },

    validateCompleteWord: function(){
      this.currentWord.sort();
      let cols = [];
      let rows = [];
      let testFails, isRow, isColumn;
      for (let id of this.currentWord){
        let sp = id.split(".");
        cols.push(parseInt(sp[0]));
        rows.push(parseInt(sp[1]));
      }

      for (let i=cols.length - 1; i > 0; i--){
        let j = i - 1;
        if (cols[i] - cols[j] > 1)
          testFails = true;
        else if (rows[i] - rows[j] > 1)
          testFails = true;
        else if (cols[i] - cols[j] == 0)
          isRow = true;
        else if (rows[i] - rows[j] == 0)
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
    }

  }//end object
  module.init();
})();




