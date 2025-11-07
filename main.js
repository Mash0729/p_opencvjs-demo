const imageInput = document.getElementById("imageInput");
const procButton = document.getElementById("procButton");
const dispInput = document.getElementById("dispInput");
const dispOutput = document.getElementById("dispOutput");

// 画像読み込み
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) {
    dispInput.innerHTML = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    dispInput.innerHTML = "";
    const img = document.createElement("img");
    img.src = e.target.result;
    dispInput.appendChild(img);
  };
  reader.readAsDataURL(file);
});
