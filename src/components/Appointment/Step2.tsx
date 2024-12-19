import {
  Button,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Radio,
  Select,
} from "antd";
import { useRecoilState } from "recoil";
import { formValuesState } from "./stores";
import { useEffect, useState } from "react";
import { useAddress } from "../../hooks/useAddress";
import dayjs, { Dayjs } from "dayjs";
import { formatDate } from "@/utils/formatDate";
import { AppointmentService } from "@/services/Appointment/AppointmentService";

export const Step2 = ({ form }: { form: any }) => {
  const { citys, fetchAddressData, fetchDistrictData } = useAddress();
  const [districts, setDistricts] = useState([]);
  const [formValues, setFormValues] = useRecoilState(formValuesState);
  const { isLoading, loadingType } = AppointmentService();

  useEffect(() => {
    fetchAddressData();
  }, []);

  const handleSelectCity = async (value: string, option: any) => {
    const data = await fetchDistrictData(value);
    if (data) {
      setDistricts(data);
      setFormValues((prev) => ({
        ...prev,
        patient: {
          ...prev?.patient,
          address: { ...prev, city: option.label },
        },
      }));
      form.setFieldsValue({ district: undefined });
    }
  };

  const handleDistrictChange = (value: string, option: any) => {
    setFormValues((prev) => ({
      ...prev,
      patient: {
        ...prev?.patient,
        address: { ...prev, state: option.label },
      },
    }));
    form.setFieldsValue({ district: value });
  };

  const handleSelectDob: DatePickerProps<Dayjs[]>["onChange"] = (
    _date,
    dateString
  ) => {
    setFormValues((prev) => ({
      ...prev,
      patient: { ...prev?.patient, dob: formatDate(dateString as string) },
    }));
  };
  const handleSubmit = async () => {
    // const response = await appointment(formValues);
    // if (response) {
    //   clearFormValue();
    //   setStep(1);
    //   navigate("/");
    // }
  };

  const gridClasses =
    "flex flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-5";

  return (
    <>
      <div className={gridClasses}>
        <Form.Item
          label="Họ và tên"
          name="name"
          required
          initialValue={formValues?.patient?.fullName}
          rules={[{ required: true, message: "Họ và tên không được để trống" }]}
        >
          <Input
            placeholder="Nhập họ và tên"
            value={formValues?.patient?.fullName}
            onChange={(e) => {
              setFormValues((prev) => ({
                ...prev,
                patient: { ...prev?.patient, fullName: e.target.value },
              }));
            }}
          />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          required
          initialValue={formValues?.patient?.email}
          // rules={[{ required: true, message: "Họ và tên không được để trống" }]}
        >
          <Input
            placeholder="Nhập email"
            value={formValues?.patient?.email}
            onChange={(e) => {
              setFormValues((prev) => ({
                ...prev,
                patient: { ...prev?.patient, email: e.target.value },
              }));
            }}
          />
        </Form.Item>
      </div>
      <div className={gridClasses}>
        <Form.Item
          label="Giới tính"
          name="gender"
          required
          layout="vertical"
          initialValue={formValues?.patient?.gender}
          rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
        >
          <Radio.Group
            value={!formValues?.patient?.gender}
            onChange={(e) => {
              setFormValues((prev) => ({
                ...prev,
                patient: { ...prev?.patient, gender: e.target.value },
              }));
            }}
          >
            <Radio value={true}>Nam</Radio>
            <Radio value={false}>Nữ</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Ngày sinh"
          name="date"
          required
          initialValue={
            formValues?.patient?.dob && dayjs(formValues.patient?.dob)
          }
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
          initialValue={formValues?.patient?.address?.city}
        >
          <Select
            showSearch
            placeholder="Chọn tỉnh/thành phố"
            optionFilterProp="label"
            options={citys}
            value={formValues?.patient?.address?.city}
            onChange={handleSelectCity}
          ></Select>
        </Form.Item>
        <Form.Item
          label="Quận/Huyện"
          name="district"
          required
          initialValue={formValues?.patient?.address?.state}
        >
          <Select
            showSearch
            placeholder="Chọn quận/huyện"
            optionFilterProp="label"
            options={districts}
            value={formValues?.patient?.address?.state}
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
        initialValue={formValues?.patient?.address?.address}
        rules={[{ required: true, message: "Địa chỉ không được để trống" }]}
      >
        <Input
          placeholder="Nhập địa chỉ"
          value={formValues?.patient?.address?.address}
          onChange={(e) => {
            setFormValues((prev) => ({
              ...prev,
              address: { ...prev?.patient?.address, address: e.target.value },
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
            !formValues?.patient?.fullName ||
            !formValues.patient?.dob ||
            formValues.patient?.gender === null ||
            !formValues.patient?.address
          }
        >
          Đặt lịch
        </Button>
      </div>
    </>
  );
};
