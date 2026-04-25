/* ================================================================
   ENHANCEMENT.JS — Visual Storytelling Scene-Based System
   SOMIRACLE v4.3 — FIX IMAGE PATH & CACHE BUG
   Fitur: scene per story_parts, fade crossfade, animasi, TTS lengkap
   ================================================================ */

// ═══════════════════════════════════════════════════════════════
// BAGIAN 1: SCENE IMAGE MAPPING (1 - 24)
// Penyesuaian: Langsung ke folder images/ (Tanpa subfolder scenes)
// ═══════════════════════════════════════════════════════════════
const SCENE_IMAGE_MAP = {
  1:  ["images/kana.jpg","images/kana (2).jpg","images/kana (3).jpg","images/kana (4).jpg","images/kana (5).jpg"],
  2:  ["images/ikan.jpg","images/ikan (2).jpg","images/ikan (3).jpg","images/ikan (4).jpg","images/ikan (5).jpg"],
  3:  ["images/badai.jpg","images/badai (2).jpg","images/badai (3).jpg","images/badai (4).jpg","images/badai (5).jpg"],
  4:  ["images/airjalan.jpg","images/airjalan (2).jpg","images/airjalan (3).jpg","images/airjalan (4).jpg","images/airjalan (5).jpg"],
  5:  ["images/roti.jpg","images/roti.jpg","images/roti (3).jpg","images/roti (4).jpg","images/roti (5).jpg"],
  6:  ["images/lumpuh.jpg","images/lumpuh (2).jpg","images/lumpuh (3).jpg","images/lumpuh (4).jpg","images/lumpuh (5).jpg"],
  7:  ["images/darah.jpg","images/darah (2).jpg","images/darah (3).jpg","images/darah (4).jpg","images/darah (5).jpg"],
  8:  ["images/kusta.jpg","images/kusta (2).jpg","images/kusta (3).jpg","images/kusta (4).jpg","images/kusta (5).jpg"],
  9:  ["images/legion.jpg","images/legion (2).jpg","images/legion (3).jpg","images/legion (4).jpg","images/legion (5).jpg"],
  10: ["images/yairus.jpg","images/yairus (2).jpg","images/yairus (3).jpg","images/yairus (4).jpg","images/yairus (5).jpg"],
  11: ["images/nain.jpg","images/nain (2).jpg","images/nain (3).jpg","images/nain (4).jpg","images/nain (5).jpg"],
  12: ["images/buta.jpg","images/buta (2).jpg","images/buta (3).jpg","images/buta (4).jpg","images/buta (5).jpg"],
  13: ["images/tuli.jpg","images/tuli (2).jpg","images/tuli (3).jpg","images/tuli (4).jpg","images/tuli (5).jpg"],
  14: ["images/ara.jpg","images/ara (2).jpg","images/ara (3).jpg","images/ara (4).jpg","images/ara (5).jpg"],
  15: ["images/jarak.jpg","images/jarak (2).jpg","images/jarak (3).jpg","images/jarak (4).jpg","images/jarak (5).jpg"],
  16: ["images/lazarus.jpg","images/lazarus (2).jpg","images/lazarus (3).jpg","images/lazarus (4).jpg","images/lazarus (5).jpg"],
  17: ["images/zakheus.jpg","images/zakheus (2).jpg","images/zakheus (3).jpg","images/zakheus (4).jpg","images/zakheus (5).jpg"],
  18: ["images/koin.jpg","images/koin (2).jpg","images/koin (3).jpg","images/koin (4).jpg","images/koin (5).jpg"],
  19: ["images/kusta2.jpg","images/kusta2 (2).jpg","images/kusta2 (3).jpg","images/kusta2 (4).jpg","images/kusta2 (5).jpg"],
  20: ["images/betesda.jpg","images/betesda (2).jpg","images/betesda (3).jpg","images/betesda (4).jpg","images/betesda (5).jpg"],
  21: ["images/sabat.jpg","images/sabat (2).jpg","images/sabat (3).jpg","images/sabat_scene4.jpg","images/sabat (5).jpg"],
  22: ["images/bungkuk.jpg","images/bungkuk (2).jpg","images/bungkuk (3).jpg","images/bungkuk (4).jpg","images/bungkuk (5).jpg"],
  23: ["images/bartimeus.jpg","images/bartimeus (2).jpg","images/bartimeus (3).jpg","images/bartimeus (4).jpg","images/bartimeus (5).jpg"],
  24: ["images/kebangkitan.jpg","images/kebangkitan (2).jpg","images/kebangkitan (3).jpg","images/kebangkitan (4).jpg","images/kebangkitan (5).jpg"],
};


