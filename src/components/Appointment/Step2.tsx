import {
  Button,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Radio,
  Select,
} from "antd";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import { formValuesState, stepState } from "./stores";
import { useEffect, useState } from "react";
import { useAddress } from "./hooks/useAddress";
import dayjs, { Dayjs } from "dayjs";
import { formatDate } from "@/utils/formatDate";
import { AppointmentService } from "@/services/Appointment/AppointmentService";
import { useNavigate } from "react-router-dom";

export const Step2 = ({ form }: { form: any }) => {
  const setStep = useSetRecoilState(stepState);
  const { citys, fetchAddressData, fetchDistrictData } = useAddress();
  const [districts, setDistricts] = useState([]);
  const [formValues, setFormValues] = useRecoilState(formValuesState);
  const clearFormValue = useResetRecoilState(formValuesState);
  const { isLoading, loadingType, appointment } = AppointmentService();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddressData();
  }, []);

  const handleSelectCity = async (value: string, option: any) => {
    const data = await fetchDistrictData(value);
    if (data) {
      setDistricts(data);
      setFormValues((prev) => ({
        ...prev,
        address: { ...prev?.address, city: option.label },
      }));
      form.setFieldsValue({ district: undefined });
    }
  };

  const handleDistrictChange = (value: string, option: any) => {
    setFormValues((prev) => ({
      ...prev,
      address: { ...prev?.address, state: option.label },
    }));
    form.setFieldsValue({ district: value });
  };

  const handleSelectDob: DatePickerProps<Dayjs[]>["onChange"] = (
    _date,
    dateString
  ) => {
    setFormValues((prev) => ({
      ...prev,
      dob: formatDate(dateString as string),
    }));
  };
  const handleSubmit = async () => {
    const response = await appointment(formValues);
    if (response) {
      clearFormValue();
      setStep(1);
      navigate("/");
    }
  };

  const gridClasses =
    "flex flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-5";

  return (
    <>
      <Form.Item
        label="Họ và tên"
        name="name"
        required
        initialValue={formValues?.fullName}
        rules={[{ required: true, message: "Họ và tên không được để trống" }]}
      >
        <Input
          placeholder="Nhập họ và tên"
          value={formValues?.fullName}
          onChange={(e) => {
            setFormValues((prev) => ({ ...prev, fullName: e.target.value }));
          }}
        />
      </Form.Item>
      <div className={gridClasses}>
        <Form.Item
          label="Giới tính"
          name="gender"
          required
          layout="vertical"
          initialValue={formValues?.gender}
          rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
        >
          <Radio.Group
            value={formValues?.gender}
            onChange={(e) => {
              setFormValues((prev) => ({ ...prev, gender: e.target.value }));
            }}
          >
            <Radio value={true}>Nữ</Radio>
            <Radio value={false}>Nam</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Ngày sinh"
          name="date"
          required
          initialValue={formValues?.dob && dayjs(formValues.dob)}
        >
          <DatePicker
            format={"DD/MM/YYYY"}
            className="w-full"
            onChange={handleSelectDob}
          />
        </Form.Item>
      </div>

      <div className={gridClasses}>
        <Form.Item
          label="Tỉnh/Thành phố"
          name="city"
          required
          initialValue={formValues?.address?.city}
        >
          <Select
            showSearch
            placeholder="Chọn tỉnh/thành phố"
            optionFilterProp="label"
            options={citys}
            value={formValues?.address?.city}
            onChange={handleSelectCity}
          ></Select>
        </Form.Item>
        <Form.Item
          label="Quận/Huyện"
          name="district"
          required
          initialValue={formValues?.address?.state}
        >
          <Select
            showSearch
            placeholder="Chọn quận/huyện"
            optionFilterProp="label"
            options={districts}
            value={formValues?.address?.state}
            onChange={handleDistrictChange}
            notFoundContent="Không tìm thấy quận/huyện"
            allowClear
          ></Select>
        </Form.Item>
      </div>
      <Form.Item
        label="Địa chỉ"
        name="address"
        required
        initialValue={formValues?.address?.address}
        rules={[{ required: true, message: "Địa chỉ không được để trống" }]}
      >
        <Input
          placeholder="Nhập địa chỉ"
          value={formValues?.address?.address}
          onChange={(e) => {
            setFormValues((prev) => ({
              ...prev,
              address: { ...prev?.address, address: e.target.value },
            }));
          }}
        />
      </Form.Item>
      <div className="grid grid-cols-1 gap-5">
        {/* <Button className="w-full" onClick={() => setStep(1)}>
          Quay lại
        </Button> */}
        <Button
          type="primary"
          className="w-full"
          onClick={handleSubmit}
          loading={isLoading === loadingType.Appointment}
          disabled={
            !formValues?.fullName ||
            !formValues.dob ||
            formValues.gender === null ||
            !formValues.address
          }
        >
          Đặt lịch
        </Button>
      </div>
    </>
  );
};
