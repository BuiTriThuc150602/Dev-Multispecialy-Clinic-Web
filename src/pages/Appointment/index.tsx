import appointmentScheduler from "@/assets/img/appointmentScheduler.png";
import { Step1 } from "@/components/Appointment";

export const Appointment = () => {
  return (
    <div className="size-full flex justify-center">
      <img
        src={appointmentScheduler}
        alt="bgAppoinment"
        className="object-contain max-md:hidden"
      />
      <div className="md:w-[1220px] flex justify-between gap-2 p-5">
        <div className="flex w-full flex-col px-5">
          <h1 className="text-2xl font-bold mb-4">
            Đặt lịch thăm khám tại&nbsp;
            <span className="text-blue2">DMC</span>
          </h1>
          <Step1 />
        </div>
      </div>
    </div>
  );
};
