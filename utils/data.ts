export type MenuItem = {
  id: number;
  title: string;
  bmTitle: string;
  icon: any;
  navi: string;
  filter: string;
};

export type DataStructure = {
  knowledgeList: MenuItem[];
  analysisList: MenuItem[];
  checklistList: MenuItem[];
  supportList: MenuItem[];
};

const data: DataStructure = {
  knowledgeList: [
    {
      id: 1,
      title: 'Video',
      bmTitle: 'Video',
      icon: require('../assets/img/knowledgeVideoList.png'),
      navi: 'video',
      filter: 'video',
    },
    {
      id: 2,
      title: 'Medication',
      bmTitle: 'Perubatan',
      icon: require('../assets/img/knowledgeMedicationList.png'),
      navi: 'medication',
      filter: 'medication',
    },
    {
      id: 3,
      title: 'Trivia',
      bmTitle: 'Trivia',
      icon: require('../assets/img/knowledgeTriviaList.png'),
      navi: 'trivia',
      filter: 'trivia',
    },
  ],
  analysisList: [
    {
      id: 1,
      title: 'CD4 & Viral Load',
      bmTitle: 'CD4 & Viral Load',
      icon: require('../assets/img/cd4.png'),
      navi: 'cd4-graph',
      filter: 'cd4',
    },
    {
      id: 2,
      title: 'Blood Sugar',
      bmTitle: 'Blood Sugar',
      icon: require('../assets/img/bloodSugar.png'),
      navi: 'blood-sugar-graph',
      filter: 'blood',
    },
    {
      id: 3,
      title: 'Renal Profile',
      bmTitle: 'Renal Profile',
      icon: require('../assets/img/renalProfile.png'),
      navi: 'renal-graph',
      filter: 'renal',
    },
    {
      id: 4,
      title: 'Lipid Profile',
      bmTitle: 'Lipid Profile',
      icon: require('../assets/img/lipidProfile.png'),
      navi: 'lipid-graph',
      filter: 'lipid',
    },
  ],
  checklistList: [
    {
      id: 1,
      title: 'All Checklist',
      bmTitle: 'Semua Senarai',
      icon: require('../assets/img/allChecklist.png'),
      navi: 'all-checklist',
      filter: 'all',
    },
    {
      id: 2,
      title: 'Vaccination',
      bmTitle: 'Vaksin',
      icon: require('../assets/img/vaccination.png'),
      navi: 'vaccination',
      filter: 'vaccine',
    },
    {
      id: 3,
      title: 'Blood Test',
      bmTitle: 'Ujian Darah',
      icon: require('../assets/img/bloodTest.png'),
      navi: 'blood-test',
      filter: 'blood',
    },
    {
      id: 4,
      title: 'Appointment',
      bmTitle: 'Temu Janji',
      icon: require('../assets/img/appointment.png'),
      navi: 'appointments',
      filter: 'appt',
    },
    {
      id: 5,
      title: 'Journal',
      bmTitle: 'Jurnal',
      icon: require('../assets/img/journal.png'),
      navi: 'journal',
      filter: 'journal',
    },
  ],
  supportList: [
    {
      id: 1,
      title: 'Organizations',
      bmTitle: 'Organisasi',
      icon: require('../assets/img/LatestUpdates.png'),
      navi: 'organizations',
      filter: 'organization',
    },
    {
      id: 3,
      title: 'Websites',
      bmTitle: 'Laman Web',
      icon: require('../assets/img/webIcon.png'),
      navi: 'websites',
      filter: 'organization',
    },
    {
      id: 4,
      title: 'List of Hospitals',
      bmTitle: 'Senarai Hospital',
      icon: require('../assets/img/hospitalIcon.png'),
      navi: 'hospitals',
      filter: 'directory',
    },
    {
      id: 5,
      title: 'List of Clinics',
      bmTitle: 'Senarai Klinik',
      icon: require('../assets/img/clinicIcon.png'),
      navi: 'clinics',
      filter: 'directory',
    },
    {
      id: 6,
      title: 'Other Applications',
      bmTitle: 'Aplikasi Lain-lain',
      icon: require('../assets/img/appIcon.png'),
      navi: 'apps',
      filter: 'directory',
    },
  ],
};

export default data;
