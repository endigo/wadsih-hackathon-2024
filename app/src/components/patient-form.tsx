"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

import { experimental_useObject as useObject } from "ai/react";
import { triageSchema } from "@/app/api/triage/schema";

export default function PatientFormModal() {
  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { object, submit } = useObject({
    api: "/api/triage",
    schema: triageSchema,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ sex, age, description });
    submit({ sex, age, description });
  };

  const renderBody = () => {
    if (object?.triage && object?.triage?.length > 0) {
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Patient Information</DialogTitle>
          <DialogDescription>
            Please provide your details and current situation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {object?.triage.map((triage) => (
              <div key={triage?.triageCategory} className="grid gap-2">
                <Label htmlFor="sex">{triage?.triageCategoryLabel}</Label>
                <Input id="sex" value={triage?.triageCategoryLabel} disabled />
              </div>
            ))}
          </div>
        </form>
      </DialogContent>;
    }

    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Patient Information</DialogTitle>
          <DialogDescription>
            Please provide your details and current situation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sex">Sex</Label>
              <Select value={sex} onValueChange={setSex} required>
                <SelectTrigger id="sex">
                  <SelectValue placeholder="Select your sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                min="0"
                max="120"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">
                Description of your current situation
              </Label>
              <Textarea
                id="description"
                placeholder="Please describe your current situation or symptoms"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-5 w-5" /> Add Patient
        </Button>
      </DialogTrigger>
      {renderBody()}
    </Dialog>
  );
}
