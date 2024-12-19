import { Row } from "antd";
import clsx from "clsx";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";

export const useCheckPassword = () => {
  const [checkedRules, setCheckedRules] = useState<number[]>([]);

  const RowTooltip = ({ title, index }: { title: string; index: number }) => {
    return (
      <Row align={"middle"}>
        <div
          className={clsx(
            "border size-4 rounded-full flex items-center justify-center mr-2 text-[8px] text-white",
            {
              "bg-primary-500": checkedRules.includes(index),
              "border-black": !checkedRules.includes(index),
            }
          )}
        >
          <FaCheck />
        </div>
        <span className="text-black">{title}</span>
      </Row>
    );
  };

  const titleTooltip = (
    <div className="tooltip-wrapper">
      <RowTooltip title="Từ 8-30 kí tự" index={1} />
      <RowTooltip title="Ít nhất 1 chữ cái viết hoa" index={2} />
      <RowTooltip title="Ít nhất 1 chữ cái viết thường" index={3} />
      <RowTooltip title="Ít nhất 1 chữ số" index={4} />
      <RowTooltip title="Ít nhất 1 kí tự đặc biệt" index={5} />
    </div>
  );

  const handleCheckPassword = (password: string | undefined) => {
    const rules = [];
    if (!password) {
      setCheckedRules([]);
      return;
    }
    if (password.length >= 8 && password.length <= 30) rules.push(1);
    if (/[A-Z]/.test(password)) rules.push(2);
    if (/[a-z]/.test(password)) rules.push(3);
    if (/\d/.test(password)) rules.push(4);
    if (/[@$!%*?&]/.test(password)) rules.push(5);
    setCheckedRules(rules);
  };

  return { checkedRules, setCheckedRules, titleTooltip, handleCheckPassword };
};
