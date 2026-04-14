import { pgTable, serial, varchar, pgEnum, integer, time, boolean } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "customer",
  "manager"
]);

export const seatTypeEnum = pgEnum("seat_type", [
  "regular",
  "premium",
  "vip"
]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: userRoleEnum("role").default("customer").notNull(),
});

export const VenuesTable = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
});

export const screensTable = pgTable("screens", {
  id: serial("id").primaryKey(),
  venueId: integer("venue_id")
    .notNull()
    .references(() => VenuesTable.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 20 }).notNull(),
  basicPrice: integer("basic_price").notNull(),
  premiumPrice: integer("premium_price").notNull(),
  vipPrice: integer("vip_price").notNull(),
});

export const seatsTable = pgTable("seats", {
  id: serial("id").primaryKey(),
  screenId: integer("screen_id")
    .notNull()
    .references(() => screensTable.id, { onDelete: "cascade" }),
  seatNumber: varchar("seat_number", { length: 10 }).notNull(),
  type: seatTypeEnum("type").notNull(),
});

export const moviesTable = pgTable("movies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 20 }).notNull(),
});

export const showsTable = pgTable("shows", {
  id: serial("id").primaryKey(),
  movieId: integer("movie_id")
    .notNull()
    .references(() => moviesTable.id, { onDelete: "cascade" }),
  screenId: integer("screen_id")
    .notNull()
    .references(() => screensTable.id, { onDelete: "cascade" }),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
});

export const bookingsTables = pgTable("bookings", {
  id: serial("id").primaryKey(),
  isbooked: boolean("isbooked").default(false),
  show_id: integer("show_id")
    .notNull()
    .references(() => showsTable.id, { onDelete: "cascade" }),
  seat_id: integer("seat_id")
    .notNull()
    .references(() => seatsTable.id, { onDelete: "cascade" }),
});