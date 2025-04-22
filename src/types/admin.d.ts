
declare interface DateRange {
  from?: Date;
  to?: Date;
}

declare type SelectRangeEventHandler = (range: DateRange) => void;
