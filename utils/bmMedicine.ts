const medicine = {
  nrti: [
    {
      name: "Lamivudine 150mg",
      brand: "Valfix / Lamivox",
      commonDose:
        "DUA (2) tablet SEKALI setiap hari atau SATU (1) tablet DUA KALI setiap hari",
      beforeAfter: "Sebelum / selepas makan",
      dayNight: "Dua-dua pun boleh",
      adjustmentRenal: "CrCl ≥50 mL/minute: \nTiada pelarasan dos diperlukan",
      adjustmentLiverMild: "Tiada pelarasan dos diperlukan",
      adjustmentLiverModerate: "Tiada pelarasan dos diperlukan",
      adjustmentLiverSevere: "Tiada pelarasan dos diperlukan",
      crushed: "Ya",
      crushInstruction:
        "Campurkan dengan larutan separa pejal / cecair dan diambil segera",
      pregancy: "Ya",
      sideEffects:
        "Sakit kepala, keletihan, kekurangan tenaga, rasa loya / muntah\n\nPenurunan selera makan, cirit-birit, ruam dan sakit perut. Peningkatan bacaan enzim hati\n\nDemam (suhu tinggi), berasa tidak sihat, sakit otot dan ketidakselesaan, sakit sendi, sukar tidur (insomnia), batuk, hidung berair, keguguran rambut (alopecia).",
      monitoring: "Ujian enzim hati\nUjian enzim otot",
      population: "Tiada",
      takenMed: "Tiada",
      notTakenMed: "Emtricitabine\nCotrimoxazole (dos tinggi)\nCladribine",
      interaction: "Orlistat \nTrimethoprim",
      image: require("../assets/img/atazor.png"),
      category: 3,
      id: 8,
    },
    {
      name: "Abacavir 300mg",
      brand: "Ziagen",
      commonDose:
        "DUA (2) tablet SEKALI setiap hari atau SATU (1) tablet DUA KALI setiap hari",
      beforeAfter: "Sebelum / selepas makan",
      dayNight: "Dua-dua pun boleh",
      adjustmentRenal: "Tiada pelarasan dos diperlukan",
      adjustmentLiverMild: "Penyelarasan dos diperlukan",
      adjustmentLiverModerate: "Tidak digalakkan",
      adjustmentLiverSevere: "Tidak digalakkan",
      crushed: "Ya",
      crushInstruction:
        "Campurkan dengan separa pejal / cecair dan diambil segera",
      pregancy: "Ya\n(Jika HLA-B5701 adalah negative)",
      sideEffects:
        "Rasa tidak sihat (loya / muntah), sakit kepala, cirit-birit, hilang selera makan, sakit perut \n\nLetih, kekurangan tenaga, demam, ruam, sesak nafas, sakit tekak, batuk",
      monitoring: "Status HLA-B * 5701",
      population: "Tiada",
      takenMed: "Tiada",
      notTakenMed:
        "Emtricitabine\nLamivudine\nTrimethoprim/sulfamethoxazole (dos tinggi)\nCladribine",
      interaction: "Phenytoin\nMetadon",
      image: require("../assets/img/ziagen.png"),
      category: 3,
      id: 9,
    },
  ],
  nnrti: [
    {
      name: "Efavirenz 600mg",
      brand: "Efavir",
      commonDose: "SATU (1) tablet SEKALI setiap hari",
      beforeAfter: "Sebelum makan",
      dayNight: "Malam",
      adjustmentRenal: "Tiada pelarasan dos diperlukan",
      adjustmentLiverMild: "Tiada pelarasan dos diperlukan",
      adjustmentLiverModerate: "Tidak digalakkan",
      adjustmentLiverSevere: "Tidak digalakkan",
      crushed: "Ya",
      crushInstruction: "Tablet boleh dibahagi",
      pregancy: "Ya",
      sideEffects:
        "Ruam, gatal, mimpi yang aneh (khayalan), sukar tidur (insomia), sukar menumpukan perhatian, perubahan perasaan hati, \nrasa 'tidak bermaya', kekeliruan, gangguan tumpuan, pemikiran membunuh diri. \nPening, sakit kepala,  mengantuk, sakit perut, cirit-birit, loya, muntah, letih, gelisah, kemurungan, peningkatan kadar trigliserida dan enzim hati.",
      monitoring: "Ujian enzim hati\nPsikosis\nRuam yang teruk",
      population: "tiada",
      takenMed: "tiada",
      notTakenMed: "Ergotamine\nMidazolam\nPhenytoin",
      interaction:
        "Atorvastatin\nAtovaquone/proguanil\nBupropion\nCarbamazepine\nClarithromycin\nCyclosporine\nDiltiazem\nItraconazole\nMethadone\nPhenobarbital\nPhenytoin\nPravastatin\nRifabutin\nRifampicin\nSertraline\nSimvastatin\nSirolimus\nTacrolimus\nVoriconazole\nWarfarin\nGinkgo biloba",
      doseInstrcution:
        "https://www.aidsmap.com/about-hiv/a-z-antiretroviral-medications",
      crushInstructionLink:
        "https://liverpool-hiv-hep.s3.amazonaws.com/prescribing_resources/pdfs/000/000/011/original/ARV_Swallowing_2018_Oct.pdf?1540371581#:~:text=Lamivudine\n20Epivir\n20Tablets\n20can\n20be,or\n20liquid\n20and\n20taken\n20immediately.&text=Dosing\n20is\n20the\n20same\n20for\n20oral\n20solution\n20and\n20tablets.,-\nE2\n80\nA2",
      image: require("../assets/img/efavir.png"),
      category: 1,
      id: 0,
    },
    {
      name: "Nevirapine 200mg",
      brand: "Hirapine / Nevirapine",
      commonDose:
        "DUA (2) tablet SEKALI setiap hari atau SATU (1) tablet DUA KALI setiap hari",
      beforeAfter: "Sebelum / selepas makan",
      dayNight: "Dua-dua boleh",
      adjustmentRenal: "Tiada pelarasan dos diperlukan",
      adjustmentLiverMild: "Tiada pelarasan dos diperlukan",
      adjustmentLiverModerate: "Tidak digalakkan",
      adjustmentLiverSevere: "Tidak digalakkan",
      crushed: "Ya",
      crushInstruction:
        "Hancurkan tablet dan larutkan dalam air (hanya untuk pengambilan dos dua kali sehari)",
      pregancy: "Ya (Jikalau CD4 > 250 sel/mm3)",
      sideEffects:
        " Ruam, reaksi alergi, keletihan dan demam, kulit lepuh, luka di dalam mulut, radang mata, pembengkakan muka atau tempat lain, kesukaran bernafas, sakit otot atau sendi, berasa tidak sihat\nSakit kepala, loya, muntah, sakit perut, cirit-birit, hilang selera makan\nEnzim hati yang meningkat, tekanan darah meningkat\nKulit menjadi kuning (jaundis / penyakit kuning), warna air kencing gelap atau seperti teh, warna najis menjadi pucat.",
      monitoring:
        "18 minggu pertama:\nUjian enzim hati \nPantau untuk ruam yang teruk (sindrom Stevens Johnson)",
      population: "Lelaki: CD4 <400 sel / mm3 \nWanita: CD4 <250 sel / mm3",
      takenMed: "tiada",
      notTakenMed: " St John's wort",
      interaction:
        "Atazanavir\nClarithromycin\nEfavirenz\nKontraseptif hormon \nLopinavir / ritonavir\nMetadon\nRifampicin\nWarfarin,\nRifabutin,\nUbat-ubatan anti kulat",
      doseInstrcution: "",
      crushInstructionLink: "",
      image: require("../assets/img/hirapine.png"),
      category: 1,
      id: 1,
    },
  ],
  pi: [
    {
      name: "Lopinavir 200mg / Ritonavir 50mg",
      brand: "Kaletra",
      commonDose:
        "DUA (2) tablet DUA KALI sehari atau EMPAT (4) tablet SEKALI setiap hari",
      beforeAfter: "Selepas makan ",
      dayNight: "Dua-dua pun boleh",
      adjustmentRenal: "Tiada pelarasan dos diperlukan",
      adjustmentLiverMild: "Tiada pelarasan dos diperlukan",
      adjustmentLiverModerate: "Tiada pelarasan dos diperlukan",
      adjustmentLiverSevere: "Tiada pelarasan dos diperlukan",
      crushed: "Ya",
      crushInstruction:
        "Syrup Kaletra boleh digunakan sebagai alternative jikalau dose kecil diperlukan",
      pregancy:
        "Untuk meneruskan rawatan. Bukan untuk pesakit yang baru didiagnosis.\n \nTidak boleh dimbil dengan Emtricitabine 200mg + Tenofovir 300mg",
      sideEffects:
        "Cirit-birit, muntah, sakit perut, kembung perut, pedih ulu hati dan senak, hilang selera makan\n \nLoya, sakit kepala, pening, jangkitan sinus atau tekak\n\n Pankreatitis, kencing manis, tekanan darah tinggi, sukar tidur (insomia), kegelisahan, buasir.\n\nRuam, gatal-gatal, jangkitan kulit, lipodistrofi (perubahan dalam lemak badan), berasa lemah\n\nReaksi alergi termasuk pembengkakan, jangkitan pada saluran pernafasan, batuk, sakit tekak, hidung berair, disfungsi ereksi (tenaga batin yang lemah), gangguan haid, kerosakan saraf periferal, sakit otot.",
      monitoring:
        "Paras gula\nPerubahan irama jantung\nUjian enzim hati \nUjian profil lemak",
      population: "Tiada",
      takenMed: "Tiada",
      notTakenMed:
        "Alkohol\nAlfuzosin\nAmiodarone\nColchicine\nDonedarone\nErgotamine\nFusidic acid\nMidazolam \nQuetiapine\nRanolazine\nSildenafil\nSimvastatin\nVardenafil",
      interaction:
        "Acyclovir-Valacyclovir\nClarithromycin\nClozapine\nDeferiprone\nDoxorubicin\nFluconazole\nGanciclovir-Valganciclovir\nMetadon\nRaltegravir\nRibavirin\nTrimethoprim\nUbat-ubatan sawan (epilepsi)",
      image: require("../assets/img/kaletra.png"),
      category: 2,
      id: 2,
    },
    {
      name: "Ritonavir 100mg",
      brand: "Norvir",
      commonDose: "SATU (1) / DUA (2) kapsul SEKALI / DUA KALI sehari",
      beforeAfter: "Selepas makan",
      dayNight: "Dua-dua pun boleh",
      adjustmentRenal: "Tiada pelarasan dos diperlukan",
      adjustmentLiverMild: "Tiada pelarasan dos diperlukan",
      adjustmentLiverModerate: "Tiada pelarasan dos diperlukan",
      adjustmentLiverSevere: " Tidak digalakkan",
      crushed: "Tidak",
      crushInstruction: "Tiada",
      pregancy: "Ya",
      sideEffects:
        "Enzim lemak & hati yang meningkat, keracunan hati, loya, muntah, cirit-birit, sakit perut, sakit kepala, kencing manis\n\nPerubahan irama jantung, reaksi alergi (hipersensitiviti) yang teruk dan ruam (sindrom Stevens-Johnson).",
      monitoring:
        "Paras gula\nSerum lipase\nUjian enzim hati\nUjian profil lemak",
      population: "Tiada",
      takenMed: "Tiada",
      notTakenMed:
        "Alfuzosin\nAmiodarone\nColchicine\nDiazepam\nDronedarone\nFlecanaide\nFusidic acid\nMidazolam\nQuetiapine\nRanolazine\nSildenafil \nSimvastatin\nVardenafil",
      interaction:
        "Calcium channel blockers\nH2 receptors\nImunosupresan\nKontraseptif hormon\nProton pump inhibitors \nUbat alahan\nUbat-ubatan anti koagulan\nUbat-ubatan anti kulat\nUbat-ubatan asma (yang mengandungi steroid)\nUbat-ubatan sawan (epilepsi)\nUbat kemoterapi (sebahagian)\nUbat-ubatan semburan hidung (yang mengandungi steroid)\nUbat-ubatan titis mata  (yang mengandungi steroid)\n",
      image: require("../assets/img/norvir.png"),
      category: 2,
      id: 3,
    },
    {
      name: "Atazanavir 300mg",
      brand: "Atazor / Atazanavir/ Reyataz",
      commonDose: "SATU (1) tablet SEKALI setiap hari",
      beforeAfter: "Selepas makan",
      dayNight: "Dua-dua pun boleh",
      adjustmentRenal: "Tiada pelarasan dos diperlukan",
      adjustmentLiverMild: "Pelarasan dos diperlukan",
      adjustmentLiverModerate: " Pelarasan dos diperlukan",
      adjustmentLiverSevere: "Tidak digalakkan",
      crushed: "Tidak",
      crushInstruction: "Tiada",
      pregancy:
        "Untuk meneruskan rawatan. Bukan untuk pesakit yang baru memulakan rawatan.",
      sideEffects:
        "Sakit kepala, ruam, letih \n\nRasa  loya / muntah cirit-birit, sakit perut, senak \n\nTahap billirubin yang tinggi (jaundis / penyakit kuning)",
      monitoring:
        "Paras gula\nElektrokardiogram - ujian pengesanan aktiviti elektrik jantung\nUjian enzim hati ",
      population: "Tiada",
      takenMed: "Ritonavir: SATU (1) tablet (100mg) SEKALI setiap hari",
      notTakenMed:
        "Ergotamine\nMidazolam\nProton pump inhibitor (dexlansoprazole, esomeprazole, lansoprazole, omeprazole, pantoprazole, rabeprazole) \nQuetiapine\nRifampicin\nSildenafil\nSimvastatin",
      interaction:
        "Antacids\nUbat-ubatan kencing manis\nUbat-ubatan kemoterapi\nImmunomodulators\n\nUbatan yang di kelaskan sebagai CYP3A4 Inhibitors",
      image: require("../assets/img/atazor.png"),
      category: 2,
      id: 4,
    },
    {
      name: "Darunavir 600mg",
      brand: "Prezista",
      commonDose: "SATU (1) tablet DUA KALI setiap hari",
      beforeAfter:
        "Selepas makan\n(Ambil tablet dengan makanan atau snek ringan  untuk membantu penyerapan ubat)",
      dayNight: "Dua-dua pun boleh",
      adjustmentRenal: "Tiada pelarasan dos diperlukan",
      adjustmentLiverMild: "Tiada pelarasan dos diperlukan",
      adjustmentLiverModerate: "Tiada pelarasan dos diperlukan",
      adjustmentLiverSevere: "Tidak digalakkan",
      crushed: "Ya",
      crushInstruction:
        "Campurkan dengan separa pejal / cecair dan diambil segera",
      pregancy: "Ya",
      sideEffects:
        "Cirit-birit, loya, muntah, sakit perut, senak, kembung perut, kembung.\n\n Sakit kepala, letih, pening, mengantuk, kebas, neuropati periferal (kesemutan atau sakit di tangan / kaki), kesukaran untuk tidur (insomia), kelemahan.\n\n Ruam, gatal, kencing manis, paras lemak yang meningkat, enzim hati yang meningkat \n\nLipodistrofi (perubahan dalam lemak badan), demam",
      monitoring: "Paras gula\nUjian enzim hati",
      population: "CD4> 200 sel / mm3",
      takenMed: "Ritonavir: SATU (1) tablet (100mg) dua kali sehari",
      notTakenMed:
        "Alfuzosin\nAmiodarone\nColchicine\nErgotamine\nLopinavir/ritonavir (Kaletra)\nMetformin\nMidazolam\nQuetiapine\nRanolazine\nRifampacin\nSildenafil\nSimvastatin\nTicagrelor",
      interaction:
        "Antibiotik\nSteroid\nKontraseptif hormon\nMetformin\nMetadon\nUbat untuk menurunkan kolesterol (cth. atorvastatin, simvastatin)",
      image: require("../assets/img/atazor.png"),
      category: 2,
      id: 5,
    },
  ],
  ii: [
    {
      name: "Raltegravir 400mg",
      brand: "Isentress",
      commonDose: "SATU (1) tablet DUA KALI setiap hari",
      beforeAfter: "Sebelum / selepas makan",
      dayNight: "Dua-dua pun boleh",
      adjustmentRenal: "Tiada pelarasan dos diperlukan",
      adjustmentLiverMild: "Tiada pelarasan dos diperlukan",
      adjustmentLiverModerate: "Tiada pelarasan dos diperlukan",
      adjustmentLiverSevere: "Tiada cadangan dari pengilang",
      crushed: "Tidak",
      crushInstruction: "Tiada",
      pregancy: "Ya",
      sideEffects:
        "Hilang selera makan, sakit perut, kembung perut, kembung, cirit-birit, loya, muntah, senak \n\nSakit kepala, pening, vertigo\n\nKesukaran tidur (insomia),mimpi yang aneh (khayalan), kemurungan\n\n Ruam, hipersensitiviti (alahan), kelemahan, keletihan, demam",
      monitoring:
        "Kemurungan\nTanda-tanda ruam pada kulit \nUjian enzim hati\nUjian profil lemak",
      population: "Tiada",
      takenMed: "Tiada",
      notTakenMed: "Tiada maklumat",
      interaction:
        "Antacid\nMultivitamin\nSuplemen mineral \n(diambil 6 jam sebelum atau 2 jam selepas raltegravir)\n\nRifampicin",
      image: require("../assets/img/isentress.png"),
      category: 5,
      id: 12,
    },
    {
      name: "Dolutegravir 50mg",
      brand: "Tivicay",
      commonDose: "SATU (1) tablet SEKALI / DUA kali sehari setiap hari ",
      beforeAfter: "Sebelum / selepas makan",
      dayNight: "Dua-dua pun boleh",
      adjustmentRenal: "Tiada pelarasan dos diperlukan",
      adjustmentLiverMild: "Tiada pelarasan dos diperlukan",
      adjustmentLiverModerate: "Tiada pelarasan dos diperlukan",
      adjustmentLiverSevere: "Tidak digalakkan",
      crushed: "Ya",
      crushInstruction:
        "Campurkan dengan separa pejal / cecair dan diambil segera",
      pregancy: "Ya",
      sideEffects:
        "Sakit kepala, sukar tidur (insomnia), pening, mimpi yang aneh, kemurungan, kekurangan tenaga (keletihan).\n\n Cirit-birit, rasa loya / muntah, sakit perut atau ketidakselesaan, angin (kembung perut).  \n\nRuam, gatal. \n\nPenambahan berat badan",
      monitoring:
        "Reaksi alergi\nUjian enzim hati\nUjian enzim otot\n \nUjian kehamilan (wanita - sebelum memulakan rawatan)",
      population: "Tiada",
      takenMed: "Tiada",
      notTakenMed: "Tiada maklumat",
      interaction:
        "Carbamazepine\nOxcarbazepine\nMetformin (Dos maksimum: 1g sehari)\nPhenobarbital\nPhenytoin\nRifampicin\n\nAntacid\nMultivitamin\nSuplemen mineral \n(diambil 6 jam sebelum atau 2 jam selepas raltegravir)",
      image: require("../assets/img/tivicay.png"),
      category: 5,
      id: 13,
    },
  ],
  combination: [
    {
      name: "Emtricitabine 200mg / Tenofovir 300mg",
      brand: "Tenof-EM / Truvada",
      commonDose: "SATU (1) tablet SEKALI setiap hari",
      beforeAfter: "Selepas makan",
      dayNight: "Dua-dua pun boleh",
      adjustmentRenal: "CrCl ≤50 mL / minit: Pelarasan dos diperlukan",
      adjustmentLiverMild: "Tiada pelarasan dos diperlukan",
      adjustmentLiverModerate: "Tiada pelarasan dos diperlukan",
      adjustmentLiverSevere: "Tiada pelarasan dos diperlukan",
      crushed: "Ya",
      crushInstruction:
        "Hancurkan dalam 100ml air / jus oren dan diambil segera",
      pregancy: "Ya",
      sideEffects:
        "Cirit-birit, kembung perut, sakit perut, rasa loya / muntah\n\n Pening, sakit kepala\n\nRuam, kelesuan, sakit\n\nKesukaran tidur (insomia), mimpi yang aneh\n\nKulit menjadi gelap \n\nReaksi alahan atau alergi, seperti nafas berbunyi (wheezing), bengkak pada muka atau salur pernafasan atau berasa pening (pengsan).",
      monitoring:
        "Ujian kepadatan tulang (BMD)\nUjian enzim hati \nUjian fungsi buah pinggang\nUjian virus Hepatitis B (sebelum memulakan rawatan)",
      population: "Tiada",
      takenMed: "Tiada",
      notTakenMed: "Tenofovir alafenamide\nLamivudine\nAdefovir dipivoxil",
      interaction:
        "Aminoglycosides\nAmphotericin B\nFoscarnet Ganciclovir\nPentamidine\nVancomycin Interleukin-2 \nNon-steroidal anti-inflammatory drugs (cth: Celecoxib, Etoricoxib)",
      image: require("../assets/img/tenof.png"),
      category: 3,
      id: 6,
    },
    {
      name: "Lamivudine 150mg / Zidovudine 300mg",
      brand: "Lamizido / Combivir",
      commonDose: "SATU (1) tablet DUA KALI setiap hari",
      beforeAfter: "Sebelum / selepas makan",
      dayNight: "Dua-dua pun boleh",
      adjustmentRenal: "CrCl <50 mL / minit: Tidak digalakkan",
      adjustmentLiverMild: "Tidak digalakkan",
      adjustmentLiverModerate: "Tidak digalakkan",
      adjustmentLiverSevere: "Tidak digalakkan",
      crushed: "Ya",
      crushInstruction:
        "Campurkan dengan larutan separa pejal / cecair (lebih kurang 15 minit) dan diambil segera",
      pregancy: "Ya",
      sideEffects:
        "Loya, sakit kepala, muntah, keletihan, pening, lemah, sakit otot, demam \n\nCirit-birit, sakit perut, hilang selera makan \n\n Keletihan, sukar tidur (insomnia), sakit sendi atau otot, batuk, hidung berair, rambut gugur, ruam, perubahan dalam lemak badan,jumlah sel darah merah dan / atau darah putih rendah, peningkatan bacaan enzim hati.",
      monitoring:
        "Ujian kepadatan tulang (BMD)\nKiraan sel darah\nTanda perubahan lemak badan (lipoatrofi)\nUjian enzim otot (tanda-tanda kelemahan/ sakit otot)\nUjian fungsi buah pinggang",
      population: "Tiada",
      takenMed: "Tiada",
      notTakenMed:
        "Clabribine\nCotrimoxazole (dose tinggi)\nEmtricitabine\nGanciclovir\nLamivudine\nRibavirin.",
      interaction:
        "Antibiotik\nAnti-malaria \nUbat- ubatan gout\nUbat-ubatan kemoterapi\nUbat-ubatan sawan (epilepsi)\nMetadon",
      image: require("../assets/img/atazor.png"),
      category: 3,
      id: 7,
    },
    {
      name: "Abacavir 600mg / Lamivudine 300mg",
      brand: "Kivexa",
      commonDose: "SATU (1) tablet SEKALI setiap hari",
      beforeAfter: "Sebelum / selepas makan",
      dayNight: "Dua-dua pun boleh",
      adjustmentRenal: "CrCl <50 mL / minit: Tidak digalakkan",
      adjustmentLiverMild: "Tidak digalakkan",
      adjustmentLiverModerate: "Tidak digalakkan",
      adjustmentLiverSevere: "Tidak digalakkan",
      crushed: "Tidak",
      crushInstruction: "Tiada",
      pregancy: "Tidak",
      sideEffects:
        "Reaksi hipersensitiviti, batuk, hidung berair, ruam, sakit tekak\n\nSakit kepala, demam, berasa tidak sihat, sukar tidur\n\nCirit-birit, berasa loya / muntah, sakit perut, hilang selera makan \n\nKeletihan, kekurangan tenaga, sakit otot & sendi dan ketidakselesaan, keguguran rambut (alopecia), sesak nafas",
      monitoring:
        "Status HLA-B * 5701\nParas gula\nUjian enzim hati \nUjian profil renal",
      population: "Tiada",
      takenMed: "Tiada",
      notTakenMed:
        "Emtricitabine\nLamivudine\nTrimethoprim/sulfamethoxazole (dos tinggi)\nCladribine",
      interaction: "Phenytoin\nMetadon",
      image: require("../assets/img/kivexa.png"),
      category: 3,
      id: 10,
    },
    {
      name: "Tenofovir 300mg / Emtricitabine 200mg / Efavirenz 600mg",
      brand: "Viraday",
      commonDose: "SATU (1) tablet SEKALI setiap hari",
      beforeAfter: "Sebelum makan",
      dayNight: "Malam",
      adjustmentRenal: "CrCl <50 mL / minit: \nTidak digalakkan",
      adjustmentLiverMild: "Tiada pelarasan dos diperlukan",
      adjustmentLiverModerate: "Tidak digalakkan",
      adjustmentLiverSevere: "Tidak digalakkan",
      crushed: "Tidak",
      crushInstruction: "Tiada",
      pregancy:
        "Untuk meneruskan rawatan. Bukan untuk pesakit yang baru didiagnosis.",
      sideEffects:
        "Pening, sakit kepala, sukar tidur (insomia), mimpi yang aneh, sukar menumpukan perhatian, mengantuk, lemah. \n\nRasa loya / muntah, cirit-birit, sakit perut, rasa kembung perut, kembung.\n\nRuam kulit, reaksi alergi, tompok kulit gelap (sering bermula pada tangan atau tapak kaki).\n \nPemikiran bunuh diri, kegelisahan, kemurungan, paranoia dan perubahan emosi",
      monitoring:
        "Ujian enzim hati\nUjian profil lemak\nUjian profil renal\n\nUjian virus Hepatitis B (2 minggu selepas memulakan rawatan)",
      population: "Tiada",
      takenMed: "Tiada",
      notTakenMed: "St Johns Wort\nGinkgo biloba ",
      interaction:
        "Antibiotik\nAntiepileptik\nAntikoagulan\nAntidepresan\nKontraseptif hormon\nMetadon\nUbat untuk tekanan darah tinggi\nUbat untuk menurunkan kolesterol (cth. atorvastatin, simvastatin)\n\nSt Johns Wort\nGinkgo biloba\n",
      image: require("../assets/img/viraday.png"),
      category: 4,
      id: 11,
    },
  ],
};

export default medicine;
