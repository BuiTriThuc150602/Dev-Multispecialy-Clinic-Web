import { Button, Form, Input } from "antd";
import { TbLockSquareRounded, TbUserCircle } from "react-icons/tb";
import { screenKey } from "@/components/Authentication/stores/screenKey";
import { AuthenService } from "@/services/Authen/AuthenService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { isScreenAuthenValue } from "./stores";
import { useSetRecoilState } from "recoil";

export const SignIn: React.FC = () => {
  const { isLoading, typeLoading, signIn } = AuthenService();
  const [form] = Form.useForm();
  const { setAccessToken } = useAuthContext();
  const navigate = useNavigate();
  const setIsScreenAuthen = useSetRecoilState(isScreenAuthenValue);

  const handleSignIn = async (values: any) => {
    values.username = values.username.toUpperCase();

    const response = await signIn(values);
    if (response?.status === false) {
      toast.error("Sai tên đăng nhập hoặc mật khẩu");
    } else {
      setAccessToken(response?.data?.access_token);
      toast.success("Đăng nhập thành công");
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col space-y-10 bg-white shadow-lg p-10 rounded-xl h-fit">
      <h1 className="text-3xl font-semibold text-blue2 font-logo text-center">
        Đăng nhập
      </h1>
      <Form
        form={form}
        className="flex flex-col"
        layout="vertical"
        onFinish={handleSignIn}
      >
        <Form.Item
          name="username"
          label={<div className="font-medium">Tên đăng nhập/Mã bệnh nhân</div>}
        >
          <Input
            allowClear
            placeholder="Nhập tên đăng nhập hoặc mã bệnh nhân"
            prefix={<TbUserCircle className="text-base text-blue2" />}
          />
        </Form.Item>
        <Form.Item
          name="password"
          label={<div className="font-medium">Mật khẩu</div>}
        >
          <Input.Password
            allowClear
            placeholder="Nhập mật khẩu"
            prefix={<TbLockSquareRounded className="text-base text-blue2" />}
          />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading === typeLoading.signIn}
        >
          Đăng nhập
        </Button>
      </Form>
      <div className="flex justify-between sm:gap-10 max-sm:flex-col">
        <div>
          Chưa có tài khoản?
          <i
            className="text-blue2 cursor-pointer ml-1"
            onClick={() => setIsScreenAuthen(screenKey.signUp)}
          >
            Đăng ký
          </i>
        </div>
        <i
          className="text-blue2 cursor-pointer"
          onClick={() => setIsScreenAuthen(screenKey.forgotPassword)}
        >
          Quên mật khẩu?
        </i>
      </div>
    </div>
  );
};
