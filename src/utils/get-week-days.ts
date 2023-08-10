interface GetWeekDaysParams {
  short?: boolean
  language?: string
}

export function getWeekDays({
  short = false,
  language = 'en-US',
}: GetWeekDaysParams = {}): string[] {
  const weekdayFormatter = new Intl.DateTimeFormat(language, {
    weekday: short ? 'short' : 'long',
  })
  const daysOfWeek: string[] = []

  for (let day = 0; day < 7; day++) {
    const date = new Date(Date.UTC(2021, 5, day))
    const weekday = formatWeekday(date, weekdayFormatter)
    daysOfWeek.push(capitalizeFirstLetter(weekday))
  }

  return daysOfWeek
}

function formatWeekday(date: Date, formatter: Intl.DateTimeFormat): string {
  return formatter.format(date)
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
