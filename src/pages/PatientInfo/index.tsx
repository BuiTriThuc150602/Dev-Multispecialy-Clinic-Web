import { userValue } from "@/stores/user";
import { Button, DatePicker, Form, Input, Radio, Select } from "antd";
import { useRecoilState } from "recoil";
import { useAddress } from "@/hooks/useAddress";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { PatientService } from "@/services/Patient/PatientService";

interface District {
  value: number;
  label: string;
}

export const PatientInfo = () => {
  const [user, setUser] = useRecoilState(userValue);
  const { citys, fetchAddressData, fetchDistrictData } = useAddress();
  const [districts, setDistricts] = useState<District[]>([]);
  const [form] = Form.useForm();
  const { updateInfo } = PatientService();

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
  }, [user]);

  // console.log("user", user);
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

    if (
      values.fullName === user?.fullName &&
      values.phone === user?.phone &&
      values.email === user?.email &&
      values.dob === dayjs(user?.dob) &&
      values.gender === user?.gender &&
      values.address.city === user?.address?.city &&
      values.address.state === user?.address?.state &&
      values.address.address === user?.address?.address
    ) {
      toast.error("Không có gì thay đổi");
      return;
    }

    if (user?.fullName && !values.fullName) {
      toast.error("Họ tên không được để trống");
      return;
    }

    if (user?.phone && !values.phone) {
      toast.error("Số điện thoại không được để trống");
      return;
    }

    if (user?.dob && !values.dob) {
      toast.error("Ngày sinh không được để trống");
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
    const response = await updateInfo(values.patientId, values);

    if (response?.data.statusCode === 200) {
      toast.success("Cập nhật thông tin thành công");
      console.log("response", response);

      setUser(response?.data.data);
    }
  };

  console.log("user", user);

  return (
    <div className="flex justify-center">
      <div className="w-[calc(100%-200px)]">
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
              <Input />
            </Form.Item>
            <Form.Item label="Ngày sinh" className="md:ml-10" name="dob">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item label="Giới tính" name="gender">
              <Radio.Group>
                <Radio value={true}>Nữ</Radio>
                <Radio value={false}>Nam</Radio>
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

          <Button type="primary" className="w-full" htmlType="submit">
            Cập nhật thông tin
          </Button>
        </Form>
      </div>
    </div>
  );
};
