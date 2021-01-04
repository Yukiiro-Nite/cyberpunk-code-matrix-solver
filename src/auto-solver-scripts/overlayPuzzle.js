function overlayPuzzle (puzzleState) {
  const previewEl = previewImage
  const overlayEl = imageOverlayCanvas
  console.log(puzzleState)

  const material = cv.imread(previewEl)
  cv.imshow(overlayEl, material)

  overlaySequenceButtons(puzzleState.sequencesLabel, overlayEl)
  overlaySolution(puzzleState, overlayEl)

  goToImageOverlay()
}

function overlaySequenceButtons (sequencesLabel, dest) {
  const material = cv.imread(dest)

  const labelOffset = sequencesLabel.selection.rect
  const lineColor = new cv.Scalar(255, 0, 0, 255);
  const sequenceRects = sequencesLabel.result.data.lines.map((line) => {
    return {
      p0: {
        x: labelOffset.x + line.bbox.x0,
        y: labelOffset.y + line.bbox.y0
      },
      p1: {
        x: labelOffset.x + line.bbox.x1,
        y: labelOffset.y + line.bbox.y1
      },
      size: {
        width: line.bbox.x1 - line.bbox.x0,
        height: line.bbox.y1 - line.bbox.y0
      }
    }
  })

  sequenceRects.forEach((rect) => {
    cv.rectangle(material, rect.p0, rect.p1, lineColor, 1, cv.LINE_8, 0);
  })

  cv.imshow(dest, material)
}

function overlaySolution (puzzleState, dest) {
  const {
    sequencesLabel,
    codeMatrixLabel,
    bufferLabel
  } = puzzleState

  const bufferSize = getBufferSize(bufferLabel)
  const codeMatrix = getCodeMatrix(codeMatrixLabel.result.data.text)
  const sequences = getSequences(sequencesLabel.result.data.text)

  const solution = findSequences(codeMatrix, sequences, bufferSize)
  const solutionRects = getSolutionRects(solution, codeMatrixLabel)

  const material = cv.imread(dest)
  const solutionColor = new cv.Scalar(0, 255, 255, 255)

  solutionRects.forEach((solutionRect) => {
    cv.rectangle(material, solutionRect.p0, solutionRect.p1, solutionColor, 1, cv.LINE_8, 0)
  })

  console.log(solution)

  cv.imshow(dest, material)
}

function getSolutionRects (solution, codeMatrix) {
  const width = codeMatrix.result.data.lines[0].words.length
  const words = codeMatrix.result.data.words
  const offset = {
    x: codeMatrix.selection.rect.x,
    y: codeMatrix.selection.rect.y
  }

  return solution.map(cell => {
    const index = (cell.y * width) + cell.x
    const word = words[index]
    return {
      p0: {x: word.bbox.x0 + offset.x, y: word.bbox.y0 + offset.y},
      p1: {x: word.bbox.x1 + offset.x, y: word.bbox.y1 + offset.y}
    }
  })
}

function getBufferSize (bufferLabel) {
  // solve this one later, we don't get clean text to parse for this one
  return 7
}

function getCodeMatrix(rawMatrixText) {
  return textToArrays(rawMatrixText)
}

function getSequences(rawSequenceText) {
  return textToArrays(rawSequenceText)
}

function textToArrays(text, lineSep = '\n', wordSep = ' ') {
  return text
    .split(lineSep)
    .map(line =>
      line
        .split(wordSep)
        .map(word => word.trim())
        .filter(Boolean)
    )
    .filter(Boolean)
}