import { Entry } from "./stores/type";
import { RowDetail } from "./RowDetail";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Select } from "antd";
import { TestResult } from "./TestResult";
import { PrescriptionResult } from "./PrescriptionResult";
import { useState } from "react";

export const TestList: React.FC<{ entries: Entry[] }> = ({ entries }) => {
  const [selectedType, setSelectedType] = useState<string>("all");
  console.log("selectedType", selectedType);

  return (
    <div className="flex flex-col gap-7">
      {entries.length > 0 &&
        entries.map((entry: Entry) => (
          <div key={entry.id} className="mt-4 pt-4">
            <div className="flex justify-center font-semibold text-xl mb-4 bg-primary-500 text-white py-2">
              Phiếu khám bệnh (
              {format(new Date(entry?.visitDate), "dd/MM/yyyy", {
                locale: vi,
              })}
              )
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 border-b pb-4">
              <RowDetail
                name="Ngày khám"
                value={format(
                  new Date(entry.visitDate),
                  "HH:mm - EEEE, dd/MM/yyyy",
                  {
                    locale: vi,
                  }
                )}
              />
              <RowDetail
                name="Bác sĩ"
                value={`${entry?.doctor?.fullName} (${entry?.doctor?.phone})`}
              />
              <RowDetail name="Triệu chứng" value={entry.symptoms} />
              <RowDetail name="Ghi chú" value={entry.note} />

              <RowDetail
                name="Chẩn đoán"
                value={entry.diagnosis || "Chưa có"}
              />

              <RowDetail name="Kế hoạch điều trị" value={entry.treatmentPlan} />
            </div>
            <div className="flex justify-end w-full mt-4">
              <Select
                placeholder="Lọc theo xét nghiệm hoặc đơn thuốc"
                options={[
                  { label: "Xét nghiệm", value: "lab" },
                  { label: "Đơn thuốc", value: "prescription" },
                  { label: "Tất cả", value: "all" },
                ]}
                onChange={(value) => setSelectedType(value)}
                value={selectedType}
                style={{ width: "150px" }}
              />
            </div>
            {
              {
                all: (
                  <>
                    <TestResult labRequests={entry.labRequests} />
                    <PrescriptionResult prescriptions={entry.prescriptions} />
                  </>
                ),
                lab: <TestResult labRequests={entry.labRequests} />,
                prescription: (
                  <PrescriptionResult prescriptions={entry.prescriptions} />
                ),
              }[selectedType]
            }
          </div>
        ))}
    </div>
  );
};
