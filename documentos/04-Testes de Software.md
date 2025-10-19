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

<table>
<tr><th colspan="6" width="1000">RF-001<br>O sistema deve permitir que os usuários se cadastrem.</th></tr>
<tr>
<td width="170"><strong>Critérios de êxito</strong></td>
<td colspan="5">- O usuário deve conseguir preencher o formulário de cadastro.<br>- O sistema deve salvar os dados e exibir mensagem de sucesso.</td>
</tr>
<tr>
<td><strong>Responsável pela funcionalidade</strong></td><td width="430">Brian Mucio Duarte</td>
<td><strong>Responsável pelo teste</strong></td><td width="430">Douglas Henrique de Sousa e Silva</td>
<td><strong>Prioridade</strong></td><td>ALTA</td>
</tr>
<tr><td colspan="6" align="center"><strong>Evidência</strong></td></tr>
<tr><td colspan="6" align="center"><img width="792" height="907" alt="image" src="https://github.com/user-attachments/assets/775c89a7-7d5a-401b-83ac-f09e94305d1c" /></td></tr>
</table>

<table>
<tr><th colspan="6" width="1000">RF-002<br>O sistema deve separar os produtos por categoria.</th></tr>
<tr>
<td width="170"><strong>Critérios de êxito</strong></td>
<td colspan="5">- Os produtos devem aparecer agrupados por categoria.<br>- As categorias devem ser exibidas corretamente no frontend.</td>
</tr>
<tr>
<td><strong>Responsável pela funcionalidade</strong></td><td>Douglas Henrique de Sousa e Silva</td>
<td><strong>Responsável pelo teste</strong></td><td>Luiza Maria da Silva Machado</td>
<td><strong>Prioridade</strong></td><td>MÉDIA</td>
</tr>
<tr><td colspan="6" align="center"><strong>Evidência</strong></td></tr>
<tr><td colspan="6" align="center"><img width="1818" height="511" src="https://github.com/user-attachments/assets/9dcc44ce-3f9e-449f-89fc-f9ba85fe9a4c" /></td></tr>
</table>

<table>
<tr><th colspan="6">RF-003<br>O sistema deve permitir que os usuários adicionem produtos ao carrinho de compras.</th></tr>
<tr>
<td><strong>Critérios de êxito</strong></td><td colspan="5">- O botão “Adicionar ao carrinho” deve funcionar corretamente.<br>- O produto deve aparecer na lista do carrinho.</td>
</tr>
<tr>
<td><strong>Responsável pela funcionalidade</strong></td><td>Luiza Maria da Silva Machado</td>
<td><strong>Responsável pelo teste</strong></td><td>Mateus Salomé Rocha Silva</td>
<td><strong>Prioridade</strong></td><td>BAIXA</td>
</tr>
<tr><td colspan="6" align="center"><strong>Evidência</strong></td></tr>
<tr><td colspan="6" align="center"><img width="1798" height="864" src="https://github.com/user-attachments/assets/30dcbc10-8d13-4af6-828b-213b21b2d86d" /></td></tr>
</table>

<table>
<tr><th colspan="6">RF-004<br>O sistema deve permitir que os usuários finalizem a compra clicando em um botão "Finalizar no WhatsApp".</th></tr>
<tr>
<td><strong>Critérios de êxito</strong></td><td colspan="5">- O botão deve redirecionar para o WhatsApp com a mensagem automática do pedido.<br>- A mensagem deve conter informações do produto e valor total.</td>
</tr>
<tr>
<td><strong>Responsável pela funcionalidade</strong></td><td>Erick Cambraia Nunes</td>
<td><strong>Responsável pelo teste</strong></td><td>Marcelly Giovanna De Souza e Maia</td>
<td><strong>Prioridade</strong></td><td>ALTA</td>
</tr>
<tr><td colspan="6" align="center"><strong>Evidência</strong></td></tr>
<tr><td colspan="6" align="center"><img width="1118" height="762" src="https://github.com/user-attachments/assets/e340ada7-b2f0-4fa0-8beb-d2eba8853a8d" /></td></tr>
</table>

<table>
<tr><th colspan="6">RF-005<br>O sistema deve realizar um cálculo do frete de envio da compra.</th></tr>
<tr>
<td><strong>Critérios de êxito</strong></td><td colspan="5">- O sistema deve calcular o valor do frete automaticamente.<br>- O valor deve variar conforme o CEP informado.</td>
</tr>
<tr>
<td><strong>Responsável pela funcionalidade</strong></td><td>Marcelly Giovanna De Souza e Maia</td>
<td><strong>Responsável pelo teste</strong></td><td>Erick Cambraia Nunes</td>
<td><strong>Prioridade</strong></td><td>MÉDIA</td>
</tr>
<tr><td colspan="6" align="center"><strong>Evidência</strong></td></tr>
<tr><td colspan="6" align="center"><img width="1810" height="535" src="https://github.com/user-attachments/assets/4fe012e8-3e90-4750-a087-8e44735575cc" /></td></tr>
</table>