// ═══════════════════════════════════════════════════════════════
// BAGIAN 2: NARRATION MAP (Lengkap 1 - 24)
// Fallback otomatis ke story_parts dari data.json jika tidak ada di map
// ═══════════════════════════════════════════════════════════════
const SCENE_NARRATION_MAP = {
  1: [
    "Di kota kecil Kana yang dikelilingi bukit-bukit Galilea, sebuah pesta pernikahan sedang berlangsung dengan penuh semarak. Lampion-lampion bergoyang lembut, musik mengalun hangat, dan tawa memenuhi setiap sudut halaman. Di antara para tamu yang berbahagia, Yesus hadir bersama ibu-Nya Maria dan para murid yang baru Ia panggil.",
    "Namun tepat di puncak kegembiraan, sebuah krisis mengancam menghancurkan segalanya — anggur habis. Dalam tradisi pernikahan Yahudi kuno, ini adalah aib besar yang bisa mengikuti nama keluarga selama bertahun-tahun. Seorang pelayan berbisik gelisah, wajah tuan rumah memucat. Maria, sang ibu yang peka, membawa masalah itu langsung kepada Yesus.",
    "Maria mendekat dan berkata dengan tenang: 'Mereka kehabisan anggur.' Yesus menjawab: 'Saat-Ku belum tiba.' Tetapi Maria tidak goyah — ia hanya berpaling kepada para pelayan dan berkata: 'Apa pun yang dikatakan-Nya kepadamu, buatlah itu.' Dalam kata-kata itu tersimpan iman paling sederhana namun paling dalam.",
    "Yesus melihat enam tempayan batu raksasa yang masing-masing menampung 60–90 liter. Ia berkata: 'Isilah tempayan-tempayan ini penuh dengan air.' Tanpa penjelasan, tanpa janji. Para pelayan saling bertukar pandang — lalu mulai menuangkan air hingga bibir tempayan pun penuh.",
    "'Sekarang cedoklah dan bawalah kepada pemimpin pesta.' Dengan tangan gemetar, sang pelayan membawa cairan itu. Pemimpin pesta mencicipinya — matanya melebar. 'Engkau menyimpan yang terbaik untuk terakhir!' Para pelayan tahu dari mana anggur itu berasal. Dan para murid pun percaya."
  ],
  2: [
    "Kabut pagi masih menggantung tipis di atas Danau Genesaret ketika Simon Petrus mendayung perahu kembali ke tepi. Semalam mereka berjuang menebarkan jala berkali-kali — namun hasilnya nihil. Tidak seekor ikan pun. Tangan lecet, tubuh berat oleh kelelahan, dan jaring terasa seperti beban dari malam yang sia-sia.",
    "Yesus berdiri di tepi danau, dikelilingi orang banyak yang ingin mendengar Firman Allah. Ia masuk ke perahu Simon dan memintanya menjauh sedikit dari daratan. Dari perahu yang mengapung itulah Yesus mulai mengajar — kata-kata-Nya mengalir seperti air, menyentuh jauh ke dalam sanubari.",
    "Selesai mengajar, Yesus berkata: 'Bertolaklah ke tempat yang dalam dan tebarkanlah jalamu.' Simon menjawab jujur: 'Guru, telah sepanjang malam kami bekerja keras dan tidak menangkap apa-apa. Tetapi karena Engkau menyuruhnya, aku akan menebarkan jala juga.' Empat kata terakhir itu adalah inti dari seluruh iman.",
    "Ada jeda sebelum jala dilempar. Dalam jeda itulah Petrus membuat keputusan terbesar hidupnya — bukan dengan pidato semangat, melainkan dengan gerakan sederhana: mengangkat jala dan melemparnya ke air. Keahliannya berkata tidak, tapi imannya berkata ya.",
    "Jala mulai terasa berat — jauh lebih berat dari biasanya. Lalu jala itu hampir koyak karena jumlah ikan yang luar biasa. Kedua perahu terisi penuh hingga hampir tenggelam. Simon Petrus jatuh tersungkur: 'Tuhan, pergilah dari padaku, karena aku ini orang berdosa.' Yesus menjawab: 'Jangan takut, mulai dari sekarang engkau akan menjala manusia.'"
  ],
  3: [
    "Sore hari di tepi Danau Galilea. Yesus telah mengajar seharian penuh — menyembuhkan orang sakit, menjawab pertanyaan para pemimpin agama. Ia kelelahan. Ketika menaiki perahu untuk menyeberang, Yesus langsung berbaring di buritan dan tertidur di tengah suara ombak yang tenang.",
    "Danau Galilea terkenal berbahaya. Dikelilingi pegunungan, angin kencang bisa datang tiba-tiba dan mengubah permukaan danau yang tenang menjadi lautan badai dalam hitungan menit. Itulah yang terjadi malam itu. Langit yang tadinya jernih berubah gelap. Awan hitam bergulung dari arah barat.",
    "Badai dahsyat menerjang. Ombak setinggi dinding menghantam perahu. Air mulai masuk. Para murid — termasuk nelayan-nelayan berpengalaman — panik. Mereka membangunkan Yesus sambil berteriak: 'Guru, Engkau tidak peduli bahwa kita binasa?!' Di atas segala kekacauan itu, Yesus berbaring tenang.",
    "Yesus bangun. Ia tidak panik. Ia berdiri dengan teguh, lalu menegur angin: 'Diam! Tenang!' Dan seketika — angin berhenti. Danau menjadi seperti kaca. Sunyi yang sempurna menggantikan gemuruh yang tadi menggetarkan tulang.",
    "Yesus berpaling kepada murid-murid-Nya: 'Mengapa kamu begitu takut? Mengapa kamu tidak percaya?' Mereka saling memandang dalam takjub dan bertanya satu sama lain: 'Siapakah orang ini, sehingga angin dan danau pun taat kepada-Nya?' Pertanyaan itu bergema dalam hati mereka sepanjang sisa hidup mereka."
  ],
  4: [
    "Setelah memberi makan 5.000 orang, Yesus menyuruh murid-murid-Nya naik perahu lebih dahulu ke seberang sementara Ia membubarkan orang banyak. Lalu Ia naik ke bukit seorang diri untuk berdoa. Sore berganti malam. Perahu murid-murid sudah jauh di tengah danau.",
    "Angin bertiup menentang. Murid-murid mendayung keras tapi perahu sulit maju. Jam tiga pagi, ketika kelelahan sudah mematikan otot lengan mereka, mereka melihat sesuatu di atas air — sebuah sosok berjalan mendekat. Mereka berteriak ketakutan: 'Itu hantu!'",
    "Tetapi Yesus segera menenangkan mereka: 'Kuatkan hatimu, Aku ini, jangan takut!' Simon Petrus berteriak: 'Tuhan, jika Engkau itu, suruhlah aku datang kepada-Mu berjalan di atas air.' Yesus menjawab dengan satu kata: 'Datanglah.'",
    "Petrus melangkah keluar dari perahu. Dan ia berjalan — benar-benar berjalan di atas air — menuju Yesus. Selama beberapa detik yang mustahil itu, gravitasi tunduk kepada iman. Tetapi kemudian ia melihat angin, melihat ombak, dan ketakutan merayap masuk. Ia mulai tenggelam. 'Tuhan, tolonglah aku!'",
    "Seketika Yesus mengulurkan tangan-Nya memegang Petrus: 'Hai orang yang kurang percaya, mengapa engkau bimbang?' Ketika mereka naik ke perahu, angin pun berhenti. Orang-orang menyembah Dia: 'Sesungguhnya Engkau Anak Allah.' Kegagalan Petrus abadi dalam catatan Injil — namun begitu pula keberaniannya keluar dari perahu."
  ],
  5: [
    "Yesus menyingkir ke tempat yang sunyi setelah mendengar kematian Yohanes Pembaptis. Namun orang banyak dari berbagai kota mengikuti-Nya dengan berjalan kaki melewati jalan-jalan berbatu yang panjang. Ketika melihat mereka, hati-Nya tergerak oleh belas kasihan yang dalam. Ia menyambut mereka dan menyembuhkan yang sakit.",
    "Sore tiba dan tempat itu sunyi dari permukiman. Para murid mendekati Yesus: 'Suruhlah orang banyak ini pergi ke desa-desa untuk membeli makanan.' Namun Yesus menjawab sesuatu yang mengejutkan: 'Tidak perlu mereka pergi — kamu sendiri harus memberi mereka makan.' Para murid saling menatap bingung.",
    "'Kami hanya mempunyai lima roti dan dua ikan di sini!' kata mereka. Yesus berkata: 'Bawalah ke sini.' Di antara ribuan orang, ada seorang anak laki-laki kecil yang maju dengan berani — ia menyerahkan bekalnya sendiri. Lima roti jelai dan dua ikan kecil. Pemberian yang tampaknya tidak berarti apa-apa.",
    "Yesus menyuruh semua orang duduk di atas rumput yang hijau. Ia mengambil kelima roti dan kedua ikan itu, menengadah ke langit dan mengucap syukur. Lalu Ia memecah-mecah dan memberikannya kepada murid-murid untuk dibagikan. Tangan yang memecahkan roti itu adalah tangan yang menciptakan alam semesta.",
    "Dan sesuatu yang luar biasa terjadi. Roti dan ikan itu tidak habis-habis. Setiap tangan yang mengambil mendapat bagian. Setiap orang makan sampai kenyang. Ketika semuanya selesai, dikumpulkan dua belas bakul penuh sisa — lebih banyak dari yang ada di awal. Di tangan Yesus, tidak ada yang terlalu kecil."
  ],
  6: [
    "Kapernaum penuh sesak. Yesus sedang mengajar di sebuah rumah, dan kerumunan orang membludak hingga ke luar pintu. Tidak ada ruang tersisa, bahkan untuk sekadar berdiri mendengarkan pengajaran-Nya.",
    "Empat orang sahabat datang membawa teman mereka yang lumpuh di atas tilam. Melihat kerumunan yang tak tertembus, mereka tidak menyerah pada keputusasaan. Mereka memanjat atap rumah itu bersama-sama.",
    "Dengan susah payah, mereka membongkar atap tepat di atas tempat Yesus berada. Pecahan tanah dan jerami jatuh saat mereka menurunkan perlahan tilam itu tepat di depan Sang Guru.",
    "Melihat iman mereka, Yesus berkata kepada orang lumpuh itu, 'Hai anak-Ku, dosamu sudah diampuni.' Para ahli Taurat yang hadir mulai berbisik-bisik di dalam hati, menuduh-Nya menghujat Allah karena hanya Tuhan yang berhak mengampuni dosa.",
    "Untuk membuktikan kuasa-Nya, Yesus berkata kepada orang lumpuh itu, 'Bangunlah, angkat tempat tidurmu dan pulanglah!' Pria itu pun bangkit saat itu juga di depan semua orang, membuat mereka takjub dan memuliakan Allah."
  ],
  7: [
    "Yesus sedang berjalan menuju rumah Yairus, dikelilingi oleh kerumunan besar yang saling berdesak-desakan. Di tengah lautan manusia itu, ada seorang perempuan yang telah menderita pendarahan selama dua belas tahun.",
    "Ia telah menghabiskan semua hartanya untuk berobat kepada berbagai tabib, namun kondisinya malah semakin memburuk. Menurut hukum saat itu, ia najis, terasing dari masyarakat, dan kehilangan harapan.",
    "Namun ia mendengar tentang Yesus. Dalam hatinya ia berkata, 'Asal kujamah saja jubah-Nya, aku akan sembuh.' Ia menyusup diam-diam di antara kerumunan dengan sisa-sisa tenaganya yang terakhir.",
    "Tangannya yang gemetar menyentuh jumbai jubah Yesus. Seketika itu juga, pendarahannya berhenti, dan ia merasakan kesembuhan. Yesus tiba-tiba berhenti dari langkahnya dan bertanya, 'Siapa yang menjamah pakaian-Ku?'",
    "Dengan ketakutan dan gemetar, perempuan itu tersungkur dan menceritakan semuanya. Yesus menatapnya dengan pandangan penuh kasih dan berkata, 'Hai anak-Ku, imanmu telah menyelamatkan engkau. Pergilah dengan damai dan sembuhlah dari penyakitmu!'"
  ],
  8: [
    "Penyakit kusta adalah hukuman mati yang lambat. Penderitanya diusir dari masyarakat, harus berteriak 'Najis!' agar orang menjauh. Suatu hari, seorang yang penuh kusta melihat Yesus dari kejauhan.",
    "Mengabaikan aturan ketat yang melarangnya mendekati orang sehat, ia berlari dan tersungkur di depan Yesus. Wajahnya menempel di tanah, menyiratkan keputusasaan yang teramat dalam.",
    "'Tuan,' katanya dengan suara parau, 'jika Engkau mau, Engkau dapat mentahirkan aku.' Ia sama sekali tidak meragukan kuasa Yesus, ia hanya berserah pada belas kasihan-Nya.",
    "Hati Yesus tergerak oleh belas kasihan yang dalam. Ia mengulurkan tangan-Nya—melakukan sesuatu yang secara hukum tak terbayangkan. Ia menyentuh kulit orang kusta itu.",
    "'Aku mau, jadilah engkau tahir,' kata Yesus. Seketika itu juga, kulit yang rusak itu pulih menjadi bersih kembali. Yesus tidak sekadar memberinya kesehatan, namun mengembalikan pria itu ke dalam kehidupan sosialnya."
  ],
  9: [
    "Perahu Yesus menepi di daerah Gerasa. Begitu Ia turun, seorang pria berlari ke arah-Nya dari pekuburan. Pria ini dirasuki roh jahat, telanjang, menakutkan, dan sering memutus rantai yang dipakaikan padanya.",
    "Ia berteriak dengan suara yang bukan miliknya, 'Apa urusan-Mu dengan aku, hai Yesus, Anak Allah Yang Mahatinggi? Demi Allah, jangan siksa aku!' Yesus dengan tenang bertanya, 'Siapa namamu?'",
    "'Namaku Legion, karena kami banyak,' jawab kumpulan roh itu. Mereka memohon dengan sangat agar tidak diusir ke dalam jurang maut, melainkan diizinkan masuk ke dalam kawanan babi di bukit terdekat.",
    "Yesus mengabulkannya. Roh-roh jahat itu keluar dan merasuki babi-babi, lalu seluruh kawanan babi yang berjumlah kira-kira dua ribu ekor itu terjun dari tepi jurang ke dalam danau dan mati lemas.",
    "Ketika penduduk kota datang, mereka melihat pria yang dulunya mengerikan itu kini duduk di kaki Yesus, berpakaian dan sudah waras. Namun alih-alih bersukacita, ketakutan yang besar menguasai masyarakat, dan mereka meminta Yesus pergi dari daerah mereka."
  ],
  10: [
    "Yairus, seorang kepala rumah ibadat, menembus kerumunan dan menjatuhkan dirinya di kaki Yesus. 'Anakku perempuan sedang sakit hampir mati,' isaknya pilu. 'Datanglah dan letakkan tangan-Mu atasnya supaya ia selamat.'",
    "Yesus menurut dan berjalan bersamanya. Namun di tengah jalan, akibat keramaian yang tertahan, kabar terburuk pun tiba. Beberapa orang dari rumah Yairus datang menyela, 'Anakmu sudah mati. Jangan lagi menyusahkan Guru.'",
    "Mendengar itu, Yesus menoleh kepada Yairus yang hancur hatinya dan berkata dengan sangat tegas, 'Jangan takut, percaya saja.' Mereka melanjutkan perjalanan, mengabaikan ratapan kematian yang mulai bergema.",
    "Tiba di rumah, Yesus melihat keributan besar. 'Mengapa kamu ribut dan menangis? Anak ini tidak mati, tetapi tidur,' kata Yesus. Orang-orang di sana menertawakan dan mengejek-Nya.",
    "Mengusir keramaian, Yesus masuk hanya dengan orang tua anak itu dan murid-murid-Nya. Ia memegang tangan anak yang kaku itu dan berkata, 'Talita kumi!' (Hai anak perempuan, bangunlah!). Seketika itu juga, anak itu bangkit, hidup kembali."
  ],
  11: [
    "Yesus dan murid-murid-Nya beserta orang banyak mendekati pintu gerbang kota Nain. Tepat pada saat itu, sebuah iring-iringan pemakaman yang menyedihkan sedang bergerak keluar dari gerbang kota.",
    "Di atas usungan mayat terbujur tubuh seorang pemuda, anak tunggal dari seorang ibu yang sudah janda. Ratapan sang ibu menyayat hati; ia baru saja kehilangan penopang dan satu-satunya keluarganya.",
    "Melihat wanita yang hancur lebur itu, hati Tuhan tergerak oleh belas kasihan. Tanpa diminta oleh siapapun, Yesus menghampiri janda itu dan dengan suara lembut berkata, 'Jangan menangis.'",
    "Yesus lalu melangkah maju dan menyentuh usungan mayat itu. Para pengusung pun terkejut dan berhenti. Dalam keheningan, Yesus berseru, 'Hai pemuda, Aku berkata kepadamu, bangkitlah!'",
    "Tiba-tiba, pemuda yang telah mati itu bangun, duduk, dan mulai berbicara. Yesus menyerahkannya kembali ke pelukan ibunya. Kekaguman bercampur takut melanda semua orang yang hadir hari itu."
  ],
  12: [
    "Saat melewati Yerusalem, Yesus melihat seorang yang buta sejak lahir. Murid-murid-Nya dengan pandangan teologis bertanya, 'Rabi, siapakah yang berbuat dosa, orang ini atau orang tuanya, sehingga ia dilahirkan buta?'",
    "Yesus menepis anggapan itu. 'Bukan karena dosa siapa pun, melainkan agar pekerjaan Allah dinyatakan di dalam dia.' Setelah berkata demikian, Yesus meludah ke tanah dan mengaduknya menjadi lumpur.",
    "Yesus mengoleskan lumpur itu tepat pada mata orang buta tersebut dan berkata, 'Pergilah, basuhlah dirimu dalam kolam Siloam.' Sebuah perintah tak lazim yang menguji ketaatan dalam kegelapannya.",
    "Dengan meraba-raba dan menuntun langkah dengan tongkatnya, pria itu berjalan tertatih menuju kolam. Ia membasuh wajahnya dengan air, membersihkan matanya dari sisa lumpur tersebut.",
    "Ketika ia membuka matanya, untuk pertama kalinya dalam hidupnya, cahaya menembus masuk. Ia bisa melihat! Ketika orang-orang meragukannya, ia bersaksi dengan berani, 'Satu hal yang aku tahu: aku tadinya buta, sekarang aku dapat melihat.'"
  ],
  13: [
    "Di daerah Dekapolis, sekelompok orang membawa kepada Yesus seorang pria yang tuli dan gagap. Mereka memohon agar Ia meletakkan tangan-Nya ke atas orang itu untuk menyembuhkannya.",
    "Yesus membawa orang itu menyendiri, menjauh dari kerumunan. Yesus sangat menghargai privasi pria ini, menjadikan penyembuhan ini sebagai perjumpaan pribadi, bukan tontonan masa.",
    "Yesus memasukkan jari-Nya ke telinga orang itu, lalu meludah dan meraba lidahnya. Tindakan fisik ini bagaikan bahasa isyarat kasih sayang yang bisa dipahami secara langsung oleh pria yang tak bisa mendengar itu.",
    "Sambil menengadah ke langit, Yesus menarik napas panjang dan berseru kepadanya dalam bahasa Aram, 'Efata!', yang artinya: Terbukalah!",
    "Seketika itu juga telinganya benar-benar terbuka, ikat lidahnya terlepas, dan ia dapat berbicara dengan sangat jelas. Orang-orang tak bisa menahan takjub dan berseru, 'Ia menjadikan segala-galanya baik!'"
  ],
  14: [
    "Pagi itu, dalam perjalanan kembali ke Yerusalem, Yesus merasa lapar. Dari kejauhan Ia melihat sebatang pohon ara yang rimbun dengan daun-daun hijau yang lebat, tampak menjanjikan.",
    "Namun saat Yesus mendekat dan mencari buah di sela-sela daunnya, Ia tidak menemukan buah satu pun. Pohon itu hanya penuh dengan daun, menampilkan sebuah kehidupan yang subur tanpa hasil yang nyata.",
    "Yesus berkata kepada pohon itu di depan para murid-Nya, 'Jangan lagi ada orang yang makan buahmu selama-lamanya!' Kata-kata itu terdengar penuh kuasa dan menghakimi.",
    "Keesokan harinya, saat mereka melewati jalan yang sama, Petrus terkejut dan menunjuk, 'Rabi, lihatlah! Pohon ara yang Kaukutuk itu sudah kering.' Pohon itu layu sampai ke akar-akarnya hanya dalam semalam.",
    "Yesus menggunakan momen itu untuk mengajarkan tentang iman: 'Jika kamu percaya dan tidak bimbang, kamu dapat memindahkan gunung.' Sebuah pelajaran tegas bahwa Tuhan mencari buah kerohanian yang nyata, bukan sekadar penampakan."
  ],
  15: [
    "Seorang perwira militer Romawi di Kapernaum sedang berduka. Hamba kesayangannya menderita sakit lumpuh yang parah. Ia mengutus beberapa pemuka Yahudi untuk memohon pertolongan Yesus.",
    "Para pemuka itu mendesak Yesus, 'Ia layak ditolong, sebab ia mengasihi bangsa kita dan bahkan membangun rumah ibadat bagi kami.' Yesus pun menyetujui dan berangkat ke sana.",
    "Namun sebelum Yesus tiba, perwira itu mengirimkan pesan, 'Tuan, jangan bersusah-susah, sebab aku tidak layak menerima Tuan di dalam rumahku. Itu sebabnya aku pun tidak menganggap diriku layak datang kepada-Mu.'",
    "Pesan itu berlanjut, 'Katakan saja sepatah kata, maka hambaku itu akan sembuh. Sebab aku sendiri tahu apa artinya tunduk pada otoritas.' Sang perwira memahami bahwa kuasa Kristus melampaui batas ruang dan waktu.",
    "Yesus sangat heran dan berpaling kepada orang banyak, 'Iman sebesar ini tidak pernah Aku jumpai, sekalipun di antara orang Israel!' Dan pada jam itu juga, hamba perwira itu sembuh total tanpa Yesus harus menemuinya."
  ],
  16: [
    "Maria dan Marta mengutus seseorang kepada Yesus dengan kabar: 'Tuhan, orang yang Engkau kasihi sakit keras.' Namun Yesus menunda keberangkatan selama dua hari. Ketika akhirnya Ia berangkat ke Betania, Lazarus sudah meninggal dan dimakamkan selama empat hari.",
    "Marta berlari menyongsong Yesus: 'Tuhan, seandainya Engkau ada di sini, saudaraku tidak akan mati.' Yesus berkata: 'Saudaramu akan bangkit.' Marta menjawab: 'Aku tahu ia akan bangkit pada hari terakhir.' Yesus berkata: 'Akulah kebangkitan dan hidup.'",
    "Maria datang tersungkur di kaki Yesus dan menangis. Para pelayat ikut menangis. Dan Injil Yohanes mencatat sesuatu yang mengharukan: Yesus pun menangis. Allah yang menjadi manusia itu menangis di depan kubur sahabat-Nya — bukan karena tidak tahu apa yang akan terjadi, melainkan karena benar-benar merasakan duka manusia.",
    "Yesus meminta batu penutup kubur disingkirkan. Marta memperingatkan: 'Tuhan, ia sudah berbau, karena ia sudah empat hari mati.' Ini adalah kasus yang mustahil secara manusia. Yesus berkata: 'Jikalau engkau percaya, kamu akan melihat kemuliaan Allah.' Ia mendongak ke langit dan berdoa.",
    "Yesus berseru dengan suara keras: 'Lazarus, keluarlah!' Dan dari dalam kegelapan kubur, sesosok tubuh berjalan keluar — masih terbungkus kain kafan. 'Bukalah kain-kain itu dan biarkan ia pergi.' Kematian telah dikalahkan. Banyak orang yang hadir hari itu percaya — dan kabar itu mengubah segalanya."
  ],
  17: [
    "Yesus memasuki kota Yerikho, dan kerumunan yang luar biasa besar mengiringi-Nya. Di kota itu tinggal Zakheus, seorang kepala pemungut cukai yang sangat kaya namun amat dibenci karena dianggap pengkhianat bangsa.",
    "Zakheus sangat ingin melihat Yesus. Namun badannya pendek dan pandangannya terhalang orang banyak. Mengabaikan wibawanya, ia berlari mendahului dan memanjat pohon ara sycamore agar bisa melihat ke jalan.",
    "Ketika Yesus sampai di bawah pohon itu, Ia menengadah, menatap tepat ke matanya dan memanggil, 'Zakheus, segeralah turun, sebab hari ini Aku harus menumpang di rumahmu.'",
    "Dengan sukacita Zakheus turun dan menerima Yesus. Kerumunan mulai bersungut-sungut, 'Ia menumpang di rumah orang berdosa.' Namun kehadiran kasih karunia di rumahnya telah mengubah hati Zakheus sepenuhnya.",
    "Zakheus berdiri dan berjanji, 'Tuhan, setengah dari hartaku akan kuberikan kepada orang miskin, dan yang kuperas akan kukembalikan empat kali lipat!' Yesus tersenyum, 'Hari ini telah terjadi keselamatan kepada rumah ini.'"
  ],
  18: [
    "Di Kapernaum, para pemungut bea Bait Allah mendatangi Petrus dan bertanya dengan penuh curiga, 'Apakah gurumu tidak membayar bea dua dirham?' Petrus dengan cepat membela, 'Memang membayar.'",
    "Namun saat Petrus masuk ke rumah, Yesus langsung bertanya, 'Menurutmu Simon, dari siapakah raja-raja memungut cukai? Dari anak-anaknya sendiri atau dari orang asing?' Petrus menjawab, 'Dari orang asing.'",
    "Yesus menjelaskan, 'Jadi bebaslah anak-anaknya. Tetapi supaya kita jangan menjadi batu sandungan bagi mereka, pergilah memancing ke danau.'",
    "'Tangkaplah ikan pertama yang kautarik ke atas,' instruksi Yesus, 'dan bukalah mulutnya. Engkau akan menemukan sekeping uang empat dirham di dalamnya.'",
    "Petrus pun pergi memancing. Tepat seperti yang disabdakan Yesus, ikan tangkapan pertamanya memiliki koin emas di mulutnya. Petrus mengambilnya dan membayarkannya untuk Yesus dan untuk dirinya sendiri."
  ],
  19: [
    "Dalam perjalanan ke Yerusalem, Yesus melewati perbatasan Samaria dan Galilea. Saat mendekati sebuah desa, sepuluh orang penderita kusta menemui-Nya. Mereka berdiri dari kejauhan karena aturan kenajisan.",
    "Dengan suara lantang dan penuh permohonan mereka berseru, 'Yesus, Guru, kasihanilah kami!' Mereka sangat mengharapkan sebuah keajaiban yang bisa menyudahi penderitaan mereka.",
    "Yesus memandang mereka dan memberi perintah yang menguji iman: 'Pergilah, perlihatkanlah dirimu kepada imam-imam.' Saat mereka berbalik, belum ada satu pun tanda kesembuhan pada tubuh mereka.",
    "Mukjizat itu terjadi saat mereka melangkah dalam ketaatan. Di tengah jalan, kulit mereka yang membusuk perlahan pulih sempurna. Kesepuluh orang itu menjadi tahir seluruhnya!",
    "Namun dari sepuluh orang yang sembuh, hanya satu yang kembali untuk tersungkur di kaki Yesus dan mengucap syukur. Ia adalah seorang Samaria. Yesus bertanya dengan sedih, 'Di manakah yang sembilan orang itu?'"
  ],
  20: [
    "Di Yerusalem, dekat Pintu Gerbang Domba, terdapat sebuah kolam bernama Betesda. Serambi-serambinya selalu dipenuhi orang sakit, buta, dan lumpuh, yang menantikan air kolam itu bergoncang karena percaya ada malaikat penyembuh.",
    "Di sana terbaring seorang pria yang sudah tiga puluh delapan tahun menderita sakit lumpuh. Hidupnya berlalu hari demi hari tanpa harapan di tepi kolam yang tak pernah bisa ia capai tepat waktu.",
    "Yesus melihatnya dan tahu sudah amat lama ia dalam keadaan itu. Yesus mendekatinya dan bertanya, 'Maukah engkau sembuh?'",
    "Pria itu menjawab dengan keluhan, 'Tuan, tidak ada orang yang menurunkan aku ke dalam kolam itu bila airnya goncang. Orang lain selalu mendahului aku.' Matanya tertuju pada air, bukan pada Sang Pembuat Mukjizat.",
    "Yesus bersabda, 'Bangunlah, angkatlah tilammu dan berjalanlah.' Seketika itu juga otot-ototnya kuat, ia mengangkat tilamnya, dan berjalan. Karena hari itu adalah hari Sabat, perbuatan baik ini memicu kemarahan para ahli Taurat."
  ],
  21: [
    "Pada suatu hari Sabat, Yesus masuk ke sebuah rumah ibadat dan mengajar. Di antara jemaat ada seorang pria yang tangan kanannya mati layu tak berdaya.",
    "Ahli-ahli Taurat dan orang-orang Farisi terus mengamat-amati Yesus. Mereka menunggu apakah Ia akan menyembuhkan pada hari Sabat, sebagai alasan kuat untuk mempersalahkan-Nya secara hukum.",
    "Mengetahui pikiran jahat mereka, Yesus berkata kepada pria yang tangannya layu itu, 'Bangunlah dan berdirilah di tengah-tengah!' Pria itu pun maju ke depan, membelah ketegangan ruangan.",
    "Yesus menantang para munafik itu, 'Manakah yang diperbolehkan pada hari Sabat, berbuat baik atau berbuat jahat? Menyelamatkan nyawa atau membinasakannya?' Mereka semua bungkam seribu bahasa.",
    "Yesus memandang mereka dengan marah bercampur duka atas kekerasan hati mereka. Lalu Ia menoleh ke pria itu, 'Ulurkanlah tanganmu!' Ia mengulurkannya, dan tangannya pulih seketika seperti sedia kala."
  ],
  22: [
    "Di suatu rumah ibadat pada hari Sabat, ada seorang perempuan malang yang telah delapan belas tahun diikat penyakit yang membuat punggungnya bungkuk parah. Ia tak bisa berdiri tegak sedikit pun.",
    "Belasan tahun ia hanya menunduk melihat debu. Namun hari itu, pandangan kasih Yesus tertuju padanya. Ia memanggilnya ke depan di tengah ibadah.",
    "'Hai ibu, penyakitmu telah sembuh,' sabda Yesus seraya meletakkan tangan-Nya. Seketika itu juga, punggungnya lurus. Ia akhirnya bisa menatap ke atas dan mulai memuliakan Allah dengan air mata sukacita.",
    "Kepala rumah ibadat menjadi sangat gusar atas 'pelanggaran' hukum Sabat ini. Ia berteriak kepada jemaat, 'Ada enam hari untuk bekerja, datanglah berobat pada hari itu, jangan pada hari Sabat!'",
    "Yesus membongkar kemunafikannya: 'Hai orang munafik, bukankah kamu melepaskan ternakmu untuk diberi minum pada hari Sabat? Masakan anak Abraham yang diikat Iblis 18 tahun ini tidak boleh dilepaskan pada hari Sabat!' Lawan-lawan-Nya pun sangat malu."
  ],
  23: [
    "Saat Yesus bersama kerumunan besar hendak meninggalkan kota Yerikho, seorang pengemis buta bernama Bartimeus sedang duduk di pinggir jalan raya yang berdebu.",
    "Mendengar derap langkah rombongan dan mengetahui bahwa yang lewat adalah Yesus orang Nazaret, Bartimeus segera berteriak sekuat tenaga, 'Yesus, Anak Daud, kasihanilah aku!'",
    "Banyak orang yang risih menyuruhnya diam. Namun hal itu justru membuatnya berteriak makin keras. Teriakan imannya menembus hiruk-pikuk dan menyentuh hati Sang Juruselamat. Yesus pun berhenti melangkah.",
    "'Panggillah dia,' titah Yesus. Orang banyak berkata, 'Kuatkan hatimu, berdirilah, Ia memanggilmu.' Bartimeus membuang jubah pengemisnya dan melompat maju menuju arah suara Yesus.",
    "'Apa yang kaukehendaki supaya Aku perbuat bagimu?' tanya Yesus lembut. 'Rabuni, supaya aku dapat melihat,' isaknya. 'Pergilah, imanmu telah menyelamatkan engkau.' Seketika matanya terbuka, dan ia mengikuti Yesus di jalan itu."
  ],
  24: [
    "Langit sore di Golgota berubah gelap. Di atas kayu salib, Yesus menanggung beban seluruh dosa dunia. Para prajurit berjaga, beberapa perempuan menangis dari kejauhan. Dengan nafas terakhir yang berat, Yesus berseru: 'Sudah selesai!' — dan menyerahkan nyawa-Nya. Tanah berguncang. Tabir Bait Suci robek dua dari atas sampai ke bawah.",
    "Tubuh Yesus diturunkan dengan hati-hati oleh tangan-tangan yang gemetar. Yusuf dari Arimatea dan Nikodemus membungkus tubuh-Nya dengan kain lenan dan meletakkan-Nya di kubur baru yang dipahat dari batu. Sebuah batu besar menggelinding menutup pintu kubur itu — seolah menutup semua harapan bersama-Nya.",
    "Hari pertama berlalu dalam duka. Hari kedua dalam sunyi yang mencekam. Para murid bersembunyi di balik pintu-pintu terkunci. Namun sebelum fajar hari ketiga, Maria Magdalena dan beberapa perempuan datang ke kubur membawa rempah-rempah — dan menemukan sesuatu yang mengubah sejarah: batu telah terguling. Kubur itu kosong.",
    "Dua malaikat dalam pakaian putih cemerlang berkata: 'Mengapa kamu mencari Dia yang hidup di antara orang mati? Ia tidak ada di sini. Ia telah bangkit!' Maria berlari menemui para murid. Petrus dan Yohanes berlomba menuju kubur. Mereka melihat kain kafan terlipat rapi — bukan tanda perampokan, tapi tanda ketertiban ilahi.",
    "Yesus bangkit dalam tubuh yang nyata — yang bisa makan ikan bakar bersama murid-murid-Nya, yang memanggil nama Maria dengan suara yang dikenalnya. Kebangkitan-Nya bukan akhir dari cerita, melainkan awal dari segalanya. Maut yang selama ribuan tahun dianggap pemenang terakhir kini telah dikalahkan. 'Aku adalah kebangkitan dan hidup.'"
  ]
};


