document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const flagsLeft = document.querySelector('#flags-left')
  const result = document.querySelector('#result')
  let width = 0
  let bombAmount = 0
  let flags = 0
  let squares = []
  let isGameOver = false
  let checkingExtra1 = true
  let checkingExtra2
  let timesExtra2 = 3
  let flagArr = []
  let stackUndo = []
  let stackRedo  = []
  

  //create Board
  function createBoard() {

    flagsLeft.innerHTML = bombAmount

    //get shuffled game array with random bombs
    const bombsArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width * width - bombAmount).fill('valid')
    const gameArray = emptyArray.concat(bombsArray)
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5)
    console.log(shuffledArray)
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div')
      square.setAttribute('id', i)
      square.classList.add(shuffledArray[i])
      grid.appendChild(square)
      squares.push(square)

      //normal click
      square.addEventListener('click', function (e) {
        if(checkingExtra2 == true ){
          clickExtra2(square)
          checkingExtra2 = false
        }else{
          click(square)
        }
          
      })

      //cntrl and left click
      square.oncontextmenu = function (e) {
        e.preventDefault()
        addFlag(square)
      }
    }

    //add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0
      const isLeftEdge = (i % width === 0)
      const isRightEdge = (i % width === width - 1)

      // if (squares[i].classList.contains('valid')) {
      //   if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
      //   if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
      //   if (i > 10 && squares[i - width].classList.contains('bomb')) total++
      //   if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++
      //   if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++
      //   if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
      //   if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
      //   if (i < 89 && squares[i + width].classList.contains('bomb')) total++
      //   squares[i].setAttribute('data', total)
      // }

      // add number for all level include easy,hard,medium:
      if (squares[i].classList.contains('valid')) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
        if (i > (width-1) && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
        if (i > width && squares[i - width].classList.contains('bomb')) total++
        if (i > (width+1) && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++
        if (i < (width*width-2) && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++
        if (i < (width*width-width) && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
        if (i < (width*width-width-2) && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
        if (i < (width*width-width-1) && squares[i + width].classList.contains('bomb')) total++
        squares[i].setAttribute('data', total)
      }
    }
  }
  createBoard()

  //add Flag with right click
  function addFlag(square) {
    let currentId = square.id
    if (isGameOver) return
    if (!square.classList.contains('checked') && (flags < bombAmount)) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag')
        square.innerHTML = ' 🚩'
        //========================================
        flagArr.push(currentId)
        stackUndo.push(currentId)
        console.log(flagArr)
        //=========================================
        flags++
        flagsLeft.innerHTML = bombAmount - flags
        checkForWin()
      } else {
        square.classList.remove('flag')
        square.innerHTML = ''
        //========================================
        flagArr.pop()
        console.log(flagArr)
        //========================================
        flags--
        flagsLeft.innerHTML = bombAmount - flags
      }
    }
  }

  //click on square actions
  function click(square) {
    let currentId = square.id
    if (isGameOver) return
    if (square.classList.contains('checked') || square.classList.contains('flag')) return
    if (square.classList.contains('bomb')) {
      gameOver(square)
    } else {
      let total = square.getAttribute('data')
      if (total != 0) {
        square.classList.add('checked')
        if (total == 1) square.classList.add('one')
        if (total == 2) square.classList.add('two')
        if (total == 3) square.classList.add('three')
        if (total == 4) square.classList.add('four')
        square.innerHTML = total
        return
      }
      checkSquare(square, currentId)
    }
    square.classList.add('checked')
  }


  //check neighboring squares once square is clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width - 1)
  
    // setTimeout(() => {
    //   if (currentId > 0 && !isLeftEdge) {
    //     const newId = squares[parseInt(currentId) - 1].id
    //     //const newId = parseInt(currentId) - 1   ....refactor
    //     const newSquare = document.getElementById(newId)
    //     click(newSquare)
    //   }
    //   if (currentId > 9 && !isRightEdge) {
    //     const newId = squares[parseInt(currentId) + 1 - width].id
    //     //const newId = parseInt(currentId) +1 -width   ....refactor
    //     const newSquare = document.getElementById(newId)
    //     click(newSquare)
    //   }
    //   if (currentId > 10) {
    //     const newId = squares[parseInt(currentId - width)].id
    //     //const newId = parseInt(currentId) -width   ....refactor
    //     const newSquare = document.getElementById(newId)
    //     click(newSquare)
    //   }
    //   if (currentId > 11 && !isLeftEdge) {
    //     const newId = squares[parseInt(currentId) - 1 - width].id
    //     //const newId = parseInt(currentId) -1 -width   ....refactor
    //     const newSquare = document.getElementById(newId)
    //     click(newSquare)
    //   }
    //   if (currentId < 98 && !isRightEdge) {
    //     const newId = squares[parseInt(currentId) + 1].id
    //     //const newId = parseInt(currentId) +1   ....refactor
    //     const newSquare = document.getElementById(newId)
    //     click(newSquare)
    //   }
    //   if (currentId < 90 && !isLeftEdge) {
    //     const newId = squares[parseInt(currentId) - 1 + width].id
    //     //const newId = parseInt(currentId) -1 +width   ....refactor
    //     const newSquare = document.getElementById(newId)
    //     click(newSquare)
    //   }
    //   if (currentId < 88 && !isRightEdge) {
    //     const newId = squares[parseInt(currentId) + 1 + width].id
    //     //const newId = parseInt(currentId) +1 +width   ....refactor
    //     const newSquare = document.getElementById(newId)
    //     click(newSquare)
    //   }
    //   if (currentId < 89) {
    //     const newId = squares[parseInt(currentId) + width].id
    //     //const newId = parseInt(currentId) +width   ....refactor
    //     const newSquare = document.getElementById(newId)
    //     click(newSquare)
    //   }
    // }, 10)
    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id
        //const newId = parseInt(currentId) - 1   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > (width-1) && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id
        //const newId = parseInt(currentId) +1 -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > width) {
        const newId = squares[parseInt(currentId - width)].id
        //const newId = parseInt(currentId) -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > (width+1) && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id
        //const newId = parseInt(currentId) -1 -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < (width*width-2) && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id
        //const newId = parseInt(currentId) +1   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < (width*width-width) && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id
        //const newId = parseInt(currentId) -1 +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < (width*width-width-2) && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id
        //const newId = parseInt(currentId) +1 +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < (width*width-width-1)) {
        const newId = squares[parseInt(currentId) + width].id
        //const newId = parseInt(currentId) +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
    }, 10)
  }

  //game over
  function gameOver(square) {
    result.innerHTML = 'BOOM! Game Over!'
    isGameOver = true

    //show ALL the bombs
    squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣'
        square.classList.remove('bomb')
        square.classList.add('checked')
      }
    })
  }

  //check for win
  function checkForWin() {
    ///simplified win argument
    let matches = 0

    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches++
      }
      if (matches === bombAmount) {
        result.innerHTML = 'YOU WIN!'
        isGameOver = true
      }
    }
  }
  
  // function extra 1
  extra1.onclick = function ex1() {
    if (checkingExtra1 == true) {
      squares.forEach(square => {
        if (square.classList.contains('bomb')) {
          square.innerHTML = '💣'
        }
      })
      setTimeout(() => {
        squares.forEach(square => {
          if (square.classList.contains('bomb')) {
            square.innerHTML = ''
          }
        })
        // return flag which is planted
        squares.forEach(square =>{
          flagArr.forEach(flag =>{
            if(square.id == flag)
            {
              square.innerHTML = '🚩'
            }
          })
        })
      }, 2000);
      checkingExtra1 = false;
    }else{
      result.innerHTML= 'Run out of times to use Extra 1'
    }
  }
  // function extra 2
  extra2.onclick = function extra2(){
    if(timesExtra2 > 0){
      checkingExtra2 = true
      console.log(checkingExtra2);
      timesExtra2 -= 1
    }else{
      result.innerHTML = 'run out of times of Extra2'
    }
    
  }
  // click function for Extra 2 
  function clickExtra2(square) {
    let currentId = parseInt(square.id)
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width - 1)
    console.log(currentId);
    if (squares[currentId].classList.contains('bomb'))                                                                     {addFlagExtra2(squares[currentId])}
    if (currentId > 0 && !isLeftEdge && squares[currentId - 1].classList.contains('bomb'))                                {addFlagExtra2(squares[currentId - 1])}
    if (currentId > (width-1) && !isRightEdge && squares[currentId + 1 - width].classList.contains('bomb'))               {addFlagExtra2(squares[currentId + 1 - width])}
    if (currentId > width && squares[currentId - width].classList.contains('bomb'))                                       {addFlagExtra2(squares[currentId - width])}
    if (currentId > (width+1) && !isLeftEdge && squares[currentId - 1 - width].classList.contains('bomb'))                {addFlagExtra2(squares[currentId - 1 - width])}
    if (currentId < (width*width-2) && !isRightEdge && squares[currentId + 1].classList.contains('bomb'))                 {addFlagExtra2(squares[currentId + 1])}
    if (currentId < (width*width-width) && !isLeftEdge && squares[currentId - 1 + width].classList.contains('bomb'))      {addFlagExtra2(squares[currentId - 1 + width])}
    if (currentId < (width*width-width-2) && !isRightEdge && squares[currentId + 1 + width].classList.contains('bomb'))   {addFlagExtra2(squares[currentId + 1 +width])}
    if (currentId < (width*width-width-1) && squares[currentId + width].classList.contains('bomb'))                       {addFlagExtra2(squares[currentId + width])}
  }
  // addflags function for extra2
  function addFlagExtra2(square) {
    let currentId = square.id
      if (!square.classList.contains('flag')) {
        square.classList.add('flag')
        square.innerHTML = ' 🚩'
        //========================================
        flagArr.push(currentId)
        stackUndo.push(currentId)
        console.log(flagArr)
        //=========================================
        flags++
        flagsLeft.innerHTML = bombAmount - flags
        checkForWin()
      }
  }
  // function Undo Flag
  undo_flag.onclick = function UndoFlag() {
    let searchkey = stackUndo.pop()
    console.log(searchkey);
    squares.forEach(square =>{
      if(square.id == searchkey)
      {
        stackRedo.push(square.id)
        flags--
        flagsLeft.innerHTML = bombAmount - flags
        square.innerHTML = ''
      }
    })
    }
  // redo flag function 
  redo_flag.onclick = function RedoFlag(){
    let searchkey = stackRedo.pop()
    squares.forEach(square =>{
      if(square.id == searchkey)
      {
        stackUndo.push(square.id)
        flags++
        flagsLeft.innerHTML = bombAmount - flags
        square.innerHTML = '🚩'
      }
    })
  }
  // checking level funcion 
  check.onclick = function Click(){
    let checkingLevel = document.getElementById('level').selectedIndex
    console.log(checkingLevel)
    switch (checkingLevel) {
      case 0: 
        width = 10
        bombAmount = 20
        let div = document.getElementById('game')
        // div.classList.remove('medium','hard')
        div.classList.add('easy')
        createBoard()
        break;
      case 1:
        width = 12
        bombAmount = 30
        let medium = document.getElementById('game')
        // medium.classList.remove('easy','hard')

        medium.classList.add('medium')
        createBoard()
        break;
      case 2:
        width = 13
        bombAmount = 50
        let hard = document.getElementById('game')
        // hard.classList.remove('easy','medium')
        hard.classList.add('hard')
        createBoard()
        break;
    }
  }

})