<table>
<tr><th colspan="6">RF-006<br>O sistema deve trazer resultados de busca personalizados pelo nome ou categoria do produto.</th></tr>
<tr>
<td><strong>Critérios de êxito</strong></td><td colspan="5">- A busca deve filtrar corretamente os produtos.<br>- Deve aceitar nome parcial e categoria.</td>
</tr>
<tr>
<td><strong>Responsável pela funcionalidade</strong></td><td>Erick Cambraia Nunes</td>
<td><strong>Responsável pelo teste</strong></td><td>Brian Mucio Duarte</td>
<td><strong>Prioridade</strong></td><td>MÉDIA</td>
</tr>
<tr><td colspan="6" align="center"><strong>Evidência</strong></td></tr>
<tr><td colspan="6" align="center"><img width="1638" height="432" src="https://github.com/user-attachments/assets/449c7866-16dc-4577-bd94-670997fb3f48" /></td></tr>
</table>

<table>
<tr><th colspan="6">RF-007<br>O sistema deve permitir que os administradores visualizem e gerenciem pedidos realizados pelos clientes.</th></tr>
<tr>
<td><strong>Critérios de êxito</strong></td><td colspan="5">- O administrador deve ver a lista de pedidos.<br>- Deve poder alterar o status e visualizar detalhes.</td>
</tr>
<tr>
<td><strong>Responsável pela funcionalidade</strong></td><td>Brian Mucio Duarte</td>
<td><strong>Responsável pelo teste</strong></td><td>Luiza Maria da Silva Machado</td>
<td><strong>Prioridade</strong></td><td>MÉDIA</td>
</tr>
<tr><td colspan="6" align="center"><strong>Evidência</strong></td></tr>
<tr><td colspan="6" align="center"><img width="1498" height="834" src="https://github.com/user-attachments/assets/cb057dbb-ed82-4aab-830e-bd7ff78b1dc2" /></td></tr>
</table>

<table>
<tr><th colspan="6">RF-008<br>O sistema deve permitir que os usuários removam produtos do carrinho ou alterem a quantidade.</th></tr>
<tr>
<td><strong>Critérios de êxito</strong></td><td colspan="5">- O usuário deve conseguir excluir ou atualizar a quantidade.<br>- O preço total deve atualizar automaticamente.</td>
</tr>
<tr>
<td><strong>Responsável pela funcionalidade</strong></td><td>Douglas Henrique de Sousa e Silva</td>
<td><strong>Responsável pelo teste</strong></td><td>Marcelly Giovanna De Souza e Maia</td>
<td><strong>Prioridade</strong></td><td>BAIXA</td>
</tr>
<tr><td colspan="6" align="center"><strong>Evidência</strong></td></tr>
<tr><td colspan="6" align="center"><img width="1498" height="834" src="https://github.com/user-attachments/assets/cb057dbb-ed82-4aab-830e-bd7ff78b1dc2" /></td></tr>
</table>

<table>
<tr><th colspan="6">RF-009<br>O sistema deve permitir que os usuários façam login com suas credenciais.</th></tr>
<tr>
<td><strong>Critérios de êxito</strong></td><td colspan="5">- O login deve validar email e senha.<br>- O sistema deve permitir acesso após autenticação.</td>
</tr>
<tr>
<td><strong>Responsável pela funcionalidade</strong></td><td>Luiza Maria da Silva Machado</td>
<td><strong>Responsável pelo teste</strong></td><td>Erick Cambraia Nunes</td>
<td><strong>Prioridade</strong></td><td>ALTA</td>
</tr>
<tr><td colspan="6" align="center"><strong>Evidência</strong></td></tr>
<tr><td colspan="6" align="center"><img width="1570" height="681" src="https://github.com/user-attachments/assets/0e1aae52-442a-4c8b-b6d3-1e5351be3c16" /></td></tr>
</table>

