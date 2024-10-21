"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Patient, TRIAGE_CATEGORIES, TRIAGE_THRESHOLDS } from "@/lib/types";
import classnames from "classnames";
import { formatDate } from "date-fns";

export function PatientTable({
  data,
  className,
}: {
  data: Patient[];
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Patients</CardTitle>
          {/* <CardDescription>
            Showing patient traffic for the last 30 days
          </CardDescription> */}
        </div>
        <div className="flex items-center gap-2 px-6 py-5 sm:py-6">
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="#">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Triage Category</TableHead>
              <TableHead>Admitted at</TableHead>
              <TableHead>Commencement date</TableHead>
              <TableHead className="text-right">Wait time (min)</TableHead>
              <TableHead className="text-right">Length of Stay (min)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item.id}
                className={classnames({
                  "bg-red-200":
                    !item.isCommenced &&
                    item.waitingTimeInSec >=
                      TRIAGE_THRESHOLDS[
                        item.triageCategory as keyof typeof TRIAGE_THRESHOLDS
                      ],
                })}
              >
                <TableCell>
                  <Link href={`/patient/${item.id}`}>
                    <div className="font-medium">{item.personID}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      Age: {item.age} Sex: {item.sex == 1 ? "M" : "F"}
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge
                    className={classnames("text-xs", {
                      "bg-red-600": item.triageCategory == 1,
                      "bg-orange-600": item.triageCategory == 2,
                      "bg-yellow-600": item.triageCategory == 3,
                      "bg-green-500": item.triageCategory == 4,
                      "bg-gray-500": item.triageCategory == 5,
                    })}
                  >
                    {
                      TRIAGE_CATEGORIES[
                        item.triageCategory as keyof typeof TRIAGE_CATEGORIES
                      ]
                    }
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.presentationDatetime &&
                    formatDate(
                      item.presentationDatetime,
                      "yyyy-MM-dd HH:mm:ss"
                    )}
                </TableCell>
                <TableCell>
                  {item.isCommenced && item.clinicalCareCommencementDatetime
                    ? formatDate(
                        item.clinicalCareCommencementDatetime,
                        "yyyy-MM-dd HH:mm:ss"
                      )
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  {Math.round(item.waitingTimeInSec / 60)}
                </TableCell>
                <TableCell className="text-right">
                  {item.isDischarged ? item.lengthOfStay : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
