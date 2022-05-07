document.getElementById("login-btn").addEventListener("click", () => {
    document.body.style.pointerEvents = "none"
    document.body.style.opacity = "0.7"
    window.location = "/signIn"
})
document.getElementById("signUp").addEventListener("click", () => {
    var userName = document.getElementById("floatingInput").value
    var pass = document.getElementById("floatingPassword").value
    var confirm_pass = document.getElementById("floatingConfirmPassword").value
    if (userName.length > 2 && pass.length > 7 && confirm_pass.length > 7 && pass == confirm_pass) {
        change_state_form(true)
        userName = userName.trim()
        register(userName, pass)
    } else if (pass != confirm_pass) {
        document.getElementById("message").innerText = "Both passwords Not matched"
    } else if (userName.length <= 2) {
        document.getElementById("message").innerText = "user name cant be to short"
    } else if (pass.length < 8) {
        document.getElementById("message").innerText = "password must be 8 char long"
    }


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
async function register(userName, password) {
    try {
        const rawResponse = await fetch("/signUp", {
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
            var json_res = await rawResponse.json()
            document.getElementById("message").innerText = json_res.message

        }

    } catch (e) {
        document.getElementById("message").innerText = e.message
    }
    change_state_form(false)
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}