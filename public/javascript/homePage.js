if (document.getElementById("signUp-btn") != null) {
    document.getElementById("signUp-btn").addEventListener("click", () => {
        window.location = "/signUp"
    })

    document.getElementById("signIn-btn").addEventListener("click", () => {
        window.location = "/signIn"
    })
}
if (document.getElementById("myInput").value == "") {
    document.getElementById("items").innerHTML = ""
    document.getElementById("items").style.visibility = "hidden"
}

function debounceCall() {
    let timer, context;
    return function(value) {
        context = this;
        clearTimeout(timer)
        timer = setTimeout(() => {
            console.log(context)
            fetchSearchQuery.apply(context, [value])
        }, 400)
    }
}
const callSearch = debounceCall()
async function fetchSearchQuery(value) {
    document.getElementById("items").innerHTML = ""
    document.getElementById("items").style.visibility = "visible"
    let val = value
    console.log(`fetching ${val} ....`)
    const rawRes = await fetch("/search", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "title": val })
    })
    if (rawRes.ok) {
        const res = await rawRes.json()
        arr = res

        document.getElementById("items").innerHTML = ""
        if (arr.length == 0) {
            var e = document.createElement("div")
            e.id = "not_found_div"
            e.innerText = " Not Found 😞"
            e.style.color = "#ababac"
            e.style.textAlign = "center"
            e.style.display = 'display'
            document.getElementById("items").appendChild(e)
        }
        arr.forEach((ele) => {
            var e = document.createElement("a")
            e.innerText = ele.title
            e.href = `/preview/${ele._id}`
            e.style.textDecoration = "none"
            e.className = "item"
            document.getElementById("items").appendChild(e)

        })
    }
}
document.getElementById("myInput").addEventListener("keyup", (e) => {
    if (e.target.value == "") {
        if (document.getElementById("items") != undefined) {
            document.getElementById("items").style.display = 'none'
        }
    } else {
        document.getElementById("items").style.display = 'flex'
        callSearch(e.target.value)
    }
})