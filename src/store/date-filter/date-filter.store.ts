import { create } from 'zustand';
import { subDays } from 'date-fns';

interface DateFilterState {
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
}

export const useDateFilterStore = create<DateFilterState>((set) => ({
  startDate: subDays(new Date(), 7),
  endDate: new Date(),
  setStartDate: (startDate) => set({ startDate }),
  setEndDate: (endDate) => set({ endDate }),
}));
