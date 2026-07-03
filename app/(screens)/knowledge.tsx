import ModuleHub from '@/components/ModuleHub';
import data from '@/utils/data';

export default function KnowledgeScreen() {
  return <ModuleHub moduleKey="learn" items={data.knowledgeList} showBack />;
}
