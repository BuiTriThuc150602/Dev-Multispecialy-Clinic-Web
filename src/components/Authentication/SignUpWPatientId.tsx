import { AuthenService } from "@/services/Authen/AuthenService";
import { Patient } from "@/types/User";
import { Button, Form, Input, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { screenKey } from "./stores/screenKey";
import { useRecoilState, useSetRecoilState } from "recoil";
import { formValue, isScreenAuthenValue } from "./stores";
import { useCheckPassword } from "./hooks/useCheckPassword";

export const SignUpWPatientId: React.FC = () => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [patientId, setPatientId] = useState<string>("");
  const [form, setForm] = useRecoilState(formValue);
  const [error, setError] = useState<string>("");
  const { checkPatiendId } = AuthenService();
  const { checkedRules, handleCheckPassword, titleTooltip } =
    useCheckPassword();
  const setIsScreenAuthen = useSetRecoilState(isScreenAuthenValue);

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
    setIsScreenAuthen(screenKey.otp);
  };

  useEffect(() => {
    handleCheckPassword(form.password);
  }, [form.password]);

  return (
    <Form layout="vertical">
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

        <Form.Item
          label="Email"
          className="col-span-1"
          name="email"
          rules={[
            {
              type: "email",
              message: "Email không hợp lệ",
            },
          ]}
        >
          <Input
            value={form?.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />
        </Form.Item>
        <div className="grid grid-cols-2 gap-10">
          <Tooltip
            trigger={["focus"]}
            placement="right"
            title={titleTooltip}
            color="white"
          >
            <Form.Item
              label="Mật khẩu"
              required
              className="col-span-1"
              name={"password"}
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
          </Tooltip>
          <Form.Item
            label="Xác nhận mật khẩu"
            required
            className="col-span-1"
            name={"confirmPassword"}
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
              form.password !== form.confirmPassword ||
              checkedRules.length < 5
            }
          >
            Đăng ký
          </Button>
        </div>
      </div>
    </Form>
  );
};