// ═══════════════════════════════════════════════════════════════
// BAGIAN 3: STATE
// ═══════════════════════════════════════════════════════════════
let currentSceneIndex = 0;
let _sceneIsTransitioning = false;
let _isSceneTtsSpeaking = false; 
let _isSceneTtsPaused = false;   

function getPhaseGradient(phase) {
  const colors = {
    kana:      "linear-gradient(135deg, #1a56db 0%, #3b82f6 55%, #60a5fa 100%)",
    galilea:   "linear-gradient(135deg, #0369a1 0%, #0891b2 55%, #22d3ee 100%)",
    yerusalem: "linear-gradient(135deg, #7c3aed 0%, #a855f7 55%, #c084fc 100%)",
  };
  return colors[phase] || colors.kana;
}

// ═══════════════════════════════════════════════════════════════
// BAGIAN 4: CSS STYLES (Injeksi kelas untuk mengganti tampilan lama)
// ═══════════════════════════════════════════════════════════════
(function injectSceneStyles() {
  if (document.getElementById("scene-storytelling-styles")) return;
  const style = document.createElement("style");
  style.id = "scene-storytelling-styles";
  style.textContent = [
    "body.scene-mode #story-hero, body.scene-mode #story-title, body.scene-mode #story-subtitle, body.scene-mode #story-text, body.scene-mode #story-image-container, body.scene-mode #screen-story footer { display: none !important; }",
    "body.scene-mode #btn-tts, body.scene-mode button[onclick='stopTTS()'] { display: none !important; }",
    "body.scene-mode .makna-block { display: none !important; }",
    "body.scene-mode.scene-last .makna-block { display: block !important; animation: rise 0.6s ease both; margin-top: 24px; }",
    "body.scene-mode #screen-story { padding-bottom: 24px !important; }",
    
    "#scene-storytelling-wrapper{display:none;flex-direction:column;gap:0;margin-top:20px;}",
    "#scene-storytelling-wrapper.active{display:flex;animation:scSlideUp 0.45s cubic-bezier(.22,1,.36,1) both;}",
    "@keyframes scSlideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}",
    
    "#scene-image-container{position:relative;width:100%;height:260px;border-radius:24px;overflow:hidden;background:var(--surface2);box-shadow:0 12px 32px rgba(0,0,0,.15); margin-bottom: 20px;}",
    "#scene-img-current,#scene-img-next{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:24px;transition:opacity .55s cubic-bezier(.4,0,.2,1);}",
    "#scene-img-current{opacity:1;z-index:2;}#scene-img-next{opacity:0;z-index:1;}",
    "#scene-img-current.sc-fade-out{opacity:0!important;}#scene-img-next.sc-fade-in{opacity:1!important;}",
    "#scene-image-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 50%,rgba(0,0,0,.65) 100%);z-index:4;border-radius:24px;pointer-events:none;}",
    
    "#scene-placeholder{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;z-index:0;border-radius:24px;transition:background .4s ease;}",
    "#scene-placeholder-icon{font-size:60px;opacity:.9; color: rgba(255,255,255,0.9);}",
    "#scene-placeholder-label{font-family:'Plus Jakarta Sans',sans-serif;font-size:1rem;font-weight:700;letter-spacing:.5px;opacity:.9; color: rgba(255,255,255,0.9);}",
    
    "#scene-badge{position:absolute;top:16px;left:16px;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:.7rem;font-weight:800;padding:6px 14px;border-radius:99px;z-index:10;letter-spacing:.6px;text-transform:uppercase;transition:all .3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.2);}",
    "#scene-progress-dots{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:10;}",
    ".scene-dot{width:8px;height:8px;border-radius:99px;background:rgba(255,255,255,.3);transition:all .35s cubic-bezier(.4,0,.2,1);cursor:pointer;}",
    ".scene-dot.active{width:24px;background:#fff;}",
    ".scene-dot:hover:not(.active){background:rgba(255,255,255,.6);}",
    
    "#scene-text-area{padding:0 8px; opacity:1;transform:translateY(0);transition:opacity .38s ease,transform .38s ease;}",
    "#scene-text-area.sc-changing{opacity:0;transform:translateY(10px);}",
    "#scene-narration{font-family:'Lora',Georgia,serif;font-size:1.05rem;line-height:1.85;color:var(--on-surface); margin-bottom: 20px;}",
    
    ".btn-tts-control{display:flex;align-items:center;gap:6px;background:var(--surface2);border:1px solid var(--border);color:var(--primary);padding:8px 18px;border-radius:99px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.85rem;cursor:pointer;transition:all 0.2s;}",
    ".btn-tts-control:hover{background:var(--primary-light);}",
    ".btn-tts-control:active{transform:scale(0.96);}",

    "#btn-lanjut-cerita{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:16px 20px;border:none;border-radius:16px;background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:1rem;cursor:pointer;box-shadow:0 6px 20px rgba(26,86,219,.3);transition:all .25s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden;-webkit-tap-highlight-color:transparent;}",
    "#btn-lanjut-cerita:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(26,86,219,.4);}",
    "#btn-lanjut-cerita:active{transform:scale(.97);}",
    "#btn-lanjut-cerita.sc-is-finish{background:linear-gradient(135deg,#059669,#10b981);box-shadow:0 6px 20px rgba(16,185,129,.35);}",
    "#btn-lanjut-cerita .btn-ripple{position:absolute;inset:0;background:linear-gradient(120deg,transparent,rgba(255,255,255,.25),transparent);transform:translateX(-100%);transition:transform .6s ease;}",
    "#btn-lanjut-cerita:hover .btn-ripple{transform:translateX(100%);}",
    "#scene-tap-hint{text-align:center;font-family:'Plus Jakarta Sans',sans-serif;font-size:.75rem;color:var(--muted);margin-top:12px;opacity:.7;letter-spacing:.2px;}",
  ].join("");
  document.head.appendChild(style);
})();

