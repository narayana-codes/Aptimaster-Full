console.log("register.js loaded");

const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", async () => {

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !email || !password || !confirmPassword) {
        alert("Please fill all fields");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {

        const response = await fetch("https://aptimaster-full-e9fy.vercel.app/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

const message = document.getElementById("message");

if(response.ok){

    message.innerText = "✅ Registration Successful";
    message.style.color = "green";

    setTimeout(() => {
        window.location.href = "login.html";
    }, 2000);

}
else{

    message.innerText = data.message;
    message.style.color = "red";

}

    } catch (err) {
        console.error(err);
        document.getElementById("message").innerText = "❌ Server Error";
document.getElementById("message").style.color = "red";
    }

});