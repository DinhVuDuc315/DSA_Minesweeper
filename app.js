document.addEventListener('DOMcontentLoaded',()=>{
const grid = document.querySelector('grid')

let width=10


//create board

function createBoard(){
    for(let i=0;i<Width*width;i++){
      const square = document.createElement('div')
      square.setAttribute('id',i)
      grid.appendChild(square)
      square.push(square)
    }
}
createBoard()





})