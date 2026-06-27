async function sendOTP(){

const email=document.getElementById("email").value;

const res=await fetch("http://localhost:5000/forgot-password",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({email})

});

const data=await res.json();

showMessage(data.message, "success");
showMessage(data.message, "error");
if(data.success){

localStorage.setItem("resetEmail",email);

// OTP section show
document.getElementById("otpSection").style.display="block";

}

}

// OTP Verify
async function verifyOTP(){

const otp=document.getElementById("otp").value;

const email=localStorage.getItem("resetEmail");

const res=await fetch("http://localhost:5000/verify-otp",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({email,otp})

});

const data=await res.json();

if(data.success){

showMessage("✅ OTP Verified Successfully","success");

document.getElementById("passwordSection").style.display="block";

}
else{

showMessage(data.message,"error");

}

if(data.success){

document.getElementById("passwordSection").style.display="block";

}

}

// Update Password
async function updatePassword() {

    const email = localStorage.getItem("resetEmail");

    const password = document.getElementById("newPassword").value;

    const confirm = document.getElementById("confirmPassword").value;

    if(password !== confirm){

        alert("Passwords do not match");

        return;

    }

    const res = await fetch("http://localhost:5000/reset-password",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            email,
            password

        })

    });

    const data = await res.json();

    if(data.success){

        alert("✅ Password Updated Successfully");

        localStorage.removeItem("resetEmail");

        window.location.href="login.html";

    }
    else{

        alert(data.message);

    }

}
async function verifyOTP() {

    const otp = document.getElementById("otp").value;
    const email = localStorage.getItem("resetEmail");

    const res = await fetch("http://localhost:5000/verify-otp", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            otp
        })

    });

    const data = await res.json();
if (data.success) {

    showMessage("✅ OTP Generated Successfully", "success");

    localStorage.setItem("resetEmail", email);

    document.getElementById("otpSection").style.display = "block";

} else {

    showMessage(data.message, "error");

}
    

    if (data.success) {
        document.getElementById("passwordSection").style.display = "block";
    }
}
function showMessage(message, type){

    const box = document.getElementById("messageBox");

    box.style.display = "block";
    box.className = type;
    box.innerText = message;

    setTimeout(() => {
        box.style.display = "none";
    }, 3000);
}
function showMessage(message,type){

const box=document.getElementById("messageBox");

box.innerHTML=message;

box.className=type;

setTimeout(()=>{

box.className="";
box.innerHTML="";

},3000);

}