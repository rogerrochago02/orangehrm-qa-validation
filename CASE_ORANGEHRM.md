# CASE — OrangeHRM

## 1. O site

OrangeHRM é um sistema de RH de código aberto. A versão testada é a 5.9, na demo pública: https://opensource-demo.orangehrmlive.com
Foram testados o cadastro de funcionário (PIM) e as férias (Leave).

## 2. O que foi testado

9 casos: 9 `passed`, 0 `failed`, 0 `blocked` (fonte: resumo do log de 13/11/2026).

- TC-01 — cadastro sem nome: recusou e pediu nome e sobrenome.
- TC-02 — cadastro completo: gravou e abriu a ficha (matrícula 0478).
- TC-03 — busca por matrícula existente: achou 1 linha.
- TC-04 — busca por matrícula inexistente: 0 linhas.
- TC-05 — matrícula repetida: recusou.
- TC-06 — direito a férias (entitlement) de 5 dias: gravou e apareceu no saldo.
- TC-07 — saldo ao pedir férias: 5,00 dias.
- TC-08 — férias de 2 dias (7 e 8/12): gravou 2 dias e o saldo caiu para 3,00.
- TC-09 — pedido sobreposto: recusou.

Rodou em Chromium headless (navegador sem janela visível), no Windows 11, em 13/11/2026.
Limites: um navegador só; a demo é compartilhada e o que os testes criaram continua nela; busca por nome não teve caso próprio.

## 3. Erros encontrados

0 erros. A recusa de pedido sobreposto mostra "Failed to Submit", sem dizer o motivo: mensagem fraca, não erro.

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
