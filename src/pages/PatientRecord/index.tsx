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
  const [filteredRecords, setFilteredRecords] = useState<Entry[]>([]);
  const [recordFilter, setRecordFilter] = useState<Entry[]>([]);
  const [dateRange, setDateRange] = useState<string[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchMedicalRecord = async () => {
    if (user?.patientId) {
      const response = await getMedicalRecord(user.patientId);
      if (response?.data.data) {
        setPatientRecord(response?.data.data);
        setFilteredRecords(response?.data.data.entries);
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
      setFilteredRecords(filteredEntries || []);
    } else {
      setFilteredRecords(patientRecord?.entries || []);
    }
    setCurrentPage(1); 
  }, [dateRange, patientRecord]);

  useEffect(() => {
    const pageSize = 1;
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedRecords = filteredRecords.slice(
      startIndex,
      startIndex + pageSize
    );
    setRecordFilter(paginatedRecords);
  }, [currentPage, filteredRecords]);

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold mb-4 text-center p-2 rounded-xl">
          Hồ sơ bệnh nhân
        </h1>
      </div>
      {patientRecord ? (
        <div className="space-y-6">
          {/* Thông tin bệnh nhân */}
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

          {/* Ghi chú */}
          <div className="border p-4 rounded-xl space-y-1">
            <h2 className="text-xl font-semibold">Ghi chú</h2>
            <p>{patientRecord?.notes}</p>
          </div>

          {/* Bộ lọc và danh sách */}
          <div className="border p-4 rounded-xl space-y-1">
            <div className="flex flex-col md:flex-row gap-4 md:gap-2 justify-between">
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
                  total={filteredRecords.length}
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
