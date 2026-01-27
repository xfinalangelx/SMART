const initQuestions = [
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
      "Peluh, air mata, air kencing atau najis seseorang yang menghidap HIV HIV tidak boleh disebarkan melalui peluh, air mata, air kencing atau najis orang yang dijangkiti HIV. ",
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
      "Saya positif HIV dan begitu juga pasangan saya jadi kami tidak perlu risau tentang HIV",
    options: ["Mitos", "Fakta"],
    answer: "Mitos",
    explanation:
      "Terdapat banyak jenis strain virus HIV. Jika anda dan pasangan anda hidup dengan HIV, anda mungkin mempunyai strain HIV yang berbeza dan oleh itu, anda masih perlu melindungi satu sama lain daripada jangkitan HIV. Jika anda dijangkiti dua atau lebih jenis strain HIV ia boleh menjejaskan keberkesanaan rawatan anda. Jika anda sedang menjalani rawatan yang berkesan dan pakar perubatan telah mengesahkan viral load anda tidak dapat dikesan, anda tidak akan menularkan HIV melalui hubungan seks.",
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
];

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const bmQuestions = shuffle(initQuestions);
export default bmQuestions;
