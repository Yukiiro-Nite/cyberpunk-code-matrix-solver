function parsePuzzle(selections) {
  console.log('Parsing puzzle sections.')

  const readSelections = selections.map(readSelection)

  Promise.all(readSelections)
    .then((parsedSelections) => {
      const puzzleState = {}

      parsedSelections.forEach((parsedSelection) => {
        console.log(parsedSelection.selection.label)
        console.log(parsedSelection.result.data.text)
        console.log(parsedSelection.result)

        puzzleState[parsedSelection.selection.label] = parsedSelection
      })

      return puzzleState
    })
    .then(overlayPuzzle)
}

function matToCanvas (mat) {
  const canvasEl = document.createElement('canvas')

  cv.imshow(canvasEl, mat)

  // document.body.appendChild(canvasEl)

  return canvasEl
}

function preProcessSelection (selection) {
  const grayOut = new cv.Mat()
  const invertOut = new cv.Mat()
  const blurOut = new cv.Mat()

  cv.cvtColor(selection, grayOut, cv.COLOR_RGBA2GRAY, 0);
  cv.bitwise_not(grayOut, invertOut);
  let ksize = new cv.Size(3, 3);
  cv.GaussianBlur(invertOut, blurOut, ksize, 0, 0, cv.BORDER_DEFAULT);

  return matToCanvas(blurOut)
}

function drawWordBoundingBoxes (canvasEl, result) {
  const mat = cv.imread(canvasEl)
  const wordColor = new cv.Scalar(255, 0, 0, 255);
  const symbolColor = new cv.Scalar(0, 0, 255, 255);

  drawBoundingBoxes(mat, canvasEl, result.data.words, wordColor)
  drawBoundingBoxes(mat, canvasEl, result.data.symbols, symbolColor)
}

function drawBoundingBoxes (material, outputEl, items, color) {
  items.forEach((item) => {
    const tl = { x: item.bbox.x0, y: item.bbox.y0 }
    const br = { x: item.bbox.x1, y: item.bbox.y1 }
    cv.rectangle(material, tl, br, color, 1, cv.LINE_8, 0);
  })

  cv.imshow(outputEl, material)
}

function prepareWorker (label) {
  console.log(`[${label}] Preparing worker...`)
  const worker = Tesseract.createWorker()

  return worker.load()
    .then(() => {
      console.log(`[${label}] Loading English Language...`)
      return worker.loadLanguage('eng')
    })
    .then(() => {
      console.log(`[${label}] Initializing English Language...`)
      return worker.initialize('eng')
    })
    .then(() => {
      console.log(`[${label}] Setting Whitelist Characters`)
      return worker.setParameters({
        tessedit_char_whitelist: '0123456789ABCDEF ',
      });
    })
    .then(() => worker)
}

function readSelection (selection) {
  console.log(`Reading ${selection.label}...`)
  return prepareWorker(selection.label)
    .then((worker) => {
      const canvas = preProcessSelection(selection.roi)
      return worker.recognize(canvas)
        .then((result) => worker.terminate()
          .then(() => {
            console.log(`[${selection.label}] Worker terminated.`)
            // drawWordBoundingBoxes(canvas, result)
            return result
          }))
    })
    .then((result) => {
      console.log(`Finished reading ${selection.label}`)
      return {
        selection,
        result
      }
    })
    .catch((reason) => {
      console.log(`Trouble reading ${selection.label}`)
      console.log(reason)
      return {
        selection,
        result: { data: { text: '' } }
      }
    })
}