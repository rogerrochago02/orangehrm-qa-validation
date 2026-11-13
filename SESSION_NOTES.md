# SESSION NOTES — QA-2026-002 (OrangeHRM demo)

## O que mudou em 13/11

A rodada de 11/11 foi feita em Chrome real 157 dirigido por DevTools Protocol. A regra do AGENTS.md passou a exigir Playwright headless com Chromium empacotado, sem Chrome do sistema, sem `--remote-debugging` e sem janela visível. Os 33 prints daquela sessão foram movidos para `EVIDENCE\NAO_USAR_CHROME_2026-11-11\`, com `LEIA.txt` explicando o motivo; nada foi apagado.

Esta rodada refez os mesmos 9 casos, sem caso novo, em Playwright 1.64.1 headless (Chromium 156.0.8078.4), script em `tools\sd-ohrm.mjs` com `tools\package.json`. Comando: `node tools/sd-ohrm.mjs` a partir de `PROJECTS\QA-2026-002`. Log: `EXECUTION_LOG_2026-11-13.txt`.

## Ordem executada

1. Login `Admin`, com usuário e senha lidos do texto da tela de login (a senha só existe em memória).
2. PIM (TC-01 a TC-05): admissão vazia, criação válida, filtro por ID existente, filtro por ID inexistente, ID duplicado.
3. Leave (TC-06 a TC-09): direito de 5 dias, saldo, licença de 2 dias úteis, sobreposição.

## Resultado

9 casos, 9 `passed`, 0 `failed`, 0 `blocked`. O TC-08, que em 11/11 ficou `blocked` por falha de input na data final, agora grava 2.00 dias (07 e 08/12) e o saldo cai de 5.00 para 3.00. A hipótese antiga ("o sistema ignora a data final") está **descartada**: era o meu método de digitação, não o produto.

## O que não testei e por quê

- Aprovação de licença por perfil diferente de Admin: exigiria criar login para o funcionário e configurar supervisor; fora do escopo desta rodada.
- Cancelamento de licença e relatórios de Leave: não estão nos 9 casos.
- Registro de ponto (Time) e busca/filtro como sessão própria: seguem fora, conforme a ordem do QA Manager de não abrir frente nova.
- Persistência real do Firebase: esta aplicação não usa; nada a verificar aqui.

## Hipóteses

1. **Data final ignorada** — descartada, como acima. `pressSequentially` no campo To atualiza o modelo e o registro sai com 2.00 dias.
2. **Saldo de férias não desconta** — descartada antes; agora reconfirmada: 5.00 → 3.00 com 2 dias.
3. **Entitlement não grava** — descartada; exige confirmar o diálogo e o saldo aparece em seguida.
4. **Mensagem de sobreposição** — continua genérica ("Failed to Submit"), sem citar o motivo. Registrada como observação, não bug.

## Dados criados na demo

- `QA2026H Analista`, empNumber 277, Employee Id 0478.
- Direito `CAN - Vacation` de 5 dias, período 2026.
- Licenças `Scheduled` de 2 dias: 07–08/12/2026 e 09–10/12/2026 (a segunda criada na captura do TC-08). Saldo atual: 1.00 dia.
- Da sessão antiga de 11/11 continuam na demo `QA2026 Analista` (186/0388), o direito de 5 dias e 5 licenças de 1 dia.

## O que o case antigo dizia e o que a execução headless mostra

| Ponto | Case antigo (11/11, arquivado) | Execução headless (13/11) |
|---|---|---|
| Ambiente | Chrome 157.0.8103.40 real, dirigido por DevTools Protocol na porta 9333 | Chromium 156.0.8078.4 empacotado no Playwright 1.64.1, headless, sem Chrome do sistema |
| Evidência | 33 prints da sessão com navegador visível, todos descartados | 12 prints nativos do headless, válidos |
| Resultado dos 9 casos | 8 `passed` e 1 `blocked` | 9 `passed`, 0 `blocked` |
| TC-08 (2 dias) | Gravou 1,00 dia; `toDate` saiu igual a `fromDate`; saldo 5,00 → 4,00 | Gravou 2,00 dias em 07–08/12; saldo 5,00 → 3,00 |
| Requisição do TC-08 | Não capturada na sessão antiga | `POST .../leave-requests` com `fromDate=2026-12-09` e `toDate=2026-12-10`; HTTP 200 |
| Veredito do TC-08 | Ficou como `blocked`, sem decisão | `falha do teste`: o produto grava o intervalo quando o campo é preenchido de forma que atualize o modelo |
| Total de evidência usada no case | 0 | 12 |

Diferença que importa para quem ler o case: o `blocked` do TC-08 não era defeito do OrangeHRM; era o meu método de digitação no Chrome controlado por CDP. Em headless, com preenchimento que dispara os eventos do formulário, o mesmo fluxo grava 2 dias e o servidor responde 200.

## Limitações

- Um navegador só (Chromium headless), sem mobile e sem outros navegadores.
- Demo pública e compartilhada: outro usuário pode alterar dados entre execuções; os casos criam registros com prefixo QA para não depender de massa fixa.
- Sem API: o comportamento é julgado pela interface.
