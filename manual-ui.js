// Handler and functions for matrix resize and data

matrixSizeForm.addEventListener('submit', handleMatrixResize)

function handleMatrixResize(submitEvent) {
  submitEvent.preventDefault();

  const width = parseInt(submitEvent.target.elements.width.value)
  const height = parseInt(submitEvent.target.elements.height.value)
  const currentMatrixValues = getMatrixValues()
  const newElements = new Array(width * height).fill().map((_, i) => createMatrixCell(i, width, height, currentMatrixValues))

  Array.from(matrixForm.children).forEach(child => child.remove())

  matrixForm.style.gridTemplateColumns = `repeat(${width}, 2.5em)`
  matrixForm.style.gridTemplateRows = `repeat(${height}, 2.5em)`
  matrixForm.setAttribute("data-width", width)
  matrixForm.setAttribute("data-height", height)

  newElements.forEach(el => matrixForm.appendChild(el))
}

function getMatrixValues() {
  const width = parseInt(matrixForm.getAttribute("data-width")) || 1
  const height = parseInt(matrixForm.getAttribute("data-height")) || 1
  const data = new Array(height).fill().map(() => new Array(width).fill())

  Array.from(matrixForm.children)
    .forEach((child, i) => set2D(data, i, width, child.value))

  return { width, height, data }
}

function createMatrixCell(index, width, height, currentMatrixValues) {
  const input = document.createElement('input')
  const { x, y } = getPos(index, width)

  input.value = get2D(currentMatrixValues.data, index, width) || ""
  input.setAttribute('data-x', x)
  input.setAttribute('data-y', y)
  input.classList.add('cell-input')

  return input
}

function getPos(index, width) {
  return {
    x: index % width,
    y: Math.floor(index / width)
  }
}

function get2D(arr, index, width) {
  const { x, y } = getPos(index, width)
  if(arr && arr.length !== undefined) {
    const row = arr[y]
    if(row && row.length !== undefined) {
      return row[x]
    }
  }
}

function set2D(arr, index, width, value) {
  const { x, y } = getPos(index, width)
  if(arr && arr.length !== undefined) {
    const row = arr[y]
    if(row && row.length !== undefined) {
      row[x] = value
    }
  }
}

// handler and functions for adding, removing, and reading sequences

sequenceForm.addEventListener('submit', handleSequenceAdd)

function handleSequenceAdd(submitEvent) {
  submitEvent.preventDefault()

  const rawSequence = submitEvent.target.elements.sequence.value
  const sequence = rawSequence.split(' ').filter(Boolean)

  const el = createSequenceEl(sequence)

  sequenceList.appendChild(el)
  submitEvent.target.reset()
}

function createSequenceEl(sequence) {
  const itemEl = document.createElement('li')
  itemEl.sequence = sequence
  itemEl.innerText = sequence.join(' ')

  const removeButton = document.createElement('button')
  removeButton.innerText = 'X'
  removeButton.addEventListener('click', () => itemEl.remove())

  itemEl.appendChild(removeButton)

  return itemEl
}

function getSequences() {
  return Array.from(sequenceList.children)
    .map(child => child.sequence)
    .filter(sequence => sequence && sequence.length > 0)
}

// handler for solver form and solution matrix builder

solveForm.addEventListener('submit', handleSolve)

function handleSolve(submitEvent) {
  submitEvent.preventDefault()

  const bufferSize = parseInt(submitEvent.target.elements.bufferSize.value)
  const matrixValues = getMatrixValues()
  const {width, height} = matrixValues
  const sequences = getSequences()
  const solution = findSequences(matrixValues.data, sequences, bufferSize)

  if(solution) {
    const solutionCells = new Array(width * height).fill().map((_, i) => createMatrixSolutionCell(i, width, matrixValues, solution))

    Array.from(solutionMatrix.children).forEach(child => child.remove())

    solutionMatrix.style.gridTemplateColumns = `repeat(${width}, 2.5em)`
    solutionMatrix.style.gridTemplateRows = `repeat(${height}, 2.5em)`

    solutionCells.forEach(el => solutionMatrix.appendChild(el))
  } else {
    // need some kind of error output here.
  }

  console.log(solution)
}

function createMatrixSolutionCell(index, width, matrixValues, solution) {
  const {x, y} = getPos(index, width)
  const solutionWithIndex = solution.map((value, index) => ({value, index}))
  const solutionForCell = solutionWithIndex.find(({value}) => value.x === x && value.y === y)
  const el = document.createElement('div') // maybe use something else for the cell wrapper..
  el.classList.add('solution-cell')
  const dataUnderlay = document.createElement('output')
  dataUnderlay.classList.add('data-underlay');
  dataUnderlay.value = get2D(matrixValues.data, index, width)

  el.appendChild(dataUnderlay)

  if(solutionForCell) {
    const solutionIndexOverlay = document.createElement('output')
    solutionIndexOverlay.value = solutionForCell.index + 1
    solutionIndexOverlay.classList.add('solution-overlay');
    el.appendChild(solutionIndexOverlay)
  }

  return el
}