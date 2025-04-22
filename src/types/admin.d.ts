
declare interface DateRange {
  from: Date | undefined;
  to?: Date;
}

declare type SelectRangeEventHandler = (range: DateRange) => void;
