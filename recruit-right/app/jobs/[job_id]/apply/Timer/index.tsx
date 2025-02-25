"use client";
import { Tag } from "antd";
import moment from "moment";
import { useTimer } from "react-timer-hook";

const Timer = ({ endTime }) => {
  const currentTime = moment().unix();

  const timeDifference = moment(endTime).unix() - currentTime;

  const expiryTime = new Date();
  expiryTime.setSeconds(expiryTime.getSeconds() + timeDifference);

  const { seconds, minutes, totalSeconds } = useTimer({
    expiryTimestamp: expiryTime,
    //TODO: Call contest end api
    onExpire: () => console.warn("onExpire called"),
  });

  return (
    <Tag color={totalSeconds < 600 ? "red" : "lime"}>
      <span className="text-md font-bold">
        {minutes.toString().padStart(2, "0")}
      </span>
      :
      <span className="text-md font-bold">
        {seconds.toString().padEnd(2, "0")}
      </span>
    </Tag>
  );
};

export default Timer;
