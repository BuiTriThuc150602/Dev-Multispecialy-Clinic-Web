import "./index.scss";
import bsQD from "@/assets/img/bs-QuocDung.png";
import bsNL from "@/assets/img/bs-NgocLan.png";
import bsTN from "@/assets/img/bs-ThiNgoc.png";
import { Button } from "antd";

export const Doctors = () => {
  const DoctorCard = (props: {
    name: string;
    position: string;
    avatar?: string;
  }) => {
    return (
      <div className="flex flex-col items-center bg-white rounded-xl">
        <img src={props.avatar} alt="doctor" className="rounded-full size-56" />
        <h3 className=" text-xl font-bold mt-5">{props.name}</h3>
        <p className="text-blue3 font-medium">{props.position}</p>
        <Button className="mt-4 text-blue3 font-medium">Đặt lịch</Button>
      </div>
    );
  };
  return (
    <div className="doctors-wrapper py-20 px-10 container mx-auto bg-cover bg-center bg-[url('@/assets/img/doctors-bg-image.png')]">
      <div className="text-3xl font-semibold mb-10">
        ĐỘI NGŨ BÁC SĨ
      </div>
      <div className="grid grid-cols-3 gap-10">
        <DoctorCard
          name="PGS.TS.BSCC Nguyễn Quốc Dũng"
          position="Chuyên khoa - Chẩn đoán hình ảnh"
          avatar={bsQD}
        />
        <DoctorCard
          name="PGS.TS Hoàng Thị Ngọc Lan"
          position="Chuyên khoa - Tiêu hóa"
          avatar={bsNL}
        />
        <DoctorCard
          name="Nguyễn Văn C"
          position="Chuyên khoa - Truyền nhiễm"
          avatar={bsTN}
        />
      </div>
    </div>
  );
};
