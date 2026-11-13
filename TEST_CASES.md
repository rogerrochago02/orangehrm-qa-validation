# Casos de teste — OrangeHRM (admissão e férias)

9 casos, todos executados em 13/11/2026: 9 `passed`, 0 `failed`, 0 `blocked`.

Ambiente: Chromium headless (navegador sem janela visível), Windows 11, demo pública `https://opensource-demo.orangehrmlive.com`.
Login `Admin`; a senha é lida da tela e não fica em arquivo.
Para rodar: `npm install --prefix tools` e `node tools/sd-ohrm.mjs`.

## TC-01 — Cadastro sem nome e sobrenome

- **Esperado:** não criar o funcionário; pedir nome e sobrenome.
- **Obtido:** ficou na tela de cadastro, com dois avisos "Required"; nada foi criado. `passed`.
- **Print:** [TC-01](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-01_p1_nomes_vazios.png)

## TC-02 — Cadastro completo

- **Esperado:** criar o funcionário e abrir a ficha.
- **Obtido:** abriu a ficha de "QA2026H Analista", matrícula 0478. `passed`.
- **Print:** [TC-02](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-02_p1_detalhes.png)

## TC-03 — Busca por matrícula existente

- **Esperado:** uma linha, com o funcionário criado.
- **Obtido:** 1 linha: 0478, QA2026H, Analista. `passed`.
- **Print:** [TC-03](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-03_p1_filtro_id.png)

## TC-04 — Busca por matrícula inexistente

- **Esperado:** nenhuma linha.
- **Obtido:** 0 linhas. `passed`.
- **Print:** [TC-04](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-04_p1_filtro_inexistente.png)

## TC-05 — Matrícula repetida

- **Esperado:** recusar o cadastro e avisar que a matrícula já existe.
- **Obtido:** recusou com "Employee Id already exists"; nada criado. `passed`.
- **Print:** [TC-05](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-05_p1_id_duplicado.png)

## TC-06 — Direito a férias de 5 dias

- **Esperado:** gravar 5 dias de direito a férias (entitlement).
- **Obtido:** gravou; a confirmação apareceu em uma mensagem que some sozinha (toast) e o saldo foi conferido em TC-07. `passed`.
- **Print:** [TC-06](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-06_p1_entitlement.png)

## TC-07 — Saldo ao pedir férias

- **Esperado:** 5,00 dias.
- **Obtido:** 5,00 dias no saldo. `passed`.
- **Print:** [TC-07](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-07_p1_saldo.png)

## TC-08 — Férias de 2 dias úteis

- **Esperado:** gravar 2 dias (7 e 8/12) e baixar o saldo para 3,00.
- **Obtido:** gravou; a lista mostrou 2,00 dias e o saldo de 3,00. `passed`.
- **Print:** [1](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-08_p1_dois_dias.png), [2](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-08_p2_leave_list.png), [3](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-08_p3_request.png), [4](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-08_p4_leave_list_2dias.png)

## TC-09 — Pedido de férias sobreposto

- **Esperado:** recusar o pedido e não gravar.
- **Obtido:** recusou com "Warning — Failed to Submit"; nada gravado. `passed`.
- **Print:** [TC-09](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-09_p1_sobreposicao.png)

Log bruto: [EXECUTION_LOG_2026-11-13.txt](EXECUTION_LOG_2026-11-13.txt)
