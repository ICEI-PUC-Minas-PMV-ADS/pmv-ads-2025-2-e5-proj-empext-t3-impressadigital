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
#  Testes por Pares

| ID     | Descrição do Requisito | Prioridade | Desenvolvedor | Testador |
|---------|-------------------------|-------------|----------------|-----------|
| RF-001 | O sistema deve permitir que os usuários se cadastrem. | ALTA | Brian Mucio Duarte | Douglas Henrique de Sousa e Silva |
|  | **Evidência:** <img width="792" height="907" alt="Captura de tela 2025-10-17 223653" src="https://github.com/user-attachments/assets/775c89a7-7d5a-401b-83ac-f09e94305d1c" /> |
| RF-002 | O sistema deve separar os produtos por categoria. | MÉDIA | Douglas Henrique de Sousa e Silva | Luiza Maria da Silva Machado |
|  | **Evidência:** [link da imagem](URL_DA_IMAGEM_AQUI) |
| RF-003 | O sistema deve permitir que os usuários adicionem produtos ao carrinho de compras. | BAIXA | Luiza Maria da Silva Machado | Mateus Salomé Rocha Silva |
|  | **Evidência:** [link da imagem](URL_DA_IMAGEM_AQUI) |
| RF-004 | O sistema deve permitir que os usuários finalizem a compra clicando em um botão "Finalizar no WhatsApp". | ALTA | Mateus Salomé Rocha Silva | Marcelly Giovanna De Souza e Maia |
|  | **Evidência:** [link da imagem](URL_DA_IMAGEM_AQUI) |
| RF-005 | O sistema deve realizar um cálculo do frete de envio da compra. | MÉDIA | Marcelly Giovanna De Souza e Maia | Erick Cambraia Nunes |
|  | **Evidência:** [link da imagem](URL_DA_IMAGEM_AQUI) |
| RF-006 | O sistema deve trazer resultados de busca personalizados pelo nome ou categoria do produto. | MÉDIA | Erick Cambraia Nunes | Brian Mucio Duarte |
|  | **Evidência:** [link da imagem](URL_DA_IMAGEM_AQUI) |
| RF-007 | O sistema deve permitir que os administradores visualizem e gerenciem pedidos realizados pelos clientes. | MÉDIA | Brian Mucio Duarte | Luiza Maria da Silva Machado |
|  | **Evidência:** [link da imagem](URL_DA_IMAGEM_AQUI) |
| RF-008 | O sistema deve permitir que os usuários removam produtos do carrinho ou alterem a quantidade. | BAIXA | Douglas Henrique de Sousa e Silva | Marcelly Giovanna De Souza e Maia |
|  | **Evidência:** [link da imagem](URL_DA_IMAGEM_AQUI) |
| RF-009 | O sistema deve permitir que os usuários façam login com suas credenciais. | ALTA | Luiza Maria da Silva Machado | Erick Cambraia Nunes |
|  | **Evidência:** [link da imagem](URL_DA_IMAGEM_AQUI) |
| RF-010 | O sistema deve exibir detalhes do produto, incluindo imagens, descrições e preços. | ALTA | Mateus Salomé Rocha Silva | Brian Mucio Duarte |
|  | **Evidência:** [link da imagem](URL_DA_IMAGEM_AQUI) |
| RF-011 | O sistema deve permitir que os administradores adicionem, editem e removam produtos do catálogo. | MÉDIA | Marcelly Giovanna De Souza e Maia | Douglas Henrique de Sousa e Silva |
|  | **Evidência:** [link da imagem](URL_DA_IMAGEM_AQUI) |
| RF-012 | O sistema deve permitir que os administradores gerenciem categorias de produtos. | MÉDIA | Erick Cambraia Nunes | Mateus Salomé Rocha Silva |
|  | **Evidência:** [link da imagem](URL_DA_IMAGEM_AQUI) |
| RF-013 | O sistema deve permitir que os usuários cadastrados realizem o login. | ALTA | Brian Mucio Duarte | Marcelly Giovanna De Souza e Maia |
|  | **Evidência:** [link da imagem](URL_DA_IMAGEM_AQUI) |
| RF-014 | O sistema deve permitir que os usuários deixem avaliações e comentários sobre os produtos. | MÉDIA | Douglas Henrique de Sousa e Silva | Erick Cambraia Nunes |
|  | **Evidência:** [link da imagem](URL_DA_IMAGEM_AQUI) |


# Testes – Empressa Digital

Casos de testes utilizados na realização da verificação e validação da aplicação.

