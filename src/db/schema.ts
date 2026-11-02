import { mysqlTable, varchar, text, json, int, timestamp } from 'drizzle-orm/mysql-core';

/**
 * TiDB Database Schema: Daily Work Logs
 * Stores individual day entries capturing the four reflection pillars.
 */
export const dailyLogsTable = mysqlTable('daily_logs', {
  id: varchar('id', { length: 64 }).primaryKey(),
  date: varchar('date', { length: 10 }).notNull().unique(), // YYYY-MM-DD
  workDone: json('work_done').$type<string[]>().notNull(),
  achievements: json('achievements').$type<string[]>().notNull(),
  failuresAndChallenges: json('failures_and_challenges').$type<string[]>().notNull(),
  lessonsLearned: json('lessons_learned').$type<string[]>().notNull(),
  highlights: json('highlights').$type<string[]>().notNull(),
  overallReflection: text('overall_reflection'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

/**
 * TiDB Database Schema: Weekly Reflections
 * Stores week-level reflection syntheses with week boundary ranges.
 */
export const weeklyReflectionsTable = mysqlTable('weekly_reflections', {
  id: varchar('id', { length: 64 }).primaryKey(),
  weekStartDate: varchar('week_start_date', { length: 10 }).notNull(),
  weekEndDate: varchar('week_end_date', { length: 10 }).notNull(),
  workDone: json('work_done').$type<string[]>().notNull(),
  achievements: json('achievements').$type<string[]>().notNull(),
  failuresAndChallenges: json('failures_and_challenges').$type<string[]>().notNull(),
  lessonsLearned: json('lessons_learned').$type<string[]>().notNull(),
  highlights: json('highlights').$type<string[]>().notNull(),
  overallReflection: text('overall_reflection'),
  generatedSummary: text('generated_summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

/**
 * TiDB Database Schema: Monthly Reflections
 * Stores month-level growth reviews and forward reflection priorities.
 */
export const monthlyReflectionsTable = mysqlTable('monthly_reflections', {
  id: varchar('id', { length: 64 }).primaryKey(),
  month: int('month').notNull(),
  year: int('year').notNull(),
  workDone: json('work_done').$type<string[]>().notNull(),
  achievements: json('achievements').$type<string[]>().notNull(),
  failuresAndChallenges: json('failures_and_challenges').$type<string[]>().notNull(),
  lessonsLearned: json('lessons_learned').$type<string[]>().notNull(),
  highlights: json('highlights').$type<string[]>().notNull(),
  overallReflection: text('overall_reflection'),
  nextMonthReflection: text('next_month_reflection'),
  generatedSummary: text('generated_summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export type DrizzleDailyLog = typeof dailyLogsTable.$inferSelect;
export type NewDrizzleDailyLog = typeof dailyLogsTable.$inferInsert;

export type DrizzleWeeklyReflection = typeof weeklyReflectionsTable.$inferSelect;
export type NewDrizzleWeeklyReflection = typeof weeklyReflectionsTable.$inferInsert;

export type DrizzleMonthlyReflection = typeof monthlyReflectionsTable.$inferSelect;
export type NewDrizzleMonthlyReflection = typeof monthlyReflectionsTable.$inferInsert;
