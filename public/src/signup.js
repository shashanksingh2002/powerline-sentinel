const signupForm = document.querySelector('.signup');
const signupMessage = document.querySelector('.message');

signupForm.addEventListener('submit',(e) => {
    e.preventDefault();
    const data = {
        fname: signupForm.elements.fname.value,
        lname: signupForm.elements.lname.value,
        email: signupForm.elements.email.value,
        password: signupForm.elements.password.value,
        ph: signupForm.elements.ph.value,
        gender: signupForm.elements.gender.value
    };
    console.log(data)
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
            window.location.href = 'http://localhost:8080/login';
        }
        else{
            signupMessage.innerHTML = result.Message;
        }
    })
    .catch(err => console.error(err))
});