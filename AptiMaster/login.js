const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    try {

        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        

       const message = document.getElementById("message");

if(response.ok){

    message.innerText = "✅ Login Successful";
    message.style.color = "green";

    localStorage.setItem("user", JSON.stringify(data.user));

    setTimeout(() => {
        window.location.href = "/category.html";
    },2000);

}
else{

    message.innerText = data.message;
    message.style.color = "red";

}

    } catch (err) {
        console.error(err);
        alert("Server Error");
    }

});