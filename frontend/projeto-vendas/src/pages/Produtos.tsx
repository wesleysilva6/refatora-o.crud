import { useEffect, useState } from "react";
import { api } from "../api";

type Produto = { id:number; nome_produto:string; preco:string|number; quantidade:number };

export default function Produtos() {
  const [items, setItems] = useState<Produto[]>([]);
  useEffect(() => { api.get("/produtos").then(r => setItems(r.data.data ?? r.data)); }, []);
  return (
    <div>
      <h2>Produtos</h2>
      <ul>{items.map(p => <li key={p.id}>{p.nome_produto} — {p.quantidade} — R$ {p.preco}</li>)}</ul>
    </div>
  );
}
