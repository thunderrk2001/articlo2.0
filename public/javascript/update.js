var editor = document.querySelector(".editor")

function changeFontSize(size) {
    editor.focus()
    document.execCommand("fontSize", false, size)
}
var color_hash = { 0: "Black", 1: "Yellow", 2: "Green", 3: "Magenta" }
var justify_hash = { 0: "justifyLeft", 1: "justifyRight", 2: "justifyCenter" }

document.getElementById("justify").addEventListener("input", (e) => {
    e.preventDefault()
    editor.focus()
    let value = document.getElementById("justify").value
    console.log(value)
    document.execCommand(justify_hash[value])
})
document.getElementById("color").addEventListener("input", (e) => {
    editor.focus()
    let value = document.getElementById("color").value
    e.preventDefault()
    editor.focus()
    document.execCommand('styleWithCSS', false, true);
    document.execCommand('foreColor', false, color_hash[value]);
    document.execCommand('styleWithCSS', false, false);


})
document.getElementById("bold").addEventListener("mousedown", (e) => {
    var ele = document.getElementById("bold")
    e.preventDefault()
    editor.focus()
    document.execCommand("bold", false)
    change_style("bold", ele)
})
document.getElementById("italic").addEventListener("mousedown", (e) => {
    var ele = document.getElementById("italic")
    e.preventDefault()
    editor.focus()
    document.execCommand("italic", false)
    change_style("italic", ele)
})
document.getElementById("underline").addEventListener("mousedown", (e) => {
    var ele = document.getElementById("underline")
    e.preventDefault()
    document.execCommand("underline", false)
    change_style("underline", ele)
})
document.getElementById("font7").addEventListener("mousedown", (e) => {
    var ele = document.getElementById("font7")
    e.preventDefault()
    editor.focus()
    changeFontSize(7)
    change_style_font("font7", ele, "font3", "font5")
})

document.getElementById("font5").addEventListener("mousedown", (e) => {
    font5()
})

function font5() {
    var ele = document.getElementById("font5")
    editor.focus()

    changeFontSize(5)
    change_style_font("font5", ele, "font3", "font7")
    console.log("ok")
}
document.getElementById("font3").addEventListener("mousedown", (e) => {
    var ele = document.getElementById("font3")
    e.preventDefault()
    editor.focus()
    changeFontSize(3)
    change_style_font("font3", ele, "font5", "font7")
})
document.getElementById("insertUnorderedList").addEventListener("mousedown", (e) => {
    var ele = document.getElementById("insertUnorderedList")
    e.preventDefault()
    editor.focus()
    document.execCommand("insertUnorderedList", false)
    change_style_ulist("insertUnorderedList", ele)
})
document.getElementById("insertorderedList").addEventListener("mousedown", (e) => {
    var ele = document.getElementById("insertorderedList")
    e.preventDefault()
    editor.focus()
    document.execCommand("insertorderedList", false)
    change_style_olist("insertorderedList", ele)
})

function change_style_ulist(commnd, ele) {
    var olist_ele = document.getElementById("insertorderedList")
    if (ele.classList.contains("bg-light")) {
        ele.classList.remove("bg-light")
        ele.classList.add("bg-secondary")
    } else {
        ele.classList.remove("bg-secondary")
        ele.classList.add("bg-light")
    }
    if (olist_ele.classList.contains("bg-secondary")) {
        console.log("done")
        olist_ele.classList.remove("bg-secondary")
        olist_ele.classList.add("bg-light")
    }

}

function change_style_olist(command, ele) {
    var ulist_ele = document.getElementById("insertUnorderedList")
    if (ele.classList.contains("bg-light")) {
        ele.classList.remove("bg-light")
        ele.classList.add("bg-secondary")
    } else {
        ele.classList.remove("bg-secondary")
        ele.classList.add("bg-light")
    }
    if (ulist_ele.classList.contains("bg-secondary")) {
        ulist_ele.classList.remove("bg-secondary")
        ulist_ele.classList.add("bg-light")
    }
}

function change_style_font(command, ele, second, third) {
    ele.classList.remove("bg-light")
    ele.classList.add("bg-secondary")
    var ele2 = document.getElementById(second)
    var ele3 = document.getElementById(third)
    if (ele2.classList.contains("bg-secondary")) {
        ele2.classList.remove("bg-secondary")
        ele2.classList.add("bg-light")
    }

    if (ele3.classList.contains("bg-secondary")) {
        ele3.classList.remove("bg-secondary")
        ele3.classList.add("bg-light")
    }


}

function change_state_load_btn(check) {
    if (check) {
        document.getElementById("load").innerText = "Uploading....."
        document.getElementById("load").style.pointerEvents = "none"
        document.getElementById("load").style.opacity = "0.5"
    } else {
        document.getElementById("load").innerText = "Upload"
        document.getElementById("load").style.pointerEvents = "visible"
        document.getElementById("load").style.opacity = "1"
    }
}

function change_style(command, ele) {

    if (document.queryCommandState(command) && ele.classList.contains("bg-light")) {
        ele.classList.remove("bg-light")
        ele.classList.add("bg-secondary")
    } else if (!document.queryCommandState(command) && ele.classList.contains("bg-secondary")) {
        var className = "bg-secondary"
        ele.classList.remove(className)
        className = "bg-light"
        ele.classList.add(className)
    }

}
document.getElementById("load").addEventListener("mousedown", async(e) => {
    e.preventDefault()
    await loadImageFileAsURL()
})
document.getElementById("title").addEventListener("click", () => {
    if (document.getElementById("titleMessage").style.visibility == "visible") {

        document.getElementById("titleMessage").style.visibility = "hidden"
    }
})

