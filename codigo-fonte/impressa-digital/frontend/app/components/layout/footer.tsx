export default function Footer() {

  return (
    // Mudança de bg-gray-900 para bg-gray-800 para um preto mais claro/cinza escuro
    <footer className="bg-gray-800 text-gray-200 p-8 text-center md:text-left">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        
        {/* Coluna 1: Nome e contato (Mantida alinhada à esquerda no desktop) */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            Gráfica <span className="text-white">Impressa Digital</span>
          </h2>
          <p className="text-sm mb-4">
            Impressões rápidas e qualidade profissional.
          </p>
          <ul className="text-sm space-y-1">

            <li><span className="text-green-400">📍</span> <strong>Endereço:</strong> Av. Vilarinho, 2550 – Minas Caixa</li> 
            <li><span className="text-green-400">📞</span> <strong>Telefone:</strong> (31) 9 9140-7186</li> 
            <li><span className="text-green-400">✉️</span> <strong>E-mail:</strong> <a href="mailto:contato@impressadigital.com.br" className="underline text-white">contato@impressadigital.com.br</a></li>
          </ul>
        </div>

        <div> 
          <h3 className="text-lg font-semibold mb-3">Serviços</h3>
          
          
          <ul className="text-sm space-y-1 list-disc list-inside marker:text-green-400"> 
            <li>Personalizados</li>
            <li>Convite de casamento</li>
            <li>Cartões de visita</li>
            <li>Panfletos</li>
            <li>Banners</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Informações</h3>
          <p className="text-sm mb-2">
            Atendimento via WhatsApp. Pedidos personalizados com orçamento gratuito.
          </p>
          <h3 className="text-lg font-semibold mb-1">Horário</h3>
          <p className="text-sm">
            Segunda a Sexta: 8:30h às 17:30h<br />
            Sábado: 8:30h às 12h
          </p>
        </div>
      </div>

      {/* Linha inferior */}
      {/* Ajustei a borda para border-gray-700 para manter a visibilidade contra o novo fundo */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-sm text-gray-400 text-center">
        © 2025 Gráfica Impressa Digital — Todos os direitos reservados.<br />
      </div>
    </footer>
  );
}