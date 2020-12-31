function parsePuzzle(selections) {
  console.log('Parsing puzzle sections.')

  const readSelections = selections.map(readSelection)

  Promise.all(readSelections)
    .then((parsedSelections) => {
      parsedSelections.forEach((parsedSelection) => {
        console.log(parsedSelection.selection.label)
        console.log(parsedSelection.result.data.text)
      })
    })
}

function matToCanvas (mat) {
  const canvasEl = document.createElement('canvas')

  cv.imshow(canvasEl, mat)

  document.body.appendChild(canvasEl)

  return canvasEl
}

function preProcessSelection (selection) {
  const grayOut = new cv.Mat()
  const invertOut = new cv.Mat()

  cv.cvtColor(selection, grayOut, cv.COLOR_RGBA2GRAY, 0);
  cv.bitwise_not(grayOut, invertOut);

  return matToCanvas(invertOut)
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