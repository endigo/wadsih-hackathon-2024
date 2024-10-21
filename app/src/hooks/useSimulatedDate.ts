import React from "react";
import { addMinutes, formatDate } from "date-fns";

let intervalId: NodeJS.Timeout;
export const useSimulatedDate = (
  interval: number = 5,
  initial: Date = new Date("2022-01-01T09:00:00.001")
) => {
  const [date, setDate] = React.useState(initial);

  React.useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
      setDate((date) => {
        return addMinutes(date, 15);
      });
    }, interval * 1000);
  }, [interval]);

  return formatDate(date, "yyyy-MM-dd HH:mm:ss.000") + "Z";
};
