const login = document.querySelector('.login')
const message = document.querySelector('.message')
login.addEventListener('submit' , e => {
    e.preventDefault()
    const data = {
        email: login.elements.email.value,
        password: login.elements.password.value
    };
    fetch('/api/login',{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if(result.emailFlag || result.passwordFlag){
            message.innerHTML = result.Message;
        }
        else{
            window.location.href = 'http://localhost:8080/home';
        }
    })
    .catch(err => console.error(err))
})