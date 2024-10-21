"use client";
import React, { useEffect } from "react";
import { Activity, Clock, CreditCard, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import classNames from "classnames";
import { TRIAGE_CATEGORIES } from "@/lib/types";
import { PeakHoursChart } from "./peak-hours-chart";

const PatientStats = ({
  currentDate,
  currentHospital,
}: {
  currentDate: string;
  currentHospital: string;
}) => {
  const [stats, setStats] = React.useState<{
    total: number;
    discharged: number;
    admitted: number;
    avgTimes: {
      triageCategory: number;
      waitingTime: number;
      lengthOfStay: number;
    }[];
    peakHours: {
      hour: number;
      count: number;
    }[];
  }>({
    total: 0,
    discharged: 0,
    admitted: 0,
    avgTimes: [],
    peakHours: [],
  });

  useEffect(() => {
    const params = new URLSearchParams();
    params.append("time", currentDate);
    params.append("hospital", currentHospital);
    fetch("/api/stats?" + params.toString())
      .then((res) => res.json())
      .then((data) => {
        setStats(data.data);
      });
  }, [currentDate, currentHospital]);

  const ratio = stats.discharged / stats.admitted;
  const correctRatio = isNaN(ratio) ? 0 : ratio;

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.discharged - stats.admitted} from last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Discharged Patients
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.discharged}</div>
            <p className="text-xs text-muted-foreground">in last hour</p>
          </CardContent>
        </Card>
        <Card
          className={classNames({
            "bg-green-200": correctRatio >= 1,
            "bg-red-200": correctRatio < 1,
          })}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Discharged/Admitted Rate
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{correctRatio.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Congestion State: {correctRatio < 0.8 ? "HIGH" : "LOW"}
            </p>
          </CardContent>
        </Card>

        {stats.avgTimes.map((time, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                AVG times of{" "}
                {
                  TRIAGE_CATEGORIES[
                    time.triageCategory as keyof typeof TRIAGE_CATEGORIES
                  ]
                }
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(time.waitingTime / 60)} min
              </div>
              <p className="text-xs text-muted-foreground">
                Length of stay {Math.round(time.lengthOfStay / 60)} minutes
              </p>
            </CardContent>
          </Card>
        ))}
        <PeakHoursChart chartData={stats.peakHours} className="col-span-4" />
      </div>
    </div>
  );
};

export default PatientStats;
