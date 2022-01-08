export const getMockUser = () => {
    return {
        email: 'zooyeop@gmail.com', // 이메일 형식
        password: 'welcometohell!', // 6 ~ 20
        nickname: 'noahsgood' // 4 ~ 10
    };
};

export const getWrongPasswordUser = (wrongPassword: string) => {
    return getMockUser().password = wrongPassword;
}

export const getWrongNicknameUser = (wrongNickname: string) => {
    return getMockUser().nickname = wrongNickname;
}

export const getWrongEmailUser = (wrongEmail: string) => {
    return getMockUser().email = wrongEmail;
}

