import { RowDetail } from "@/components/PatientRecord/RowDetail";
import { TestList } from "@/components/PatientRecord/TestList";
import { PatientService } from "@/services/Patient/PatientService";
import { userValue } from "@/stores/user";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  Entry,
  PatientRecordProps,
} from "@/components/PatientRecord/stores/type";
import { DatePicker, Pagination } from "antd";
import { endOfDay, isWithinInterval, parseISO, startOfDay } from "date-fns";

export const PatientRecord = () => {
  const user = useRecoilValue(userValue);
  const { getMedicalRecord } = PatientService();
  const [patientRecord, setPatientRecord] = useState<PatientRecordProps>();
  const [dateRange, setDateRange] = useState<string[]>();
  const [recordFilter, setRecordFilter] = useState<Entry[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchMedicalRecord = async () => {
    if (user?.patientId) {
      const response = await getMedicalRecord(user.patientId);
      if (response?.data.data) {
        setPatientRecord(response?.data.data);
        setRecordFilter(response?.data.data.entries);
      }
    }
  };

  useEffect(() => {
    fetchMedicalRecord();
  }, [user]);

  useEffect(() => {
    if (dateRange && dateRange[0] !== "" && dateRange[1] !== "") {
      const startDate = startOfDay(new Date(dateRange[0]));
      const endDate = endOfDay(new Date(dateRange[1]));
      const filteredEntries = patientRecord?.entries.filter((entry) => {
        const visitDate = parseISO(entry.visitDate);
        return isWithinInterval(visitDate, { start: startDate, end: endDate });
      });
      setRecordFilter(filteredEntries || []);
    } else {
      setRecordFilter(patientRecord?.entries || []);
    }
    setCurrentPage(1);
  }, [dateRange]);

  useEffect(() => {
    if (patientRecord?.entries && currentPage > 0) {
      const recordIndex = currentPage - 1;
      if (recordIndex < patientRecord.entries.length) {
        const selectedEntry = patientRecord.entries[recordIndex];
        setRecordFilter([selectedEntry]);
      } else {
        setRecordFilter([]);
      }
    }
  }, [currentPage, patientRecord]);  

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold mb-4 text-center text-primary-600 bg-primary-100 p-2 rounded-xl">
          Hồ sơ bệnh nhân
        </h1>
      </div>
      {patientRecord ? (
        <div className="space-y-6">
          <div className="border p-4 rounded-xl space-y-1">
            <h2 className="text-xl font-semibold">Thông tin bệnh nhân</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <RowDetail
                name="Họ tên"
                value={patientRecord?.patient.fullName}
              />
              <RowDetail name="Tuổi" value={patientRecord?.patient.age} />
              <RowDetail
                name="Giới tính"
                value={patientRecord?.patient.gender ? "Nam" : "Nữ"}
              />
              <RowDetail
                name="Mã bệnh nhân"
                value={patientRecord?.patient.patientId}
              />
              <RowDetail
                name="Số điện thoại"
                value={patientRecord?.patient.phone}
              />
              <RowDetail
                name="Địa chỉ"
                value={`${patientRecord?.patient.address.address}, ${patientRecord?.patient.address.state}, ${patientRecord?.patient.address.city}`}
              />
            </div>
          </div>

          <div className="border p-4 rounded-xl space-y-1">
            <h2 className="text-xl font-semibold">Ghi chú</h2>
            <p>{patientRecord?.notes}</p>
          </div>

          <div className="border p-4 rounded-xl space-y-1">
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <div className="text-base font-semibold">Lọc theo ngày</div>
                <DatePicker.RangePicker
                  className="w-[220px]"
                  onChange={(_value, dateString) => {
                    setDateRange(dateString);
                  }}
                />
              </div>
              <div>
                <Pagination
                  defaultCurrent={1}
                  total={
                    dateRange && dateRange[0] !== ""
                      ? recordFilter.length
                      : patientRecord?.entries.length
                  }
                  pageSize={1}
                  showSizeChanger={false}
                  onChange={(page) => setCurrentPage(page)}
                  current={currentPage}
                />
              </div>
            </div>
            <TestList entries={recordFilter} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p>Không tìm thấy hồ sơ bệnh nhân</p>
        </div>
      )}
    </div>
  );
};
