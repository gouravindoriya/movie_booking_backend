import {
  pgTable,
  serial,
  varchar,
  pgEnum,
  integer,
  time,
  boolean,
  date,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/* ================= ENUMS ================= */

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

/* ================= USERS ================= */

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: userRoleEnum("role").default("customer").notNull(),
});

/* ================= VENUES ================= */

export const venuesTable = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
});

/* ================= SCREENS ================= */

export const screensTable = pgTable("screens", {
  id: serial("id").primaryKey(),
  venueId: integer("venue_id")
    .notNull()
    .references(() => venuesTable.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 50 }).notNull(),
  basicPrice: integer("basic_price").notNull(),
  premiumPrice: integer("premium_price").notNull(),
  vipPrice: integer("vip_price").notNull(),
});

/* ================= SEATS ================= */

export const seatsTable = pgTable("seats", {
  id: serial("id").primaryKey(),
  screenId: integer("screen_id")
    .notNull()
    .references(() => screensTable.id, { onDelete: "cascade" }),
  seatNumber: varchar("seat_number", { length: 10 }).notNull(),
  type: seatTypeEnum("type").notNull(),
}, (table) => ({
  uniqueSeatPerScreen: uniqueIndex("unique_seat_per_screen")
    .on(table.screenId, table.seatNumber),
}));

/* ================= MOVIES ================= */

export const moviesTable = pgTable("movies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

/* ================= SHOWS ================= */

export const showsTable = pgTable("shows", {
  id: serial("id").primaryKey(),
  movieId: integer("movie_id")
    .notNull()
    .references(() => moviesTable.id, { onDelete: "cascade" }),
  screenId: integer("screen_id")
    .notNull()
    .references(() => screensTable.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
}, (table) => ({
  showIndex: index("show_lookup_idx")
    .on(table.screenId, table.date),
}));

/* ================= SHOW SEATS ================= */

export const showSeatsTable = pgTable("show_seats", {
  id: serial("id").primaryKey(),
  showId: integer("show_id")
    .notNull()
    .references(() => showsTable.id, { onDelete: "cascade" }),
  seatId: integer("seat_id")
    .notNull()
    .references(() => seatsTable.id, { onDelete: "cascade" }),
  isBooked: boolean("is_booked").default(false),
}, (table) => ({
  uniqueShowSeat: uniqueIndex("unique_show_seat")
    .on(table.showId, table.seatId),
  showSeatIndex: index("show_seat_idx")
    .on(table.showId, table.isBooked),
}));

/* ================= BOOKINGS ================= */

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  showId: integer("show_id")
    .notNull()
    .references(() => showsTable.id, { onDelete: "cascade" }),

  status: varchar("status", { length: 20 }).default("pending"), // pending, confirmed

  createdAt: timestamp("created_at").defaultNow(),
});

/* ================= BOOKING SEATS ================= */

export const bookingSeatsTable = pgTable("booking_seats", {
  id: serial("id").primaryKey(),

  bookingId: integer("booking_id")
    .notNull()
    .references(() => bookingsTable.id, { onDelete: "cascade" }),

  seatId: integer("seat_id")
    .notNull()
    .references(() => seatsTable.id, { onDelete: "cascade" }),
}, (table) => ({
  uniqueBookingSeat: uniqueIndex("unique_booking_seat")
    .on(table.bookingId, table.seatId),
}));