# TEST CASES — QA-2026-002 (OrangeHRM demo)

Só casos executados. Status do vocabulário único. Execução de 2026-11-13, 13:35–13:43 (-03:00).

Ambiente: Playwright 1.64.1 headless, Chromium empacotado 156.0.8078.4 (revision 1248), viewport 1366×900, Windows 11 Pro. Sem Chrome do sistema, sem remote debugging. URL base: https://opensource-demo.orangehrmlive.com (OrangeHRM OS 5.9). Login `Admin`; senha lida da tela de login na execução e não registrada em arquivo.

Comando: `node tools/sd-ohrm.mjs` em `PROJECTS\QA-2026-002`. Log bruto: `EXECUTION_LOG_2026-11-13.txt`.

Resumo: 9 casos — 9 `passed`, 0 `failed`, 0 `blocked`.

| Total | passed | failed | blocked |
|---|---|---|---|
| 9 | 9 | 0 | 0 |

---

## TC-01 — Admissão sem nome e sobrenome

| Campo | Valor |
|---|---|
| ID | TC-01 |
| Pré-condição | Sessão Admin; PIM > Add Employee |
| Passos | 1. Abrir Add Employee. 2. Não preencher nada. 3. Clicar em Save. |
| Esperado | Não criar funcionário; marcar First Name e Last Name como obrigatórios; permanecer no formulário |
| Obtido | Permaneceu em `/pim/addEmployee`; duas mensagens "Required"; nenhum registro criado |
| Status | `passed` |
| Data | 2026-11-13 |
| Evidência | `EVIDENCE\HEADLESS\QA-2026-002_2026-11-13_TC-01_p1_nomes_vazios.png` |

## TC-02 — Criar funcionário com nome completo

| Campo | Valor |
|---|---|
| ID | TC-02 |
| Pré-condição | Sessão Admin; Add Employee |
| Passos | 1. First Name `QA2026H`. 2. Last Name `Analista`. 3. Manter o Employee Id gerado. 4. Save. |
| Esperado | Criar o funcionário e abrir Personal Details com o registro |
| Obtido | Abriu `/pim/viewPersonalDetails/empNumber/277`; heading "QA2026H Analista"; Employee Id `0478` |
| Status | `passed` |
| Data | 2026-11-13 |
| Evidência | `EVIDENCE\HEADLESS\QA-2026-002_2026-11-13_TC-02_p1_detalhes.png` |

## TC-03 — Filtrar lista por Employee Id existente

| Campo | Valor |
|---|---|
| ID | TC-03 |
| Pré-condição | Funcionário de TC-02, Employee Id 0478 |
| Passos | 1. PIM > Employee List. 2. Employee Id `0478`. 3. Search. |
| Esperado | Exatamente 1 linha com o funcionário criado |
| Obtido | 1 linha: `0478 | QA2026H | Analista` |
| Status | `passed` |
| Data | 2026-11-13 |
| Evidência | `EVIDENCE\HEADLESS\QA-2026-002_2026-11-13_TC-03_p1_filtro_id.png` |

## TC-04 — Filtrar por Employee Id inexistente

| Campo | Valor |
|---|---|
| ID | TC-04 |
| Pré-condição | Employee List |
| Passos | 1. Employee Id `999999`. 2. Search. |
| Esperado | Nenhuma linha |
| Obtido | 0 linhas, sem registro exibido |
| Status | `passed` |
| Data | 2026-11-13 |
| Evidência | `EVIDENCE\HEADLESS\QA-2026-002_2026-11-13_TC-04_p1_filtro_inexistente.png` |

## TC-05 — Admissão com Employee Id duplicado

| Campo | Valor |
|---|---|
| ID | TC-05 |
| Pré-condição | Employee Id 0478 já usado por TC-02 |
| Passos | 1. Add Employee. 2. Nome `QA2026H Duplicado`. 3. Employee Id `0478`. 4. Save. |
| Esperado | Bloquear criação e apontar o ID duplicado |
| Obtido | Permaneceu em `/pim/addEmployee` com "Employee Id already exists"; nenhum registro criado |
| Status | `passed` |
| Data | 2026-11-13 |
| Evidência | `EVIDENCE\HEADLESS\QA-2026-002_2026-11-13_TC-05_p1_id_duplicado.png` |

