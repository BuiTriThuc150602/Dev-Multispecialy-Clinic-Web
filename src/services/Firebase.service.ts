import { FirebaseErrorCode } from "@/components/Authentication/stores/screenKey";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  ConfirmationResult,
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  UserCredential,
} from "firebase/auth";

export class FirebaseService {
  private static instance: FirebaseService;
  private app;
  private auth;

  private constructor() {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_API_KEY,
      authDomain: import.meta.env.VITE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_APP_ID,
    };
    this.app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    this.auth = getAuth(this.app);
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  public getApp() {
    return this.app;
  }

  public getAuth() {
    return this.auth;
  }

  public async sendOTP(
    phone: string,
    recaptchaVerifier: RecaptchaVerifier | null
  ): Promise<ConfirmationResult> {
    try {
      if (!recaptchaVerifier) {
        throw new Error("RecaptchaVerifier chưa được xác thực");
      }

      const phone_formatted =
        phone[0] === "0" ? phone.replace("0", "+84") : phone;
      return await signInWithPhoneNumber(
        this.auth,
        phone_formatted,
        recaptchaVerifier
      );
    } catch (error: any) {
      if (error.code) {
        const errorCodes = Object.keys(FirebaseErrorCode) as Array<
          keyof typeof FirebaseErrorCode
        >;

        if (errorCodes.includes(error.code)) {
          throw new Error(
            FirebaseErrorCode[error.code as keyof typeof FirebaseErrorCode]
          );
        }
      } else {
        throw new Error(error.message ?? "Lỗi không xác định");
      }
      throw new Error(error.message ?? "Lỗi không xác định");
    }
  }

  public async confirmOTP(
    confirmationResult: ConfirmationResult,
    otp: string
  ): Promise<UserCredential> {
    return confirmationResult
      .confirm(otp)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        if (error.code) {
          const errorCodes = Object.keys(FirebaseErrorCode) as Array<
            keyof typeof FirebaseErrorCode
          >;
          if (errorCodes.includes(error.code)) {
            throw new Error(
              FirebaseErrorCode[error.code as keyof typeof FirebaseErrorCode]
            );
          }
        } else {
          throw new Error(error.message ?? "Lỗi không xác định");
        }
        throw new Error(error.message ?? "Lỗi không xác định");
      });
  }
}
