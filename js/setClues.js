let initWord = [];

//1. select cells
function selectCell(e) {
    function sortAndValidate(){
        initWord.sort();
        // validateCrossword(id);
    }

    if (e.target !== e.currentTarget) {
        const cell = e.target;
        const id = e.target.id;
        const isSelected = cell.className.includes('selected');
        const notInList = !initWord.includes(id);
        const $class = cell.classList;
        const hasValue = cell.value === '';

        if (!isSelected && !hasValue && notInList){
            $class.add('selected');
            initWord.push(id);
            sortAndValidate(); 
        }else if (isSelected && hasValue){
            $class.remove('selected');
            initWord.pop(id);
            sortAndValidate();
        }
        e.stopPropagation();
   }
}



//-----------Listeners ----------------------------------
getCrossword.addEventListener('keyup', selectCell, false);