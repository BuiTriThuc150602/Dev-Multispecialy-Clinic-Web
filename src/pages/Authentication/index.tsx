import { SignIn, SignUp, ForgotPassword } from "@/components/Authentication";
import { screenKey } from "@/components/Authentication/stores/screenKey";
import { OTP } from "@/components/OTP";
import { useRecoilValue } from "recoil";
import {
  formValue,
  isScreenAuthenValue,
} from "@/components/Authentication/stores";
import { OTPScreen } from "@/types/OTP";
import { IFormValue } from "@/types/Authentication";

export const Authentication = () => {
  const isScreenAuthen = useRecoilValue(isScreenAuthenValue);
  const form = useRecoilValue(formValue);

  return (
    <div className="auth_wrapper h-screen pt-4 flex justify-center mx-auto max-sm:px-2 bg-[url('@/assets/img/team-bg-img.jpg')]">
      {isScreenAuthen === screenKey.signIn ? (
        <SignIn />
      ) : isScreenAuthen === screenKey.signUp ? (
        <SignUp />
      ) : isScreenAuthen === screenKey.otp ? (
        <OTP screen={OTPScreen.Authen} form={form as IFormValue} />
      ) : isScreenAuthen === screenKey.forgotPassword ? (
        <ForgotPassword />
      ) : (
        <></>
      )}
    </div>
  );
};
