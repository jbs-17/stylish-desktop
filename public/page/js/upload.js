// eslint-disable-next-line no-unused-vars
function previewFile() {
  document.getElementById("preview-container").innerHTML = '';
  document.getElementById("preview-container-mobile").innerHTML = '';
  document.getElementById("upload-title").innerHTML = '';
  
  const fileInput = document.getElementById("file-upload");
  const file = fileInput.files[0];
  const fileType = file.type.split("/")[0];
  
    const size = (file.size / 1024 / 1024).toFixed(2);
    const name = file.name;
    const type= file.type;
    console.log(type, size, file.size, name);
    
  if(fileInput.files.length > 1){
    alert('Pilih satu file saja!');
    document.getElementById('form').reset();
    return
  };
  if(!type.includes('image') && !type.includes('video')){
    alert(`Tipe File ${type} invalid! File hanya boleh image atau video!`);
    document.getElementById('form').reset();
    return
  };
  if(size > 20){
    alert(`Ukuran file ${size}MB invalid! Ukuran file maksimal 20MB!`);
    document.getElementById('form').reset();
    return
  };
  
  const previewDesktop = document.getElementById("preview-container");
  const previewMobile = document.getElementById("preview-container-mobile");
  const title = document.getElementById("upload-title");

  if (!file) {
    title.textContent = "Unggah Foto atau Video Anda";
    previewDesktop.innerHTML = "<p class='preview-placeholder'>Preview akan muncul di sini</p>";
    previewMobile.innerHTML = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    
    title.textContent = fileType === "image" ? "Foto Anda" : "Video Anda";

    let content = "";

    if (fileType === "image") {
      content = `<img src="${e.target.result}" style="max-width: 100%; max-height: 100%; border-radius: 8px;" />`;
    } else if (fileType === "video") {
      content = `
        <video controls style="max-width: 100%; max-height: 100%; border-radius: 8px;">
          <source src="${e.target.result}" type="${file.type}" />
          Browser Anda tidak mendukung video.
        </video>`;
    }

    previewDesktop.innerHTML = content;
    previewMobile.innerHTML = content;
  };

  reader.onerror = function () {
    console.error("Terjadi kesalahan saat membaca file.");
  };
  reader.readAsDataURL(file);
}














document.querySelector(".upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    const result = await response.json();
    console.log(result)
    if (result.status) {
      alert(result.message);
    } else {
      alert(result.message);
    }

    // Reset form dan preview
    form.reset();
    document.getElementById("upload-title").textContent = "Unggah Foto atau Video Anda";
    document.getElementById("preview-container").innerHTML = "<p class='preview-placeholder'>Preview akan muncul di sini</p>";
    document.getElementById("preview-container-mobile").innerHTML = "";
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat mengunggah file.");
  }
});