async function loadImageFileAsURL() {
    var filesSelected = document.getElementById("image").files;
    if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];
        if (fileToLoad.type.match("image.*") && fileToLoad.size <= 200000) {
            var fileReader = new FileReader();
            fileReader.onload = async function(fileLoadedEvent) {
                await uploadImage(fileToLoad)
            };

            fileReader.readAsDataURL(fileToLoad);
        } else if (fileToLoad.size > 200000) {
            document.getElementById("messageImage").style.visibility = "visible"
        }

    }
}
async function uploadImage(fileToLoad) {
    document.getElementById("messageImage").style.visibility = "hidden"
    var formData = new FormData()
    formData.append("image", fileToLoad)
    try {
        const rawResponse = await fetch("/uploadImage", {
            method: "POST",
            body: formData
        })
        if (rawResponse.ok) {
            const json_res = await rawResponse.json()
            addImageToAlbum(json_res.url)

        } else {
            throw "Some error"
        }
    } catch (e) {

        console.log(e)
    }

    change_state_load_btn(false)
}

function addImageToEditor(imageLoaded) {
    imageLoaded.className = "image"
    imageLoaded.onerror = "this.style.display='none'"
    document.querySelector(".editor").appendChild(imageLoaded);
}

function addImageToEditor2(src) {
    var imageLoaded = document.createElement("IMG")
    imageLoaded.src = src
    imageLoaded.className = "image"
    imageLoaded.onerror = "this.style.display='none'"
    document.querySelector(".editor").appendChild(imageLoaded);
}

document.getElementById("btn_showImages").addEventListener('click', async() => {
    document.getElementById("loadingDots").style.display = "flex";
    await fetchImages()
})
async function fetchImages() {
    const rawRes = await fetch("/writeArticle/userUploadedImages", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    document.getElementById("loadingDots").style.display = "none";
    if (rawRes.ok) {
        const res = await rawRes.json()
        var urlList = res.urlList

        addImages(urlList)


    } else {
        console.log("eror on fetching images")
    }
}



function addImages(list) {
    document.getElementById("btn_showImages").style.pointerEvents = "none"

    list.forEach((url) => {
        addImageToAlbum(url)
    })
}

function addImageToAlbum(url) {
    document.getElementById("btn_showImages").style.pointerEvents = "none"
    var html_div = document.createElement("div")
    html_div.className = "col-md-4"
    html_div.innerHTML = `
                                 <div class="card mb-4 shadow-sm">
                                    <img src="${url}" data-mdb-dismiss="modal" onclick="addImageToEditor2(this.src)" />
                                </div>
                        `
    document.getElementById("album").appendChild(html_div)

}
document.getElementById("submit-btn").addEventListener("click", async() => {

    /*/var main_content = document.querySelector(".main-content").style
    main_content.opacity = "0.3";
    main_content.pointerEvents = "none"
    document.querySelector(".loadingBar").style.visibility = "visible"*/
    let title = document.getElementById("title");
    if (title != undefined && title.value.length > 10) {
        document.getElementById("sending").style.visibility = "visible"
        document.body.style.pointerEvents = "none"
        document.body.style.opacity = "0.7"
        await sendFullArticleData(editor.innerHTML, title.value)
    } else {
        document.getElementById("titleMessage").style.visibility = "visible"
    }


})
async function sendFullArticleData(data, title) {
    var id = document.getElementById("submit-btn").getAttribute("data-uid")
    const res = await fetch(`/myArticles/update/${id}/submit`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "data": data,
            "title": title
        })
    })
    if (res.ok) {
        goToHomePage()
    }
}

function goToHomePage() {
    localStorage.removeItem("article_data_reject_edit")
    localStorage.removeItem("title_reject_edit")
    window.location = "/myArticles"

}

async function sendImageToServer(html_ele) {
    var data = html_ele.src
    console.log(data)
    var res = await fetch("/post_image", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "data": data
        })
    })
    if (res.ok) {
        var json_data = await res.json()
        html_ele.src = json_data.uid

    } else {
        ok = false
    }
}

document.getElementById("preview-btn").addEventListener("click", () => {
    makeBodyUnclcikable()
    var id = document.getElementById("preview-btn").getAttribute("data-uid")
    localStorage.setItem("preview", "edit_reject")
    localStorage.setItem(`article_data_reject_edit${id}`, editor.innerHTML)
    localStorage.setItem(`title_reject_edit${id}`, document.getElementById("title").value)
    window.location = `/myArticles/editReject/${id}/preview`

})
window.onload = () => {
    document.getElementById("messageImage").style.visibility = "hidden"
    var id = document.getElementById("preview-btn").getAttribute("data-uid")
    if (localStorage.getItem(`article_data_reject_edit${id}`) != null) {
        editor.innerHTML = localStorage.getItem(`article_data_reject_edit${id}`)
        document.getElementById("title").innerHTML = localStorage.getItem(`title_reject_edit${id}`)
        localStorage.removeItem(`title_reject_edit${id}`)
        localStorage.removeItem(`article_data_reject_edit${id}`)

    }

    document.getElementById("preview-btn").disabled = false
    document.getElementById("submit-btn").disabled = false
    setTimeout(() => { font5() }, 100)

}

function makeBodyUnclcikable() {
    document.body.style.pointerEvents = "none"
    document.body.style.opacity = "0.5"
}