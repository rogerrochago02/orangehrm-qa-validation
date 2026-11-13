# QA-2026-002 — OrangeHRM (PIM e Leave)

Teste automatizado headless da demo pública do OrangeHRM OS 5.9, em PIM e Leave.
Prova que 9 casos executados passaram em 2026-11-13, sem defeito confirmado.
Não cobre Time, busca como sessão própria, aprovação por outro perfil nem relatórios de Leave.

## Resultado

9 casos, 9 `passed`, 0 erros, 12 prints, 2026-11-13. Fonte: `TEST_CASES.md`, `BUGS.md`, `EVIDENCE/HEADLESS/` e `EXECUTION_LOG_2026-11-13.txt`.

## Como rodar

```bash
npm install --prefix tools
node tools/sd-ohrm.mjs
```

A senha do `Admin` é lida da tela e não é gravada.

## Limitações

- Time (CH-03) e busca como sessão própria (CH-04) não foram executadas.
- Demo compartilhada: os dados podem mudar entre execuções.
- Depende de `playwright-core` em `tools/` (Playwright 1.64.1 headless, Chromium 156.0.8078.4).

## O que ficou fora

Time, busca como sessão própria, aprovação por outro perfil, relatórios de Leave.

## Dados na demo

Ficaram `QA2026H Analista` (277/0478), entitlement de 5 dias e licença de 2 dias em 07–08/12/2026; da sessão anterior, `QA2026 Analista` (186/0388) e 5 licenças de 1 dia.

## Evidência

`EVIDENCE/HEADLESS/` (12 prints) e `EXECUTION_LOG_2026-11-13.txt` (log bruto).

## Autor

Roger Rocha
