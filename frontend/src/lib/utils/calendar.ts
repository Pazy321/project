export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isPast: boolean;
}

export function generateCalendarDays(
  year: number,
  month: number,
  selectedDate: Date | null,
  today: Date
): CalendarDay[] {
  const days: CalendarDay[] = [];
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  let firstDayIndex = firstDay.getDay();
  if (firstDayIndex === 0) firstDayIndex = 7;
  const startDay = firstDayIndex - 1;
  
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  
  // Previous month days
  for (let i = startDay; i > 0; i--) {
    const day = prevMonthLastDay - i + 1;
    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      isPast: true,
    });
  }
  
  // Current month days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    
    const isToday = date.getTime() === today.getTime();
    const isSelected = selectedDate ? date.getTime() === selectedDate.getTime() : false;
    const isPast = date < today;
    
    days.push({
      date,
      day,
      isCurrentMonth: true,
      isToday,
      isSelected,
      isPast,
    });
  }
  
  return days;
}

export function formatCalendarDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    weekday: 'short' 
  };
  return date.toLocaleDateString('ru-RU', options);
}

export function getMonthYearString(date: Date): string {
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