<table>
<tr><th colspan="6">RF-010<br>O sistema deve exibir detalhes do produto, incluindo imagens, descrições e preços.</th></tr>
<tr>
<td><strong>Critérios de êxito</strong></td><td colspan="5">- Ao clicar em um produto, o sistema deve exibir detalhes completos.<br>- As imagens e descrições devem corresponder ao produto selecionado.</td>
</tr>
<tr>
<td><strong>Responsável pela funcionalidade</strong></td><td>Mateus Salomé Rocha Silva</td>
<td><strong>Responsável pelo teste</strong></td><td>Brian Mucio Duarte</td>
<td><strong>Prioridade</strong></td><td>ALTA</td>
</tr>
<tr><td colspan="6" align="center"><strong>Evidência</strong></td></tr>
<tr><td colspan="6" align="center"><img width="1587" height="809" src="https://github.com/user-attachments/assets/a3c7f573-9975-4c77-bf75-b6787d287a58" /></td></tr>
</table>

<table>
<tr><th colspan="6">RF-011<br>O sistema deve permitir que os administradores adicionem, editem e removam produtos do catálogo.</th></tr>
<tr>
<td><strong>Critérios de êxito</strong></td><td colspan="5">- O administrador deve conseguir incluir, editar e excluir produtos.<br>- As alterações devem refletir no catálogo principal.</td>
</tr>
<tr>
<td><strong>Responsável pela funcionalidade</strong></td><td>Marcelly Giovanna De Souza e Maia</td>
<td><strong>Responsável pelo teste</strong></td><td>Douglas Henrique de Sousa e Silva</td>
<td><strong>Prioridade</strong></td><td>MÉDIA</td>
</tr>
<tr><td colspan="6" align="center"><strong>Evidência</strong></td></tr>
<tr><td colspan="6" align="center"><img width="1517" height="650" src="https://github.com/user-attachments/assets/1afb6872-42cf-46e1-9557-e048d3c03a9f" /></td></tr>
</table>

<table>
<tr><th colspan="6">RF-012<br>O sistema deve permitir que os administradores gerenciem categorias de produtos.</th></tr>
<tr>
<td><strong>Critérios de êxito</strong></td><td colspan="5">- Deve ser possível criar, editar e excluir categorias.<br>- As alterações devem atualizar os produtos relacionados.</td>
</tr>
<tr>
<td><strong>Responsável pela funcionalidade</strong></td><td>Mateus Salomé Rocha Silva</td>
<td><strong>Responsável pelo teste</strong></td><td>Erick Cambraia Nunes</td>
<td><strong>Prioridade</strong></td><td>MÉDIA</td>
</tr>
<tr><td colspan="6" align="center"><strong>Evidência</strong></td></tr>
<tr><td colspan="6" align="center"><img width="1869" height="804" src="https://github.com/user-attachments/assets/234382d0-49f9-499d-8221-2bc346a19352" /></td></tr>
</table>

<table>
<tr><th colspan="6">RF-014<br>O sistema deve permitir que os usuários deixem avaliações e comentários sobre os produtos.</th></tr>
<tr>
<td><strong>Critérios de êxito</strong></td><td colspan="5">- O usuário deve conseguir enviar uma avaliação e comentário.<br>- As avaliações devem aparecer na página do produto.</td>
</tr>
<tr>
<td><strong>Responsável pela funcionalidade</strong></td><td>Douglas Henrique de Sousa e Silva</td>
<td><strong>Responsável pelo teste</strong></td><td>Mateus Salomé Rocha Silva</td>
<td><strong>Prioridade</strong></td><td>MÉDIA</td>
</tr>
<tr><td colspan="6" align="center"><strong>Evidência</strong></td></tr>
<tr><td colspan="6" align="center"><img width="1774" height="505" src="https://github.com/user-attachments/assets/c4c78d85-f501-4ff3-863d-4e428595b101" /></td></tr>
</table>


# Testes de Sucesso e Insucesso

Casos de teste utilizados para verificar e validar as funcionalidades da aplicação.

### Tipo de Teste
- **Sucesso**: Verifica se a funcionalidade funciona corretamente conforme o esperado.  
- **Insucesso**: Verifica se o sistema trata erros ou situações inesperadas corretamente.

<table>
  <tr>
    <th colspan="2" width="1000">CT-002- S <br>Separar produtos por categoria</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>O sistema deve separar os produtos por categoria.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">Luiza Maria da Silva Machado</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-002: Requisito relacionado ao teste.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      <strong>Como cliente:</strong><br>
      1. Entrar no site.<br>
      2. Escolher uma categoria de produtos.<br>
      3. Selecionar um produto da categoria.<br>
      4. Ver as opções do produto (detalhes, imagens, preço, etc.).<br><br>
      <strong>Como administrador:</strong><br>
      1. Entrar no painel de administração do site.<br>
      2. Acessar a seção de produtos.<br>
      3. Selecionar o produto que deseja editar ou adicionar categoria.<br>
      4. Adicionar a categoria ao produto e salvar as alterações.
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - Categoria existente no sistema<br>
      - Produto existente no sistema
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve apresentar corretamente os produtos filtrados por categoria e permitir que o administrador adicione categorias ao produto.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center">

