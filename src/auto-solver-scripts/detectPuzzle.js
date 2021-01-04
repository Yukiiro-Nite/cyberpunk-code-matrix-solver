// OpenCV.js documentation: https://docs.opencv.org/master/d5/d10/tutorial_js_root.html
// Template matching would be the most basic way of doing this
// https://docs.opencv.org/master/d8/dd1/tutorial_js_template_matching.html
// Might have problems with images taken with a camera though.
// Maybe I can find a way to detect and warp a screen shape then use template matching?

const requiredLabels = [
  'bufferLabel',
  'codeMatrixLabel',
  'sequencesLabel'
]

const bounds = {
  codeMatrixLabel: { width: 520, height: 375 },
  sequencesLabel: { width: 420, height: 300 },
  bufferLabel: { width: 920, height: 130 }
}

function detectPuzzle (imageEl) {
  const mat = cv.imread(imageEl)

  const requiredSections = getRequiredSections(mat, requiredLabels)

  if(requiredSections.length < requiredLabels.length) {
    return false
  } else {
    parsePuzzle(requiredSections)
  }

  return true
}

function getRequiredSections(img, labels) {
  return labels
    .map((label) => {
      const assetMaterial = getAssetMat(label)
      const minMax = containsImage(img, assetMaterial)

      if(minMax && minMax.maxVal > 0.7) {
        const labelBounds = bounds[label]
        const size = {
          width: labelBounds ? labelBounds.width : assetMaterial.cols,
          height: labelBounds ? labelBounds.height : assetMaterial.rows
        }
        const rect = new cv.Rect(minMax.maxLoc.x, minMax.maxLoc.y + assetMaterial.rows, size.width, size.height - assetMaterial.rows)

        if( rect.x + rect.width > img.cols || rect.y + rect.height > img.rows) {
          console.log(`${label} found, but img was not large enough to contain information.`)
          return false
        } else {
          return {
            label,
            rect,
            roi: img.roi(rect)
          }
        }
      } else {
        console.log(`${label} not found, maxVal was too low: ${minMax && minMax.maxVal}`)
        return false
      }
    })
    .filter(Boolean)
}

function drawLabels(img) {
  const rectColor = new cv.Scalar(255, 0, 0, 255);

  const rects = requiredLabels.map((label) => {
    const assetMaterial = getAssetMat(label)
    const minMax = containsImage(img, assetMaterial)
    console.log(label, minMax)

    const labelBounds = bounds[label]
    const offset = {
      x: labelBounds ? labelBounds.width : assetMaterial.cols,
      y: labelBounds ? labelBounds.height : assetMaterial.rows
    }

    return {
      tl: minMax.maxLoc,
      br: {
        x: minMax.maxLoc.x + offset.x,
        y: minMax.maxLoc.y + offset.y
      },
      confidence: minMax.maxVal
    }
  })
  const filteredRects = rects.filter(rect => rect.confidence > 0.7)

  filteredRects.forEach(rect => {
    cv.rectangle(img, rect.tl, rect.br, rectColor, 2, cv.LINE_8, 0);
  })
}

function containsImage(src, search) {
  if(search.rows > src.rows || search.cols > src.cols) {
    console.log('Search image is too big for the src image!')
    return false
  } else {
    const mask = new cv.Mat();
    const result = new cv.Mat();

    const graySrc = new cv.Mat();
    cv.cvtColor(src,graySrc, cv.COLOR_RGBA2GRAY, 0);

    const graySearch = new cv.Mat();
    cv.cvtColor(search, graySearch, cv.COLOR_RGBA2GRAY, 0);

    cv.matchTemplate(graySrc, graySearch, result, cv.TM_CCOEFF_NORMED, mask);
    const minMax = cv.minMaxLoc(result);

    return minMax
  }
}

const assetMaterials = {}

function getAssetMat (name) {
  const cachedAsset = assetMaterials[name]
  if(!cachedAsset) {
    const imgEl = imageAssets.querySelector(`[name='${name}']`)

    if(imgEl) {
      assetMaterials[name] = cv.imread(imgEl)
      return assetMaterials[name]
    }
  } else {
    return cachedAsset
  }
}