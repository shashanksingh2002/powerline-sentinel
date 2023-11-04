const signupForm = document.querySelector('.signup');
const signupMessage = document.querySelector('.message');
const passwordInput = document.querySelector('.password');
const cpasswordInput = document.querySelector('.cpassword');

const validatePassword = () => {
    if (passwordInput.value === cpasswordInput.value) {
        passwordInput.style.outline = '2px solid green';
        cpasswordInput.style.outline = '2px solid green';
    } else {
        passwordInput.style.outline = '2px solid red';
        cpasswordInput.style.outline = '2px solid red';
    }    
}

passwordInput.addEventListener('input', validatePassword);
cpasswordInput.addEventListener('input', validatePassword);

signupForm.addEventListener('submit',(e) => {
    e.preventDefault();
    if(signupForm.elements.password.value === signupForm.elements.cpassword.value){
        const data = {
            fname: signupForm.elements.fname.value,
            lname: signupForm.elements.lname.value,
            email: signupForm.elements.email.value,
            password: signupForm.elements.password.value,
            ph: signupForm.elements.ph.value,
            gender: signupForm.elements.gender.value
        };
        fetch('/api/signup',{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if(result.flag){
                window.location.href = '/login';
            }
            else{
                signupMessage.innerHTML = result.Message;
            }
        })
        .catch(err => console.error(err))
    }
    else{
        signupMessage.innerHTML = '<p>The password is not matching with confirm password</p>'
    }
});