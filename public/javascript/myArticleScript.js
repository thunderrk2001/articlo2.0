var btn_list = ["btn_Accept", "btn_Pending", "btn_Reject", "btn_Reject_Update"]
window.addEventListener("load", async() => {
    isFlexBtnsClickable(false)
    await articles("articles")
})

function addToHtmlList(list, s) {
    document.querySelector("#waitingText").innerHTML = ""
    var parent_list = document.querySelector(".add1")
    parent_list.innerHTML = ""
    if (s == "articles") {
        list.forEach((element) => {
            var div = document.createElement("div")
            div.innerHTML = `<div class="list-group-item list-group-item-action flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">
                <a href="/preview/${element._id}" data-uid="${element._id}" class="title">
                    <h5 class="mb-1">${element.title}</h5>
                </a>
                <div class="add">
                    <button type="button" onclick="update_btn(this)" data-uid="${element._id}" class="btn  btn-sm">
                           Update
                        </button>
                    <button type="button" onclick="remove(this)" class="btn  btn-sm"><img src="
                            https://cdn.iconscout.com/icon/premium/png-512-thumb/delete-1432400-1211078.png" height="20px"></button>
                </div>
            </div>
            <div class="d-flex w-100 justify-content-between">
                <small>Message: Success </small>

                <small style="font-weight:600; margin-left: 10px;">${element.dateTime}</small>
            </div>
            <div class="d-flex w-100 justify-content-center  dialogDelete" >
             <button id="confirmDelete"  class="btn bg-danger btn-sm" style="color:white" >Delete</button>
             <button id="cancelDelete" class="btn  btn-sm" >Cancel</button>
            </div>
        </div>`;
            parent_list.appendChild(div)

        });
    } else if (s == "pending") {
        list.forEach((element) => {
            var div = document.createElement("div")
            div.innerHTML = ` <div class="list-group-item list-group-item-action flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">
                <a href="/myArticles/pending/${element._id}" data-uid="${element._id}" class="title">
                    <h5 class="mb-1">${element.title}</h5>
                </a>
            </div>
            <div class="d-flex w-100 justify-content-between">
                <small>Message: pending... </small>

                <small style="font-weight:600; margin-left: 10px;">${element.dateTime}</small>
            </div>
        </div>`;
            parent_list.appendChild(div)

        });
    } else if (s == "reject") {
        list.forEach((element) => {
            var div = document.createElement("div")
            div.innerHTML = ` <div class="list-group-item list-group-item-action flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">

                    <h5 class="mb-1" style="color:grey">${element.title}</h5>

                <div class="add">
                    <button type="button" class="btn  btn-sm" data-uid="${element._id}" onclick="editReject(this)" >
                           Edit
                        </button>

                </div>
            </div>
            <div class="d-flex w-100 justify-content-between">
                <small style="color:red">Message: ${element.message} </small>

                <small style="font-weight:600; margin-left: 10px;">${element.dateTime}</small>
            </div>

        </div>`;
            parent_list.appendChild(div)

        });
    } else if (s == "reject_update") {
        list.forEach((element) => {
            var div = document.createElement("div")
            div.innerHTML = ` <div class="list-group-item list-group-item-action flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">

                    <h5 class="mb-1" style="color:grey">${element.title}</h5>

                <div class="add">
                    <button type="button"  onclick="editRejectUpdate(this)"  class="btn  btn-sm" data-uid="${element._id}"  >
                           Edit
                        </button>

                </div>
            </div>
            <div class="d-flex w-100 justify-content-between">
                <small style="color:red">Message: ${element.message} </small>

                <small style="font-weight:600; margin-left: 10px;">${element.dateTime}</small>
            </div>

        </div>`;
            parent_list.appendChild(div)

        });
    } else {

    }


}