### Tipo de Teste
- **Sucesso**: Tem o objetivo de verificar se as funcionalidades funcionam corretamente.
- **Insucesso**: Tem o objetivo de verificar se o sistema trata erros de maneira correta.

### Casos de Teste de Sucesso

<table>
  <tr>
    <th colspan="2" width="1000">CT-001 - S<br>Login com credenciais válidas</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se um usuário pode fazer login com sucesso utilizando credenciais válidas.</td>
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
    <td>RF-013: Permitir o login do usuário cadastrado.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Abrir a aplicação.<br>
      2. Inserir um email válido.<br>
      3. Inserir uma senha válida.<br>
      4. Clicar no botão "Entrar".
      </td>
  </tr>
    <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>Email:</strong> Colocar um email cadastrado<br>
      - <strong>Senha:</strong> Colocar valor de senha válida
  </tr>
    <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve redirecionar o usuário para a página inicial do aplicativo após o login bem-sucedido.</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-002 - S<br>Cadastrar Usuário</th>
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
    <td>RF-001: Permitir o cadastro do usuário.</td>
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

### SUCESSO

### ETAPA 2  
<table>
  <tr>
    <th colspan="2" width="1000">CT-001 - I01<br>Login com credenciais inválidas</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica o tratamento de credenciais inválidas no login.</td>
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
    <td>RF-013: O funcionário não conseguirá logar no aplicativo</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Abrir a aplicação.<br>
      2. Inserir o email inválido.<br>
      3. Inserir a senha inválida.<br>
      4. Clicar no botão "Login".
      </td>
  </tr>
    <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>Email:</strong> Colocar email não cadastrado<br>
      - <strong>Senha:</strong> Colocar senha inválida
  </tr>
    <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve apresentar a mensagem de login inválido.</td>
  </tr>
</table>

### SUCESSO
 <video src="https://github.com/user-attachments/assets/017b5017-8164-4887-8bdd-785413ad27f1" width="600" controls>


### ETAPA 3
Criar casos de teste da etapa 3

### ETAPA 4
Criar casos de teste da etapa 4
 
# Evidências de Testes de Software

Apresente imagens e/ou vídeos que comprovam que um determinado teste foi executado, e o resultado esperado foi obtido. Normalmente são screenshots de telas, ou vídeos do software em funcionamento.

## Parte 1 - Testes de desenvolvimento
Cada funcionalidade desenvolvida deve ser testada pelo próprio desenvolvedor, utilizando casos de teste, tanto de sucesso quanto de insucesso, elaborados por ele. Todos os testes devem ser evidenciados.

### Exemplo
### ETAPA 2
<table>
  <tr>
    <th colspan="6" width="1000">CT-001<br>Login com credenciais válidas</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">O sistema deve redirecionar o usuário para a página inicial do aplicativo após o login bem-sucedido.</td>
  </tr>
    <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">José da Silva </td>
     <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">08/05/2024</td>
  </tr>
    <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">O sistema está permitindo o login corretamente.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><video src="https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-1-e5-proj-time-sheet/assets/82043220/2e3c1722-7adc-4bd4-8b4c-3abe9ddc1b48"/></td>
  </tr>
</table>

### ETAPA 3
Colocar evidências de teste da etapa 3

### ETAPA 4
Colocar evidências de teste da etapa 4

## Parte 2 - Testes por pares
A fim de aumentar a qualidade da aplicação desenvolvida, cada funcionalidade deve ser testada por um colega e os testes devem ser evidenciados. O colega "Tester" deve utilizar o caso de teste criado pelo desenvolvedor responsável pela funcionalidade (desenvolveu a funcionalidade e criou o caso de testes descrito no plano de testes) e caso perceba a necessidade de outros casos de teste, deve acrescentá-los na sessão "Plano de Testes".

### ETAPA 2

### Exemplo
<table>
  <tr>
    <th colspan="6" width="1000">CT-001<br>Login com credenciais válidas</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">O sistema deve redirecionar o usuário para a página inicial do aplicativo após o login bem-sucedido.</td>
  </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade</strong></td>
    <td width="430">José da Silva </td>
      <td><strong>Responsável pelo teste</strong></td>
    <td width="430">Maria Oliveira </td>
     <td width="100"><strong>Data do teste</strong></td>
    <td width="150">08/05/2024</td>
  </tr>
    <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">O sistema está permitindo o login corretamente.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><video src="https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2024-1-e5-proj-time-sheet/assets/82043220/2e3c1722-7adc-4bd4-8b4c-3abe9ddc1b48"/></td>
  </tr>
</table>

### ETAPA 3
Colocar evidências de teste da etapa 3

### ETAPA 4
Colocar evidências de teste da etapa 4

