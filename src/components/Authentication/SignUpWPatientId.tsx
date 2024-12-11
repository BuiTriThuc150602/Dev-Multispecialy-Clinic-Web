import { AuthenService } from "@/services/Authen/AuthenService";
import { Patient } from "@/types/User";
import { Button, Form, Input, Radio, ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import { configDisabledNoData, congfigDisabledData } from "./configTheme";
import { formatDobFromServer } from "@/utils/formatDate";
import { screenKey } from "./stores/screenKey";
import { useRecoilState } from "recoil";
import { formValue } from "./stores";

export const SignUpWPatientId = ({
  setIsScreen,
}: {
  setIsScreen: (value: string) => void;
}) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [patientId, setPatientId] = useState<string>("");
  const [form, setForm] = useRecoilState(formValue);
  const [error, setError] = useState<string>("");
  const { checkPatiendId } = AuthenService();

  const handleGetById = async (patient: Patient) => {
    if (!patientId) return;
    let patientUpperCase = patientId.toUpperCase();
    setForm({
      ...form,
      username: patientUpperCase,
      patient: patient,
    });
    setIsDisabled(false);
  };

  const handleSetFields = (error: string) => {
    setError(error);
    setForm({});
    setIsDisabled(true);
  };

  useEffect(() => {
    if (patientId.length > 4) {
      let patientUpperCase = patientId.toUpperCase();

      const isValidPatientId = /^PAT\d{2,}$/.test(patientUpperCase);

      if (!isValidPatientId) {
        setError("Mã bệnh nhân không hợp lệ");
        return;
      }
      checkPatiendId(patientUpperCase).then((response) => {
        if (!response?.status) {
          handleSetFields(response?.data.message);
        } else {
          handleSetFields("");
          handleGetById(response.data);
        }
      });
    } else {
      handleSetFields("");
    }
  }, [patientId]);

  const handleSubmit = () => {
    if (!form.patient) return;
    setIsScreen(screenKey.otp);
  };

  return (
    <div className="flex flex-col gap-4 ">
      <Form.Item
        label="Mã bệnh nhân"
        layout="vertical"
        required
        help={error}
        validateStatus={error ? "error" : "success"}
      >
        <Input
          placeholder="Nhập mã bệnh nhân (VD: PAT01)"
          value={patientId}
          onChange={(e) => {
            setPatientId(e.target.value);
          }}
        />
      </Form.Item>

      <ConfigProvider
        theme={
          isDisabled ? configDisabledNoData.theme : congfigDisabledData.theme
        }
      >
        <Form layout="vertical" disabled={true}>
          <div className="grid grid-cols-2 gap-10">
            <Form.Item label="Số điện thoại" className="col-span-1">
              <Input value={form?.patient?.phone} />
            </Form.Item>
            <Form.Item label="Họ và tên" required className="col-span-1">
              <Input value={form?.patient?.fullName} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-10 items-center">
            <Form.Item
              label="Giới tính"
              required
              layout="horizontal"
              initialValue={!form?.patient?.gender}
            >
              <Radio.Group value={!form?.patient?.gender}>
                <Radio value={true}>Nữ</Radio>
                <Radio value={false}>Nam</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Ngày sinh" required className="mt-2">
              <Input value={formatDobFromServer(form?.patient?.dob)} />
            </Form.Item>
          </div>
          <Form.Item
            label="Địa chỉ"
            layout="vertical"
            required
            className="col-span-1"
          >
            <Input
              value={
                form.patient?.address?.address &&
                `${form?.patient?.address?.address} - ${form?.patient?.address?.state} - ${form?.patient?.address?.city}`
              }
            />
          </Form.Item>
        </Form>
      </ConfigProvider>
      <Form.Item
        label="Email"
        layout="vertical"
        className="col-span-1"
        rules={[
          {
            type: "email",
            message: "Email không hợp lệ",
          },
        ]}
      >
        <Input
          value={form?.patient?.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />
      </Form.Item>
      <div className="grid grid-cols-2 gap-10">
        <Form.Item
          label="Mật khẩu"
          layout="vertical"
          required
          className="col-span-1"
        >
          <Input.Password
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu"
          layout="vertical"
          required
          className="col-span-1"
          rules={[
            {
              required: true,
              message: "Vui lòng xác nhận mật khẩu",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không khớp"));
              },
            }),
          ]}
        >
          <Input.Password
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value,
              })
            }
          />
        </Form.Item>
      </div>
      <div className="flex justify-center pt-2">
        <Button
          type="primary"
          className="w-2/3"
          onClick={handleSubmit}
          disabled={
            isDisabled ||
            !form.password ||
            !form.confirmPassword ||
            form.password !== form.confirmPassword
          }
        >
          Đăng ký
        </Button>
      </div>
    </div>
  );
};
