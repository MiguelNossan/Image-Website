

function styling() {
    const imgDiv = document.getElementById("imgDiv");
    const postImgStyle = document.getElementById("postImg");
    const header = document.querySelector("header");
    const headerBtns = document.querySelectorAll(".headerBtn");
    const main = document.querySelector("main")
    const lisuForm = document.getElementById("lisuForm")
    const lisuH1 = document.getElementById("lisuH1")
    const lisuLabel = document.querySelectorAll(".lisuLabel")
    const lisuInput1 = document.getElementById("lisuInput1")
    const lisuInput2 = document.getElementById("lisuInput2")
    const lisuSubmitBtn = document.getElementById("lisuSubmitBtn")
    const closeBtn = document.getElementById("closeBtn")
    const imgH2 = document.getElementById("imgH2")


    let w = innerWidth;
    let h = innerHeight;
    let mainMT = 65;
    let headerBR = 2;
    let headerBtnFS = 16;
    let headerBtnW = 90;
    let headerBtnH = 50;
    let headerBtnM = "auto 10px"
    let ratio = postImgStyle.naturalWidth / postImgStyle.naturalHeight;
    let ihn = 1 / ratio;
    
    let lisuFormW = 500;
    let lisuFormH = 300;
    let lisuFormBR = 20;
    let lisuH1FS = 40;
    let lisuLabelFS = 25;
    let lisuInputFS = 20;
    let lisuSubmitBtnFS = 30;
    let closeBtnWH = 25;




    if (w < 600) {
        headerBtnM = "auto 5px"
        headerBR = 1;


        if (w >= 500) {
            headerBtnFS = 14;
            headerBtnW = 80;

        } else if (w >= 450) {
            headerBtnFS = 13;
            headerBtnW = 75;

            lisuFormW = 350;
            lisuFormH = 260;
            lisuH1FS = 35;
            lisuLabelFS = 20;
            lisuInputFS = 15;
            lisuSubmitBtnFS = 25;
            closeBtnWH = 20;
        } else if (w >= 400) {
            headerBtnFS = 11;
            headerBtnW = 65;
        } else if (w < 400) {
            mainMT = 50;
            headerBtnH = 40;
            headerBtnM = "auto 2px"

            if (w >= 350) {
                headerBtnFS = 10;
                headerBtnW = 60;
            } else if (w >= 300) {
                headerBtnFS = 8;
                headerBtnW = 50;
            } else if (w >= 250) {
                headerBtnFS = 6;
                headerBtnW = 40;
            } else if (w < 250) {
                headerBtnM = "auto 0"
                mainMT = 30;
                headerBtnH = 20;
                headerBR = 0;
                headerBtnFS = 4;
                headerBtnW = 30;
            }
        }


        if (w >= 450) {
            lisuFormW = 350;
            lisuFormH = 260;
            lisuH1FS = 35;
            lisuLabelFS = 20;
            lisuInputFS = 15;
            lisuSubmitBtnFS = 25;
            closeBtnWH = 20;
        } else if (w >= 350) {
            lisuFormW = 300;
            lisuFormH = 220;
            lisuH1FS = 30;
            lisuLabelFS = 18;
            lisuInputFS = 13;
            lisuSubmitBtnFS = 20;
            closeBtnWH = 15;
        } else if (w >= 275) {
            lisuFormW = 240;
            lisuFormH = 170;
            lisuFormBR = 15;
            lisuH1FS = 25;
            lisuLabelFS = 15;
            lisuInputFS = 12;
            lisuSubmitBtnFS = 17;
            closeBtnWH = 10;
        } else {
            lisuFormW = 150;
            lisuFormH = 150;
            lisuFormBR = 10;
            lisuH1FS = 20;
            lisuLabelFS = 10;
            lisuInputFS = 8;
            lisuSubmitBtnFS = 14;
            closeBtnWH = 8;
        }
        
        
    }
    

    header.style.height = mainMT + "px";
    header.style.borderRadius = `0 0 ${headerBR}em ${headerBR}em`
    headerBtns.forEach(btn => {
        btn.style.margin = headerBtnM;
        btn.style.fontSize = headerBtnFS + "px";
        btn.style.width = headerBtnW + "px";
        btn.style.height = headerBtnH + "px";
    })

    lisuForm.style.width = lisuFormW + "px"
    lisuForm.style.height = lisuFormH + "px"
    lisuForm.style.borderRadius = lisuFormBR + "px"
    lisuH1.style.fontSize = lisuH1FS + "px"
    lisuLabel.forEach(label => {
        label.style.fontSize = lisuLabelFS + "px";
    })
    lisuInput1.style.fontSize = lisuInputFS + "px";
    lisuInput2.style.fontSize = lisuInputFS + "px";
    lisuSubmitBtn.style.fontSize = lisuSubmitBtnFS + "px";
    closeBtn.style.width = closeBtnWH + "px"
    closeBtn.style.height = closeBtnWH + "px"



    for (let i = 0.9; i > 0.03; i -= 0.02) {
        i = Number(i.toFixed(5));
        if ((h*0.9)-mainMT >= (w*i)*ihn) {
            main.style.marginTop = mainMT + "px"
            main.style.height = (h*0.9)-mainMT + "px"
            imgDiv.style.width = w*i + "px";
            imgDiv.style.height = (w*i)*ihn + "px";
            imgH2.style.fontSize = 0.045*(w*i) + "px";
            postImgStyle.style.width = w*i + "px";
            postImgStyle.style.height = (w*i)*ihn + "px";
            postImgStyle.style.borderRadius = "3dvw"
            postImgStyle.style.border = "3px solid black"        
            break;
        }
    }



}

setInterval(()=>{
    styling();
}, 300)

styling();
