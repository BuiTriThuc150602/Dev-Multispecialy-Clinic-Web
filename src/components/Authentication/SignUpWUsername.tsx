import {
  AutoComplete,
  AutoCompleteProps,
  Button,
  ConfigProvider,
  Form,
  Input,
  Radio,
} from "antd";
import { useEffect, useState } from "react";
import { PatientService } from "@/services/Patient/PatientService";
import { configDisabledNoData, congfigDisabledData } from "./configTheme";
import { formatDobFromServer } from "@/utils/formatDate";
import { useRecoilState } from "recoil";
import { formValue } from "./stores";
import { screenKey } from "./stores/screenKey";
import { AuthenService } from "@/services/Authen/AuthenService";
import toast from "react-hot-toast";

export const SignUpWUsername = ({
  setIsScreen,
}: {
  setIsScreen: (value: string) => void;
}) => {
  const [form, setForm] = useRecoilState(formValue);
  const [patients, setPatients] = useState<AutoCompleteProps["options"]>([]);
  const { getByPhone } = PatientService();
  const { checkExistUsername } = AuthenService();
  const [phone, setPhone] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [errorPhone, setErrorPhone] = useState<string>("");

  const handleGetPhone = async (phone: string) => {
    const response = await getByPhone(phone);

    if (response?.status && response?.data.length > 0) {
      const patient = response.data.map((patient: any) => {
        return {
          ...patient,
          key: patient.patientId,
          value: patient.patientId,
          label: `${patient.patientId} - ${patient.fullName} - ${
            patient.gender ? "Nữ" : "Nam"
          } - ${formatDobFromServer(patient.dob)} - ${patient.address.city}`,
        };
      });
      setPatients(patient);
    } else {
      setErrorPhone("Số điện thoại không tồn tại");
    }
  };

  const onSelectPatientByPhone = (value: string, option: any) => {
    const phoneByPatient = patients?.find(
      (patient) => patient.patientId === value
    );
    setPhone(phoneByPatient?.phone);
    if (option.accountId) {
      setForm({});
      setErrorPhone("Số điện thoại đã đăng ký");
      return;
    }
    setErrorPhone("");
    setForm({
      ...form,
      patient: option,
    });
  };
  useEffect(() => {
    setForm({});
    setPatients([]);
    setErrorPhone("");
    setIsDisabled(true);

    if (phone && phone.toString().length > 9) {
      handleGetPhone(phone);
      setIsDisabled(false);
    }
  }, [phone]);

  const handleSignUp = async () => {
    if (!form.username) return;
    const response = await checkExistUsername(form.username);
    if (!response?.status) {
      toast.error(response?.data.message);
      return;
    }
    setIsScreen(screenKey.otp);
  };

  return (
    <ConfigProvider
      theme={
        isDisabled ? configDisabledNoData.theme : congfigDisabledData.theme
      }
    >
      <Form layout="vertical">
        <div className="space-y-4">
          <Form.Item
            label="Số điện thoại"
            required
            help={errorPhone}
            validateStatus={errorPhone ? "error" : "success"}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại",
              },
              {
                pattern: new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/),
                message: "Số điện thoại không hợp lệ",
              },
            ]}
            layout="vertical"
          >
            <AutoComplete
              options={patients}
              onSelect={onSelectPatientByPhone}
              value={phone}
              onChange={(value) => setPhone(value)}
              placeholder="Nhập số điện thoại"
            />
          </Form.Item>
          <div className="grid grid-cols-2 gap-10">
            <Form.Item
              label="Tên đăng nhập"
              layout="vertical"
              name="username"
              className="col-span-1"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên đăng nhập",
                },
                {
                  pattern: new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9]).{7,}$/),
                  message:
                    "Tên đăng nhập phải có ít nhất 1 ký tự số và chữ và phải lớn hơn 6 ký tự",
                },
              ]}
            >
              <Input
                value={form?.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
                placeholder="Tên đăng nhập phải có ít nhất 1 ký tự số và chữ"
              />
            </Form.Item>
            <Form.Item label="Email" layout="vertical" className="col-span-1">
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
          </div>
          <div className="grid grid-cols-2 gap-5 items-center">
            <Form.Item
              label="Họ và tên"
              layout="vertical"
              required
              className="col-span-1"
            >
              <Input disabled={true} value={form?.patient?.fullName} />
            </Form.Item>
            <Form.Item label="Ngày sinh" layout="vertical" required>
              <Input
                disabled={true}
                value={formatDobFromServer(form?.patient?.dob)}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-5 items-center">
            <Form.Item
              label="Giới tính"
              required
              layout="horizontal"
              initialValue={!form?.patient?.gender}
            >
              <Radio.Group value={!form?.patient?.gender} disabled={true}>
                <Radio value={true}>Nữ</Radio>
                <Radio value={false}>Nam</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              layout="vertical"
              required
              className="col-span-1"
            >
              <Input
                disabled={true}
                value={
                  form.patient?.address?.address &&
                  `${form?.patient?.address?.address} - ${form?.patient.address?.state} - ${form?.patient?.address?.city}`
                }
              />
            </Form.Item>
          </div>
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
              // rules={[
              //   {
              //     required: true,
              //     message: "Vui lòng xác nhận mật khẩu",
              //   },
              //   ({ getFieldValue }) => ({
              //     validator(_, value) {
              //       if (!value || getFieldValue("password") === value) {
              //         return Promise.resolve();
              //       }
              //       return Promise.reject(new Error("Mật khẩu không khớp"));
              //     },
              //   }),
              // ]}
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
          <div className="flex justify-center w-full pt-2">
            <Button
              type="primary"
              className="w-2/3"
              onClick={handleSignUp}
              disabled={
                isDisabled ||
                !form.username ||
                !form.password ||
                !form.confirmPassword ||
                form.password !== form.confirmPassword
              }
            >
              Đăng ký
            </Button>
          </div>
        </div>
      </Form>
    </ConfigProvider>
  );
};
