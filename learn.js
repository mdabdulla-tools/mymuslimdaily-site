/* Muslim Daily — learning content: alphabet, wudu, prayer steps, short surahs. */
'use strict';

const ALPHABET = [
['ا','Alif','ā'],['ب','Bā','b'],['ت','Tā','t'],['ث','Thā','th'],
['ج','Jīm','j'],['ح','Ḥā','ḥ'],['خ','Khā','kh'],['د','Dāl','d'],
['ذ','Dhāl','dh'],['ر','Rā','r'],['ز','Zāy','z'],['س','Sīn','s'],
['ش','Shīn','sh'],['ص','Ṣād','ṣ'],['ض','Ḍād','ḍ'],['ط','Ṭā','ṭ'],
['ظ','Ẓā','ẓ'],['ع','ʿAyn','ʿ'],['غ','Ghayn','gh'],['ف','Fā','f'],
['ق','Qāf','q'],['ك','Kāf','k'],['ل','Lām','l'],['م','Mīm','m'],
['ن','Nūn','n'],['ه','Hā','h'],['و','Wāw','w'],['ي','Yā','y']
];

const WUDU_STEPS = [
 'Make the intention (niyyah) in your heart, and say "Bismillah" (In the name of Allah).',
 'Wash both hands up to the wrists three times.',
 'Rinse your mouth three times, and sniff water into your nose and blow it out three times.',
 'Wash your face three times — from hairline to chin and ear to ear.',
 'Wash your right arm, then your left arm, up to and including the elbows, three times.',
 'Wipe your whole head once with wet hands, and wipe the inside and outside of your ears.',
 'Wash your right foot, then your left foot, up to and including the ankles, three times.',
 'Finish with the dua: "Ash-hadu an la ilaha illallah, wahdahu la sharika lah, wa ash-hadu anna Muhammadan \'abduhu wa rasuluh." (Muslim)'
];

const PRAY_STEPS = [
 'Stand facing the Qibla. Make the intention for the prayer you are performing.',
 'Raise both hands to your ears and say "Allahu Akbar" (Takbir). Fold your hands over your chest.',
 'Recite Surah Al-Fatiha, then a short surah or some verses of the Quran.',
 'Say "Allahu Akbar" and bow (ruku\'), with your hands on your knees, and say "Subhana Rabbiyal-\'Azim" three times.',
 'Rise, saying "Sami\'allahu liman hamidah", then "Rabbana lakal-hamd", until you stand straight.',
 'Say "Allahu Akbar" and prostrate (sujud): forehead, nose, both hands, knees and toes on the ground. Say "Subhana Rabbiyal-A\'la" three times.',
 'Sit up briefly, then prostrate a second time, the same way. This completes one rak\'ah.',
 'For the second rak\'ah, stand and repeat steps 3–7. Then sit and recite At-Tahiyyat.',
 'In the final sitting of the prayer, recite At-Tahiyyat, Durood (salawat upon the Prophet ﷺ) and a dua.',
 'End the prayer by turning your head to the right, then to the left, saying "As-salamu \'alaykum wa rahmatullah" each time.'
];

const SHORT_SURAHS = [
{n:'Al-Fatiha (1) — The Opening',
 ar:'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾',
 en:'In the name of Allah, the Most Merciful, the Most Compassionate. All praise is for Allah, Lord of the worlds — the Most Merciful, the Most Compassionate, Master of the Day of Judgement. You alone we worship, and You alone we ask for help. Guide us along the Straight Path — the path of those You have blessed, not of those who earned Your anger, nor of those who went astray.'},
{n:'Al-Asr (103) — The Time',
 ar:'وَالْعَصْرِ ﴿١﴾ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ﴿٢﴾ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ ﴿٣﴾',
 en:'By time! Indeed, mankind is in loss — except those who believe and do righteous deeds, and urge one another to truth, and urge one another to patience.'},
{n:'Al-Kawthar (108) — The Abundance',
 ar:'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ﴿١﴾ فَصَلِّ لِرَبِّكَ وَانْحَرْ ﴿٢﴾ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ ﴿٣﴾',
 en:'Indeed, We have granted you Al-Kawthar. So pray to your Lord and sacrifice. Indeed, your enemy is the one cut off.'},
{n:'Al-Ikhlas (112) — The Sincerity',
 ar:'قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾',
 en:'Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born. And there is none like unto Him.'},
{n:'Al-Falaq (113) — The Daybreak',
 ar:'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾',
 en:'Say: I seek refuge in the Lord of the daybreak, from the evil of what He created, and from the evil of the darkness when it settles, and from the evil of the blowers in knots, and from the evil of the envier when he envies.'},
{n:'An-Nas (114) — Mankind',
 ar:'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾',
 en:'Say: I seek refuge in the Lord of mankind, the King of mankind, the God of mankind — from the evil of the retreating whisperer, who whispers into the chests of mankind, from among jinn and mankind.'},
{n:'An-Nasr (110) — The Help',
 ar:'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ ﴿١﴾ وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا ﴿٢﴾ فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا ﴿٣﴾',
 en:'When the help of Allah comes, and the victory, and you see people entering the religion of Allah in multitudes — then glorify the praises of your Lord and ask His forgiveness. Indeed, He is the Most Forgiving.'},
{n:'Al-Fil (105) — The Elephant',
 ar:'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ ﴿١﴾ أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ ﴿٢﴾ وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ ﴿٣﴾ تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ ﴿٤﴾ فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ ﴿٥﴾',
 en:'Have you not seen how your Lord dealt with the companions of the elephant? Did He not make their plot go astray? And He sent against them birds in flocks, striking them with stones of baked clay, and made them like eaten straw.'}
];