// ═══════════════════════════════════════════════════════════════
// BAGIAN 5: HELPER FUNCTIONS (Logika Fallback & Data Fetching)
// ═══════════════════════════════════════════════════════════════
function getActiveStoryParts(miracle) {
  var parts = miracle.story_parts;
  if (miracle.story_parts_variations && typeof userPath !== 'undefined' && miracle.story_parts_variations[userPath]) {
    parts = miracle.story_parts_variations[userPath];
  }
  return parts;
}

function getSceneImage(miracle, sceneIdx) {
  var map = SCENE_IMAGE_MAP[miracle.id];
  if (map && map[sceneIdx] != null) return map[sceneIdx];
  return miracle.image || null; 
}

function getSceneNarration(miracle, sceneIdx) {
  var narMap = SCENE_NARRATION_MAP[miracle.id];
  if (narMap && narMap[sceneIdx]) return narMap[sceneIdx];
  
  var parts = getActiveStoryParts(miracle);
  if (parts && parts[sceneIdx] != null) {
    var part = parts[sceneIdx];
    return typeof part === "string" ? part : (part.text || "");
  }
  return "";
}

function getTotalScenes(miracle) {
  var narMap = SCENE_NARRATION_MAP[miracle.id];
  if (narMap) return narMap.length;
  var parts = getActiveStoryParts(miracle);
  if (parts) return parts.length;
  return 1;
}

