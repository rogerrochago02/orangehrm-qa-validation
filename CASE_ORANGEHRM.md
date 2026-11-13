# CASE — OrangeHRM

## 1. O site

OrangeHRM OS 5.9, demo pública de avaliação: https://opensource-demo.orangehrmlive.com
Sistema de RH de código aberto. Áreas testadas: cadastro de funcionário (PIM) e licença (Leave).
Rodou em Windows 11 Pro, Chromium 156.0.8078.4 empacotado no Playwright 1.64.1, headless, em 2026-11-13.

## 2. O que foi testado

9 casos — 9 `passed`, 0 `failed`, 0 `blocked` (fonte: `summary` do log de 2026-11-13).

- TC-01 — admissão sem nome: recusou e marcou First/Last Name. `passed`.
- TC-02 — criar funcionário: gravou e abriu o cadastro (ID 0478). `passed`.
- TC-03 — filtro por ID existente: 1 linha. `passed`.
- TC-04 — filtro por ID inexistente: 0 linhas. `passed`.
- TC-05 — ID duplicado: recusou com "Employee Id already exists". `passed`.
- TC-06 — direito de 5 dias: gravou e o saldo apareceu. `passed`.
- TC-07 — saldo ao atribuir licença: 5.00 dias. `passed`.
- TC-08 — licença de 2 dias úteis (7 e 8/12): gravou 2.00 dias, saldo 3.00. `passed`.
- TC-09 — pedido sobreposto: recusou. `passed`.

Limites: um navegador só (Chromium headless); demo compartilhada, e os registros criados ficam nela; busca por nome sem caso próprio.
Rodada de 11/11: usou Chrome real e não vale como evidência. TC-08 estava `blocked` e passou — o erro era do método de digitação.

## 3. Erros encontrados

0 erros. A recusa de pedido sobreposto usa mensagem genérica ("Failed to Submit"), sem citar o motivo: observação, não erro.

## 4. Como reproduzir

```bash
npm install --prefix tools
node tools/sd-ohrm.mjs
```

## 5. Evidência

- TC-01: [print](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-01_p1_nomes_vazios.png)
- TC-02: [print](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-02_p1_detalhes.png)
- TC-03: [print](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-03_p1_filtro_id.png)
- TC-04: [print](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-04_p1_filtro_inexistente.png)
- TC-05: [print](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-05_p1_id_duplicado.png)
- TC-06: [print](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-06_p1_entitlement.png)
- TC-07: [print](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-07_p1_saldo.png)
- TC-08: [print 1](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-08_p1_dois_dias.png), [2](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-08_p2_leave_list.png), [3](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-08_p3_request.png), [4](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-08_p4_leave_list_2dias.png)
- TC-09: [print](EVIDENCE/HEADLESS/QA-2026-002_2026-11-13_TC-09_p1_sobreposicao.png)
- Log bruto: [EXECUTION_LOG_2026-11-13.txt](EXECUTION_LOG_2026-11-13.txt)
