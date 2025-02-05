import dynamic from 'next/dynamic';

const ColoredGrid = dynamic(() => import('@/components/ColoredGrid'), {
  ssr: true
});

export default function Home() {
  return (
    <main>
      <ColoredGrid />
    </main>
  );
}
