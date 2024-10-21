"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { Package2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PatientChart } from "@/components/patient-chart";
import { PatientTable } from "@/components/patient-table";
import { Patient } from "@/lib/types";
import { useSimulatedDate } from "@/hooks/useSimulatedDate";
import PatientStats from "@/components/stats";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  // Randomly choose initial date between 2022-01-01T00:00:00.001 and 2022-12-311T23:59:599.999

  const currentDate = useSimulatedDate(
    5,
    new Date(
      2022,
      Math.round(Math.random() * 11),
      Math.round(Math.random() * 30),
      Math.round(Math.random() * 23),
      0,
      0,
      0
    )
  );

  const [currentHospital, setCurrentHospital] = React.useState<string>("7001");
  const [hospitals, setHospitals] = React.useState<{ id: string }[]>([]);
  const [patients, setPattients] = React.useState<Patient[]>([]);

  useEffect(() => {
    fetch("/api/hospitals")
      .then((res) => res.json())
      .then((data) => {
        setHospitals(data.data);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append("time", currentDate);
    params.append("hospital", currentHospital);

    fetch("/api/patients?" + params.toString())
      .then((res) => res.json())
      .then((data) => {
        setPattients(data.data);
      });
  }, [currentHospital, currentDate]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span>Team RDS</span>
          </Link>
        </nav>
        <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          {currentDate.toString()}
          <Select
            defaultValue={currentHospital}
            onValueChange={(value) => setCurrentHospital(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Hospital" />
            </SelectTrigger>
            <SelectContent>
              {hospitals.map((hospital) => (
                <SelectItem key={hospital.id} value={hospital.id}>
                  Hospital: {hospital.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Link href="/new-patient">
            <Button>
              <Plus className="h-5 w-5" /> Add Patient
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <PatientStats
          currentDate={currentDate}
          currentHospital={currentHospital}
        />
        <div>
          <PatientChart
            currentDate={currentDate}
            currentHospital={currentHospital}
          />
          <div className="mt-4">
            <PatientTable data={patients || []} className="col-span-2" />
          </div>
        </div>
      </main>
    </div>
  );
}
