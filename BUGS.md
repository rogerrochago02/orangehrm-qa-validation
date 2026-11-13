# BUGS — QA-2026-002 (OrangeHRM demo)

## 0 bugs reproduzidos

Rodada sem defeito confirmado. Nenhum bug entra no formato do template porque nenhum comportamento falhou duas vezes.

- Cenários executados: **9** — 9 `passed`, 0 `failed`, 0 `blocked`.
- Ambiente: Playwright 1.64.1 headless, Chromium empacotado 156.0.8078.4, viewport 1366×900, 2026-11-13, OrangeHRM OS 5.9.
- Log bruto: `EXECUTION_LOG_2026-11-13.txt`.

## Limites testados

| Área | O que foi forçado |
|---|---|
| PIM | admissão sem nome, criação válida, filtro por ID existente e inexistente, ID duplicado |
| Leave | direito de 5 dias, saldo exibido, licença de 2 dias úteis, pedido sobreposto |
| Validação | campo obrigatório vazio, identificador único, sobreposição de datas |

## Observações que não entram como bug

1. **Mensagem genérica ao bloquear sobreposição.** O sistema recusa com "Warning — Failed to Submit" e não diz que o motivo é sobreposição (TC-09). Bloqueia corretamente; é mensagem pobre, não quebra de regra. Severidade seria `trivial`; não registrei como bug.
2. **Dados de demonstração poluídos.** A demo tem dezenas de funcionários com nomes repetidos e IDs fora do padrão. É estado da demo, não defeito do produto.
3. **Filtro por nome exige escolher a sugestão** do autocompletar; sem selecionar, a lista volta completa. Comportamento do componente, não erro de regra.
4. **`toDate` igual a `fromDate` (sessão de 11/11)** — veredito `falha do teste`, não defeito do produto. No headless o POST envia `fromDate=2026-12-09` e `toDate=2026-12-10` e o servidor responde 200 gravando 2 dias; o valor repetido vinha do método de digitação no Chrome via CDP.

## Dados que as execuções criaram na demo

- 2026-11-11 (sessão antiga, evidência descartada): funcionário `QA2026 Analista` (empNumber 186, ID 0388), direito `CAN - Vacation` 5 dias e 5 licenças de 1 dia.
- 2026-11-13 (execução válida): funcionário `QA2026H Analista` (empNumber 277, ID 0478), direito `CAN - Vacation` 5 dias e licença `Scheduled` de 2 dias em 07–08/12/2026.
- Nenhum registro de outro funcionário foi alterado.

## Ambiente

Chromium 156.0.8078.4 empacotado no Playwright 1.64.1, headless, Windows 11 Pro 10.0.26200, https://opensource-demo.orangehrmlive.com, 2026-11-13. Login `Admin` (senha lida da tela, não gravada).
