"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { experimental_useObject as useObject } from "ai/react";
import { triageSchema } from "@/app/api/triage/schema";
import { Package2, Plus } from "lucide-react";
import Link from "next/link";
import classnames from "classnames";
import { TRIAGE_CATEGORIES } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import {
  TableBody,
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PatientFormAndResults() {
  const { isLoading, object, submit } = useObject({
    api: "/api/triage",
    schema: triageSchema,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const description = (e.target as any).description.value;
    submit({ description });
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span>Team RDS</span>
          </Link>
        </nav>
        <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <Link href="/new-patient">
            <Button disabled={isLoading}>
              <Plus className="h-5 w-5" /> Add Patient
            </Button>
          </Link>
        </div>
      </header>
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Patient Form */}
          <Card className="w-full lg:w-1/2">
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>
                Please provide your details and current situation.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {/* <div className="grid gap-4 py-4">
                  <Label htmlFor="sex">Sex</Label>
                  <Select required>
                    <SelectTrigger name="sex" id="sex">
                      <SelectValue placeholder="Select your sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Enter your age"
                    required
                    min="0"
                    max="120"
                  />
                </div> */}
                <div className="grid gap-2">
                  <Label htmlFor="description">
                    Description of your current situation
                  </Label>
                  <Textarea
                    id="description"
                    name="message"
                    placeholder="Please describe your current situation or symptoms"
                    required
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Results Table */}
          <Card className="w-full lg:w-1/2">
            <CardHeader>
              <CardTitle>Triage Category</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <div>
                  {object?.triage?.map((triage, idx) => (
                    <div
                      key={idx}
                      className={classnames(
                        "w-[100px] h-[100px] flex rounded-md p-2 text-center justify-center items-center text-white",
                        {
                          "bg-red-600": triage?.triageCategory == 1,
                          "bg-orange-600": triage?.triageCategory == 2,
                          "bg-yellow-600": triage?.triageCategory == 3,
                          "bg-green-500": triage?.triageCategory == 4,
                          "bg-gray-500": triage?.triageCategory == 5,
                        }
                      )}
                    >
                      {
                        TRIAGE_CATEGORIES[
                          triage?.triageCategory as keyof typeof TRIAGE_CATEGORIES
                        ]
                      }
                    </div>
                  ))}
                  {object?.triage && object?.triage?.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Hospital</TableHead>
                          <TableHead className="text-right">
                            Wait time (min)
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Hopsital: 7001</TableCell>
                          <TableCell>63 minutes</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Hopsital: 7006</TableCell>
                          <TableCell>98 minutes</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
