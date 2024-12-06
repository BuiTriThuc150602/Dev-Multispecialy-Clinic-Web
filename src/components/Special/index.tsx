import Special1 from "@/assets/img/special1.png";
import Special2 from "@/assets/img/special2.png";
import Special4 from "@/assets/img/special4.png";
import Special5 from "@/assets/img/special5.png";
import SpacialDaLieu from "@/assets/img/special-da-lieu.jpg";
import { FaLongArrowAltRight } from "react-icons/fa";

export const Special = () => {
  const ColImage = ({ image, title }: { image: string; title: string }) => (
    <div className="relative col-span-1">
      <img src={image} alt="special1" className="size-full" />
      <div className="text-white absolute bottom-2 left-4 text-lg font-semibold">
        {title}
      </div>
    </div>
  );
  return (
    <div className="pt-32 pb-16">
      <div className="mx-4 lg:mx-20 2xl:mx-60">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 space-x-4 space-y-8">
          <div className="p-4 col-span-1 flex flex-col justify-center items-center lg:items-start space-y-4">
            <h1 className="text-blue2 font-bold text-3xl">Chuyên khoa</h1>
            <div className="text-gray2 font-normal text-sm leading-6 text-center lg:text-start">
              DMC cung cấp một loạt các dịch vụ và chuyên khoa lâm sàng toàn
              diện, kết hợp chuyên môn y khoa với công nghệ tiên tiến để mang
              lại dịch vụ chăm sóc chất lượng cao nhất cho bệnh nhân.
            </div>
            <div className="flex items-center gap-2 text-blue2">
              Xem tất cả chuyên khoa
              <FaLongArrowAltRight />
            </div>
          </div>
          <ColImage image={Special1} title="Tim mạch" />
          <ColImage image={Special2} title="Phẩu thuật" />
          <ColImage image={SpacialDaLieu} title="Da liễu" />
          <ColImage image={Special4} title="Chấn thương chỉnh hình" />
          <ColImage image={Special5} title="Nhi khoa" />
        </div>
      </div>
    </div>
  );
};
