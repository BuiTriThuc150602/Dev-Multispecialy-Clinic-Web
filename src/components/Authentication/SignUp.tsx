import { Radio, RadioChangeEvent } from "antd";
import { useState } from "react";
import { screenKey } from "./stores/screenKey";
import { SignUpWPatientId } from "./SignUpWPatientId";
import { SignUpWUsername } from "./SignUpWUsername";
import { formValue, isScreenAuthenValue } from "./stores";
import { useResetRecoilState, useSetRecoilState } from "recoil";

export const SignUp: React.FC = () => {
  const [valueRegister, setValueRegister] = useState("RegisterUserName");
  const clearFormValue = useResetRecoilState(formValue);
  const setIsScreenAuthen = useSetRecoilState(isScreenAuthenValue);

  const onChange = (e: RadioChangeEvent) => {
    clearFormValue();
    setValueRegister(e.target.value);
  };

  return (
    <div className="sign-up-wrapper space-y-4 p-6 max-w-[980px] bg-white shadow-xl rounded-lg w-full h-fit">
      <h1 className="text-3xl font-semibold text-blue2 font-logo text-center">
        Đăng ký
      </h1>
      <div className="flex items-center justify-center">
        <Radio.Group
          onChange={onChange}
          value={valueRegister}
          buttonStyle="solid"
          className="space-x-4"
        >
          <Radio.Button value={"RegisterUserName"}>Bệnh nhân mới</Radio.Button>
          <Radio.Button value={"RegisterPatient"}>Bệnh nhân cũ</Radio.Button>
        </Radio.Group>
      </div>
      <div className="space-y-4">
        {
          {
            RegisterUserName: <SignUpWUsername />,
            RegisterPatient: <SignUpWPatientId />,
          }[valueRegister]
        }
      </div>
      <div className="flex gap-2 w-full justify-center">
        <div>Đã có tài khoản?</div>
        <i
          className="text-blue2 cursor-pointer"
          onClick={() => setIsScreenAuthen(screenKey.signIn)}
        >
          Đăng nhập
        </i>
      </div>
    </div>
  );
};
