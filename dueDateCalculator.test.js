/* eslint-disable semi */
/* eslint-disable no-undef */

const {calculateDueDate, formatTimeInMins} = require('./dueDateCalculator');

//test for validating input date/time and turnaround time
const invalidDateInputMessage = "Invalid date format. The correct format is 2:12PM or AM"

test("should show invalid date format message because hour input is not a number", () => {
    expect(calculateDueDate("x9:12PM Monday", 12)).toBe(invalidDateInputMessage)
})

test("hour input is too long, shows invalid date format message", () => {
    expect(calculateDueDate("110:12PM Monday", 12)).toBe(invalidDateInputMessage)
})

test("minute input is not a number, shows invalid date format message", () => {
    expect(calculateDueDate("10:ggAM Monday", 12)).toBe(invalidDateInputMessage)
})

test("minute input is more than 59, shows invalid date format message", () => {
    expect(calculateDueDate("10:78AM Monday", 12)).toBe(invalidDateInputMessage)
})

test("minute input is less than 0, shows invalid date format message", () => {
    expect(calculateDueDate("10:-1AM Monday", 12)).toBe(invalidDateInputMessage)
})

test("meridiem is missing, shows invalid date format message", () => {
    expect(calculateDueDate("10:12 Monday", 12)).toBe(invalidDateInputMessage)
})

test("meridiem is not AM nor PM, shows invalid date format message", () => {
    expect(calculateDueDate("10:12GG Monday", 12)).toBe(invalidDateInputMessage)
})

test("should return no-working day message because of non-working day input", () => {
    const saturday = "Saturday"
    const sunday = "sunday"

    expect(calculateDueDate(`01:12PM ${saturday}`)).toBe(`${saturday} is not a working day`)
    expect(calculateDueDate(`01:12PM ${sunday}`)).toBe(`${sunday} is not a working day`)
    expect(calculateDueDate(`01:12PM`)).toBe(`undefined is not a working day`)
})

test("reporting problem during non-working hours returns error message", () => {

    expect(calculateDueDate(`8:12PM monday`)).toBe("You can only report a problem during working hours")
    expect(calculateDueDate(`00:12PM Monday`)).toBe("You can only report a problem during working hours")
    expect(calculateDueDate(`5:12PM monday`)).toBe("You can only report a problem during working hours")
    expect(calculateDueDate(`11:12PM Monday`)).toBe("You can only report a problem during working hours")
})

test("invalid turnaround time message", () => {
    expect(calculateDueDate("12:37AM Thursday", -13)).toBe("Turnaround time must be at least 0")
})

test("no upper limit for turnaround time", () => {
    expect(calculateDueDate("12:37AM Thursday", 999999999999)).not.toBe("Turnaround time must be at least 0")
})

test("lowercase and capital meridiem should both work", () => {
    expect(calculateDueDate("10:12AM Wednesday", 13.5)).toBe("3:42PM Thursday")
    expect(calculateDueDate("10:12am Wednesday", 13.5)).toBe("3:42PM Thursday")
    expect(calculateDueDate("4:12pM Tuesday", 13.5)).toBe("1:42PM Thursday")
    expect(calculateDueDate("4:12PM Tuesday", 13.5)).toBe("1:42PM Thursday")
})

test("lowercase and capital working days should both work", () => {
    expect(calculateDueDate("10:12AM wednesday", 13.5)).toBe("3:42PM Thursday")
    expect(calculateDueDate("10:12am WEDNESDAY", 13.5)).toBe("3:42PM Thursday")
    expect(calculateDueDate("4:12pM Tuesday", 13.5)).toBe("1:42PM Thursday")
    expect(calculateDueDate("4:12PM tUESDAY", 13.5)).toBe("1:42PM Thursday")
})

//test for helper function formatTimeInMins

test("should return string for integer input", () => {
    expect(typeof formatTimeInMins(0)).toBe("string")
})

test("converts minutes to hours in 12H format during working days correctly", () => {
    expect(formatTimeInMins(0)).toBe("9:00AM")
    expect(formatTimeInMins(180)).toBe("12:00AM")
    expect(formatTimeInMins(240)).toBe("1:00PM")
    expect(formatTimeInMins(479)).toBe("4:59PM")
})

//tests for the correct due date
test("correctly returns date for same the same day", () => {
    expect(calculateDueDate("9:37AM Thursday", 1)).toBe("10:37AM Thursday")
    expect(calculateDueDate("9:37AM Thursday", 5)).toBe("2:37PM Thursday")
})

test("turnaround zero, should return same date (also 2 zeroes in minutes)", () => {
    expect(calculateDueDate("12:00AM Tuesday", 0)).toBe("12:00AM Tuesday")
})

test("should return due date with 2 days passed exactly (task example)", () => {
    expect(calculateDueDate("2:12PM Tuesday", 16)).toBe("2:12PM Thursday")
})

test('correctly "overflows" to the next day', () => {
    expect(calculateDueDate("2:12PM Tuesday", 3)).toBe("9:12AM Wednesday")
})

test('correctly "overflows" to the next week', () => {
    expect(calculateDueDate("2:12PM Friday", 3)).toBe("9:12AM Monday")
    expect(calculateDueDate("9:12AM Friday", 12)).toBe("1:12PM Monday")
})

test('correctly jumps multiple days', () => {
    expect(calculateDueDate("2:12PM Tuesday", 11)).toBe("9:12AM Thursday")
})

test("non-integer turnaround correctly returns due date", () => {
    expect(calculateDueDate("10:37AM Thursday", 0.5)).toBe("11:07AM Thursday")
    expect(calculateDueDate("10:37AM Thursday", 0.1)).toBe("10:43AM Thursday")
    expect(calculateDueDate("10:37AM Thursday", 0.99999)).toBe("11:37AM Thursday") //rounds turnaround
})

test("correctly owerflows to next week from Thursday to Monday", () => {
    expect(calculateDueDate("11:37AM Thursday", 13.5)).toBe("9:07AM Monday")
})

test("correctly jumps multiple weeks", () => {
    expect(calculateDueDate("11:37AM Thursday", 80)).toBe("11:37AM Thursday")
    expect(calculateDueDate("11:37AM Thursday", 100)).toBe("3:37PM Monday")
    expect(calculateDueDate("11:37AM Thursday", 102.5)).toBe("10:07AM Tuesday")
})

test("correctly returns due date (different minute inputs)", () => {
    expect(calculateDueDate("9:0AM Thursday", 1)).toBe("10:00AM Thursday")
    expect(calculateDueDate("9:00AM Thursday", 5)).toBe("2:00PM Thursday")
    expect(calculateDueDate("9:01AM Thursday", 5)).toBe("2:01PM Thursday")
    expect(calculateDueDate("9:1AM Thursday", 5)).toBe("2:01PM Thursday")
})

