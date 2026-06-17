const accessTokenOptions = {
    httpOnly:true,
    secure:process.env.NODE_ENV === 'production',
    sameSite:'strict',
    maxAge:15 * 60 * 1000,
}

const refreshTokenOptions = {
    httpOnly:true,
    secure:process.env.NODE_ENV === 'production',
    sameSite:'strict',
    maxAge:7* 24 * 60 * 60 * 1000,
}

export const setCokies =(res, accessToken, refreshToken) =>{

    res.cookie('AccessToken', accessToken, accessTokenOptions);
    res.cookie('RefreshToken', refreshToken, refreshTokenOptions);
    
}