// ═══════════════════════════════════════════════════════════════
// BAGIAN 6: BUILD SCENE UI (Membangun Struktur HTML secara Dinamis)
// ═══════════════════════════════════════════════════════════════
function buildSceneUI(miracle) {
  var storyScreen = document.getElementById("screen-story");
  if (!storyScreen) return;

  var old = document.getElementById("scene-storytelling-wrapper");
  if (old) old.remove();

  var totalScenes = getTotalScenes(miracle);
  var dotsHtml = Array.from({ length: totalScenes }, function(_, i) {
    return '<div class="scene-dot' + (i === 0 ? ' active' : '') + '" onclick="jumpToScene(' + i + ')" title="Adegan ' + (i+1) + '"></div>';
  }).join("");

  var wrapper = document.createElement("div");
  wrapper.id = "scene-storytelling-wrapper";
  wrapper.className = "active";
  wrapper.innerHTML =
    '<div id="scene-image-container">' +
      '<div id="scene-placeholder">' +
        '<span class="material-symbols-outlined" id="scene-placeholder-icon" style="font-variation-settings:\"FILL\" 1">' + (miracle.icon || 'auto_stories') + '</span>' +
        '<span id="scene-placeholder-label">' + (miracle.title || 'Adegan') + '</span>' +
      '</div>' +
      '<img id="scene-img-current" src="" alt="Scene aktif" style="opacity:0;" />' +
      '<img id="scene-img-next" src="" alt="Scene berikut" style="opacity:0;" />' +
      '<div id="scene-image-overlay"></div>' +
      '<div id="scene-badge">Adegan 1 / ' + totalScenes + '</div>' +
      '<div id="scene-progress-dots">' + dotsHtml + '</div>' +
    '</div>' +
    '<div id="scene-text-area">' +
      '<p id="scene-narration"></p>' +
      '<div style="display:flex; justify-content:center; gap:8px; margin-bottom:24px;">' +
        '<button class="btn-tts-control" id="btn-scene-tts-play" onclick="playPauseSceneTTS()">' +
           '<span class="material-symbols-outlined" id="btn-scene-tts-icon" style="font-size:18px;">volume_up</span>' +
           '<span id="btn-scene-tts-label">Dengarkan Adegan</span>' +
        '</button>' +
        '<button class="btn-tts-control" id="btn-scene-tts-stop" onclick="stopSceneTTS()" style="display:none; color:var(--error); border-color:var(--error);">' +
           '<span class="material-symbols-outlined" style="font-size:18px;">stop_circle</span>' +
           '<span>Stop</span>' +
        '</button>' +
      '</div>' +
    '</div>' +
    '<div>' +
      '<button id="btn-lanjut-cerita" onclick="handleLanjutCerita()">' +
        '<span class="btn-ripple"></span>' +
        '<span id="btn-lanjut-label">Lanjut Cerita</span>' +
        '<span class="material-symbols-outlined" id="btn-lanjut-icon" style="font-size:20px;">arrow_forward</span>' +
      '</button>' +
      '<p id="scene-tap-hint">Ketuk tombol untuk melanjutkan ke adegan berikutnya</p>' +
    '</div>';

  var storyTextEl = document.getElementById("story-text");
  if (storyTextEl && storyTextEl.parentElement) {
    storyTextEl.parentElement.insertBefore(wrapper, storyTextEl);
  } else {
    var mainEl = storyScreen.querySelector("main") || storyScreen;
    mainEl.appendChild(wrapper);
  }
}

