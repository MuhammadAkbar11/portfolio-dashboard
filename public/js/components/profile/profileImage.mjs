const profileImageInput = document.getElementById("profile-image-input");
const profileImagePreview = document.getElementById("profile-image-preview");
const saveImageBtn = document.getElementById("save-image-btn");

if (profileImageInput && profileImagePreview && saveImageBtn) {
  profileImageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profileImagePreview.src = e.target.result;
        saveImageBtn.disabled = false;
      };
      reader.readAsDataURL(file);
    } else {
      saveImageBtn.disabled = true;
    }
  });
}
