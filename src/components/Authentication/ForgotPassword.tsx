import { Button, Form, Input, Tooltip } from "antd";
import { TbLockSquareRounded, TbUserCircle } from "react-icons/tb";
import { screenKey } from "@/components/Authentication/stores/screenKey";
import { AuthenService } from "@/services/Authen/AuthenService";
import { useRecoilState, useSetRecoilState } from "recoil";
import { formForgotPassword, isScreenAuthenValue } from "./stores";
import { useEffect, useState } from "react";
import { useCheckPassword } from "./hooks/useCheckPassword";
import { OTPScreen } from "@/types/OTP";
import { OTP } from "@/components/OTP";

export const ForgotPassword: React.FC = () => {
  const { checkExistUsername } = AuthenService();
  const [formAntd] = Form.useForm();
  const [form, setForm] = useRecoilState(formForgotPassword);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const { checkedRules, handleCheckPassword, titleTooltip } =
    useCheckPassword();
  const [isScreenForgotPassword, setIsScreenForgotPassword] =
    useState<boolean>(true);
  const setIsScreenAuthen = useSetRecoilState(isScreenAuthenValue);

  useEffect(() => {
    if (form?.username) {
      checkExistUsername(form.username).then((response) => {
        if (response?.status) {
          if (response?.data?.isExist) {
            setIsDisabled(false);
            formAntd.setFields([
              {
                name: "username",
                errors: [],
              },
            ]);
            setForm({
              ...form,
              phone: response?.data?.data,
            });
          } else {
            setIsDisabled(true);
            formAntd.setFields([
              {
                name: "username",
                errors: ["Tên đăng nhập không tồn tại"],
              },
            ]);
          }
        }
      });
    }
  }, [form?.username]);

  useEffect(() => {
    if (!form?.password) return;
    handleCheckPassword(form.password);
  }, [form?.password]);

  return (
    <>
      {isScreenForgotPassword ? (
        <div className="w-full md:w-[500px] flex flex-col space-y-10 bg-white shadow-lg p-10 rounded-xl h-fit">
          <h1 className="text-3xl font-semibold text-blue2 font-logo text-center">
            Quên mật khẩu
          </h1>
          <Form form={formAntd} className="flex flex-col" layout="vertical">
            <Form.Item
              name="username"
              label={
                <div className="font-medium">Tên đăng nhập/Mã bệnh nhân</div>
              }
            >
              <Input
                allowClear
                placeholder="Nhập tên đăng nhập hoặc mã bệnh nhân"
                prefix={<TbUserCircle className="text-base text-blue2" />}
                value={form?.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Tooltip
              trigger={["focus"]}
              placement="right"
              title={titleTooltip}
              color="white"
            >
              <Form.Item
                name="password"
                label={<div className="font-medium">Mật khẩu mới</div>}
              >
                <Input.Password
                  allowClear
                  placeholder="Nhập mật khẩu mới"
                  prefix={
                    <TbLockSquareRounded className="text-base text-blue2" />
                  }
                  value={form?.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                />
              </Form.Item>
            </Tooltip>
            <Button
              type="primary"
              disabled={
                isDisabled ||
                !form?.username ||
                !form?.password ||
                checkedRules.length < 5
              }
              onClick={() => setIsScreenForgotPassword(false)}
            >
              Lấy lại mật khẩu
            </Button>
          </Form>
          <div className="flex justify-end sm:gap-10 max-sm:flex-col">
            <i
              className="text-blue2 cursor-pointer ml-1"
              onClick={() => setIsScreenAuthen(screenKey.signIn)}
            >
              Đăng nhập
            </i>
          </div>
        </div>
      ) : (
        <OTP screen={OTPScreen.ForgotPassword} form={form} />
      )}
    </>
  );
};
