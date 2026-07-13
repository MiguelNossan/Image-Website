import { styleChannelImages } from "./channelSite.js"

const header_l = document.querySelector("header");
const goToHomePage = document.getElementById("goToHomePage");
const showDeleteAcctForm = document.getElementById("showDeleteAcctForm");
const goToFollowingPage = document.getElementById("goToFollowingPage");
const postImg = document.getElementById("postImg");
const likeBtn_l = document.getElementById("like");
const followBtn_l = document.getElementById("follow");
const imgDiv_l = document.getElementById("imgDiv");
const lisuForm_l = document.getElementById("lisuForm");
const lisuH1_l = document.getElementById("lisuH1");
const lisuSubmitBtn_l = document.getElementById("lisuSubmitBtn");
const lisuInput1_l = document.getElementById("lisuInput1");
const lisuInput2_l = document.getElementById("lisuInput2");
const loader_l = document.getElementById("loader");
const imgH2_l = document.getElementById("imgH2");
const main_l = document.querySelector("main");
const followingSite_l = document.getElementById("followingSite");
const followingList_l = document.getElementById("followingList");
const channelSite_l = document.getElementById("channelSite");
const channelContent_l = document.getElementById("channelContent");
const channelSiteH2_l = document.getElementById("channelSiteH2")

const imageProbe_l = document.getElementById("imageProbe");

let userId = null;
let jwToken = '';
let currentImg = -1;
let images = [];
let lisu = "";
let imgLiked = false;
let following = [];
let followed = false;

function showLoggedInBtns() {
    document.querySelectorAll(".loggedOutHeaderBtn").forEach(btn =>{
        btn.style.display = "none";
    })

    document.querySelectorAll(".loggedInHeaderBtn").forEach(btn =>{
        btn.style.display = "block";
    })

    likeBtn_l.style.display = "block";
    followBtn_l.style.display = "block";
}

function hideAllElements() {
    header_l.style.display = "none";
    imgDiv_l.style.display = "none";
    loader_l.style.display = "none";
    lisuForm_l.style.display = "none";
    followingSite_l.style.display = "none";
    channelSite_l.style.display = "none";
}

async function userHasJWT() {
    jwToken = localStorage.getItem("jwToken");
    const response = await fetch("/api/jwtlogin", {
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${jwToken}`
        }
    })

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("jwToken", data.jwToken);
        userId = data.userId;
        following = data.following || [];
        showLoggedInBtns();
        goToHomePage.style.display = "none"


        alert(data.message)
    } else {
        localStorage.removeItem("jwToken")
    }


}

async function deleteAccount() {
    const response = await fetch("/api/deleteaccount", {
        method: "delete",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwToken}`
        },
        body: JSON.stringify({ username: lisuInput1_l.value, password: lisuInput2_l.value })
    })

    const data = await response.json();

    if (!response.ok) {
        alert(data.message);
        return;
    }

    localStorage.removeItem("jwToken");
    location.reload();
}

if (localStorage.getItem("jwToken"))  {
    userHasJWT();
}

fetch("/api/images")
.then(res => res.json())
.then(files => {
    images = files;

    if (images.length > 0) {
        const randomImg = Math.floor(Math.random() * images.length)
        currentImg = randomImg;
        postImg.src = "../images/" + images[randomImg].filename;
        imgH2_l.innerText = images[randomImg].owner?.username ?? "Unknown user";
        if (userId != images[randomImg].owner._id && userId) {
            likeBtn_l.style.display = "block";
            followBtn_l.style.display = "block";
            if (images[randomImg].likes.includes(userId)) {
                imgLiked = true;
                likeBtn_l.src = "styleImages/heartRB.png";
            } else {
                likeBtn_l.src = "styleImages/heartWB.png";
            }
            if (following.some(user => user.id === images[randomImg].owner._id)) {
                followBtn_l.src = "styleImages/unfollow.png";
                followBtn_l.title = "Unfollow"
                followed = true;
            } else {
                followBtn_l.src = "styleImages/follow.png";
                followBtn_l.title = "Follow"
                followed = false;
            }
        } else {
            likeBtn_l.style.display = "none";
            followBtn_l.style.display = "none";
        }
    }
})