https://github.com/user-attachments/assets/7273dcfb-1202-456a-8304-d943a66fa8fe

 </td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-002 - I<br>Separar produtos por categoria (Insucesso)</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">Luiza Maria da Silva Machado</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Não se aplica.</td>
  </tr>
</table>

----

<table>
  <tr>
    <th colspan="2" width="1000">CT-003 - S<br>Adicionar produtos ao carrinho de compras</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>O sistema deve permitir que os usuários adicionem produtos ao carrinho de compras.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">Luiza Maria da Silva Machado</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-003: Permitir adicionar produtos ao carrinho de compras.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      <strong>Como cliente:</strong><br>
      1. Entrar no site.<br>
      2. Selecionar um produto.<br>
      3. Adicionar o produto ao carrinho.<br>
      4. Acessar o carrinho para visualizar os itens e o valor total da compra.<br>
      5. Decidir se deseja finalizar a compra ou continuar navegando.<br><br>
      <strong>Como administrador:</strong><br>
      1. Entrar no painel de administração.<br>
      2. Acessar a seção de produtos.<br>
      3. Selecionar o produto que deseja editar.<br>
      4. Adicionar ou alterar categorias do produto e salvar as alterações.
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - Produto existente no sistema<br>
      - Carrinho vazio antes da adição
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve permitir que o usuário adicione produtos ao carrinho, visualizar o total da compra e permitir a finalização ou continuação da compra.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center">

https://github.com/user-attachments/assets/46e217aa-a1a8-4331-b924-70abc2f2a31e

</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-003 - I<br>Adicionar produtos ao carrinho (Insucesso)</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">	Mateus Salomé Rocha Silva</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Não se aplica.</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-004 - S<br>Finalizar compra pelo WhatsApp</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>O sistema deve permitir que os usuários finalizem a compra clicando no botão "Finalizar no WhatsApp".</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">Marcelly Giovanna De Souza e Maia</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-004: Permitir finalizar a compra clicando no botão "Finalizar no WhatsApp".</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Entrar no site e adicionar produtos ao carrinho.<br>
      2. Acessar o carrinho de compras.<br>
      3. Clicar no botão "Finalizar no WhatsApp".<br>
      4. Verificar se o WhatsApp é aberto com a mensagem automática contendo os produtos e valor total.
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - Produtos adicionados no carrinho<br>
      - Valor total calculado corretamente
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>
      - O botão redireciona corretamente para o WhatsApp.<br>
      - A mensagem contém os produtos e o valor total da compra.
    </td>
  </tr>
  <tr>
    <td><strong>Prioridade</strong></td>
    <td>ALTA</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center">
      
 

https://github.com/user-attachments/assets/710f1faf-d1f5-4e2c-9fc9-623d022088ea
   </td>

  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-004 - I<br>Finalizar compra pelo WhatsApp (Insucesso)</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">Marcelly Giovanna De Souza e Maia</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Não se aplica.</td>
  </tr>
  
</table>


<table>
  <tr>
    <th colspan="2" width="1000">CT-005 - S<br>Cálculo do frete de envio</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>O sistema deve realizar corretamente o cálculo do frete de envio da compra, considerando endereço e produtos selecionados.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">Marcelly Giovanna De Souza e Maia</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-005: Calcular corretamente o valor do frete de envio da compra.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Entrar no site e adicionar produtos ao carrinho.<br>
      2. Acessar o carrinho de compras.<br>
      3. Inserir endereço de entrega.<br>
      4. Verificar se o sistema calcula e exibe corretamente o valor do frete.
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - Produtos adicionados no carrinho<br>
      - Endereço de entrega válido
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve apresentar o valor do frete corretamente baseado no endereço e nos produtos selecionados.</td>
  </tr>
  <tr>
    <td colspan="6" align="center">

https://github.com/user-attachments/assets/95fa831b-9eb5-4021-8698-4d3356595e7f

<strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"></td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-005 - I<br>Cálculo do frete de envio (Insucesso)</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">Marcelly Giovanna De Souza e Maia</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Não se aplica.</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-006 - S<br>Visualizar e gerenciar pedidos pelos administradores</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>O sistema deve permitir que os administradores visualizem todos os pedidos realizados pelos clientes e realizem ações de gerenciamento como alterar status ou atualizar informações do pedido.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">Erick Cambraia Nunes</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-006: Administradores devem conseguir gerenciar pedidos de clientes.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Entrar no painel administrativo do site.<br>
      2. Acessar a seção de pedidos.<br>
      3. Visualizar a lista de pedidos realizados pelos clientes.<br>
      4. Selecionar um pedido e alterar status ou atualizar informações conforme necessário.<br>
      5. Salvar as alterações.
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - Pedidos de clientes já realizados no sistema<br>
      - Informações de pedido válidas
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O administrador deve conseguir visualizar todos os pedidos e gerenciá-los corretamente, com alterações refletidas no sistema.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center">

https://github.com/user-attachments/assets/e0f81336-abf7-4c02-82a0-3e20deb3e8db

 </td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-006 - I<br>Visualizar e gerenciar pedidos (Insucesso)</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">Erick Cambraia Nunes</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Não se aplica.</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-007 - S<br>Remover produtos ou alterar quantidade no carrinho</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>O sistema deve permitir que os usuários removam produtos do carrinho ou alterem a quantidade de itens antes de finalizar a compra.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">Brian Múcio Duarte</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-008: Permitir ajustes no carrinho de compras.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Entrar no site.<br>
      2. Adicionar um ou mais produtos ao carrinho.<br>
      3. Abrir o carrinho de compras.<br>
      4. Alterar a quantidade de produtos ou remover algum item.<br>
      5. Verificar se o total do carrinho é atualizado corretamente.
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - Produtos disponíveis no site<br>
      - Quantidade inicial de produtos no carrinho
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve permitir que o usuário altere a quantidade ou remova produtos e atualizar corretamente o valor total do carrinho.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"> 

https://github.com/user-attachments/assets/dc5122c1-20c9-43cf-85e2-fefbfa7c5a43

</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-007 - I<br>Remover produtos ou alterar quantidade no carrinho (Insucesso)</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">Brian Múcio Duarte</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Não se aplica.</td>
  </tr>
</table>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-009 - S<br>Cadastrar Usuário</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se um usuário pode fazer cadastro com sucesso.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">Brian Múcio Duarte</td>
  </tr>
 <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr> 
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-009: Permitir o cadastro do usuário.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Abrir a aplicaçãoo.<br>
      2. Clicar em "Quero fazer parte".<br>
      3. Inserir um nome de usuário.<br>
      4. Inserir a data de nascimento.<br>
      4. Inserir um CPF válido.<br>
      4. Inserir um email.<br>
      4. Inserir uma senha.<br>
      5. Clicar no botão "Cadastre-se".
      </td>
  </tr>
    <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>Nome de usuário:</strong> Inserir um nome de usuário<br>
      - <strong>Data de nascimento:</strong> Inserir uma data de nascimento<br>
      - <strong>CPF:</strong> Inserir um CPF válido<br>
      - <strong>Email:</strong> Inserir um email ainda não cadastrado<br>
      - <strong>Senha:</strong> Inserir uma senha
  </tr>
    <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve redirecionar o usuário para o login do aplicativo após o cadastro bem-sucedido.</td>
  </tr>
<tr>
  <td colspan="6" align="center"><strong>Evidência</strong></td>
</tr>
<tr>
  <td colspan="6" align="center">
    <video src="https://github.com/user-attachments/assets/a5b8d123-b979-4d8a-950f-ea16bfd4b3eb" width="600" controls>
      Seu navegador não suporta a tag de vídeo.
    </video>
  </td>
</tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-010 - S<br>Exibir detalhes do produto</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>O sistema deve exibir corretamente os detalhes de cada produto, incluindo imagens, descrições e preços, quando o usuário acessa a página do item selecionado.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Mateus Salomé Rocha Silva</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-010: O sistema deve exibir detalhes do produto, incluindo imagens, descrições e preços.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar o site.<br>
      2. Escolher uma categoria de produtos.<br>
      3. Selecionar um produto específico.<br>
      4. Verificar se as informações exibidas incluem imagem, descrição e preço.<br>
      5. Confirmar que os dados apresentados estão corretos e completos.
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - Produtos cadastrados no sistema com imagem, descrição e preço.<br>
      - Acesso de usuário comum.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>As informações do produto devem ser exibidas corretamente, sem falhas no carregamento de imagens, textos ou valores.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"> 

https://github.com/user-attachments/assets/6da351aa-7e17-4441-b338-78c5ea0dbddf


  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-010 - I<br>Exibir detalhes do produto (Insucesso)</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Mateus Salomé Rocha Silva</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Não se aplica.</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Não se aplica.</td>
  </tr>
</table>


