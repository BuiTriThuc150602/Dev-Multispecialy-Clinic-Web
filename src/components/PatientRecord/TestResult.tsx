import { Table, TableProps, Tag } from "antd";
import { RowDetail } from "./RowDetail";
import { LabDetail, LabTest } from "./stores/type";

const generateColumnsLabTest = (
  data: LabDetail[]
): TableProps<LabDetail>["columns"] => {
  const hasValue = data.some((item) => item.value !== undefined);
  const hasNotes = data.some((item) => item.notes !== undefined);

  const columns: TableProps<LabDetail>["columns"] = [
    {
      title: "Tên chỉ số",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    ...(hasValue
      ? [
          {
            title: "Giá trị",
            dataIndex: "value",
            key: "value",
          },
          {
            title: "Mức bình thường",
            dataIndex: "range",
            key: "range",
          },
          {
            title: "Đơn vị",
            dataIndex: "unit",
            key: "unit",
          },
        ]
      : []),
    ...(hasNotes
      ? [
          {
            title: "Ghi chú",
            dataIndex: "notes",
            key: "notes",
          },
          {
            title: "Gợi ý",
            dataIndex: "recommendations",
            key: "recommendations",
          },
        ]
      : []),
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (_, record) => (
        <>
          <Tag color={record.status === "Bình thường" ? "green" : "volcano"}>
            {record.status}
          </Tag>
        </>
      ),
    },
  ];

  return columns;
};

export const TestResult: React.FC<{ labRequests: LabTest[] }> = ({
  labRequests,
}) => {
  return (
    <>
      <div className="text-primary-600 bg-primary-100 py-2 text-lg font-semibold mt-2 flex justify-center">
        KẾT QUẢ XÉT NGHIỆM
      </div>

      {labRequests.length > 0 && (
        <div className="mt-4 pt-2">
          <div className="flex flex-col gap-4">
            {labRequests.map((lab: LabTest) => (
              <div key={lab.id} className="space-y-4">
                <div className="w-full flex justify-start text-lg font-semibold">
                  <span className="bg-gray-200 rounded-md p-2">
                    {lab.labTest.name.toLocaleUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 px-4">
                  <RowDetail
                    name="Giá"
                    value={`${lab.labTest.price.toLocaleString()} VND`}
                  />
                  <RowDetail
                    name="Trạng thái"
                    value={
                      lab.status === "completed"
                        ? "Hoàn thành"
                        : "Chưa hoàn thành"
                    }
                  />
                  <RowDetail name="Kết quả" value={lab.testResult.result} />
                  <RowDetail name="Ghi chú" value={lab.testResult.notes} />
                </div>

                <Table<LabDetail>
                  columns={generateColumnsLabTest(lab.testResult.detail)}
                  dataSource={lab.testResult.detail}
                  pagination={false}
                />
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 px-4 ">
                  {lab.testResult.images.map((image, idx) => (
                    <img
                      key={idx}
                      src={image}
                      alt="Kết quả xét nghiệm"
                      className="size-auto object-contain col-span-1"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
