import { userValue } from "@/stores/user";
import { Button, DatePicker, Form, Input, Radio, Select } from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import { useAddress } from "@/hooks/useAddress";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { PatientService } from "@/services/Patient/PatientService";
import { OTP } from "@/components/OTP";
import { OTPScreen } from "@/types/OTP";
import { Patient } from "@/types/User";
import { isScreenPatientInfoValue } from "@/stores/patientInfo";

interface District {
  value: number;
  label: string;
}

export const PatientInfo = () => {
  const [isScreenPatientInfo, setIsScreenPatientInfo] = useRecoilState(
    isScreenPatientInfoValue
  );
  const user = useRecoilValue(userValue);
  const { citys, fetchAddressData, fetchDistrictData } = useAddress();
  const [districts, setDistricts] = useState<District[]>([]);
  const [form] = Form.useForm();
  const { updateInfo } = PatientService();
  const [formOTP, setFormOTP] = useState<Patient>({});

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        patientId: user?.patientId,
        phone: user?.phone,
        fullName: user?.fullName,
        dob: dayjs(user?.dob),
        gender: user?.gender,
        email: user?.email,
        address: {
          city: user.address?.city,
          state: user.address?.state,
          address: user.address?.address,
        },
      });
      fetchAddressData();
    }
  }, [user]);

  useEffect(() => {
    const selectDistrict = async () => {
      if (user?.address?.city) {
        const cityId = citys.find(
          (city) => city.label === user?.address?.city
        )?.value;
        const data = await fetchDistrictData(cityId);
        setDistricts(data);
      }
    };

    selectDistrict();
  }, [citys]);

  const handleSelectCity = async (value: string | number, _option: any) => {
    const data = await fetchDistrictData(value);
    setDistricts(data);
    const city = citys.find((city) => city.value === value)?.label;
    form.setFieldsValue({
      address: {
        city: city,
        state: "",
      },
    });
  };

  const handleSelectDistrict = (value: string | number, _option: any) => {
    const district = districts.find(
      (district) => district.value === value
    )?.label;
    form.setFieldsValue({
      address: {
        state: district,
      },
    });
  };

  const handleUpdateInfo = async (values: any) => {
    console.log("values", values);
    console.log("user", user);

    if (
      values.phone === user?.phone &&
      values.email === user?.email &&
      values.address.city === user?.address?.city &&
      values.address.state === user?.address?.state &&
      values.address.address === user?.address?.address
    ) {
      toast.error("Không có gì thay đổi");
      return;
    }

    if (user?.phone && !values.phone) {
      toast.error("Số điện thoại không được để trống");
      return;
    }

    if (user?.email && !values.email) {
      toast.error("Email không được để trống");
      return;
    }

    if (user?.address?.city && !values.address.city) {
      toast.error("Tỉnh/Thành phố không được để trống");
      return;
    }

    if (user?.address?.state && !values.address.state) {
      toast.error("Quận/Huyện không được để trống");
      return;
    }

    if (user?.address?.address && !values.address.address) {
      toast.error("Địa chỉ không được để trống");
      return;
    }

    values.dob = values.dob.format("YYYY-MM-DD");
    if (values.phone === user?.phone) {
      await updateInfo(values.patientId, values);
    } else {
      const formValue = form.getFieldsValue();
      formValue.dob = formValue.dob.format("YYYY-MM-DD");
      setFormOTP(formValue);
      setIsScreenPatientInfo(false);
    }
  };

  return (
    <>
      {isScreenPatientInfo ? (
        <div className="flex justify-center">
          <div className="w-full mx-6 md:mx-0 md:w-[calc(100%-200px)]">
            <div className="flex justify-center">
              <h1 className="text-2xl font-bold my-4 text-center text-primary-600 bg-primary-100 p-2 rounded-xl">
                Thông tin bệnh nhân
              </h1>
            </div>
            <Form form={form} layout="vertical" onFinish={handleUpdateInfo}>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <Form.Item label="Mã bệnh nhân" name="patientId">
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="Số điện thoại"
                  className="md:ml-10"
                  name="phone"
                  rules={[
                    {
                      pattern: new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/),
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Họ và tên" name="fullName">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="Ngày sinh" className="md:ml-10" name="dob">
                  <DatePicker disabled className="w-full" format="DD/MM/YYYY" />
                </Form.Item>
                <Form.Item label="Giới tính" name="gender">
                  <Radio.Group disabled>
                    <Radio value={false}>Nữ</Radio>
                    <Radio value={true}>Nam</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="Email"
                  className="md:ml-10"
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: "Email không hợp lệ",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Tỉnh/Thành phố" name={["address", "city"]}>
                  <Select
                    showSearch
                    placeholder="Chọn tỉnh/thành phố"
                    optionFilterProp="label"
                    options={citys}
                    onChange={handleSelectCity}
                  />
                </Form.Item>
                <Form.Item
                  label="Quận/Huyện"
                  className="md:ml-10"
                  name={["address", "state"]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn quận/huyện"
                    optionFilterProp="label"
                    options={districts}
                    onChange={handleSelectDistrict}
                  />
                </Form.Item>
              </div>
              <Form.Item
                label="Địa chỉ"
                className="w-full"
                name={["address", "address"]}
              >
                <Input value={user?.address?.address} />
              </Form.Item>

              <Button
                type="primary"
                className="w-full mb-4 md:mb-0"
                htmlType="submit"
              >
                Cập nhật thông tin
              </Button>
            </Form>
          </div>
        </div>
      ) : (
        <div className="auth_wrapper h-screen pt-4 flex justify-center mx-auto max-sm:px-2 bg-[url('@/assets/img/team-bg-img.jpg')]">
          <OTP screen={OTPScreen.UpdateInfo} form={formOTP} />
        </div>
      )}
    </>
  );
};
