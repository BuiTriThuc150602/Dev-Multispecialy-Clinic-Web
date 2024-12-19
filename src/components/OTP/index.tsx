import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { getApp, getApps, initializeApp } from "firebase/app";
import { ConfirmationResult, getAuth, RecaptchaVerifier } from "firebase/auth";
import toast from "react-hot-toast";
import { AuthenService } from "@/services/Authen/AuthenService";
import { useNavigate } from "react-router-dom";
import { FirebaseService } from "@/services/Firebase.service";
import { useAuthContext } from "@/context/AuthContext";
import { OTPProps, OTPScreen } from "@/types/OTP";
import { IFormForgotPassword, IFormValue } from "@/types/Authentication";
import { Patient } from "@/types/User";
import { PatientService } from "@/services/Patient/PatientService";
import { useSetRecoilState } from "recoil";
import { isScreenPatientInfoValue } from "@/stores/patientInfo";
import { isScreenAuthenValue } from "../Authentication/stores";
import { screenKey } from "../Authentication/stores/screenKey";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export const OTP: React.FC<OTPProps> = ({ screen, form }) => {
  const [phone, setPhone] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [otp, setOtp] = useState<string>("");
  const { isLoading, typeLoading, signUp, signIn, forgotPassword } =
    AuthenService();
  const { updateInfo } = PatientService();
  const navigate = useNavigate();
  const [isPeding, setIsPending] = useState<boolean>(false);
  const setIsScreenPatientInfo = useSetRecoilState(isScreenPatientInfoValue);
  const setIsScreenAuthen = useSetRecoilState(isScreenAuthenValue);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult>();
  const { setAccessToken } = useAuthContext();

  useEffect(() => {
    if (screen === OTPScreen.Authen) {
      const typedForm = form as IFormValue;
      setPhone(typedForm.patient?.phone || "");
    } else if (screen === OTPScreen.UpdateInfo) {
      const typedForm = form as Patient;
      setPhone(typedForm.phone || "");
    } else if (screen === OTPScreen.ForgotPassword) {
      const typedForm = form as IFormForgotPassword;
      setPhone(typedForm.phone || "");
    }
  }, [screen, form]);

  useEffect(() => {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );
    setRecaptchaVerifier(recaptchaVerifier);
    return () => {
      recaptchaVerifier.clear();
    };
  }, [auth]);

  const handleSubmit = async () => {
    if (!confirmationResult && phone) {
      try {
        setIsPending(true);
        const sendOTP = await FirebaseService.getInstance().sendOTP(
          phone,
          recaptchaVerifier
        );
        setTimeLeft(30);
        setConfirmationResult(sendOTP);
        setIsPending(false);
        toast.success("Mã OTP đã được gửi");
      } catch (error: any) {
        toast.error(error.message);
        setIsPending(false);
      }
    } else {
      try {
        setIsPending(true);
        if (confirmationResult) {
          const verify = await FirebaseService.getInstance().confirmOTP(
            confirmationResult,
            otp
          );
          console.log("verify", verify);
          setIsPending(false);
          toast.success("Xác thực thành công");
          setOtp("");
          if (screen === OTPScreen.Authen) {
            handleSignUp();
          } else if (screen === OTPScreen.UpdateInfo) {
            handleUpdateInfo();
          } else if (screen === OTPScreen.ForgotPassword) {
            handleResetPassword();
          }
        }
      } catch (error: any) {
        toast.error(error.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    if (timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleResendOtp = async () => {
    setTimeLeft(30);
    if (!confirmationResult && phone) {
      try {
        setIsPending(true);
        const sendOTP = await FirebaseService.getInstance().sendOTP(
          phone,
          recaptchaVerifier
        );
        setConfirmationResult(sendOTP);
        setIsPending(false);
        toast.success("Mã OTP đã được gửi");
      } catch (error: any) {
        toast.error(error.message);
        setIsPending(false);
      }
    }
  };

  const handleSignUp = () => {
    const typedForm = form as IFormValue;
    signUp(typedForm).then((response) => {
      if (!response?.status) {
        toast.error(response?.data?.message);
      } else {
        toast.success(response.data.message);
        signIn({
          username: typedForm?.username,
          password: typedForm?.password,
        }).then((response) => {
          if (!response?.status) {
            console.log("response handleSignIn", response);
          } else {
            setAccessToken(response?.data?.access_token);
            navigate("/");
          }
        });
      }
    });
  };

  const handleUpdateInfo = async () => {
    const values = form as Patient;
    console.log("values in handleUpdateInfo", values);
    if (values.patientId) {
      await updateInfo(values.patientId, values);
      setIsScreenPatientInfo(true);
    }
  };

  const handleResetPassword = () => {
    const typedForm = form as IFormForgotPassword;
    const { username, password } = typedForm;
    forgotPassword({ username, password }).then((response) => {
      if (!response?.status) {
        toast.error(response?.data?.message);
      } else {
        toast.success(response.data.message);
        setIsScreenAuthen(screenKey.signIn);
      }
    });
  };

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white shadow-lg rounded-xl gap-10 flex items-center justify-between h-fit p-10">
        <div className="flex flex-col flex-1 space-y-14 px-4">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-bold font-logo text-blue2">
              XÁC THỰC OTP
            </h1>
            <div className="text-sm text-gray2">
              Mã OTP đã được gửi đến số điện thoại
              <span className="ml-1 font-semibold">
                *******{phone?.slice(-3)}
              </span>
            </div>
            <div>Vui lòng nhập mã OTP</div>
          </div>
          <div className="space-y-3 w-full">
            <Input.OTP
              length={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            />
            <div className="w-full flex justify-end">
              {timeLeft === 0 ? (
                <div
                  className="text-sm font-semibold text-blue2 cursor-pointer"
                  onClick={handleResendOtp}
                >
                  Gửi lại mã
                </div>
              ) : (
                <div className="text-sm">
                  Mã sẽ được gửi lại sau {timeLeft}s
                </div>
              )}
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            type="primary"
            loading={isLoading === typeLoading.signUp}
          >
            {isPeding ? (
              <span className="loading loading-spinner" />
            ) : confirmationResult ? (
              "Xác thực"
            ) : (
              "Gửi mã OTP"
            )}
          </Button>
        </div>
      </div>
      <div id="recaptcha-container" />
    </div>
  );
};
