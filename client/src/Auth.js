class Auth {

    static authenticateUser(token) {
        localStorage.setItem('jwt', token);
    }

    static isUserAuthenticated() {
        return localStorage.getItem('jwt') !== null;
    }

    static deauthenticateUser() {
        localStorage.removeItem('jwt');
    }

    static getToken() {
        return localStorage.getItem('jwt');
    }
    
}

export default Auth;