// ═══════════════════════════════════════════════════════════════
// BAGIAN 7: LOAD SCENE (Logika Transisi & Animasi)
// ═══════════════════════════════════════════════════════════════
function loadScene(miracle, sceneIdx, animate) {
  if (_sceneIsTransitioning) return;

  if (speechSynthesis.speaking) {
      window.stopSceneTTS();
  }

  var totalScenes = getTotalScenes(miracle);
  var imgUrl      = getSceneImage(miracle, sceneIdx);
  var narration   = getSceneNarration(miracle, sceneIdx);
  var isLast      = sceneIdx >= totalScenes - 1;

  var badge = document.getElementById("scene-badge");
  if (badge) badge.textContent = "Adegan " + (sceneIdx+1) + " / " + totalScenes;
  
  // FIX: Update story-header-scene on every scene change
  var headerScene = document.getElementById("story-header-scene");
  if (headerScene) headerScene.textContent = "Adegan " + (sceneIdx+1) + " / " + totalScenes;

  document.querySelectorAll(".scene-dot").forEach(function(dot, i) {
    dot.classList.toggle("active", i === sceneIdx);
  });

  var btnLabel = document.getElementById("btn-lanjut-label");
  var btnIcon  = document.getElementById("btn-lanjut-icon");
  var btn      = document.getElementById("btn-lanjut-cerita");
  var tapHint  = document.getElementById("scene-tap-hint");

  if (btnLabel) btnLabel.textContent = isLast ? "Lanjutkan ke Keputusan" : "Lanjut Cerita";
  if (btnIcon)  btnIcon.textContent  = isLast ? "flag" : "arrow_forward";
  if (btn)      btn.classList.toggle("sc-is-finish", isLast);
  if (tapHint)  tapHint.style.display = isLast ? "none" : "block";

  if (isLast) {
    document.body.classList.add("scene-last");
  } else {
    document.body.classList.remove("scene-last");
  }

  // Inject VR for miracle 24 scene 5
  window.injectVRScene(miracle, sceneIdx);

  if (!animate) {
    _applyImageDirect(miracle, imgUrl);
    _applyNarrationDirect(narration);
    return;
  }

  _sceneIsTransitioning = true;
  _crossfadeImage(miracle, imgUrl);
  _fadeNarration(narration);
  
  // FAILSAFE: Jika animasi macet, bebaskan status transisi setelah 1.5 detik
  setTimeout(function() {
      _sceneIsTransitioning = false;
  }, 1500);
}

