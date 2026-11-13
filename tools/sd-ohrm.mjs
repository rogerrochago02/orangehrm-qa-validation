// QA-2026-002 — execucao headless (Chromium empacotado do Playwright).
// Sem Chrome do sistema, sem channel, sem executablePath, sem remote debugging.
// Uso: node tools/sd-ohrm.mjs (a partir de PROJECTS\QA-2026-002)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, "..", "EVIDENCE", "HEADLESS");
const BASE = "https://opensource-demo.orangehrmlive.com";
const results = [];
fs.mkdirSync(OUT, { recursive: true });
const log = (o) => console.log(JSON.stringify(o));

async function runCase(id, fn) {
  const t0 = Date.now();
  try {
    const data = await fn();
    results.push({ id, status: data.ok ? "passed" : "failed", ...data });
    log({ case: id, status: data.ok ? "passed" : "failed", ...data, ms: Date.now() - t0 });
  } catch (e) {
    results.push({ id, status: "failed", error: String(e.message || e).slice(0, 300) });
    log({ case: id, status: "failed", error: String(e.message || e).slice(0, 300), ms: Date.now() - t0 });
  }
}

const shot = (page, name) => page.screenshot({ path: path.join(OUT, name) });

async function login(page) {
  await page.goto(`${BASE}/web/index.php/auth/login`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('input[name="username"]', { timeout: 30000 });
  await page.waitForTimeout(800);
  const body = await page.locator("body").innerText();
  const user = body.match(/Username\s*:\s*(\S+)/i)?.[1];
  const pass = body.match(/Password\s*:\s*(\S+)/i)?.[1];
  if (!user || !pass) throw new Error("credenciais nao exibidas na tela de login");
  await page.fill('input[name="username"]', user);
  await page.fill('input[name="password"]', pass);
  await page.click('button[type="submit"]');
  await page.waitForURL(/dashboard/, { timeout: 25000 });
  return { user };
}

async function pickEmployee(page, name) {
  const inp = page.getByPlaceholder("Type for hints...").first();
  await inp.fill("");
  await inp.pressSequentially(name, { delay: 40 });
  const opt = page.locator(".oxd-autocomplete-option", { hasText: name }).first();
  await opt.waitFor({ state: "visible", timeout: 20000 });
  await opt.click();
  await page.waitForTimeout(500);
}

async function pickLeaveType(page, label) {
  const grp = page.locator(".oxd-input-group").filter({ hasText: "Leave Type" }).first();
  await grp.locator(".oxd-select-text").click();
  await page.locator(".oxd-select-dropdown .oxd-select-option", { hasText: label }).first().click();
  await page.waitForTimeout(400);
}

const empIdGroup = (page) => page.locator(".oxd-input-group").filter({ hasText: "Employee Id" }).first();

async function fillDate(input, value) {
  await input.click();
  await input.fill("");
  await input.pressSequentially(value, { delay: 30 });
  await input.press("Tab");
  await input.page().waitForTimeout(500);
}

const browser = await chromium.launch({ headless: true });
log({ step: "browser", version: browser.version(), headless: true, channel: "bundled-chromium" });
const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
const page = await ctx.newPage();
page.setDefaultTimeout(20000);

let empName = "QA2026H Analista";
let empId = null;

// TC-01
await runCase("TC-01", async () => {
  await login(page);
  await page.goto(`${BASE}/web/index.php/pim/addEmployee`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.waitForTimeout(1200);
  const errs = await page.locator(".oxd-input-field-error-message").allInnerTexts();
  const stillForm = page.url().includes("addEmployee");
  await shot(page, "QA-2026-002_2026-11-13_TC-01_p1_nomes_vazios.png");
  const ok = stillForm && errs.filter((e) => /required/i.test(e)).length >= 2;
  return { ok, expected: "bloquear e marcar First/Last Name", obtained: `url=${page.url().split("/web")[1]}, erros=${JSON.stringify(errs)}` };
});

// TC-02
await runCase("TC-02", async () => {
  await page.fill('input[name="firstName"]', "QA2026H");
  await page.fill('input[name="lastName"]', "Analista");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.waitForURL(/viewPersonalDetails/, { timeout: 25000 });
  await page.waitForTimeout(1500);
  const heading = await page.locator("h6").filter({ hasText: "QA2026H" }).first().innerText();
  empId = await empIdGroup(page).locator("input").first().inputValue();
  const empNumber = page.url().match(/empNumber\/(\d+)/)?.[1];
  await shot(page, "QA-2026-002_2026-11-13_TC-02_p1_detalhes.png");
  const ok = /QA2026H/.test(heading) && !!empId && !!empNumber;
  return { ok, expected: "criar funcionario e abrir Personal Details", obtained: `empNumber=${empNumber}, id=${empId}, heading="${heading}"` };
});

// TC-03
await runCase("TC-03", async () => {
  if (!empId) throw new Error("sem Employee Id de TC-02");
  await page.goto(`${BASE}/web/index.php/pim/viewEmployeeList`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  await empIdGroup(page).locator("input").first().fill(empId);
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.waitForTimeout(2000);
  const rows = await page.locator(".oxd-table-body .oxd-table-row").allInnerTexts();
  await shot(page, "QA-2026-002_2026-11-13_TC-03_p1_filtro_id.png");
  const ok = rows.length === 1 && rows[0].includes(empId) && /QA2026H/.test(rows[0]);
  return { ok, expected: "1 linha com o funcionario criado", obtained: `${rows.length} linha(s): ${rows[0]?.replace(/\n+/g, " | ") ?? "vazio"}` };
});

// TC-04
await runCase("TC-04", async () => {
  await page.goto(`${BASE}/web/index.php/pim/viewEmployeeList`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  await empIdGroup(page).locator("input").first().fill("999999");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.waitForTimeout(2000);
  const rows = await page.locator(".oxd-table-body .oxd-table-row").count();
  await shot(page, "QA-2026-002_2026-11-13_TC-04_p1_filtro_inexistente.png");
  return { ok: rows === 0, expected: "0 linhas para ID inexistente", obtained: `${rows} linha(s)` };
});

// TC-05
await runCase("TC-05", async () => {
  if (!empId) throw new Error("sem Employee Id de TC-02");
  await page.goto(`${BASE}/web/index.php/pim/addEmployee`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.fill('input[name="firstName"]', "QA2026H");
  await page.fill('input[name="lastName"]', "Duplicado");
  await empIdGroup(page).locator("input").first().fill(empId);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.waitForTimeout(1500);
  const errs = await page.locator(".oxd-input-field-error-message").allInnerTexts();
  const stillForm = page.url().includes("addEmployee");
  await shot(page, "QA-2026-002_2026-11-13_TC-05_p1_id_duplicado.png");
  const ok = stillForm && errs.some((e) => /already exists/i.test(e));
  return { ok, expected: "bloquear ID duplicado", obtained: `url=${page.url().split("/web")[1]}, erros=${JSON.stringify(errs)}` };
});

// TC-06
await runCase("TC-06", async () => {
  await page.goto(`${BASE}/web/index.php/leave/addLeaveEntitlement`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await pickEmployee(page, empName);
  await pickLeaveType(page, "CAN - Vacation");
  const ent = page.locator(".oxd-input-group").filter({ hasText: "Entitlement" }).first().locator("input").first();
  await ent.fill("5");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.waitForTimeout(1200);
  const confirm = page.getByRole("button", { name: "Confirm", exact: true });
  if (await confirm.count()) await confirm.click();
  await page.waitForTimeout(2000);
  const toast = (await page.locator(".oxd-toast").allInnerTexts()).join(" ").replace(/\n+/g, " ");
  await shot(page, "QA-2026-002_2026-11-13_TC-06_p1_entitlement.png");
  return { ok: /success/i.test(toast), expected: "gravar 5 dias de direito", obtained: `toast="${toast}"` };
});

// TC-07
await runCase("TC-07", async () => {
  await page.goto(`${BASE}/web/index.php/leave/assignLeave`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await pickEmployee(page, empName);
  await pickLeaveType(page, "CAN - Vacation");
  await page.waitForTimeout(1500);
  const bal = await page.locator(".oxd-input-group").filter({ hasText: "Leave Balance" }).first().innerText();
  await shot(page, "QA-2026-002_2026-11-13_TC-07_p1_saldo.png");
  const ok = /5\.00/.test(bal);
  return { ok, expected: "saldo 5.00 dias", obtained: bal.replace(/\n+/g, " | ") };
});

// TC-08
await runCase("TC-08", async () => {
  const dates = page.locator('input[placeholder="yyyy-dd-mm"]');
  await fillDate(dates.nth(0), "2026-07-12");
  await fillDate(dates.nth(1), "2026-08-12");
  await page.waitForTimeout(800);
  const dur = await page.locator(".oxd-input-group").filter({ hasText: "Duration" }).first().innerText().catch(() => "");
  await page.getByRole("button", { name: "Assign", exact: true }).click();
  await page.waitForTimeout(2000);
  const toast = (await page.locator(".oxd-toast").allInnerTexts()).join(" ").replace(/\n+/g, " ");
  await shot(page, "QA-2026-002_2026-11-13_TC-08_p1_dois_dias.png");

  await page.goto(`${BASE}/web/index.php/leave/viewLeaveList`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await pickEmployee(page, empName);
  const grp = page.locator(".oxd-input-group").filter({ hasText: "Status" }).first();
  await grp.locator(".oxd-select-text").click();
  await page.locator(".oxd-select-dropdown .oxd-select-option", { hasText: "Scheduled" }).first().click();
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.waitForTimeout(2000);
  const rows = await page.locator(".oxd-table-body .oxd-table-row").allInnerTexts();
  await shot(page, "QA-2026-002_2026-11-13_TC-08_p2_leave_list.png");
  const ok = /success/i.test(toast) && rows.some((r) => /2\.00/.test(r));
  return { ok, expected: "gravar 2 dias uteis (07 e 08/12)", obtained: `duracao="${dur.replace(/\n+/g, " | ")}", toast="${toast}", lista=${rows.map((r) => r.replace(/\n+/g, " | ")).join(" || ")}` };
});

// TC-09
await runCase("TC-09", async () => {
  await page.goto(`${BASE}/web/index.php/leave/assignLeave`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await pickEmployee(page, empName);
  await pickLeaveType(page, "CAN - Vacation");
  await page.waitForTimeout(1200);
  const dates = page.locator('input[placeholder="yyyy-dd-mm"]');
  await fillDate(dates.nth(0), "2026-07-12");
  await fillDate(dates.nth(1), "2026-08-12");
  await page.getByRole("button", { name: "Assign", exact: true }).click();
  await page.waitForTimeout(2000);
  const toast = (await page.locator(".oxd-toast").allInnerTexts()).join(" ").replace(/\n+/g, " ");
  await shot(page, "QA-2026-002_2026-11-13_TC-09_p1_sobreposicao.png");
  const blocked = /failed|warn/i.test(toast);
  return { ok: blocked, expected: "bloquear pedido sobreposto", obtained: `toast="${toast}"` };
});

await ctx.close();
await browser.close();
const passed = results.filter((r) => r.status === "passed").length;
log({ summary: { total: results.length, passed, failed: results.length - passed } });
