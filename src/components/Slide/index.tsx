import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import Banner from "@/assets/img/banner.png";
import Banner2 from "@/assets/img/banner-2.png";
import { useRecoilValue } from "recoil";
import { userValue } from "@/stores/user";
import toast from "react-hot-toast";

export const Slide = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(userValue);

  const handleBooking = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt lịch hẹn");
      return;
    }
    navigate("/booking");
  };

  const h1Classes =
    "text-xl md:text-3xl lg:text-6xl font-semibold text-blue2 font-banner";
  return (
    <div>
      <div className="relative">
        <img src={Banner} alt="banner" className="object-contain w-full" />
        <div className="absolute top-0 lg:top-20 left-28 flex flex-col py-12">
          <div className="flex flex-col space-y-3">
            <h1 className={h1Classes}>Hệ Thống</h1>
            <h1 className={h1Classes}>Y Tế Được</h1>
            <h1 className={h1Classes}>Tin Tưởng</h1>
            <h1 className={h1Classes}>Ở Việt Nam</h1>
          </div>
          <div className="max-lg:hidden mt-10">
            <img src={Banner2} alt="banner-2" className="h-20 w-auto" />
          </div>
        </div>
        <div className="h-20 lg:h-32 mx-20">
          <div className="px-8 lg:px-12 py-4 md:py-6 lg:py-9 shadow-2xl rounded-3xl -translate-y-4 md:-translate-y-10 lg:-translate-y-16 relative bg-white">
            <div className="flex items-center justify-center">
              <Button
                type="primary"
                className="md:px-16 md:py-6 mr-3"
                onClick={handleBooking}
              >
                <span className="font-bold text-base lg:text-xl">
                  Đặt lịch hẹn
                </span>
              </Button>
              {/* <Button className="md:px-16 md:py-6">
                <span className="font-bold text-base lg:text-xl">Tra cứu</span>
              </Button> */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-2 py-14 max-lg:px-10">
        <h1 className="text-3xl max-md:text-2xl text-blue2 font-bold text-center">
          Điểm đến của dịch vụ chăm sóc chất lượng cao
        </h1>
        <div className="max-md:text-sm max-w-[682px] text-center text-gray2 font-normal">
          Với mạng lưới 13 bệnh viện và 4 phòng khám trên toàn quốc, DMC là đơn
          vị y tế tư nhân hàng đầu, định hình văn hóa chăm sóc sức khỏe tại Việt
          Nam.
        </div>
      </div>
    </div>
  );
};