function remove(div) {

    var minorParent = div.parentElement.parentElement
    let uid = minorParent.children[0].getAttribute("data-uid")
    var parent = minorParent.parentElement
    parent.children[2].style.visibility = "visible"
    parent.children[2].children[1].addEventListener("click", () => {
        parent.children[2].style.visibility = "hidden"
    })
    parent.children[2].children[0].addEventListener("click", async() => {
        document.getElementById("loading").style.visibility = "visible"
        document.getElementById("big").style.opacity = ".5"
        document.getElementById("flex_btn").style.pointerEvents = "none"
        document.getElementById("big").style.pointerEvents = "none"
        await deleteActualArticle(uid, parent.parentElement)

    })

}


function showNothing(s) {
    document.querySelector("#waitingText").innerHTML = ""
    var parent_list = document.querySelector(".add1")
    var div = document.createElement("div")
    div.style.textAlign = "center"
    div.style.marginTop = "100px"
    div.style.color = "green"
    div.style.fontSize = "25px"
    div.style.opacity = "0.5"
    div.innerText = `Nothing in ${s} List`
    parent_list.append(div)

}

function removeStyle(s) {
    document.querySelector(".list-group").innerHTML = ""
    var index = btn_list.indexOf(s)
    for (var i = 0; i < btn_list.length; i++) {
        if (i == index) {
            document.getElementById(btn_list[i]).classList.remove("btn-secondary")
            document.getElementById(btn_list[i]).classList.add("btn-primary")
        } else {
            if (document.getElementById(btn_list[i]).classList.contains("btn-primary")) {
                document.getElementById(btn_list[i]).classList.remove("btn-primary")
                document.getElementById(btn_list[i]).classList.add("btn-secondary")
            }
        }
    }

    isFlexBtnsClickable(false)
}

function isFlexBtnsClickable(check) {
    if (check) {
        document.getElementById("flex_btn").style.pointerEvents = "visible"
        document.getElementById("flex_btn").style.opacity = "100%"

    } else {
        document.getElementById("flex_btn").style.pointerEvents = "none"
        document.getElementById("flex_btn").style.opacity = "60%"

    }
}

function waitingText() {
    var ele = document.createElement("div")
    ele.style.textAlign = "center"
    ele.style.color = "gray"
    ele.style.fontSize = "20px"
    ele.innerText = "Fetching..."
    document.querySelector("#waitingText").appendChild(ele)
}
document.getElementById("btn_Accept").addEventListener("click", async() => {
    removeStyle("btn_Accept")
    waitingText()
    await articles("articles")

})

document.getElementById("btn_Pending").addEventListener("click", async() => {
    removeStyle("btn_Pending")
    waitingText()
    await articles("pending")


})
document.getElementById("btn_Reject").addEventListener("click", async() => {
    removeStyle("btn_Reject")
    waitingText()
    await articles("reject")

})
document.getElementById("btn_Reject_Update").addEventListener("click", async() => {
    removeStyle("btn_Reject_Update")
    waitingText()
    await articles("reject_update")
})

function editReject(div) {
    window.location = `/myArticles/editReject/${div.getAttribute("data-uid")}`
}

function editRejectUpdate(div) {
    window.location = `/myArticles/editRejectUpdate/${div.getAttribute("data-uid")}`
}

function update_btn(div) {
    window.location = `/myArticles/update/${div.getAttribute("data-uid")}`
}
async function articles(s) {
    const rawResponse = await fetch(`/myArticles/${s}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
    if (rawResponse.ok) {
        const res = await rawResponse.json()
        if (res["articles"].length == 0) {
            showNothing(s)

        } else {
            addToHtmlList(res["articles"], s)

        }
        isFlexBtnsClickable(true)

    }
}
async function deleteActualArticle(id, ele) {
    var parent_list = document.querySelector(".add1")
    var path = `/myArticles/articles/${id}/delete`
    const rawResponse = await fetch(path, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "ok": "OK" })
    })
    if (rawResponse.ok) {
        document.getElementById("loading").style.visibility = "hidden"
        document.getElementById("big").style.opacity = "1"
        document.getElementById("big").style.pointerEvents = "visible"
        document.getElementById("flex_btn").style.pointerEvents = "visible"
        parent_list.removeChild(ele)
    }
}