postImg.addEventListener("click", ()=>{
    if (images.length > 0) {
        let randomImg;
        do {
            randomImg = Math.floor(Math.random() * images.length);
        } while (randomImg === currentImg);
        
        currentImg = randomImg;
        postImg.src = "../images/" + images[randomImg].filename;
        imgH2_l.innerText = images[randomImg].owner?.username ?? "Unknown user";
        if (userId != images[randomImg].owner._id && userId) {
            likeBtn_l.style.display = "block";
            followBtn_l.style.display = "block";
            if (images[randomImg].likes.includes(userId)) {
                imgLiked = true;
                likeBtn_l.src = "styleImages/heartRB.png";
            } else {
                likeBtn_l.src = "styleImages/heartWB.png";
            }
            if (following.some(user => user.id === images[randomImg].owner._id)) {
                followBtn_l.src = "styleImages/unfollow.png";
                followBtn_l.title = "Unfollow"
                followed = true;
            } else {
                followBtn_l.src = "styleImages/follow.png";
                followBtn_l.title = "Follow"
                followed = false;
            }
        } else {
            likeBtn_l.style.display = "none";
            followBtn_l.style.display = "none";
        }
    } else {
        console.log("The images aren't loading right now.")
    }
})

likeBtn_l.addEventListener("click", async ()=>{
    let response = '';

    if (!imgLiked) {
        response = await fetch("/api/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwToken}`
            },
            body: JSON.stringify({ imgId: images[currentImg]._id })
        })


        if (!response.ok) {
            return;
        }

        likeBtn_l.src = "styleImages/heartRB.png";
        imgLiked = true;
    } else {
        response = await fetch("/api/unlike", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwToken}`
            },
            body: JSON.stringify({ imgId: images[currentImg]._id })
        })

        if (!response.ok) {
            return;
        }

        likeBtn_l.src = "styleImages/heartWB.png";
        imgLiked = false
    }

    const updatedImage = await response.json();
    
    images[currentImg] = updatedImage;
})


document.getElementById("showLoginForm").addEventListener("click", ()=>{
    lisu = "li";
    lisuH1_l.innerText = "Log In";
    lisuSubmitBtn_l.innerText = "Log In";
    hideAllElements()
    lisuForm_l.style.display = "block";
});

document.getElementById("showSignUpForm").addEventListener("click", ()=>{
    lisu = "su"
    lisuH1_l.innerText = "Sign Up";
    lisuSubmitBtn_l.innerText = "Sign Up"
    hideAllElements()
    lisuForm_l.style.display = "block";
});

showDeleteAcctForm.addEventListener("click", ()=>{
    lisu = "da"
    lisuH1_l.innerText = "Delete Account";
    lisuSubmitBtn_l.innerText = "Delete Account"
    hideAllElements()
    lisuForm_l.style.display = "block";
    showLoggedInBtns();
    showDeleteAcctForm.style.display = "none"
    
})

document.getElementById("closeBtn").addEventListener("click", ()=>{
    lisuForm_l.style.display = "none";
    header_l.style.display = "flex";
    imgDiv_l.style.display = "block";
    lisuInput1_l.value = "";
    lisuInput2_l.value = "";
})

lisuForm_l.addEventListener("submit", async (e)=>{
    try {
        e.preventDefault();
        let response = "";
        hideAllElements();
        loader_l.style.display = "block";

        if (lisu === "su") {
            response = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ username: lisuInput1_l.value, password: lisuInput2_l.value })
            })
        } else if (lisu === "li") {
            response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: lisuInput1_l.value, password: lisuInput2_l.value })
            })
        } else if (lisu === "da") {
            deleteAccount();
            return;
        }
        
        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            lisuInput2_l.value = "";
            loader_l.style.display = "none";
            header_l.style.display = "flex";
            lisuForm_l.style.display = "block";
            return;
        }

        userId = data.userId;
        following = data.following || [];
        loader_l.style.display = "none";
        header_l.style.display = "flex";
        imgDiv_l.style.display = "block";
        lisuInput1_l.value = "";
        lisuInput2_l.value = "";
        jwToken = data.jwToken;
        localStorage.setItem("jwToken", jwToken);
        showLoggedInBtns();
        goToHomePage.style.display = "none"

        alert(data.message)
    } catch (err) {
        console.log(err)
    }
})

followBtn_l.addEventListener("click", async (e)=>{
    if (followed) {
        const response = await fetch("/api/unfollow", {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwToken}` 
            },
            body: JSON.stringify({ userToFollowId: images[currentImg].owner._id })
        })

        if (!response.ok) {
            console.error("Somethink went wrong")
            return;
        }

        followed = false;
        followBtn_l.title = "Follow"
        following = following.filter(
            id => id !== images[currentImg].owner._id
        );
        followBtn_l.src = "styleImages/follow.png";
    } else {
        const response = await fetch("/api/follow", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwToken}` 
            },
            body: JSON.stringify({ userToFollowId: images[currentImg].owner._id })
        })

        if (!response.ok) {
            console.error("Somethink went wrong")
            return;
        }

        followed = true;
        followBtn_l.title = "UnFollow"
        following.push({
            id: images[currentImg].owner._id,
            username: images[currentImg].owner.username
        });
        followBtn_l.src = "styleImages/unfollow.png";
    }
})

document.getElementById("logOutBtn").addEventListener("click", ()=>{
    localStorage.removeItem("jwToken");
    location.reload();
})

document.getElementById("goToUploadPage").addEventListener("click", ()=>{
    window.open("upload.html", "_blank")
})

goToFollowingPage.addEventListener("click", ()=>{
    showLoggedInBtns();
    goToFollowingPage.style.display = "none"
    hideAllElements();
    header_l.style.display = "flex"
    followingSite_l.style.display = "block"
    followingList_l.innerHTML = "";
    following.forEach(user=>{
        const a = document.createElement("a");
        a.classList = "followedChannelA";
        a.innerText = user.username;
        a.dataset.userId = user.id;
        a.dataset.username = user.username;
        a.href = "#";
        a.style.display = "block";

        followingList_l.appendChild(a);
    })
})

document.addEventListener("click", async (e)=>{
    const a = e.target.closest(".followedChannelA");
    if (!a || !a.dataset.userId) return;

    const channelId = a.dataset.userId;

    const response = await fetch("/api/images/otherChannel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId })
    })
 
    if (!response.ok) return;

    followingSite_l.style.display = "none";
    channelSite_l.style.display = "block";
    channelSiteH2_l.innerText = a.dataset.username;
    const images = await response.json();

    styleChannelImages(images, channelContent_l, imageProbe_l, window.innerWidth);
  
})

document.addEventListener("click", (e)=>{
    const img = e.target.closest(".channelImage");
    if (!img) return;
    showLoggedInBtns();
    goToHomePage.style.display = "none";
    postImg.src = img.src;
    const imageNumber = img.dataset.imageNumber;
    hideAllElements();

    if (userId != images[imageNumber].owner._id && userId) {
        likeBtn_l.style.display = "block";
        followBtn_l.style.display = "block";
        if (images[imageNumber].likes.includes(userId)) {
            imgLiked = true;
            likeBtn_l.src = "styleImages/heartRB.png";
        } else {
            likeBtn_l.src = "styleImages/heartWB.png";
        }
        if (following.some(user => user.id === images[imageNumber].owner._id)) {
            followBtn_l.src = "styleImages/unfollow.png";
            followBtn_l.title = "Unfollow"
            followed = true;
        } else {
            followBtn_l.src = "styleImages/follow.png";
            followBtn_l.title = "Follow"
            followed = false;
        }
    } else {
        likeBtn_l.style.display = "none";
        followBtn_l.style.display = "none";
    }

    header_l.style.display = "flex";
    imgDiv_l.style.display = "block";
})

goToHomePage.addEventListener("click", ()=>{
    showLoggedInBtns();
    goToHomePage.style.display = "none";
    hideAllElements();
    imgDiv_l.style.display = "block";
    header_l.style.display = "flex"
})