import {
  Button,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Radio,
  Select,
  Tooltip,
} from "antd";
import { useRecoilState, useSetRecoilState } from "recoil";
import { formValue, isScreenAuthenValue } from "./stores";
import { screenKey } from "./stores/screenKey";
import { AuthenService } from "@/services/Authen/AuthenService";
import toast from "react-hot-toast";
import { useAddress } from "@/hooks/useAddress";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/formatDate";
import { useCheckPassword } from "./hooks/useCheckPassword";

export const SignUpWUsername: React.FC = () => {
  const [form, setForm] = useRecoilState(formValue);
  const { checkExistUsername } = AuthenService();
  const { citys, fetchAddressData, fetchDistrictData } = useAddress();
  const [districts, setDistricts] = useState([]);
  const [formAntd] = Form.useForm();
  const { checkedRules, handleCheckPassword, titleTooltip } =
    useCheckPassword();
  const [isDisbaleUsername, setIsDisableUsername] = useState<boolean>(true);
  const setIsScreenAuthen = useSetRecoilState(isScreenAuthenValue);

  useEffect(() => {
    fetchAddressData();
  }, []);

  const handleSignUp = async () => {
    if (!form.username) return;
    setIsScreenAuthen(screenKey.otp);
  };

  const handleInput = (value: string) => {
    return value.replace(/\D/g, "");
  };

  const handleSelectCity = async (value: string, option: any) => {
    const data = await fetchDistrictData(value);
    if (data) {
      setDistricts(data);
      setForm((prev) => ({
        ...prev,
        patient: {
          ...prev?.patient,
          address: { ...prev?.patient?.address, city: option.label },
        },
      }));
      formAntd.setFieldsValue({ district: undefined });
    }
  };

  const handleDistrictChange = (value: string, option: any) => {
    setForm((prev) => ({
      ...prev,
      patient: {
        ...prev?.patient,
        address: { ...prev?.patient?.address, state: option.label },
      },
    }));
    formAntd.setFieldsValue({ district: value });
  };

  const formatName = (value: string) => {
    return value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const onChangeDob: DatePickerProps["onChange"] = (_date, dateString) => {
    if (!dateString) {
      setForm((prev) => ({
        ...prev,
        patient: {
          ...prev?.patient,
          dob: "",
        },
      }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      patient: {
        ...prev?.patient,
        dob: formatDate(dateString as string),
      },
    }));
  };

  useEffect(() => {
    handleCheckPassword(form.password);
  }, [form.password]);

  useEffect(() => {
    if (!form.username) return;
    const isValidUsername = /^(?=.*[a-zA-Z])(?=.*[0-9])[^\s]{7,}$/.test(
      form.username
    );
    setIsDisableUsername(!isValidUsername);
    if (isValidUsername && form.username.length > 4) {
      let usernameUpperCase = form.username.toUpperCase();
      checkExistUsername(usernameUpperCase).then((response) => {
        if (response?.status) {
          if (response?.data?.isExist) {
            formAntd.setFields([
              {
                name: "username",
                errors: [response?.data.message],
              },
            ]);
            setIsDisableUsername(true);
          } else {
            formAntd.setFields([
              {
                name: "username",
                errors: [],
              },
            ]);
            setIsDisableUsername(false);
          }
        }
      });
    }
  }, [form.username]);

  return (
    <Form layout="vertical" form={formAntd}>
      <div className="space-y-4">
        <Form.Item
          label="Số điện thoại"
          name="phone"
          required
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
          getValueFromEvent={(e) => handleInput(e.target.value)}
          layout="vertical"
        >
          <Input
            value={form?.patient?.phone}
            onChange={(e) =>
              setForm({
                ...form,
                patient: {
                  ...form.patient,
                  phone: e.target.value,
                },
              })
            }
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
                pattern: new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])[^\s]{7,}$/),
                message:
                  "Tên đăng nhập phải có ít nhất 1 ký tự số và chữ, lớn hơn 6 ký tự và không chứa khoảng trắng",
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
          <Form.Item
            label="Email"
            layout="vertical"
            className="col-span-1"
            name={"email"}
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
        </div>
        <div className="grid grid-cols-2 gap-5 items-center">
          <Form.Item
            label="Họ và tên"
            layout="vertical"
            required
            className="col-span-1"
          >
            <Input
              value={form?.patient?.fullName}
              onChange={(e) => {
                const formattedName = formatName(e.target.value);
                setForm({
                  ...form,
                  patient: {
                    ...form.patient,
                    fullName: formattedName,
                  },
                });
              }}
            />
          </Form.Item>
          <Form.Item label="Ngày sinh" layout="vertical" required>
            <DatePicker
              format={"DD/MM/YYYY"}
              className="w-full"
              onChange={onChangeDob}
            />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-5 items-center">
          <Form.Item label="Giới tính" required layout="horizontal">
            <Radio.Group
              options={[
                { label: "Nam", value: true },
                { label: "Nữ", value: false },
              ]}
              value={form?.patient?.gender}
              onChange={(e) =>
                setForm({
                  ...form,
                  patient: {
                    ...form.patient,
                    gender: e.target.value,
                  },
                })
              }
            />
          </Form.Item>
          <Form.Item label="Tỉnh/Thành phố" layout="vertical" required>
            <Select
              showSearch
              placeholder="Chọn tỉnh/thành phố"
              optionFilterProp="label"
              options={citys}
              value={form?.patient?.address?.city}
              onChange={handleSelectCity}
            ></Select>
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-10">
          <Form.Item label="Quận/Huyện" name="district" required>
            <Select
              showSearch
              placeholder="Chọn quận/huyện"
              optionFilterProp="label"
              options={districts}
              value={form?.patient?.address?.state}
              onChange={handleDistrictChange}
              notFoundContent="Không tìm thấy quận/huyện"
              allowClear
            ></Select>
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            layout="vertical"
            required
            className="col-span-1"
          >
            <Input
              value={form?.patient?.address?.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  patient: {
                    ...form.patient,
                    address: {
                      ...form?.patient?.address,
                      address: e.target.value,
                    },
                  },
                })
              }
            />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-10">
          <Tooltip
            trigger={["focus"]}
            placement="right"
            title={titleTooltip}
            color="white"
          >
            <Form.Item
              label="Mật khẩu"
              layout="vertical"
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
            layout="vertical"
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
        <div className="flex justify-center w-full pt-2">
          <Button
            type="primary"
            className="w-2/3"
            onClick={handleSignUp}
            disabled={
              !form.patient?.phone ||
              !form.patient?.fullName ||
              !form.patient?.dob ||
              form?.patient?.gender === undefined ||
              !form.patient?.address?.city ||
              !form.patient?.address?.state ||
              !form.patient?.address?.address ||
              !form.username ||
              !form.password ||
              !form.confirmPassword ||
              form.password !== form.confirmPassword ||
              checkedRules.length < 5 ||
              isDisbaleUsername
            }
          >
            Đăng ký
          </Button>
        </div>
      </div>
    </Form>
  );
};
