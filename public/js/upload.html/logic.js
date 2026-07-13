const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const areYouSureDiv = document.getElementById("areYouSureDiv");
const imagePersonalization = document.getElementById("imagePersonalization");
const tagInput = document.getElementById("tagInput");

let jwToken = localStorage.getItem("jwToken");
let imgId = "";
let newUpload = "";

if (!jwToken) {
    alert("You're not logged in!")
    location.href = "index.html"
}

async function reload() {
    try {
        const response = await fetch("/api/images/my", {
            headers: {
                "Authorization": `Bearer ${jwToken}`
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`)
        }

        const files = await response.json();

        const gallery = document.getElementById("gallery");
        gallery.innerHTML = "";
        files.forEach(file => {
            const div = document.createElement("div");
            div.className = "uploadedImgReview";
            div.innerHTML = `
                <div class="uploadedImgContainer">
                    <img class="uploadedImg" src="${"images/" + file.filename}">
                </div>
                <p><span>${file.likes.length}</span> Likes</p>
                <img data-img-id="${file._id}" class="deleteBtn" src="styleImages/delete.png" title="Delete">
            `
            gallery.appendChild(div);
        });
    } catch (err) {
        console.error(err)
    }
};



async function uploadFile(file) {

    if (!file.type.startsWith("image/")) {
        alert("Only .png, .jpeg, .gif & .webp are allowed!");
        return;
    }

    imagePersonalization.style.display = "block";

    newUpload = file;
}

dropZone.addEventListener("click", ()=>{
    fileInput.click();
});

fileInput.addEventListener("change", ()=>{
    const file = fileInput.files[0];
    if (file) uploadFile(file);
})

document.addEventListener("dragover", (e)=> e.preventDefault());
document.addEventListener("drop", (e)=>e.preventDefault());

dropZone.addEventListener("dragover", (e)=>{
    e.preventDefault();
    dropZone.classList.add("dragover");
})

dropZone.addEventListener("dragleave", ()=>{
    dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", async (e)=>{
    e.preventDefault();
    dropZone.classList.remove("dragover");

    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
});

document.addEventListener("click", (e)=>{
    const btn = e.target.closest(".deleteBtn");
    if (!btn) return;

    imgId = btn.dataset.imgId;

    areYouSureDiv.style.display = "block";
});

document.getElementById("confirmYes").addEventListener("click", async ()=>{
    await fetch("/api/deleteimg", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwToken}`
        },
        body: JSON.stringify({ imgId })
    });

    areYouSureDiv.style.display = "none";
    
    reload();
})

document.getElementById("confirmNo").addEventListener("click", ()=>{
    areYouSureDiv.style.display = "none";
})

document.getElementById("upload").addEventListener("click", async ()=>{
    const formData = new FormData();

    formData.append("image", newUpload);
    formData.append("tags", tagInput.value)

    const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${jwToken}`
        },
        body: formData
    })

    if (!response.ok) {
        alert("Upload failed");
        return;
    }

    reload();
    tagInput.value = "";
    imagePersonalization.style.display = "none";
    alert("Upload successful");
})

document.getElementById("cancel").addEventListener("click", async ()=>{
    tagInput.value = "";
    imagePersonalization.style.display = "none";
})


reload()