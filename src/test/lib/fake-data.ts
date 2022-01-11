export class LoginFakeUser {
    private email: string;
    private password: string;

    constructor() {
        this.email = 'zooyeop@gmail.com';
        this.password = 'welcometohell!';
    }

    public getEmail() {
        return this.email;
    }
    
    public setEmail(email: string) {
        this.email = email;
    }
    
    public getPassword() {
        return this.password;
    }
    
    public setPassword(password: string) {
        this.password = password;
    }
    
}

export class SignUpFakeUser extends LoginFakeUser {
    private nickname: string;
    
    constructor() {
        super();
        this.nickname = 'noahsgood';
    }

    public getNickname() {
        return this.nickname;
    }

    public setNickname(nickname: string) {
        this.nickname = nickname;
    }
}