// ═══════════════════════════════════════════════════════════════
// BAGIAN 8: LOGIKA TEXT-TO-SPEECH (TTS) - PLAY, PAUSE, STOP
// ═══════════════════════════════════════════════════════════════
window.playPauseSceneTTS = function() {
  if (speechSynthesis.speaking) {
    if (speechSynthesis.paused || _isSceneTtsPaused) {
      speechSynthesis.resume();
      _isSceneTtsPaused = false;
    } else {
      speechSynthesis.pause();
      _isSceneTtsPaused = true;
    }
    _updateSceneTtsBtnUI();
    return;
  }

  var m = (typeof appData !== 'undefined' && appData.miracles)
    ? appData.miracles[typeof currentIdx !== 'undefined' ? currentIdx : 0]
    : null;
  if (!m) return;

  var text = getSceneNarration(m, currentSceneIndex);
  var cleanText = text.replace(/<[^>]+>/g, ''); 

  var utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = "id-ID";
  utterance.rate = 0.95;

  utterance.onstart = function() {
    _isSceneTtsSpeaking = true;
    _isSceneTtsPaused = false;
    _updateSceneTtsBtnUI();
  };
  
  utterance.onend = function() {
    _isSceneTtsSpeaking = false;
    _isSceneTtsPaused = false;
    _updateSceneTtsBtnUI();
  };
  
  utterance.onerror = function(e) {
    if(e.error !== 'canceled') {
      _isSceneTtsSpeaking = false;
      _isSceneTtsPaused = false;
      _updateSceneTtsBtnUI();
    }
  };

  utterance.onpause = function() {
    _isSceneTtsPaused = true;
    _updateSceneTtsBtnUI();
  };

  utterance.onresume = function() {
    _isSceneTtsPaused = false;
    _updateSceneTtsBtnUI();
  };

  speechSynthesis.speak(utterance);
};

window.stopSceneTTS = function() {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }
  _isSceneTtsSpeaking = false;
  _isSceneTtsPaused = false;
  _updateSceneTtsBtnUI();
};

function _updateSceneTtsBtnUI() {
  var btnPlay = document.getElementById("btn-scene-tts-play");
  var btnStop = document.getElementById("btn-scene-tts-stop");
  var icon = document.getElementById("btn-scene-tts-icon");
  var label = document.getElementById("btn-scene-tts-label");
  
  if (!btnPlay || !icon || !label || !btnStop) return;

  if (_isSceneTtsSpeaking) {
    btnStop.style.display = "flex"; 
    
    if (_isSceneTtsPaused) {
      icon.textContent = "play_arrow";
      label.textContent = "Lanjutkan";
      btnPlay.style.color = "var(--primary)";
      btnPlay.style.borderColor = "var(--border)";
      btnPlay.style.background = "var(--surface2)";
    } else {
      icon.textContent = "pause";
      label.textContent = "Jeda";
      btnPlay.style.color = "var(--accent)"; 
      btnPlay.style.borderColor = "var(--accent)";
      btnPlay.style.background = "#fffbeb"; 
    }
  } else {
    btnStop.style.display = "none"; 
    icon.textContent = "volume_up";
    label.textContent = "Dengarkan Adegan";
    btnPlay.style.color = "var(--primary)";
    btnPlay.style.borderColor = "var(--border)";
    btnPlay.style.background = "var(--surface2)";
  }
}

// ═══════════════════════════════════════════════════════════════
// BAGIAN 9: IMAGE & FALLBACK HELPERS (URUTAN FIX CACHE)
// ═══════════════════════════════════════════════════════════════
function _applyImageDirect(miracle, imgUrl) {
  var cur         = document.getElementById("scene-img-current");
  var placeholder = document.getElementById("scene-placeholder");
  if (!cur) return;
  
  var showPlaceholder = function() {
    cur.style.opacity = "0";
    if (placeholder) {
      placeholder.style.display = "flex";
      placeholder.style.background = getPhaseGradient(miracle.phase);
    }
  };

  if (imgUrl) {
    // PASANG LISTENER SEBELUM SRC UNTUK MENGATASI CACHE
    cur.onload = function() {
      cur.style.opacity = "1";
      if (placeholder) placeholder.style.display = "none";
    };
    cur.onerror = showPlaceholder;
    cur.src = imgUrl; 
  } else {
    showPlaceholder();
  }
}

function _crossfadeImage(miracle, imgUrl) {
  var cur = document.getElementById("scene-img-current");
  var nxt = document.getElementById("scene-img-next");
  var placeholder = document.getElementById("scene-placeholder");
  
  if (!cur || !nxt) { _sceneIsTransitioning = false; return; }

  var finalizeTransition = function() {
    cur.src = nxt.src;
    cur.style.opacity = "1";
    cur.style.zIndex  = "2";
    cur.classList.remove("sc-fade-out");
    nxt.src = "";
    nxt.style.opacity = "0";
    nxt.style.zIndex  = "1";
    nxt.classList.remove("sc-fade-in");
    _sceneIsTransitioning = false;
  };

  var doCrossfade = function() {
    if (placeholder) placeholder.style.display = "none";
    nxt.style.zIndex = "3";
    cur.style.zIndex = "2";
    nxt.classList.add("sc-fade-in");
    nxt.style.opacity = "1";
    cur.classList.add("sc-fade-out");
    cur.style.opacity = "0";
    setTimeout(finalizeTransition, 600);
  };

  if (imgUrl) {
    nxt.style.opacity = "0";
    nxt.style.zIndex  = "1";
    
    // PASANG LISTENER SEBELUM SRC UNTUK MENGATASI CACHE
    nxt.onload = doCrossfade;
    nxt.onerror = function() {
        _sceneIsTransitioning = false; 
        console.warn("Gagal memuat gambar: " + imgUrl);
    };
    nxt.src = imgUrl; 
  } else {
    _sceneIsTransitioning = false;
  }
}

// ═══════════════════════════════════════════════════════════════
// BAGIAN 10: NARRATION HELPERS
// ═══════════════════════════════════════════════════════════════
function _applyNarrationDirect(text) {
  var el = document.getElementById("scene-narration");
  if (el) el.innerHTML = text; 
}

function _fadeNarration(text) {
  var area = document.getElementById("scene-text-area");
  var el   = document.getElementById("scene-narration");
  if (!area || !el) return;
  area.classList.add("sc-changing");
  setTimeout(function() {
    el.innerHTML = text;
    area.classList.remove("sc-changing");
  }, 380);
}

// ═══════════════════════════════════════════════════════════════
// BAGIAN 11: TOMBOL & JUMP LOGIC
// ═══════════════════════════════════════════════════════════════
window.handleLanjutCerita = function() {
  var m = (typeof appData !== 'undefined' && appData.miracles)
    ? appData.miracles[typeof currentIdx !== 'undefined' ? currentIdx : 0]
    : null;
  if (!m) return;
  
  var totalScenes = getTotalScenes(m);
  if (currentSceneIndex < totalScenes - 1) {
    currentSceneIndex++;
    loadScene(m, currentSceneIndex, true);
    
    const storyScreen = document.getElementById("screen-story");
    if(storyScreen) storyScreen.scrollTo({ top: 0, behavior: 'smooth' });
    
  } else {
    window.stopSceneTTS();
    if (typeof window.goToDecision === "function") window.goToDecision();
  }
};

window.jumpToScene = function(sceneIdx) {
  if (_sceneIsTransitioning) return;
  var m = (typeof appData !== 'undefined' && appData.miracles)
    ? appData.miracles[typeof currentIdx !== 'undefined' ? currentIdx : 0]
    : null;
  if (!m) return;
  if (sceneIdx === currentSceneIndex) return;
  
  currentSceneIndex = sceneIdx;
  loadScene(m, sceneIdx, true);
};


// ═══════════════════════════════════════════════════════════════
// BAGIAN VR: WebAR Integration (Miracle 24 Scene 5)
// ═══════════════════════════════════════════════════════════════
(function setupVRButton() {
  function doSetup() {
    if (typeof appData === 'undefined' || !appData) { setTimeout(doSetup, 200); return; }
    var origRenderStory = window.renderStory;
    // VR check is done inside loadScene override below
  }
  doSetup();
})();

// ═══════════════════════════════════════════════════════════════
// BAGIAN FEEDBACK: Confetti & Haptic Feedback for Quiz/Decision
// ═══════════════════════════════════════════════════════════════
window.triggerCorrectFeedback = function() {
  // Haptic feedback
  if (navigator.vibrate) { try { navigator.vibrate([30, 20, 60]); } catch(e){} }
  
  // Confetti burst
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1a56db', '#10b981', '#f59e0b', '#7c3aed', '#ffffff'],
      zIndex: 9999
    });
    setTimeout(function() {
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { x: 0.1, y: 0.7 },
        colors: ['#60a5fa', '#34d399'],
        zIndex: 9999
      });
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { x: 0.9, y: 0.7 },
        colors: ['#fbbf24', '#a78bfa'],
        zIndex: 9999
      });
    }, 200);
  }
};

