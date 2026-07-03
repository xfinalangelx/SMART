import { TriviaQuestion } from './questions';

const initQuestions: TriviaQuestion[] = [
  {
    id: 1,
    question: "Ubat-ubatan herba dapat digunakan untuk mengubati HIV.",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
    explanation:
      "Adakah ubat herba dapat menyembuhkan HIV? Tidak. Sebilangan orang memilih untuk mengambil bentuk ubat alternatif, seperti ubat-ubatan herba, sebagai cara semula jadi untuk HIV. Walau bagaimanapun, ubat herba adalah tidak berkesan untuk mengubati HIV. Pengambilan ubatan herba boleh membahayakan individu tersebut, kerana ubatan herba tidak melindungi sistem imun anda dari jangkitan. Ubatan herba juga mungkin mengurangkan keberkesanan antiretroviral. Salah satu cara untuk kekal sihat dengan HIV adalah dengan mengambil rawatan antiretroviral seperti yang dipreskrib oleh doktor anda dan menghadiri temu janji untuk memantau viral load untuk memastikan rawatan anda berkesan.",
  },
  {
    id: 2,
    question:
      "Anda boleh dijangkiti HIV daripada menyentuh, mencium, memeluk atau berjabat tangan dengan individu yang menghidapi HIV",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
    explanation:
      "Anda tidak boleh mendapat HIV daripada menyentuh seseorang, memeluknya atau berjabat tangan dengan individu yang dijangkiti HIV. Terdapat sebilangan kecil virus HIV di dalam air liur seseorang yang dijangkiti HIV. Namun, HIV tidak boleh ditularkan daripada mencium individu yang di jangkiti HIV.",
  },
  {
    id: 3,
    question:
      "HIV boleh menular melalui peluh, air mata, air kencing atau najis orang yang di jangkiti HIV",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
    explanation:
      "HIV tidak terdapat dalam peluh, air mata, air kencing atau najis dalam jumlah yang boleh menjangkiti orang lain. HIV hanya boleh ditularkan melalui cecair badan tertentu — darah, air mani, cecair faraj dan rektum, serta susu ibu — jadi anda tidak boleh dijangkiti HIV melalui cecair badan yang lain ini.",
  },
  {
    id: 4,
    question:
      "Anda boleh mendapat HIV dari kolam renang, kawasan mandi, mencuci pakaian",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
    explanation:
      "Virus HIV tidak boleh hidup di dalam air, jadi anda tidak boleh mendapat HIV dari kolam renang, kawasan mandi, mencuci pakaian atau dari air minum.",
  },
  {
    id: 5,
    question: "Anda boleh dijangkiti HIV melalui gigitan nyamuk ataupun haiwan",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
    explanation:
      "Anda tidak boleh dijangkiti HIV dari serangga. Apabila seekor serangga (seperti nyamuk) menggigit anda, ia hanya menghisap darah anda - ia tidak menyuntik darah orang yang sebelum itu. HIV adalah singkatan untuk Human Immunodeficiency Virus, yang bermaksud bahawa jangkitan hanya dapat dijangkiti di antara manusia.",
  },
  {
    id: 6,
    question:
      "Setiap orang akan mengalami simptom seperti selesema (sindrom retroviral akut) dalam masa 2-4 minggu selepas dijangkiti HIV",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
    explanation:
      "Tidak semua orang mempunyai simptom apabila dijangkiti HIV. Ramai orang mempunyai simptom seperti selesema, dipanggil sindrom retroviral akut (ARS) atau jangkitan HIV primer, dalam tempoh 2 hingga 4 minggu selepas dijangkiti HIV. Gejala seperti selesema ini mungkin termasuk demam, kelenjar bengkak, sakit tekak, ruam, keletihan, sakit otot dan sendi, dan sakit kepala. Gejala mungkin berlarutan beberapa hari hingga beberapa minggu. Walau bagaimanapun, gejala ini menyerupai banyak jangkitan lain, jadi, satu-satunya cara untuk mengetahui dengan pasti jika anda dijangkiti HIV adalah dengan menjalani ujian.",
  },
  {
    id: 7,
    question: "Adalah senang untuk mengetahui simptom HIV",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
    explanation:
      "Gejala HIV berbeza untuk setiap orang, sesetengah orang mungkin tidak mendapat sebarang gejala. Namun, tanpa rawatan, virus HIV akan merosakkan sistem imun individu tersebut. Adalah tidak mungkin untuk mengetahui sekiranya seseorang menghidapi HIV dengan melihat mereka. Ramai individu yang dijangkiti HIV tidak menunjukkan sebarang tanda-tanda ataupun gejala. Individu HIV positif yang menerima rawatan yang berkesan, boleh menjalani kehidupan yang sihat seperti orang lain.",
  },
  {
    id: 8,
    question:
      "Saya positif HIV dan begitu juga pasangan saya jadi kami tidak perlu risau tentang HIV",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
    explanation:
      "Terdapat banyak jenis strain virus HIV. Jika anda dan pasangan anda hidup dengan HIV, anda mungkin mempunyai strain HIV yang berbeza dan oleh itu, anda masih perlu melindungi satu sama lain daripada jangkitan HIV. Jika anda dijangkiti dua atau lebih jenis strain HIV ia boleh menjejaskan keberkesanaan rawatan anda. Jika anda sedang menjalani rawatan yang berkesan dan pakar perubatan telah mengesahkan viral load anda tidak dapat dikesan, anda tidak akan menularkan HIV melalui hubungan seks.",
  },
  {
    id: 9,
    question:
      "Anda tidak boleh dijangkiti HIV daripada berkongsi tempat duduk tandas, meja, tombol pintu, kutleri atau tuala",
    options: ["Mitos", "Fakta"],
    answer: "Fakta",
    explanation:
      "Anda tidak boleh dijangkiti HIV daripada tempat duduk tandas, meja, tombol pintu, kutleri atau berkongsi tuala. HIV hanya boleh ditularkan melalui cecair badan tertentu, jadi barangan harian ini tidak boleh menyebarkan HIV.",
  },
  {
    id: 10,
    question: "HIV hanya berisiko untuk kumpulan orang tertentu",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
    explanation:
      "Seperti kebanyakan penyakit, HIV tidak mendiskriminasikan antara jenis orang dan jangkitan itu boleh ditularkan kepada sesiapa sahaja. Sesetengah orang lebih terdedah kepada jangkitan HIV jika mereka kerap melakukan aktiviti tertentu (contohnya menyuntik dadah) mereka lebih berkemungkinan mendapat atau menjangkiti virus HIV. Walau bagaimanapun, adalah TIDAK BENAR bahawa HIV hanya menjejaskan kumpulan tertentu.",
  },
  {
    id: 11,
    question:
      "Jika cecair badan daripada individu yang dijangkiti HIV masuk ke dalam badan saya, saya pasti akan mendapat HIV",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
    explanation:
      "HIV tidak selalu ditularkan daripada seseorang yang hidup dengan HIV. Terdapat banyak sebab mengapa ini berlaku. Sebagai contoh, jika individu HIV positif menjalani rawatan yang berkesan, ia akan mengurangkan jumlah virus HIV dalam badan mereka. Jika doktor mengesahkan bahawa virus itu telah mencapai tahap yang tidak dapat dikesan bermakna tiada risiko untuk menularkan HIV. Jika anda bimbang bahawa anda telah terdedah kepada HIV, sila berjumpa dengan doktor anda. Anda mungkin layak untuk mengambil profilaksis selepas pendedahan (PEP), yang menghalang virus daripada menjadi jangkitan. Walau bagaimanapun PEP tidak tersedia di mana-mana dan perlu diambil dalam masa 72 jam dari kemungkinan pendedahan untuk menjadi berkesan",
  },
  {
    id: 12,
    question: "TIADA penawar untuk HIV",
    options: ["Mitos", "Fakta"],
    answer: "Fakta",
    explanation:
      "Tiada ubat yang boleh menyembuhkan jangkitan HIV, tetapi pengambilan ubat antiretroviral boleh membantu mengawal virus HIV dan melindungi sistem imun anda, dan menghalang HIV daripada menjadi AIDS.",
  },
  {
    id: 13,
    question: "Tidak dapat dikesan = Tidak boleh ditularkan (U+U)",
    options: ["Mitos", "Fakta"],
    answer: "Fakta",
    explanation:
      "Jikalau doktor anda telah mengesahkan bahawa seseorang yang hidup dengan HIV mempunyai longokkan virus (viral load) yang tidak dapat dikesan oleh itu, tiada risiko penularan. Longokkan virus (viral load) yang tidak dapat dikesan = rawatan yang diterima berkesan dan telah mengurangkan jumlah virus dalam darah mereka supaya ia tidak dapat dikesan melalui ujian darah)",
  },
  {
    id: 14,
    question:
      "HIV tidak boleh berjangkit melalui perkongsian makanan, minuman, peralatan memasak, batuk, bersin atau meludah",
    options: ["Mitos", "Fakta"],
    answer: "Fakta",
    explanation:
      "HIV tidak boleh hidup dalam udara, oleh itu, anda tidak boleh dijangkiti HIV daripada berkongsi ruang dengan orang yang hidup dengan HIV. Contoh perkongsian ruang = berkongsi minuman makanan, peralatan memasak dan kutleri, tandas, tuala, air liur, batuk, bersin atau meludah. HIV juga tidak boleh disebarkan jikalau orang yang menyediakan makanan anda hidup dengan HIV.",
  },
  {
    id: 15,
    question:
      "Anda boleh dijangkiti HIV daripada menggunakan jarum yang tidak disterilkan untuk tatu dan tindikan",
    options: ["Mitos", "Fakta"],
    answer: "Fakta",
    explanation:
      "Anda berisiko untuk dijangkiti HIV jika jarum yang digunakan telah digunakan untuk individu yang hidup dengan HIV dan tidak disterilkan sebelum digunakkan untuk anda. Walau bagaimanapun, pengamal tatu dan menindik dikehendaki oleh undang-undang untuk menggunakan jarum baharu untuk setiap pelanggan yang baru.",
  },
  {
    id: 16,
    question: "Risiko untuk dijangkiti HIV melalui seks oral adalah rendah",
    options: ["Mitos", "Fakta"],
    answer: "Fakta",
    explanation:
      "Risiko HIV daripada seks oral adalah sangat kecil melainkan anda atau pasangan anda mempunyai luka terbuka yang besar pada bahagian kemaluan atau gusi yang luka atau berdarah di dalam mulut anda.",
  },
  {
    id: 17,
    question: "Mengambil ubat HIV (ART) setiap hari seperti yang dipreskrib adalah penting",
    options: ["Mitos", "Fakta"],
    answer: "Fakta",
    explanation:
      "Mengambil terapi antiretroviral (ART) tepat seperti yang dipreskrib, setiap hari, mengekalkan jumlah virus dalam badan anda pada tahap rendah dan melindungi sistem imun anda. Terlepas dos boleh membenarkan virus membiak dan menjadi rintang kepada ubat, yang menyukarkan rawatan. Kepatuhan yang baik adalah perkara paling penting yang anda boleh lakukan untuk kekal sihat.",
  },
  {
    id: 18,
    question: "Seseorang yang hidup dengan HIV yang menjalani rawatan berkesan boleh hidup panjang dan sihat",
    options: ["Mitos", "Fakta"],
    answer: "Fakta",
    explanation:
      "Dengan rawatan antiretroviral yang berkesan, individu yang hidup dengan HIV boleh menjangkakan jangka hayat yang hampir normal. Rawatan moden mengawal virus, melindungi sistem imun, dan membolehkan seseorang bekerja, menjalin hubungan dan berkeluarga, serta menjalani kehidupan yang penuh.",
  },
  {
    id: 19,
    question: "Ibu yang hidup dengan HIV pasti akan menularkan HIV kepada bayinya",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
    explanation:
      "Dengan penjagaan yang betul, risiko penularan HIV daripada ibu kepada bayi boleh dikurangkan kepada kurang daripada 1%. Ini termasuk mengambil rawatan antiretroviral semasa mengandung, penjagaan bersalin yang sesuai, ubat untuk bayi selepas lahir, dan mengikut nasihat perubatan mengenai pemberian susu. Bincang dengan penyedia penjagaan kesihatan anda tentang merancang kehamilan.",
  },
  {
    id: 20,
    question: "PrEP (profilaksis pra-pendedahan) boleh membantu individu HIV-negatif mengelak jangkitan HIV",
    options: ["Mitos", "Fakta"],
    answer: "Fakta",
    explanation:
      "PrEP ialah ubat yang diambil oleh individu HIV-negatif untuk mengurangkan risiko dijangkiti HIV dengan ketara. Apabila diambil seperti yang dipreskrib, ia sangat berkesan. PrEP tidak melindungi daripada jangkitan seksual yang lain, jadi kondom masih disyorkan. Berbincang dengan penyedia penjagaan kesihatan untuk mengetahui sama ada PrEP sesuai dan tersedia untuk anda.",
  },
  {
    id: 21,
    question: "HIV dan AIDS adalah perkara yang sama",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
    explanation:
      "HIV ialah virus yang boleh melemahkan sistem imun. AIDS pula adalah peringkat paling lanjut jangkitan HIV yang tidak dirawat, apabila sistem imun telah rosak teruk. Tidak semua orang dengan HIV akan menghidap AIDS — dengan rawatan yang berkesan, kebanyakan individu yang hidup dengan HIV tidak akan berkembang menjadi AIDS.",
  },
  {
    id: 22,
    question: "Anda patut berhenti mengambil ubat HIV sebaik sahaja anda berasa sihat",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
    explanation:
      "Walaupun anda berasa sihat sepenuhnya, virus masih berada dalam badan anda. Berhenti rawatan membenarkan virus membiak semula, merosakkan sistem imun anda, dan mungkin menjadi rintang kepada ubat. Rawatan HIV adalah seumur hidup — jangan sekali-kali berhenti atau mengubahnya tanpa berbincang dengan doktor anda dahulu.",
  },
  {
    id: 23,
    question: "Ujian darah berkala adalah sebahagian penting dalam menguruskan HIV",
    options: ["Mitos", "Fakta"],
    answer: "Fakta",
    explanation:
      "Ujian darah berkala seperti kiraan CD4 dan viral load membantu pasukan penjagaan kesihatan anda memastikan rawatan anda berkesan dan sistem imun anda sihat. Ujian lain (buah pinggang, hati, gula darah dan kolesterol) membantu memantau kesihatan keseluruhan anda dan mengesan sebarang kesan sampingan ubat lebih awal.",
  },
  {
    id: 24,
    question: "Individu yang hidup dengan HIV boleh berkongsi makanan dan ruang kediaman dengan selamat",
    options: ["Mitos", "Fakta"],
    answer: "Fakta",
    explanation:
      "HIV tidak tersebar melalui sentuhan harian. Berkongsi makanan, pinggan mangkuk, bilik air, ruang kediaman atau memeluk seseorang yang hidup dengan HIV tidak membawa risiko penularan. HIV hanya boleh ditularkan melalui cecair badan tertentu.",
  },
  {
    id: 25,
    question: "Hanya doktor anda yang boleh mengubah ubat atau dos HIV anda",
    options: ["Mitos", "Fakta"],
    answer: "Fakta",
    explanation:
      "Jangan sekali-kali mengubah, menghentikan atau melaraskan ubat HIV anda sendiri, dan berhati-hati dengan ubat lain, suplemen dan produk herba, yang boleh berinteraksi dengan ART. Sentiasa semak dengan doktor atau ahli farmasi anda sebelum memulakan sebarang ubat baharu.",
  },
];

// Return a shuffled copy (does not mutate the source array)
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  let currentIndex = shuffled.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ];
  }

  return shuffled;
}

const bmQuestions = shuffle(initQuestions);
export default bmQuestions;
