
const module = {
  
  settings: {
    rows: 6,
    init: 1,
    max: 10,
    min: 4,
  },

  values: {
    currentWord: [],
  },


  init: function(){
    this.cacheDOM();
    this.generateGrid(this.settings.rows);
    this.increaseGridBtn(this.settings.rows, this.settings.max);
    this.selectCells(this.values.currentWord);
  },


  cacheDOM: function(){
    this.$wrapper = $('#crosswordWrapper');
    this.$crossword = this.$wrapper.find('#crossword');
    this.$increaseBtn = this.$wrapper.find('#increaseBtn');
    this.$allCells = this.$wrapper.find('.cell');
  },
  
  
  generateGrid: function(rows){
    for (let i = 1; i < rows + 1; i++){
      let newItem = $(`<div id="r-${i}" class="_row"></div>`);
      this.$crossword.append(newItem);
    }
    this.makeCells(this.settings.rows, this.settings.init);
  },

  makeCells: function(rows, init){
    for (let i = init; i < rows + 1; i++){
      let $row = this.$wrapper.find('#r-' + i);
      init = rows + 1;
      for (let j = 1; j < rows + 1; j++){
        let newItem = $(`<div class="cell-wrapper">\
        <input type="text" maxlength="1" id="${i}.${j}" class="cell row-${i} col-${j}" /></div>`);
        $row.append(newItem);
      };
    };
    this.settings.init = init;
    this.cacheCells();
  },

  cacheCells: function(){
    this.$allCells = this.$wrapper.find('.cell');
    //console.log(this.$allCells);
  },

  increaseGridBtn: function(rows, max){
    this.$increaseBtn.click(function(){
      if (rows < max){
        rows ++;
        let newItem = $(`<div id="r-${rows}" class="_row"></div>`);
        module.$crossword.append(newItem);
        for (let i = 1; i < rows; i++){
          let $row = module.$wrapper.find('#r-' + i);
          let newItem = $(`<div class="cell-wrapper">\
          <input type="text" maxlength="1" id="${i}.${rows}" class="cell row-${i} col-${rows}" /></div>`);
          $row.append(newItem);
        }
        module.makeCells(rows, module.settings.init);
      }else{
        console.log('Exceeds grid size');
      }
    });//end listener
  },

  selectCells: function(currentWord){
    this.$crossword.keyup(function(e){
      console.log(e.target);
    });
  },

  validateGrid: function($allCells){
    console.log($allCells);
  }

}//end object
module.init();





