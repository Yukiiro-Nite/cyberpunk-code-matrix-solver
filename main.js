const demoData = [
  ['55', '1C', 'BD', 'BD', 'E9'],
  ['E9', 'BD', 'E9', '1C', '1C'],
  ['BD', '55', '1C', 'E9', 'BD'],
  ['1C', '1C', '55', 'BD', '55'],
  ['55', 'BD', '1C', '1C', '55']
]
const demoSequence = ['55', '55', 'BD', '55']
const demoSequence2 = ['55', '1C', 'BD', 'E9', '1C', 'E9', 'BD', '55', '55']

function findSequence(codeMatrix, sequence) {
  for(let y = 0; y < codeMatrix.length; y++) {
    for(let x = 0; x < codeMatrix[0].length; x++) {
      const result = solveSequenceFromPos(codeMatrix, x, y, sequence)
      if(result) {
        return result
      }
    }
  }
}

function solveSequenceFromPos(codeMatrix, x, y, sequence, prevDir) {
  const currentCell = codeMatrix[y][x]
  const currentPos = {x, y}
  const [head, ...tail] = sequence
  if(currentCell !== head) {
    return false;
  } else if(tail.length > 0) {
    const maxSize = Math.max(codeMatrix.length, codeMatrix[0].length)
    for(let i = 0; i < maxSize; i++) {
      let xResult, yResult;
      if(i < codeMatrix.length && i !== y && prevDir !== 'y') {
        yResult = solveSequenceFromPos(codeMatrix, x, i, tail, 'y')
      }
      if(i < codeMatrix[0].length && i !== x && prevDir !== 'x') {
        xResult = solveSequenceFromPos(codeMatrix, i, y, tail, 'x')
      }

      if(xResult) {
        return [currentPos, ...xResult]
      } else if(yResult) {
        return [currentPos, ...yResult]
      }
    }
    return false
  } else {
    return [currentPos]
  }
}

console.log(findSequence(demoData, demoSequence2))

/**
 * TODO:
 * - Support multiple sequences
 * - Don't use previously used positions
 */