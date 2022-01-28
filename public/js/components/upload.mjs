const imageUploaderInit = () => {
  // ProjectForm();

  const InputFileImage = document.getElementById("upload-project-image");
  const BtnUploadImage = document.getElementById("btn-upload-project-image");

  if (BtnUploadImage) {
    BtnUploadImage.addEventListener("click", e => {
      e.preventDefault();
      InputFileImage.click();
    });

    InputFileImage.addEventListener("change", e => {
      resetUpload(InputFileImage);
      const newFile = convertImageFileToObjectURL(e.target, e.target.files)[0];
      if (newFile) {
        createPreviewImage(e.target, newFile);
      }
    });
  }
};

const checkFileType = file => {
  const fileTypes = /jpg|jpeg|png/;
  const mimeType = fileTypes.test(file.type);
  return mimeType;
};

const setErrorUpload = el => {
  const ElParent = el.parentNode;
  const MessageErrEl = document.createElement("div");
  MessageErrEl.className = "mt-1 upload-error";
  MessageErrEl.innerHTML = `
  <small class="text-danger">Only Allowed Image</small>
  `;
  ElParent.appendChild(MessageErrEl);
};

const resetUpload = el => {
  const ElParent = el.parentNode;
  const MessageErrEl = ElParent.querySelector(".upload-error");
  const PreviewEl = ElParent.querySelector(".upload-preview-wrapper");
  if (MessageErrEl) {
    ElParent.removeChild(MessageErrEl);
  }

  if (PreviewEl) {
    ElParent.removeChild(PreviewEl);
  }
};

const createPreviewImage = (el, file) => {
  const ElParent = el.parentNode;
  const PreviewWrapper = document.createElement("div");
  const PreviewImg = document.createElement("img");

  PreviewImg.setAttribute("src", file.url);
  PreviewImg.setAttribute("alt", "preview upload");
  PreviewImg.className = "upload-preview-img";

  PreviewWrapper.className = "my-3 upload-preview-wrapper";
  PreviewWrapper.appendChild(PreviewImg);
  ElParent.appendChild(PreviewWrapper);
};

const convertImageFileToObjectURL = (el, files) => {
  return [...files].map(file => {
    if (checkFileType(file)) {
      return {
        filename: file.name,
        file,
        url: URL.createObjectURL(file),
      };
    }

    setErrorUpload(el);
    return null;
  });
};

document.addEventListener("DOMContentLoaded", () => imageUploaderInit());
