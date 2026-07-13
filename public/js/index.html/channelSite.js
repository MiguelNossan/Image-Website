export function styleChannelImages(images, channelContent_l, imageProbe_l, w) {
/*
    for (let i = 0; i < images.length; i++) {
        imageProbe_l.src = "images/" + images[i].filename;
        console.log(imageProbe_l.naturalWidth)
        if (imageProbe_l.naturalWidth >= imageProbe_l.naturalHeight) {
            const allImagesTogetherLength
        }
    } 
*/
    console.log(images)
    const imagesPerLine = Math.floor(w/210);
    let createdImages = 0;
    const lines = Math.ceil(images.length / imagesPerLine);
    channelContent_l.innerHTML = "";
    
    for (let a = 0; a < lines; a++) {
        const div = document.createElement("div")

        for (let i = createdImages; i < images.length && i < createdImages + imagesPerLine; i++) {
            const img = document.createElement("img");
            img.src = "images/" + images[i].filename;
            img.dataset.id = images[i]._id;
            img.dataset.imageNumber = i;
            img.className = "channelImage";
            div.appendChild(img)
        }
        channelContent_l.appendChild(div);
        createdImages += imagesPerLine
    }
}