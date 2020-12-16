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
  for(let y = 0; y < codeMatrix.length; y++) {
    for(let x = 0; x < codeMatrix[0].length; x++) {
      const result = solveSequencesFromPos(codeMatrix, x, y, sequences, undefined, [], bufferSize)
      if(result) {
        return result
      }
    }
  }
}

function solveSequencesFromPos(codeMatrix, x, y, sequences, prevDir, prevPositions = [], bufferSize) {
  const currentCell = codeMatrix[y][x]
  const currentPos = {x, y}
  const [heads, tails] = sequences.reduce((acc, seq) => {
    const [head, ...tail] = seq
    acc[0].push(head)
    acc[1].push(tail)
    return acc
  }, [[], []])
  const currentPosUsed = prevPositions.find(pos => pos.x === currentPos.x && pos.y === currentPos.y)
  const hasMatch = heads.find(head => head === currentCell)
  const hasMore = tails.some(tail => tail && tail.length > 0)
  if(currentPosUsed || !hasMatch || bufferSize === 0){
    return false
  } else if(hasMore) {
    const maxSize = Math.max(codeMatrix.length, codeMatrix[0].length)
    const nextSequences = heads.map((head, index) =>
      head === currentCell
        ? tails[index]
        : sequences[index]
    )

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
        yResult = solveSequencesFromPos(codeMatrix, x, i, nextSequences, 'y', prevPositions.concat(currentPos), bufferSize--)
      }
      if(checkX) {
        xResult = solveSequencesFromPos(codeMatrix, i, y, nextSequences, 'x', prevPositions.concat(currentPos), bufferSize--)
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

console.log(findSequences(demoData1, [demoSequence2]))
console.log(findSequences(demoData2, demoSequence3, 4))

/**
 * TODO:
 * - build UI
 * - build Scanner
 */