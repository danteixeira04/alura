import { Card } from '../../components/molecules/Card';
import { HomeTemplate } from '../../components/templates/HomeTemplate';

export function Home() {
  return (
    <HomeTemplate
      header={
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Code Connect
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Monorepo pnpm — frontend com Atomic Design + Tailwind.
          </p>
        </div>
      }
    >
      <Card
        title="Primeiro Card"
        description="Exemplo de molécula renderizada dentro de um template."
        actionLabel="Ver mais"
        onAction={() => window.alert('ação do card')}
      />
    </HomeTemplate>
  );
}

export default Home;