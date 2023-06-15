const generateRandomPassword = function (len) {
    const randomString = 'abcdefghijklmnopqrstuvwxyzBCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let password = '';
    for (let index = 0; index < len; index++) {
        password += randomString[Math.ceil(Math.random() * (randomString.length - 1))];
    }

    return password;
};
