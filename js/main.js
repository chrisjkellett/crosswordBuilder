
const crossword = {
  
  settings: {
    rows: 6,
    gridInitValue: 1,
    max: 10,
    min: 4,
  },

  values: {
    currentWord: [],
    allCells: []
  },

  init: function(){
    this.generateGrid(this.settings.rows, this.DOM.crossword);
    this.increaseGridBtn(this.settings.rows, this.settings.max, this.DOM.increaseBtn, this.values.allCells);
    this.selectCells(this.values.currentWord, this.DOM.crossword);
  },

  DOM: {
    crossword: document.getElementById('crossword'),
    increaseBtn: document.getElementById('increaseBtn')
  },
  
  generateGrid: function(rows, $crossword){
    for (let i = 1; i < rows + 1; i++)
      $crossword.innerHTML += `<div id="r-${i}" class="_row"></div>`;
    this.makeCells(this.settings.rows, this.settings.gridInitValue);
    this.cacheCells(this.values.allCells);
  },

  makeCells: function(rows, init){
    for (let i = init; i < rows + 1; i++){
      let row = document.querySelector('#r-' + i);
      init = rows + 1;
      for (let j = 1; j < rows + 1; j++){
        row.innerHTML += `<div class="cell-wrapper">
        <input type="text" maxlength="1" id="${i}.${j}" class="cell row-${i} col-${j}" /></div>`;
      }
    }
    this.settings.gridInitValue = init;
  },

  cacheCells: function(allCells){
    allCells = document.querySelectorAll('.cell');
    console.log(allCells);
  },

  increaseGridBtn: function(rows, max, $button, allCells){
    $button.addEventListener('click', function(){
      if (rows < max){
        rows ++;
        const $crossword = document.getElementById('crossword');
        const addNewRow = $crossword.insertAdjacentHTML('beforeend', `<div id="r-${rows}" class="_row"></div>`);
        for (let i = 1; i < rows; i++){
          let row = document.querySelector('#r-' + i);
          row.insertAdjacentHTML('beforeend', 
          `<div class="cell-wrapper">
          <input type="text" maxlength="1" id="${i}.${rows}" class="cell row-${i} col-${rows}" /></div>`);
        }//end for
        crossword.makeCells(rows, crossword.settings.gridInitValue);
      }else{
        console.log('Exceeds grid size');
      }//end if 
      crossword.cacheCells(allCells);
    });//end listener
  },

  selectCells: function(currentWord, $crossword){
    $crossword.addEventListener('keyup', function(e){
      const cell = e.target;
      const id = cell.id;
      const isSelected = cell.className.includes('selected');
      const notCurrentWord = !currentWord.includes(id);
      const hasValue = cell.value === '';

      if (!isSelected && !hasValue && notCurrentWord){
        cell.classList.add('selected');
        currentWord.push(id);
        crossword.validateGrid(crossword.DOM.crossword);
      } else if (isSelected && hasValue){
        cell.classList.remove('selected');
        currentWord.pop(id);
        // sortAndValidate(id);
      }
    });
  },

  validateGrid: function($allCells){
    console.log($allCells);
  }

}//end object
crossword.init();





