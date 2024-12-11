import {
  Button,
  DatePicker,
  Form,
  Radio,
  RadioChangeEvent,
  Select,
  TimePicker,
  TimePickerProps,
  AutoComplete,
  Input,
} from "antd";
import { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import TextArea from "antd/es/input/TextArea";
import dayjs, { Dayjs } from "dayjs";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { formValuesState, stepState } from "./stores";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/formatDate";
import { useGetPatientByPhone } from "@/components/Appointment/hooks/useGetPatientByPhone";
import { Service } from "@/components/Appointment/type";
import { useGetSpecializations } from "@/hooks/Doctor/useGetSpecializations";
import { useGetDoctorBySpecialization } from "@/hooks/Doctor/useGetDoctorBySpecialization";
import { userValue } from "@/stores/user";
import { AppointmentService } from "@/services/Appointment/AppointmentService";

export const Step1 = ({ form }: { form: any }) => {
  const setStep = useSetRecoilState(stepState);
  const [formValues, setFormValues] = useRecoilState(formValuesState);
  const disableHours = [0, 1, 2, 3, 4, 5, 6, 19, 20, 21, 22, 23];
  const [phone, setPhone] = useState<string>("");
  const { patients, handleGetPhone } = useGetPatientByPhone();
  const { specializations } = useGetSpecializations();
  const { doctor, fetchDoctorBySpecialization } =
    useGetDoctorBySpecialization();
  const user = useRecoilValue(userValue);
  const { appointment } = AppointmentService();

  useEffect(() => {
    if (user && user.patientId) {
      setFormValues((prev) => ({
        ...prev,
        patient: user,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (phone?.length > 9) {
      handleGetPhone(phone);
    }
  }, [phone]);

  useEffect(() => {
    if (formValues?.doctor?.specialization) {
      fetchDoctorBySpecialization(formValues?.doctor?.specialization);
    }
  }, [formValues?.doctor?.specialization]);

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    const today = dayjs().endOf("day");
    const maxDate = dayjs().add(15, "day").endOf("day");
    return current < today || current > maxDate;
  };

  const handleSelectSpecialty = (value: string) => {
    form.setFieldsValue({ doctor: undefined });

    setFormValues((prev) => ({
      ...prev,
      doctor: {
        ...prev?.doctor,
        specialization: value,
        doctor: undefined,
      },
    }));
  };

  const handleSelectDoctor = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      doctor: {
        ...prev?.doctor,
        doctor: value,
      },
    }));
    form.setFieldsValue({ doctor: value });
  };

  const handleDateAppointment: DatePickerProps<Dayjs[]>["onChange"] = (
    _date,
    dateString
  ) => {
    setFormValues((prev) => ({
      ...prev,
      date: formatDate(dateString as string),
    }));
  };

  const handleTimeAppointment: TimePickerProps["onChange"] = (
    _time,
    timeString
  ) => {
    setFormValues((prev) => ({ ...prev, time: timeString as string }));
  };

  const onSelect = (_data: string, option: any) => {
    setFormValues((prev) => ({
      ...prev,
      patient: {
        phone: option.phone,
        fullName: option.fullName,
        gender: option.gender,
        dob: option.dob,
        address: option.address,
      },
    }));
  };

  const handleSubmit = async () => {
    if (user && user.patientId) {
      await appointment(formValues);
    } else {
      if (!formValues?.patient?.phone) {
        setFormValues((prev) => ({
          ...prev,
          patient: {
            phone: phone,
          },
        }));
      }
      setStep(2);
    }
  };

  const gridClasses =
    "flex flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-5";
  console.log("formValues", formValues);

  return (
    <>
      <div className={gridClasses}>
        <Form.Item
          label="Chọn loại dịch vụ khám"
          name="serviceType"
          initialValue={Service.InHour}
          required
        >
          <Radio.Group
            buttonStyle="solid"
            onChange={(e: RadioChangeEvent) =>
              setFormValues((prev) => ({ ...prev, service: e.target.value }))
            }
          >
            <Radio.Button value={Service.InHour}>Khám Thường</Radio.Button>
            <Radio.Button value={Service.OutHour}>Khám Ngoài Giờ</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
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
        >
          {user && user.patientId ? (
            <Input placeholder={user.phone} disabled />
          ) : (
            <AutoComplete
              options={patients}
              onSelect={onSelect}
              onSearch={(text) => {
                if (text.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)) {
                  setFormValues((prev) => ({ ...prev, phone: text }));
                  setPhone(text);
                }
              }}
              placeholder="Nhập số điện thoại"
            />
          )}
        </Form.Item>
      </div>

      <div className={gridClasses}>
        <Form.Item label="Chọn chuyên khoa" name="specialty" required>
          <Select
            showSearch
            placeholder="Chọn chuyên khoa"
            optionFilterProp="label"
            options={specializations}
            onChange={handleSelectSpecialty}
          ></Select>
        </Form.Item>
        <Form.Item label="Chọn bác sĩ" name="doctor">
          <Select
            showSearch
            placeholder="Chọn bác sĩ"
            optionFilterProp="label"
            options={doctor}
            onChange={handleSelectDoctor}
          ></Select>
        </Form.Item>
      </div>

      <div className={gridClasses}>
        <Form.Item label="Chọn ngày muốn khám" name="dateAppointment" required>
          <DatePicker
            format={"DD/MM/YYYY"}
            disabledDate={disabledDate}
            className="w-full"
            onChange={handleDateAppointment}
          />
        </Form.Item>
        <Form.Item label="Chọn giờ muốn khám" name="timeAppointment" required>
          <TimePicker
            format={"HH:mm"}
            minuteStep={15}
            disabledTime={() => ({
              disabledHours: () => disableHours,
            })}
            hideDisabledOptions
            className="w-full"
            onChange={handleTimeAppointment}
          ></TimePicker>
        </Form.Item>
      </div>

      <Form.Item
        label="Nhập vấn đề sức khỏe cần khám"
        name="description"
        required
      >
        <TextArea
          showCount
          maxLength={200}
          placeholder="Nhập tình trạng sức khoẻ của bạn, câu hỏi dành cho bác sĩ và các vấn đề sức khỏe cần khám"
          onChange={(e) =>
            setFormValues((prev) => ({ ...prev, symptoms: e.target.value }))
          }
        />
      </Form.Item>

      <div className="flex justify-end mt-3">
        <Button
          type="primary"
          className="w-full"
          disabled={
            !formValues?.service ||
            !formValues?.patient?.phone ||
            !formValues.doctor ||
            !formValues.date ||
            !formValues.time ||
            !formValues.symptoms
          }
          onClick={handleSubmit}
        >
          {user?.patientId ? "Đặt lịch" : "Tiếp tục"}
        </Button>
      </div>
    </>
  );
};
