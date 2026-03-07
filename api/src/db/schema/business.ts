import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const auditColumns = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const roleEnum = pgEnum("role", ["owner", "admin", "manager", "agent"]);
export const customerStatusEnum = pgEnum("customer_status", [
  "lead",
  "pending",
  "approved",
  "active",
  "inactive",
]);
export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "pending",
  "paid",
  "void",
  "uncollectible",
]);
export const invoiceTypeEnum = pgEnum("invoice_type", [
  "down_payment",
  "monthly_payment",
  "origination_fee",
  "manual",
]);

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"),
  legacyCustomerId: text("legacy_customer_id").unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  status: customerStatusEnum("status").default("pending").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...auditColumns,
});

export const customerApplicants = pgTable("customer_applicants", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .references(() => customers.id, { onDelete: "cascade" })
    .notNull(),
  dateOfBirth: timestamp("date_of_birth", { withTimezone: true }),
  ssnLast4: text("ssn_last4"),
  addressLine1: text("address_line_1"),
  addressLine2: text("address_line_2"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  housingStatus: text("housing_status"),
  residenceDuration: text("residence_duration"),
  monthlyHousingPayment: numeric("monthly_housing_payment", {
    precision: 12,
    scale: 2,
  }),
  insurancePolicyNumber: text("insurance_policy_number"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...auditColumns,
});

export const customerEmployment = pgTable("customer_employment", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .references(() => customers.id, { onDelete: "cascade" })
    .notNull(),
  employerName: text("employer_name"),
  duration: text("duration"),
  position: text("position"),
  grossAnnualIncome: numeric("gross_annual_income", {
    precision: 12,
    scale: 2,
  }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...auditColumns,
});

export const customerVehicles = pgTable("customer_vehicles", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .references(() => customers.id, { onDelete: "cascade" })
    .notNull(),
  vin: text("vin"),
  year: integer("year"),
  make: text("make"),
  model: text("model"),
  mileage: integer("mileage"),
  price: numeric("price", { precision: 12, scale: 2 }),
  downPayment: numeric("down_payment", { precision: 12, scale: 2 }),
  originationFee: numeric("origination_fee", { precision: 12, scale: 2 }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...auditColumns,
});

export const customerDocuments = pgTable("customer_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .references(() => customers.id, { onDelete: "cascade" })
    .notNull(),
  documentType: text("document_type").notNull(),
  fileName: text("file_name"),
  storageUrl: text("storage_url").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...auditColumns,
});

export const customerFinancingTerms = pgTable("customer_financing_terms", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .references(() => customers.id, { onDelete: "cascade" })
    .notNull(),
  principalAmount: numeric("principal_amount", { precision: 12, scale: 2 }),
  apr: numeric("apr", { precision: 8, scale: 4 }),
  termMonths: integer("term_months"),
  monthlyPaymentAmount: numeric("monthly_payment_amount", {
    precision: 12,
    scale: 2,
  }),
  startedAt: timestamp("started_at", { withTimezone: true }),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...auditColumns,
});

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  legacyLeadId: text("legacy_lead_id").unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  desiredLoanAmount: numeric("desired_loan_amount", {
    precision: 12,
    scale: 2,
  }),
  downPayment: numeric("down_payment", { precision: 12, scale: 2 }),
  monthlyIncome: numeric("monthly_income", { precision: 12, scale: 2 }),
  hasTradeIn: boolean("has_trade_in").default(false).notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().default({}),
  ...auditColumns,
});

export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .references(() => customers.id, { onDelete: "cascade" })
    .notNull(),
  legacyInvoiceId: text("legacy_invoice_id").unique(),
  stripeInvoiceId: text("stripe_invoice_id").unique(),
  status: invoiceStatusEnum("status").default("draft").notNull(),
  type: invoiceTypeEnum("type").notNull(),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 12, scale: 2 }).default("0").notNull(),
  amountDue: numeric("amount_due", { precision: 12, scale: 2 }).notNull(),
  amountPaid: numeric("amount_paid", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  dueAt: timestamp("due_at", { withTimezone: true }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...auditColumns,
});

export const invoiceLineItems = pgTable("invoice_line_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceId: uuid("invoice_id")
    .references(() => invoices.id, { onDelete: "cascade" })
    .notNull(),
  description: text("description").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  unitAmount: numeric("unit_amount", { precision: 12, scale: 2 }).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...auditColumns,
});

export const stripeCustomers = pgTable("stripe_customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .references(() => customers.id, { onDelete: "cascade" })
    .notNull(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  email: text("email"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...auditColumns,
});

export const staffRoles = pgTable("staff_roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  role: roleEnum("role").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  ...auditColumns,
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorUserId: text("actor_user_id"),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  summary: text("summary"),
  payload: jsonb("payload").$type<Record<string, unknown>>().default({}),
  ...auditColumns,
});
