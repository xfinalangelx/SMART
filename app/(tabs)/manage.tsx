import ModuleHub from '@/components/ModuleHub';
import ManageOverview from '@/components/ManageOverview';
import { useAppData } from '@/contexts/AppDataContext';

export default function ManageTab() {
  const { state } = useAppData();
  const language = state?.appData?.settings?.language === 'en' ? 'en' : 'bm';

  return (
    <ModuleHub moduleKey="manage">
      <ManageOverview language={language} />
    </ModuleHub>
  );
}
