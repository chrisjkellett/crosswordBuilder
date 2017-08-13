!function(){
  const crossword = {

    settings: {
      rows: 6,
      gridInitValue: 1,
      max: 10
    },

    init: function(){
      this.generateGrid(this.settings.rows);
      this.increaseGridBtn(this.settings.rows, this.settings.max);
    },
    
    generateGrid: function(rows){
      const $crossword = document.getElementById('crossword');
      for (let i = 1; i < rows + 1; i++)
        $crossword.innerHTML += `<div id="r-${i}" class="_row"></div>`;
      this.makeCells(this.settings.rows, this.settings.gridInitValue);
    },

    makeCells: function(rows, init){
      for (let i = init; i < rows + 1; i++){
        let row = document.querySelector('#r-' + i);
        init = rows + 1;
        for (let j = 1; j < rows + 1; j++){
          row.innerHTML += `<div class="cell-wrapper">
          <input type="text" maxlength="1" id="${i}.${j}" class="cell row-${i} col-${j}" /></div>`;
        }//end for
      }//end for
      this.settings.gridInitValue = init;
    },

    increaseGridBtn: function(rows, max){
      const increaseBtn = document.getElementById('increaseBtn');
      increaseBtn.addEventListener('click', function(){
        if (rows < max){
          rows ++;
          const $crossword = document.getElementById('crossword');
          const addNewRow = $crossword.insertAdjacentHTML('beforeend', 
          `<div id="r-${rows}" class="_row"></div>`);
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
      });//end listener
    }//end function

  }//end object
  crossword.init();
}();





