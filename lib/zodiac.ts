type ZodiacSign = {
  name: string;
  symbol: string;
  element: string;
  dateRange: string;
};

const signs: { name: string; symbol: string; element: string; dateRange: string; startMonth: number; startDay: number; endMonth: number; endDay: number }[] = [
  { name: "Capricorn",   symbol: "\u2651", element: "Earth", dateRange: "Dec 22 – Jan 19", startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { name: "Aquarius",    symbol: "\u2652", element: "Air",   dateRange: "Jan 20 – Feb 18", startMonth: 1,  startDay: 20, endMonth: 2, endDay: 18 },
  { name: "Pisces",      symbol: "\u2653", element: "Water", dateRange: "Feb 19 – Mar 20", startMonth: 2,  startDay: 19, endMonth: 3, endDay: 20 },
  { name: "Aries",       symbol: "\u2648", element: "Fire",  dateRange: "Mar 21 – Apr 19", startMonth: 3,  startDay: 21, endMonth: 4, endDay: 19 },
  { name: "Taurus",      symbol: "\u2649", element: "Earth", dateRange: "Apr 20 – May 20", startMonth: 4,  startDay: 20, endMonth: 5, endDay: 20 },
  { name: "Gemini",      symbol: "\u264A", element: "Air",   dateRange: "May 21 – Jun 20", startMonth: 5,  startDay: 21, endMonth: 6, endDay: 20 },
  { name: "Cancer",      symbol: "\u264B", element: "Water", dateRange: "Jun 21 – Jul 22", startMonth: 6,  startDay: 21, endMonth: 7, endDay: 22 },
  { name: "Leo",         symbol: "\u264C", element: "Fire",  dateRange: "Jul 23 – Aug 22", startMonth: 7,  startDay: 23, endMonth: 8, endDay: 22 },
  { name: "Virgo",       symbol: "\u264D", element: "Earth", dateRange: "Aug 23 – Sep 22", startMonth: 8,  startDay: 23, endMonth: 9, endDay: 22 },
  { name: "Libra",       symbol: "\u264E", element: "Air",   dateRange: "Sep 23 – Oct 22", startMonth: 9,  startDay: 23, endMonth: 10, endDay: 22 },
  { name: "Scorpio",     symbol: "\u264F", element: "Water", dateRange: "Oct 23 – Nov 21", startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { name: "Sagittarius", symbol: "\u2650", element: "Fire",  dateRange: "Nov 22 – Dec 21", startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
];

export function getZodiacSign(birthday: Date): ZodiacSign {
  const month = birthday.getUTCMonth() + 1; // 0-indexed → 1-indexed
  const day = birthday.getUTCDate();

  for (const sign of signs) {
    if (sign.startMonth === sign.endMonth) {
      if (month === sign.startMonth && day >= sign.startDay && day <= sign.endDay) {
        return { name: sign.name, symbol: sign.symbol, element: sign.element, dateRange: sign.dateRange };
      }
    } else if (sign.startMonth > sign.endMonth) {
      // Capricorn wraps around year boundary
      if ((month === sign.startMonth && day >= sign.startDay) || (month === sign.endMonth && day <= sign.endDay)) {
        return { name: sign.name, symbol: sign.symbol, element: sign.element, dateRange: sign.dateRange };
      }
    } else {
      if ((month === sign.startMonth && day >= sign.startDay) || (month === sign.endMonth && day <= sign.endDay)) {
        return { name: sign.name, symbol: sign.symbol, element: sign.element, dateRange: sign.dateRange };
      }
    }
  }

  // Fallback (should never reach here with valid dates)
  return { name: "Capricorn", symbol: "\u2651", element: "Earth", dateRange: "Dec 22 – Jan 19" };
}
