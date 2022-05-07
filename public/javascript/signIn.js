function signInButtonClicked() {
    var userName = document.getElementById("floatingInput").value
    var password = document.getElementById("floatingPassword").value
    document.querySelector(".loadingBar").style.visibility = "visible"
    change_state_form(true)
    sign(userName, password)
}
document.getElementById("signUp-btn").addEventListener("click", () => {
    document.body.style.pointerEvents = "none"
    document.body.style.opacity = "0.7"
    window.location = "/signUp"
})

function change_state_form(check) {
    if (check) {
        document.querySelector(".form-signin").style.opacity = "0.5"
        document.querySelector(".form-signin").style.pointerEvents = "none"
    } else {
        document.querySelector(".form-signin").style.opacity = "1"
        document.querySelector(".form-signin").style.pointerEvents = "visible"
    }
}
async function sign(userName, password) {
    userName = userName.trim()
    try {
        const rawResponse = await fetch("/signIn", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userName": userName,
                "password": password
            })
        })
        if (rawResponse.ok) {
            const nextPage = getCookie("nextPage")
            if (nextPage == undefined || nextPage == null || nextPage == "") {
                //go to home page
                window.location = "/"
            } else {
                window.location.reload(false)
                window.location = nextPage

            }
        } else {
            var err_res = await rawResponse.json()
            document.getElementById("message").innerText = err_res.message
        }
    } catch (e) {
        var err_res = await rawResponse.json()
        document.getElementById("message").innerText = err_res.message
    }
    change_state_form(false)
    document.querySelector(".loadingBar").style.visibility = "hidden"
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}