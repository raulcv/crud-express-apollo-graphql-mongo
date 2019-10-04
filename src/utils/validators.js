module.exports.validateRegisterInput = (
    username,
    email,
    pwd,
    confirmPwd
) => {
    const errors = {}
    if(username.trim() === ''){
        errors.username = 'Nombre de usuario no puede ser vacio';
    }
    if(email.trim() === ''){
        errors.email = 'Email no puede ser vacio';
    }else{
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if(!email.match(regEx)){
            errors.email = 'Email no valido, ingrese un Email valido.'
        }
    }
    if(pwd.trim() === ''){
        errors.pwd = "Contraseña no puede ser vacio";
    }else if (pwd !== confirmPwd ){
        errors.pwd = 'Las contraseñas deben cohencicidir';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (username, pwd) => {
    const errors = {};
    if(username.trim() === ''){
        errors.username = "Nombre de Usuario no puede ser vacio";
    }else if (pwd === ''){
        errors.pwd = 'Contraseña no puede ser vacio';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}