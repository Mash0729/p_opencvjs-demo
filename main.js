const imageInput = document.getElementById("imageInput");
const procButton = document.getElementById("procButton");
const clearButton = document.getElementById("clearButton");
const dispInput = document.getElementById("dispInput");
const dispOutput = document.getElementById("dispOutput");

let targetImage = null;

// リロード時にinputを初期化
imageInput.value = "";

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

    targetImage = img;
    dispOutput.innerHTML = "";
  };
  reader.readAsDataURL(file);
});

// 実行ボタン押下時
procButton.addEventListener("click", () => {
  try {
    // 画質劣化防止のために元画像の解像度のcanvasを作成
    const fullCanvas = document.createElement("canvas");
    fullCanvas.width = targetImage.naturalWidth;
    fullCanvas.height = targetImage.naturalHeight;
    // オフスクリーンで表示
    const ctx = fullCanvas.getContext("2d");
    ctx.drawImage(targetImage, 0, 0, fullCanvas.width, fullCanvas.height);

    // Mat形式で画像を保持
    const src = cv.imread(fullCanvas);

    // 32bit-floatへの一時的な変換
    // CV_8Uのままではクリッピングが起こる
    const floatSrc = new cv.Mat();
    src.convertTo(floatSrc, cv.CV_32F);

    // セピア化用の行列
    // RGBA->RGBAへの変換
    const sepiaMatrix = [
      0.393, 0.769, 0.189, 0,
      0.349, 0.686, 0.168, 0,
      0.272, 0.534, 0.131, 0,
      0, 0, 0, 1,
    ];
    const mat = cv.matFromArray(4, 4, cv.CV_32F, sepiaMatrix);
    const floatDst = new cv.Mat();
    cv.transform(floatSrc, floatDst, mat);

    // 表示用に8bit符号なし整数型に戻す
    const dst = new cv.Mat();
    floatDst.convertTo(dst, cv.CV_8U);

    // 処理結果表示
    dispOutput.innerHTML = "";
    const canvas = document.createElement("canvas");
    dispOutput.appendChild(canvas);
    cv.imshow(canvas, dst);
  } catch (err) {
    console.error(err);
  }
});

// クリアボタン押下時
clearButton.addEventListener("click", () => {
  imageInput.value = "";
  dispInput.innerHTML = "";
  dispOutput.innerHTML = "";
})