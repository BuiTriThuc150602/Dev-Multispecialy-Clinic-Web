import { Table, TableProps } from "antd";
import { Medication, Medications, Prescription } from "./stores/type";

const columnsMedication: TableProps<Medications>["columns"] = [
  {
    title: "Tên thuốc",
    dataIndex: "medication",
    key: "name",
    render: (medication: Medication) => <div>{medication.name}</div>,
  },
  {
    title: "Mô tả",
    dataIndex: "medication",
    key: "description",
    render: (medication: Medication) => <div>{medication.description}</div>,
  },
  {
    title: "HDSD",
    dataIndex: "medication",
    key: "usage",
    render: (medication: Medication) => <div>{medication.usage}</div>,
  },
  {
    title: "Ghi chú",
    dataIndex: "note",
    key: "note",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Hình ảnh",
    dataIndex: "medication",
    key: "image",
    render: (medication: Medication) => (
      <img
        src={medication.image}
        alt="Thuốc"
        className="size-28 object-contain"
      />
    ),
  },
];

export const PrescriptionResult: React.FC<{
  prescriptions: Prescription[];
}> = ({ prescriptions }) => {
  return (
    <>
      {prescriptions.map((prescription) => (
        <div key={prescription.id} className="mt-4">
          <div className="text-primary-600 bg-primary-100 py-2 text-lg font-semibold mt-6 mb-2 flex justify-center border-t pt-4">
            ĐƠN THUỐC
          </div>
          <Table<Medications>
            columns={columnsMedication}
            dataSource={prescription.medications}
            pagination={false}
          />
        </div>
      ))}
    </>
  );
};
