export interface UserAuthenticate {
    _id?: string;
    first_name:string;
    last_name:string;
    avatar?: string;
    email: string;
    date_of_birth: Date;
    gender: boolean;
    phone: string;
    
    role: string;
    expiresIn: string;
    refreshToken: string;
    accessToken?: string;
}
