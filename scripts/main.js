const buttons = document.querySelectorAll('.btn');

buttons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const target = event.currentTarget;
    if (target.matches('.btn-primary') && target.closest('header')) {
      document.querySelector('#collection')?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const uploadInput = document.querySelector('#photoUpload');
const uploadStatus = document.querySelector('#uploadStatus');

const fileTargets = {
  'product-1': '.product-image-1 img',
  'product-2': '.product-image-2 img',
  'product-3': '.product-image-3 img',
  'product-4': '.product-image-4 img',
  'product-5': '.product-image-5 img',
  'product-6': '.product-image-6 img',
  'product-7': '.product-image-7 img',
  'product-8': '.product-image-8 img',
  'gallery-a': '.photo-image-a img',
  'gallery-b': '.photo-image-b img',
  'gallery-c': '.photo-image-c img',
  'background': '.background-video',
  'background-video': '.background-video',
};

function setUploadStatus(message) {
  if (!uploadStatus) return;
  uploadStatus.textContent = message;
}

function updateImageTarget(targetSelector, fileUrl, fileName) {
  const target = document.querySelector(targetSelector);
  if (!target) return false;

  if (target.tagName === 'IMG') {
    target.src = fileUrl;
    target.alt = fileName;
    return true;
  }

  if (target.tagName === 'VIDEO') {
    target.src = fileUrl;
    target.load();
    target.play().catch(() => {});
    return true;
  }

  target.style.backgroundImage = `url('${fileUrl}')`;
  target.style.backgroundSize = 'cover';
  target.style.backgroundPosition = 'center';
  return true;
}

function handleUploadFiles(files) {
  if (!files || files.length === 0) {
    setUploadStatus('No files selected.');
    return;
  }

  let loaded = 0;
  let skipped = 0;

  Array.from(files).forEach((file) => {
    const name = file.name.toLowerCase();
    const key = name.replace(/\.(png|jpg|jpeg|mp4)$/i, '');
    let targetSelector = fileTargets[key];

    if (!targetSelector && file.type.startsWith('video/')) {
      targetSelector = '.background-video';
    }

    if (!targetSelector) {
      skipped += 1;
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    const success = updateImageTarget(targetSelector, fileUrl, file.name);
    if (success) loaded += 1;
    else skipped += 1;
  });

  if (loaded > 0) {
    setUploadStatus(`Loaded ${loaded} image${loaded === 1 ? '' : 's'}. ${skipped > 0 ? `${skipped} unsupported file${skipped === 1 ? '' : 's'} skipped.` : ''}`);
  } else {
    setUploadStatus('No supported images were selected. Use file names like product-1.png or gallery-a.jpg.');
  }
}

uploadInput?.addEventListener('change', (event) => {
  handleUploadFiles(event.target.files);
});
