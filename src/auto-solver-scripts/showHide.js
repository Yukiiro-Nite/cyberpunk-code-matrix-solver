function changeHidden(el, hidden) {
  let currentHidden = el.getAttribute('hidden')
  if(currentHidden !== hidden) {
    hidden
      ? el.setAttribute('hidden', hidden)
      : el.removeAttribute('hidden')
  }
}

function showImagePreview () { changeHidden(imagePreviewForm, false) }
function hideImagePreview () { changeHidden(imagePreviewForm, true) }

function showGetImageWrapper () { changeHidden(getImageWrapper, false) }
function hideGetImageWrapper () { changeHidden(getImageWrapper, true) }

function showSelectImage () { changeHidden(selectImagePanel, false) }
function hideSelectImage () { changeHidden(selectImagePanel, true) }

function showImageError () { changeHidden(imageError, false) }
function hideImageError () { changeHidden(imageError, true) }

function showImageOverlay () { changeHidden(imageOverlay, false) }
function hideImageOverlay () { changeHidden(imageOverlay, true) }

function goToSelectImage () {
  hideImagePreview()
  hideImageOverlay()
  showGetImageWrapper()
  showSelectImage()
}

function goToImagePreview () {
  hideSelectImage()
  hideImageError()
  hideImageOverlay()
  showGetImageWrapper()
  showImagePreview()
}

function goToImageOverlay () {
  hideSelectImage()
  hideImageError()
  hideGetImageWrapper()
  hideImagePreview()
  showImageOverlay()
}