

export interface User {
    id: string;
    name: string;
    email: string;
    profilePicture: string;
    baseCurrency?: string;
}
export interface UpdateUserResponse {
    data: User
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface ChangePasswordResponse {
    message: string;
}
