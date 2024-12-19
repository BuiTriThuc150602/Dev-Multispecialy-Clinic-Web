import { AppointmentService } from "@/services/Appointment/AppointmentService";
import { Appointment, StatusAppointment } from "@/types/Appointment";
import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Tag,
  DatePicker,
  Select,
} from "antd";
import { formatDobFromServer, formatTime } from "@/utils/formatDate";
import toast from "react-hot-toast";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useGetAllAppointment } from "@/hooks/Appointment/useGetAllAppointment";
dayjs.extend(isBetween);

export const AppointmentList: React.FC = () => {
  const { cancelAppointment, isLoading, loadingType } = AppointmentService();
  const { appointments, handleGetAppointments } = useGetAllAppointment();
  const [appointmentFilter, setAppointmentFilter] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>(
    StatusAppointment.all
  );
  const [dateFilter, setDateFilter] = useState<string[]>([]);

  useEffect(() => {
    setAppointmentFilter(appointments);
  }, [appointments]);

  const handleCancel = (id: number) => {
    cancelAppointment(id).then((response) => {
      if (response?.status) {
        toast.success("Hủy lịch hẹn thành công");
        handleGetAppointments();
      }
    });
  };
  const handleFilterByDate = (
    _dates: null | (Dayjs | null)[],
    dateStrings: string[]
  ) => {
    setDateFilter(dateStrings);
    let filteredAppointments = [...appointments];

    if (dateStrings && dateStrings[0] !== "" && dateStrings[1] !== "") {
      const startDate = dayjs(dateStrings[0], "DD-MM-YYYY");
      const endDate = dayjs(dateStrings[1], "DD-MM-YYYY");

      filteredAppointments = filteredAppointments.filter((appointment) => {
        const appointmentDate = dayjs(appointment.date, "YYYY-MM-DD");
        return appointmentDate.isBetween(startDate, endDate, null, "[]");
      });
    }

    if (statusFilter !== StatusAppointment.all) {
      filteredAppointments = filteredAppointments.filter((appointment) => {
        return appointment.status === statusFilter;
      });
    }

    setAppointmentFilter(filteredAppointments);
  };

  const handleFilterByStatus = (value: string) => {
    setStatusFilter(value);
    let filteredAppointments = [...appointments];

    if (value !== StatusAppointment.all) {
      filteredAppointments = filteredAppointments.filter((appointment) => {
        return appointment.status === value;
      });
    }

    if (dateFilter && dateFilter[0] && dateFilter[1]) {
      const startDate = dayjs(dateFilter[0], "DD-MM-YYYY");
      const endDate = dayjs(dateFilter[1], "DD-MM-YYYY");

      filteredAppointments = filteredAppointments.filter((appointment) => {
        const appointmentDate = dayjs(appointment.date, "YYYY-MM-DD");
        return appointmentDate.isBetween(startDate, endDate, null, "[]");
      });
    }

    setAppointmentFilter(filteredAppointments);
  };

  return (
    <div>
      <Typography.Title level={2} className="w-full flex justify-center">
        Danh sách lịch hẹn
      </Typography.Title>
      <div className="px-10">
        <div className="flex max-md:flex-col gap-2 md:items-center justify-between mb-4">
          <div className="flex max-md:flex-col gap-2 md:items-center mb-4">
            <div className="text-base font-semibold">Lọc theo ngày</div>
            <DatePicker.RangePicker
              format="DD-MM-YYYY"
              onChange={handleFilterByDate}
            />
          </div>
          <div className="flex max-md:flex-col gap-2 md:items-center mb-4">
            <div className="text-base font-semibold">Lọc theo trạng thái</div>
            <Select
              placeholder="Chọn trạng thái"
              defaultValue={StatusAppointment.all}
              options={[
                { label: "Tất cả", value: StatusAppointment.all },
                { label: "Đã hủy", value: StatusAppointment.caceled },
                { label: "Đã đến khám", value: StatusAppointment.arrived },
                { label: "Đã đặt lịch", value: StatusAppointment.appointment },
              ]}
              className="w-[140px]"
              onChange={handleFilterByStatus}
            />
          </div>
        </div>
        {appointmentFilter.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p>Không tìm thấy lịch hẹn</p>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {appointmentFilter.map((appointment) => (
              <Col lg={24} key={appointment.id} className="w-full">
                <Card
                  title={`Lịch hẹn (${appointment.index})`}
                  bordered={true}
                  hoverable
                  className="flex flex-col w-full bg-primary-50"
                >
                  <div className="w-full grid md:md:grid-cols-2 gap-2 mb-1">
                    <Typography.Text className="col-span-1">
                      <b>Thời gian:</b> {formatTime(appointment.time)}
                      {" - "}
                      {formatDobFromServer(appointment.date)}
                    </Typography.Text>
                    <div className="col-span-1">
                      <b>Trạng thái:</b>{" "}
                      <Tag
                        color={
                          appointment.status === StatusAppointment.caceled
                            ? "red"
                            : appointment.status === StatusAppointment.arrived
                            ? "green"
                            : appointment.isCancel
                            ? "orange"
                            : "red"
                        }
                      >
                        {appointment.status}
                      </Tag>
                    </div>
                  </div>
                  <div className="w-full grid md:grid-cols-2 gap-2 mb-1">
                    <Typography.Text className="col-span-1">
                      <b>Chuyên khoa:</b>{" "}
                      {appointment.doctor.specialization.name}
                    </Typography.Text>
                    <Typography.Text className="col-span-1">
                      <b>Bác sĩ:</b> {appointment.doctor.fullName}
                    </Typography.Text>
                  </div>
                  <div className="w-full grid md:grid-cols-2 gap-2 mb-1">
                    <Typography.Text className="col-span-1">
                      <b>Triệu chứng:</b> {appointment.symptoms}
                    </Typography.Text>
                    <Typography.Text className="col-span-1">
                      <b>Dịch vụ:</b>{" "}
                      {appointment.service.name === "InHour"
                        ? "Khám trong giờ"
                        : "Khám ngoài giờ"}{" "}
                      - {appointment.service.price.toLocaleString()} VND
                    </Typography.Text>
                  </div>
                  {appointment.isCancel && (
                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        onClick={() => handleCancel(appointment.id)}
                        loading={isLoading === loadingType.cancelAppointment}
                      >
                        Hủy lịch hẹn
                      </Button>
                    </div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};
