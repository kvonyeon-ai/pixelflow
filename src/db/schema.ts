import {
  pgTable,
  serial,
  text,
  integer,
  bigint,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export type SessionData = {
  service?: string | null;
  topic?: string | null;
  pages?: number | null;
  deadline?: string | null;
  requirements?: string | null;
  design?: string | null;
  botRole?: string | null;
  botFunctions?: string | null;
  orderId?: number | null;
  orderCode?: string | null;
};

export const botUsers = pgTable("bot_users", {
  id: serial("id").primaryKey(),
  chatId: bigint("chat_id", { mode: "number" }).notNull().unique(),
  username: text("username"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  language: text("language"),
  state: text("state").notNull().default("start"),
  data: jsonb("data").$type<SessionData>().notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  code: text("code").unique(),
  chatId: bigint("chat_id", { mode: "number" }).notNull(),
  username: text("username"),
  firstName: text("first_name"),
  language: text("language").notNull().default("ru"),
  service: text("service").notNull(),
  details: jsonb("details")
    .$type<Record<string, string | number | null>>()
    .notNull()
    .$defaultFn(() => ({})),
  price: integer("price").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type BotUser = typeof botUsers.$inferSelect;
export type Order = typeof orders.$inferSelect;
