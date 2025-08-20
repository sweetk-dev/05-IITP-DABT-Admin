import { ReactNode } from 'react';

interface CardListBodyProps<Item> {
  items: Item[];
  renderItem: (item: Item) => ReactNode;
}

export default function CardListBody<Item>({ items, renderItem }: CardListBodyProps<Item>) {
  return (
    <div>
      {items.map((item, idx) => (
        <div key={(item as any).id || idx}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}


