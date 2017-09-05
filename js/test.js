

validateByAxis2: function(id){
  const sp = id.split("-"); 
  const cell = root.$wrapper.find('#' + id);
  const orientation = cell.hasClass('across') ? 'down' : 'across';
  const index = orientation === 'down' ? 1 : 0;
  const list = [];

  //identify dead cell
  for (let i = 1; i < root.rows + 1; i++){
    let $id = orientation === 'down' ? i + '-' + sp[index] : sp[index] + '-' + i;
    let $cell = root.$wrapper.find('#' + $id);
    if ($cell.hasClass('dead-cell')) list.push($id);
  }

  //set limit
  const $index = orientation === 'down' ? 0 : 1;
  for (let id of list){
    let $sp = id.split("-");
    let deadCellId$ = $sp[$index];
    let targetId$ = sp[$index];
  }

  //compare limit
}