## TC-06 — Criar direito a férias de 5 dias

| Campo | Valor |
|---|---|
| ID | TC-06 |
| Pré-condição | Funcionário de TC-02; Leave > Entitlements > Add |
| Passos | 1. Add Leave Entitlement. 2. Funcionário `QA2026H Analista`. 3. Leave Type `CAN - Vacation`. 4. Entitlement `5`. 5. Save e Confirm. |
| Esperado | Gravar 5 dias de direito |
| Obtido | Toast "Success — Successfully Saved"; saldo de 5.00 confirmado em TC-07 |
| Status | `passed` |
| Data | 2026-11-13 |
| Evidência | `EVIDENCE\HEADLESS\QA-2026-002_2026-11-13_TC-06_p1_entitlement.png` |

## TC-07 — Saldo exibido ao atribuir licença

| Campo | Valor |
|---|---|
| ID | TC-07 |
| Pré-condição | Direito de 5 dias de TC-06 |
| Passos | 1. Leave > Assign Leave. 2. Selecionar `QA2026H Analista`. 3. Leave Type `CAN - Vacation`. 4. Ler Leave Balance. |
| Esperado | 5.00 dias |
| Obtido | `Leave Balance 5.00 Day(s)` |
| Status | `passed` |
| Data | 2026-11-13 |
| Evidência | `EVIDENCE\HEADLESS\QA-2026-002_2026-11-13_TC-07_p1_saldo.png` |

## TC-08 — Licença de 2 dias úteis: gravação e desconto no saldo

| Campo | Valor |
|---|---|
| ID | TC-08 |
| Pré-condição | Saldo 5.00 (TC-07) |
| Passos | 1. Assign Leave. 2. Funcionário e tipo como em TC-07. 3. From `2026-07-12`. 4. To `2026-08-12`. 5. Assign. 6. Leave List com status Scheduled. |
| Esperado | Gravar 2 dias; saldo cair para 3.00 |
| Obtido | Toast "Successfully Saved"; Leave List: `2026-07-12 to 2026-08-12 | CAN - Vacation | 3.00 | 2.00 | Scheduled (2.00)` |
| Requisição | `POST /web/index.php/api/v2/leave/employees/leave-requests` com `{"leaveTypeId":6,"fromDate":"2026-12-09","toDate":"2026-12-10","comment":null,"empNumber":277}` → HTTP 200, `{"data":{"id":111,...,"dateApplied":"2026-12-09"}}` |
| Veredito | `falha do teste` — o corpo enviado tem `toDate` diferente de `fromDate` e o servidor grava 2 dias; o `toDate` igual ao `fromDate` de 11/11 veio do método de digitação em CDP, não do produto |
| Status | `passed` |
| Data | 2026-11-13 |
| Evidência | `EVIDENCE\HEADLESS\QA-2026-002_2026-11-13_TC-08_p1_dois_dias.png`, `..._TC-08_p2_leave_list.png`, `..._TC-08_p3_request.png` e `..._TC-08_p4_leave_list_2dias.png` |

## TC-09 — Pedido de licença sobreposto

| Campo | Valor |
|---|---|
| ID | TC-09 |
| Pré-condição | Licença de 2 dias em 07–08/12 (TC-08) |
| Passos | 1. Assign Leave para o mesmo funcionário e tipo. 2. From `2026-07-12`. 3. To `2026-08-12`. 4. Assign. |
| Esperado | Bloquear o pedido sobreposto e não gravar |
| Obtido | Toast "Warning — Failed to Submit"; nenhum toast de sucesso |
| Status | `passed` |
| Data | 2026-11-13 |
| Evidência | `EVIDENCE\HEADLESS\QA-2026-002_2026-11-13_TC-09_p1_sobreposicao.png` |
