import React from "react";

interface OrderCardProps {
  date: string;
  title: string;
  description: string;
  quantity: number;
  productImage: string;
}

const OrderCard: React.FC<OrderCardProps> = ({
  date,
  title,
  description,
  quantity,
  productImage,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <div className="bg-green-600 text-white rounded-t-lg px-4 py-2 font-bold uppercase text-sm">
        PEDIDO REALIZADO
        <div className="text-xs font-normal">{date}</div>
      </div>
      <div className="flex p-4 gap-4">
        <img
          src={productImage}
          alt={title}
          className="w-24 h-24 rounded shadow-sm object-cover"
        />
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-500 text-sm mt-1">{description}</p>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <span className="bg-green-600 text-white rounded-full px-3 py-1 text-xs font-semibold">
              Quantidade: {quantity < 10 ? `0${quantity}` : quantity}
            </span>
            <button className="bg-green-600 text-white text-xs font-semibold px-4 py-1 rounded hover:bg-green-700 transition">
              Avaliar o produto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;