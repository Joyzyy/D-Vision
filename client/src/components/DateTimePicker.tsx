import { CalendarIcon } from "@radix-ui/react-icons";

import { DateTime } from "luxon";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { SelectSingleEventHandler } from "react-day-picker";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { Show } from "./Show";

interface DateTimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  date,
  setDate,
}) => {
  const [selectedDateTime, setSelectedDateTime] = useState<DateTime>(
    DateTime.fromJSDate(date)
  );

  const handleSelect: SelectSingleEventHandler = (day, selected) => {
    const selectedDay = DateTime.fromJSDate(selected);
    const modifiedDay = selectedDay.set({
      hour: selectedDateTime.hour,
      minute: selectedDateTime.minute,
    });

    setSelectedDateTime(modifiedDay);
    setDate(modifiedDay.toJSDate());
  };

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    const hours = Number.parseInt(value.split(":")[0] || "00", 10);
    const minutes = Number.parseInt(value.split(":")[1] || "00", 10);
    const modifiedDay = selectedDateTime.set({ hour: hours, minute: minutes });

    setSelectedDateTime(modifiedDay);
    setDate(modifiedDay.toJSDate());
  };

  const footer = (
    <>
      <div className="px-4 pt-0 pb-4">
        <Label>Time</Label>
        <Input
          type={"time"}
          onChange={handleTimeChange}
          value={selectedDateTime.toFormat("HH:mm")}
        />
      </div>
      {!selectedDateTime && <p>Please pick a day.</p>}
    </>
  );

  return (
    <Popover>
      <PopoverTrigger asChild className="z-10">
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <Show when={date} fallback={<span>Please pick a date.</span>}>
            <>{selectedDateTime.toFormat("DDD HH:mm")}</>
          </Show>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto h-auto">
        <Calendar
          mode={"single"}
          selected={selectedDateTime.toJSDate()}
          onSelect={handleSelect}
          initialFocus
        />
        {footer}
      </PopoverContent>
    </Popover>
  );
};
