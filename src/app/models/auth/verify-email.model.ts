export interface VerifyEmailRequest {
  email: string;
  verificationCode: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface ResendCodeRequest {
  email: string;
}

export interface ResendCodeResponse {
  message: string;
}