window.triggerWrongFeedback = function() {
  // Haptic feedback for wrong
  if (navigator.vibrate) { try { navigator.vibrate([80, 30, 80]); } catch(e){} }
};

// ═══════════════════════════════════════════════════════════════
// BAGIAN SKELETON: Skeleton Loading Screen
// ═══════════════════════════════════════════════════════════════
(function setupSkeletonLoading() {
  var loadingOverlay = document.getElementById("loading-overlay");
  if (loadingOverlay) {
    loadingOverlay.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:20px;padding:24px;width:100%;max-width:400px;">' +
      '<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#1a56db22,#7c3aed22);display:flex;align-items:center;justify-content:center;">' +
        '<div class="loader"></div>' +
      '</div>' +
      '<div style="font-family:Plus Jakarta Sans,sans-serif;font-size:1rem;font-weight:700;color:var(--primary)">Memuat Perjalanan...</div>' +
      '<div style="width:100%;display:flex;flex-direction:column;gap:12px;">' +
        [1,2,3].map(function(){ return '<div style="height:80px;border-radius:16px;background:var(--surface2);position:relative;overflow:hidden;">' +
          '<div style="position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);animation:shimmer 1.5s infinite;"></div>' +
          '</div>'; }).join("") +
      '</div>' +
    '</div>';
  }
})();

// ═══════════════════════════════════════════════════════════════
// BAGIAN LEARNING OBJECTIVES: Show per miracle before starting  
// ═══════════════════════════════════════════════════════════════
window.showMiracleLearningObjective = function(miracle, onContinue) {
  var overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(15,23,42,0.8);backdrop-filter:blur(10px);z-index:99999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.3s;padding:20px;";
  
  var obj = miracle.learning_objectives || [];
  var pedagogical = (typeof pedagogicalMapping !== 'undefined' && pedagogicalMapping[miracle.id]) ? pedagogicalMapping[miracle.id] : null;
  
  overlay.innerHTML = '<div style="background:var(--surface);border-radius:24px;padding:28px;max-width:420px;width:100%;box-shadow:0 30px 80px rgba(0,0,0,0.4);animation:pop 0.4s cubic-bezier(.34,1.56,.64,1) both;">' +
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">' +
      '<div style="width:48px;height:48px;border-radius:50%;background:var(--primary-light);display:flex;align-items:center;justify-content:center;">' +
        '<span class="material-symbols-outlined" style="color:var(--primary);font-size:24px;font-variation-settings:\"FILL\" 1;">flag</span>' +
      '</div>' +
      '<div><p class="font-sans text-xs font-bold" style="color:var(--muted);text-transform:uppercase;letter-spacing:1px;">Tujuan Pembelajaran</p>' +
      '<h3 class="font-sans font-bold" style="color:var(--on-bg);font-size:1.05rem;margin:0;">' + (miracle.title || "Mukjizat") + '</h3></div>' +
    '</div>' +
    (obj.length > 0 ? '<ul style="padding-left:20px;margin:0 0 16px;color:var(--on-surface);font-size:0.88rem;line-height:1.7;">' +
      obj.map(function(o){ return '<li style="margin-bottom:6px;">' + o + '</li>'; }).join("") +
    '</ul>' : '') +
    (pedagogical ? '<div style="background:var(--surface2);padding:12px 16px;border-radius:12px;margin-bottom:16px;display:flex;align-items:center;gap:8px;">' +
      '<span class="material-symbols-outlined" style="color:var(--primary);font-size:16px;">psychology</span>' +
      '<div><p class="font-sans text-xs" style="color:var(--muted);margin:0;">Capaian Pembelajaran</p><p class="font-sans text-xs font-bold" style="color:var(--primary);margin:0;">' + pedagogical.cp + '</p></div></div>' : '') +
    '<button onclick="this.closest(\'div[style]\').parentElement.click()" style="width:100%;padding:14px;background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:white;border:none;border-radius:14px;font-family:Plus Jakarta Sans,sans-serif;font-weight:700;font-size:0.95rem;cursor:pointer;">Mulai Perjalanan →</button>' +
  '</div>';
  
  document.body.appendChild(overlay);
  void overlay.offsetWidth;
  overlay.style.opacity = "1";
  
  overlay.addEventListener("click", function(e) {
    if (e.target === overlay || e.target.tagName === "BUTTON") {
      overlay.style.opacity = "0";
      setTimeout(function() { overlay.remove(); if (onContinue) onContinue(); }, 300);
    }
  });
};

// ═══════════════════════════════════════════════════════════════
// BAGIAN VR IFRAME: Inject VR viewer untuk Mukjizat 24 Adegan 5
// ═══════════════════════════════════════════════════════════════
window._vrInjected = false;
window.injectVRScene = function(miracle, sceneIdx) {
  // Only for miracle id=24, scene index 4 (adegan 5)
  if (miracle.id !== 24 || sceneIdx !== 4) {
    var existingVr = document.getElementById("scene-vr-container");
    if (existingVr) existingVr.style.display = "none";
    return;
  }
  
  var existing = document.getElementById("scene-vr-container");
  if (existing) { existing.style.display = "block"; return; }
  
  var textArea = document.getElementById("scene-text-area");
  if (!textArea) return;
  
  var vrDiv = document.createElement("div");
  vrDiv.id = "scene-vr-container";
  vrDiv.style.cssText = "margin-bottom:20px;border-radius:20px;overflow:hidden;box-shadow:0 12px 32px rgba(0,0,0,0.2);";
  vrDiv.innerHTML = '<div style="background:linear-gradient(135deg,#0c1b4d,#7c3aed);padding:12px 16px;display:flex;align-items:center;gap:8px;">' +
    '<span class="material-symbols-outlined" style="color:white;font-size:20px;">view_in_ar</span>' +
    '<span style="font-family:Plus Jakarta Sans,sans-serif;font-weight:700;font-size:0.9rem;color:white;">Pengalaman VR — Kebangkitan Yesus</span></div>' +
    '<iframe src="https://mywebar.com/p/Project_0_e2lfm8gzo" width="100%" height="360" frameborder="0" allowfullscreen allow="camera; microphone; xr-spatial-tracking; gyroscope; accelerometer; magnetometer" style="display:block;background:#000;"></iframe>' +
    '<div style="padding:10px 16px;background:var(--surface2);font-family:Plus Jakarta Sans,sans-serif;font-size:0.78rem;color:var(--muted);">💡 Gunakan headset VR atau sentuh layar untuk menjelajah pengalaman 360°</div>';
  
  textArea.parentNode.insertBefore(vrDiv, textArea);
};

// ═══════════════════════════════════════════════════════════════
// BAGIAN 12: MENGAMBIL ALIH SIKLUS (HOOKS)
// ═══════════════════════════════════════════════════════════════
(function hookRenderStory() {
  function doHook() {
    if (typeof window.renderStory !== "function") {
      setTimeout(doHook, 80);
      return;
    }
    var originalRenderStory = window.renderStory;
    window.renderStory = function() {
      if (typeof originalRenderStory === "function") originalRenderStory.call(this);
      
      if (typeof appData === 'undefined' || !appData || !appData.miracles) return;
      var m = appData.miracles[typeof currentIdx !== 'undefined' ? currentIdx : 0];
      if (!m) return;
      
      currentSceneIndex = 0;
      _sceneIsTransitioning = false;
      document.body.classList.add("scene-mode");
      document.body.classList.remove("scene-last"); 
      
      buildSceneUI(m);
      loadScene(m, 0, false);
    };
    
    // Hook startMiracle to show learning objectives first
    var origStartMiracle = window.startMiracle;
    window.startMiracle = function(idx) {
      if (typeof origStartMiracle === "function") {
        var m = (typeof appData !== 'undefined' && appData && appData.miracles) ? appData.miracles[idx] : null;
        if (m && (m.learning_objectives || (typeof pedagogicalMapping !== 'undefined' && pedagogicalMapping[m.id]))) {
          // Run original first to set currentIdx and render
          origStartMiracle.call(this, idx);
          // Then show overlay on top
          window.showMiracleLearningObjective(m, null);
        } else {
          origStartMiracle.call(this, idx);
        }
      }
    };
  }
  doHook();
})();

(function hookShowScreen() {
  function doHook() {
    if (typeof window.showScreen !== "function") {
      setTimeout(doHook, 80);
      return;
    }
    var origShowScreen = window.showScreen;
    window.showScreen = function(id) {
      window.stopSceneTTS();

      if (id !== "screen-story") {
        document.body.classList.remove("scene-mode");
        document.body.classList.remove("scene-last");
        currentSceneIndex = 0;
        _sceneIsTransitioning = false;
      }
      if (typeof origShowScreen === "function") origShowScreen.call(this, id);
    };
  }
  doHook();
})();

console.log("[SOMIRACLE] Visual Scene Storytelling v4.3 aktif. Bug Cache Gambar telah diperbaiki (Full Version).");
