const demoData1 = [
  ['55', '1C', 'BD', 'BD', 'E9'],
  ['E9', 'BD', 'E9', '1C', '1C'],
  ['BD', '55', '1C', 'E9', 'BD'],
  ['1C', '1C', '55', 'BD', '55'],
  ['55', 'BD', '1C', '1C', '55']
]
const demoData2 = [
  ['BD', 'BD', '55', '1C', 'BD'],
  ['55', '1C', 'BD', 'BD', 'E9'],
  ['1C', '1C', 'E9', '1C', 'E9'],
  ['1C', '1C', '1C', '55', 'BD'],
  ['55', 'E9', 'BD', '1C', 'E9']
]

const demoSequence1 = ['55', '55', 'BD', '55']
const demoSequence2 = ['55', '1C', 'BD', 'E9', '1C', 'E9', 'BD', '55', '55']
const demoSequence3 = [
  ['1C', '1C'],
  ['BD', '1C'],
  ['1C', '1C', 'BD']
]

function findSequences(codeMatrix, sequences, bufferSize) {
  // Start from the top row
  for(let x = 0; x < codeMatrix[0].length; x++) {
    const result = solveSequencesFromPos(codeMatrix, x, 0, sequences, 'x', [], bufferSize)
    if(result) {
      return result
    }
  }
}

function solveSequencesFromPos(codeMatrix, x, y, sequences, prevDir, prevPositions = [], bufferSize) {
  const currentPos = {x, y}
  const currentPosUsed = prevPositions.find(pos => pos.x === currentPos.x && pos.y === currentPos.y)
  const nextPositions = [].concat(prevPositions, currentPos)
  const currentSolution = nextPositions.map(pos => codeMatrix[pos.y][pos.x])

  if(currentPosUsed || bufferSize <= 0) {
    return false
  } else if(solvesSequence(currentSolution, sequences)) {
    return nextPositions
  } else {
    const maxSize = Math.max(codeMatrix.length, codeMatrix[0].length)

    let checkX, checkY
    for(let i = 0; i < maxSize; i++) {
      let xResult, yResult;
      checkY = i < codeMatrix.length
        && i !== y
        && prevDir !== 'y'
      checkX = i < codeMatrix[0].length
        && i !== x
        && prevDir !== 'x'
      if(checkY) {
        yResult = solveSequencesFromPos(codeMatrix, x, i, sequences, 'y', nextPositions, bufferSize - 1)
      }
      if(checkX) {
        xResult = solveSequencesFromPos(codeMatrix, i, y, sequences, 'x', nextPositions, bufferSize - 1)
      }

      if(xResult) {
        return xResult
      } else if(yResult) {
        return yResult
      }
    }

    return false
  }
}

function solvesSequence(solution, sequences) {
  return sequences.every(sequence => containsSequence(solution, sequence))
}

function containsSequence(a, b) {
  return a.join(' ').includes(b.join(' '))
}