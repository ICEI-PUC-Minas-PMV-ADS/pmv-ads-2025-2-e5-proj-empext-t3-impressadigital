# Plano de Testes – Empressa Digital

## 1. Objetivo
Garantir que todos os requisitos funcionais do sistema estejam implementados corretamente, atendendo às especificações e funcionando conforme o esperado.  
O objetivo é validar cada funcionalidade por meio de **testes de pares**, onde quem desenvolveu não poderá executar o teste.

---

## 2. Escopo
O plano de testes abrange todos os **Requisitos Funcionais (RF)** do sistema, incluindo cadastro de usuários, gerenciamento de produtos, finalização de compras e login.

---

## 3. Responsabilidades
- **Executor da tarefa**: responsável pelo desenvolvimento da funcionalidade.  
- **Testador**: responsável por validar o requisito implementado.  
- **Evidência**: link da imagem que comprova o teste executado.

---

## 4. Metodologia
Os testes serão realizados de forma manual.  
Cada requisito será verificado individualmente conforme sua descrição.  
Caso o resultado não atenda ao esperado, o erro será documentado e reenviado para correção.

---

## 5. Critérios de Aceite
Um requisito será considerado aprovado se:
- O comportamento observado estiver de acordo com o esperado.  
- A funcionalidade estiver livre de erros críticos.  
- Houver evidência (link de imagem) comprovando o teste.

---
## Parte 2 - Testes por pares

A fim de aumentar a qualidade da aplicação desenvolvida, cada funcionalidade deve ser testada por um colega e os testes devem ser evidenciados. O colega "Tester" deve utilizar o caso de teste criado pelo desenvolvedor responsável pela funcionalidade (desenvolveu a funcionalidade e criou o caso de testes descrito no plano de testes) e caso perceba a necessidade de outros casos de teste, deve acrescentá-los na sessão "Plano de Testes".

| ID     | Descrição do Requisito | Prioridade | Desenvolvedor | Testador |
|---------|-------------------------|-------------|----------------|-----------|
| RF-001 | O sistema deve permitir que os usuários se cadastrem. | ALTA | Brian Mucio Duarte | Douglas Henrique de Sousa e Silva |
|  | **Evidência:** <img width="792" height="907" alt="Captura de tela 2025-10-17 223653" src="https://github.com/user-attachments/assets/775c89a7-7d5a-401b-83ac-f09e94305d1c" /> |
| RF-002 | O sistema deve separar os produtos por categoria. | MÉDIA | Douglas Henrique de Sousa e Silva | Luiza Maria da Silva Machado |
|  | **Evidência:** <img width="1818" height="511" alt="Captura de tela 2025-10-17 231558" src="https://github.com/user-attachments/assets/9dcc44ce-3f9e-449f-89fc-f9ba85fe9a4c" />|
| RF-003 | O sistema deve permitir que os usuários adicionem produtos ao carrinho de compras. | BAIXA | Luiza Maria da Silva Machado | Mateus Salomé Rocha Silva |
|  | **Evidência:** <img width="1798" height="864" alt="Captura de tela 2025-10-17 233325" src="https://github.com/user-attachments/assets/30dcbc10-8d13-4af6-828b-213b21b2d86d" />|
| RF-004 | O sistema deve permitir que os usuários finalizem a compra clicando em um botão "Finalizar no WhatsApp". | ALTA | Mateus Salomé Rocha Silva | Marcelly Giovanna De Souza e Maia |
|  | **Evidência:**  <img width="1118" height="762" alt="Captura de tela 2025-10-17 233335" src="https://github.com/user-attachments/assets/e340ada7-b2f0-4fa0-8beb-d2eba8853a8d" />|
| RF-005 | O sistema deve realizar um cálculo do frete de envio da compra. | MÉDIA | Marcelly Giovanna De Souza e Maia | Erick Cambraia Nunes |
|  | **Evidência:** <img width="1810" height="535" alt="Captura de tela 2025-10-17 233709" src="https://github.com/user-attachments/assets/4fe012e8-3e90-4750-a087-8e44735575cc" />|
| RF-006 | O sistema deve trazer resultados de busca personalizados pelo nome ou categoria do produto. | MÉDIA | Erick Cambraia Nunes | Brian Mucio Duarte |
|  | **Evidência:**<img width="1638" height="432" alt="Captura de tela 2025-10-17 232745" src="https://github.com/user-attachments/assets/449c7866-16dc-4577-bd94-670997fb3f48" />|
| RF-007 | O sistema deve permitir que os administradores visualizem e gerenciem pedidos realizados pelos clientes. | MÉDIA | Brian Mucio Duarte | Luiza Maria da Silva Machado |
|  | **Evidência:**<img width="1498" height="834" alt="Captura de tela 2025-10-17 233847" src="https://github.com/user-attachments/assets/cb057dbb-ed82-4aab-830e-bd7ff78b1dc2" />|
| RF-008 | O sistema deve permitir que os usuários removam produtos do carrinho ou alterem a quantidade. | BAIXA | Douglas Henrique de Sousa e Silva | Marcelly Giovanna De Souza e Maia |
|  | **Evidência:** <img width="1498" height="834" alt="Captura de tela 2025-10-17 233847" src="https://github.com/user-attachments/assets/cb057dbb-ed82-4aab-830e-bd7ff78b1dc2" />|
| RF-009 | O sistema deve permitir que os usuários façam login com suas credenciais. | ALTA | Luiza Maria da Silva Machado | Erick Cambraia Nunes |
|  | **Evidência:** <img width="1570" height="681" alt="Captura de tela 2025-10-17 234142" src="https://github.com/user-attachments/assets/0e1aae52-442a-4c8b-b6d3-1e5351be3c16" />|
| RF-010 | O sistema deve exibir detalhes do produto, incluindo imagens, descrições e preços. | ALTA | Mateus Salomé Rocha Silva | Brian Mucio Duarte |
|  | **Evidência:**<img width="1587" height="809" alt="Captura de tela 2025-10-17 234547" src="https://github.com/user-attachments/assets/a3c7f573-9975-4c77-bf75-b6787d287a58" />|
| RF-011 | O sistema deve permitir que os administradores adicionem, editem e removam produtos do catálogo. | MÉDIA | Marcelly Giovanna De Souza e Maia | Douglas Henrique de Sousa e Silva |
|  | **Evidência:** <img width="1517" height="650" alt="Captura de tela 2025-10-17 235014" src="https://github.com/user-attachments/assets/1afb6872-42cf-46e1-9557-e048d3c03a9f" />|
| RF-012 | O sistema deve permitir que os administradores gerenciem categorias de produtos. | MÉDIA | Erick Cambraia Nunes | Mateus Salomé Rocha Silva |
|  | **Evidência:** <img width="1869" height="804" alt="Captura de tela 2025-10-17 234822" src="https://github.com/user-attachments/assets/234382d0-49f9-499d-8221-2bc346a19352" />|
| RF-014 | O sistema deve permitir que os usuários deixem avaliações e comentários sobre os produtos. | MÉDIA | Douglas Henrique de Sousa e Silva | Erick Cambraia Nunes |
|  | **Evidência:** <img width="1774" height="505" alt="Captura de tela 2025-10-17 235223" src="https://github.com/user-attachments/assets/c4c78d85-f501-4ff3-863d-4e428595b101" />|

