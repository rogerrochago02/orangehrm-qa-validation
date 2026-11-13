# OrangeHRM — admissão e férias

Testes na demo pública do OrangeHRM OS 5.9, um sistema de RH, nas áreas de admissão e férias.
9 casos executados em 13/11/2026, em navegador sem janela: 9 passaram, 0 erros.

Repositório: https://github.com/rogerrochago02/orangehrm-qa-validation

## Resultado

9 casos, 9 passaram, 0 erros, 12 prints, 13/11/2026. Fonte: `TEST_CASES.md`, `BUGS.md`, `EVIDENCE/HEADLESS/` e `EXECUTION_LOG_2026-11-13.txt`.

## Como rodar

```bash
npm install --prefix tools
node tools/sd-ohrm.mjs
```

O script faz login com `Admin` e executa os 9 casos. A senha é lida da tela e não fica salva.

## O que ficou fora

Time, busca como sessão própria, aprovação por outro perfil e relatórios de Leave.

## Limitações

- Time e busca não foram testados.
- A demo é compartilhada: os dados podem mudar.
- Precisa instalar o Playwright antes de rodar.

## Dados na demo

Ficaram na demo o funcionário `QA2026H Analista` (ID 0478), um direito de 5 dias e uma licença de 2 dias em 07 e 08/12/2026.

## Evidência

12 prints em `EVIDENCE/HEADLESS/` e o log em `EXECUTION_LOG_2026-11-13.txt`.
