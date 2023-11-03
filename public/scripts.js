const login = document.querySelector('.login')
const signup = document.querySelector('.signup')

login.addEventListener('click', (e) => {
    window.location.href = '/login'
})

signup.addEventListener('click', (e) => {
    window.location.href = '/signup'
})