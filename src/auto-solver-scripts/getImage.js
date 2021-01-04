getCameraImage.addEventListener('submit', handleGetImage.bind(this, 'camera'))
getScreenImage.addEventListener('submit', handleGetImage.bind(this, 'screen'))
getFileImage.addEventListener('submit', handleGetImage.bind(this, 'file'))
imagePreviewForm.addEventListener('submit', handleImageSubmit)
getDifferentImageButton.addEventListener('click', handleGetDifferentImage)
backToGetImageButton.addEventListener('click', handleGetDifferentImage)

function handleImageSubmit (submitEvent) {
  submitEvent.preventDefault();

  const imageHasPuzzle = detectPuzzle(previewImage)

  if(imageHasPuzzle) {
    showImageOverlay()
  } else {
    showImageError()
  }

  console.log('Handling image submit event!')
}

function handleGetImage(type, submitEvent) {
  submitEvent.preventDefault()
  
  switch(type) {
    case 'camera':
      camera();
      break;
    case 'screen':
      screen();
      break;
    case 'file':
      file();
      break;
    default:
      throw new Error(`Unknown get image type: ${type}`)
  }

  goToImagePreview()
}

function handleGetDifferentImage (clickEvent) {
  clickEvent.preventDefault();

  goToSelectImage()
}

function getBackgroundVideo() {
  let video = document.getElementById('bg-video')

  if(!video) {
    video = document.createElement('video')
    video.id = 'bg-video'
    video.hidden = true
    video.setAttribute('autoplay', 'true')
    document.body.append(video)
  }

  return video
}

function camera() {
  const video = getBackgroundVideo()
  previewImage.src = ''

  navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
    const track = stream.getTracks()[0]
    video.addEventListener('loadedmetadata', () => {
      const {videoWidth, videoHeight} = video
      const canvas = document.createElement('canvas')
      canvas.width = videoWidth
      canvas.height = videoHeight
      const context = canvas.getContext('2d')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      previewImage.src = canvas.toDataURL()
      document.body.removeChild(video)
      track.stop()
      stream.removeTrack(track)
    })
    video.srcObject = stream
  })
}

function screen() {
  const video = getBackgroundVideo()
  previewImage.src = ''
  
  navigator.mediaDevices.getDisplayMedia().then(stream => {
    const track = stream.getTracks()[0]
    video.addEventListener('loadedmetadata', () => {
      const {videoWidth, videoHeight} = video
      const canvas = document.createElement('canvas')
      canvas.width = videoWidth
      canvas.height = videoHeight
      const context = canvas.getContext('2d')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      previewImage.src = canvas.toDataURL()
      document.body.removeChild(video)
      track.stop()
      stream.removeTrack(track)
    })
    video.srcObject = stream
  })
}

function file() {
  previewImage.src = ''
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.addEventListener('change', (event) => {
    const files = Array.from(event.target.files)
    const file = files[0]
    const reader = new FileReader()

    reader.addEventListener("load", function () {
      previewImage.src = reader.result;
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  })
  
  input.click()
}