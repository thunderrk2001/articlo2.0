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
document.getElementById("myInput").addEventListener("input", async() => {
    document.getElementById("items").innerHTML = ""
    document.getElementById("items").style.visibility = "visible"
    let val = document.getElementById("myInput").value
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
            e.innerText = " Not Found 😞"
            e.style.color = "#ababac"
            e.style.textAlign = "center"
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


})