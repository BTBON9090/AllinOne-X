/* Fictional sample names for design mockups, curated as complete names.
   Gender labels describe the intended sample presentation, not a person's identity.
   Never construct a name by drawing unrelated individual characters. */
(() => {
  const groups = [
    { style: '威武',
      male: '张毅 李昂 王峥 陈岳 刘骁 赵振霆 周承锋 吴凌峰 徐骏驰 孙浩然 朱威远 胡志坚 高振宇 林劲松 欧阳承岳 司马云骁',
      female: '陈飒 苏锐 李英楠 王凌雪 刘凌薇 赵靖云 周英姿 吴锐宁 徐怀瑾 孙劲竹 朱正仪 胡凌霜 高明玥 林亦锋 夏侯映雪 上官凌月' },
    { style: '温柔',
      male: '周宁 林舒 陈温 李和 王景安 赵予谦 吴清和 刘温言 徐怀安 孙允和 朱沐晨 胡知暖 高煦宁 沈予安 欧阳景和 上官怀宁',
      female: '陈柔 苏婉 林悦 李恬 王语柔 赵安然 周婉宁 吴舒雅 刘若晴 徐知柔 孙静怡 朱清婉 胡暖晴 沈语安 欧阳舒宁 上官婉清' },
    { style: '可爱',
      male: '李乐 陈畅 周熙 林晗 王乐一 赵星宇 吴予乐 刘小满 徐嘉乐 孙沐阳 朱可扬 胡星朗 高乐安 沈一诺 欧阳嘉乐 上官星辰',
      female: '苏甜 林萌 陈欣 李米 王可欣 赵悦悦 周果果 吴乐瑶 刘小语 徐可心 孙安琪 朱笑妍 胡朵儿 沈依依 欧阳可盈 上官乐晴' },
    { style: '文艺',
      male: '陈砚 林墨 周笙 李舟 王书言 赵知行 吴文轩 刘亦书 徐予墨 孙听澜 朱清言 胡书衡 高砚秋 沈闻溪 欧阳知远 上官书宁',
      female: '苏吟 林音 陈芸 李诗 王书瑶 赵亦文 周予棠 吴墨涵 刘知夏 徐书悦 孙语笙 朱念书 胡文茵 沈清音 欧阳诗涵 上官知秋' },
    { style: '诗意',
      male: '林霁 周岚 陈川 李澄 王云舟 赵清越 吴望舒 刘星河 徐景明 孙江远 朱青川 胡映辰 高听松 沈暮云 欧阳云川 上官明远',
      female: '苏月 林雪 陈露 李霏 王清荷 赵云舒 周月宁 吴星晚 刘映雪 徐雨棠 孙晚晴 朱梦溪 胡知春 沈疏桐 欧阳映月 上官清芷' },
    { style: '个性',
      male: '陈拓 林野 周朔 李燃 王不凡 赵行远 吴知非 刘南舟 徐亦山 孙逐光 朱时越 胡远川 高立言 沈见山 欧阳行舟 上官星野',
      female: '苏翎 林岑 陈漾 李洵 王一禾 赵知遥 周以宁 吴亦然 刘南星 徐见月 孙未央 朱初霁 胡予澄 沈云汐 欧阳见微 上官时宁' },
    { style: '寓意',
      male: '陈瑞 林佑 周祺 李恒 王承泽 赵嘉佑 吴致远 刘景荣 徐启明 孙明达 朱安泽 胡家成 高弘毅 沈思源 欧阳嘉成 上官承安',
      female: '苏祎 林安 陈吉 李嘉 王嘉宁 赵欣然 周瑞瑶 吴宜安 刘锦瑶 徐安悦 孙念慈 朱嘉禾 胡舒宜 沈悦宁 欧阳嘉仪 上官宜宁' },
    { style: '内涵',
      male: '陈谦 林睿 周衡 李悟 王思齐 赵修远 吴慎言 刘秉文 徐知礼 孙明诚 朱守正 胡怀信 高思哲 沈允中 欧阳秉谦 上官明德',
      female: '苏慧 林懿 陈敏 李知 王思宁 赵慧如 周静思 吴知意 刘明善 徐若愚 孙思雅 朱善宁 胡谨言 沈思婉 欧阳慧宁 上官知礼' },
    { style: '文化',
      male: '陈儒 林章 周翰 李珩 王博文 赵彦礼 吴承章 刘文谦 徐尚书 孙允文 朱景文 胡修文 高明礼 沈文泽 欧阳怀文 上官景章',
      female: '苏雅 林仪 陈芷 李瑾 王文雅 赵诗雅 周书仪 吴若兰 刘知书 徐静姝 孙文萱 朱雅宁 胡兰心 沈玉书 欧阳文茵 上官雅仪' },
    { style: '哲理',
      male: '陈省 林觉 周哲 李真 王知止 赵行简 吴致知 刘守拙 徐思明 孙笃行 朱明理 胡慎独 高知常 沈思远 欧阳致诚 上官知恒',
      female: '苏悟 林思 陈澈 李静 王知足 赵明心 周思澄 吴知微 刘澄心 徐以真 孙善思 朱思慧 胡守静 沈知宁 欧阳思齐 上官明心' },
    { style: '深意',
      male: '陈初 林归 周砺 李晟 王怀远 赵承志 吴知新 刘念初 徐允初 孙景行 朱明志 胡思成 高怀瑾 沈守一 欧阳念远 上官承志',
      female: '苏忆 林念 陈诺 李愿 王念安 赵知恩 周予希 吴初心 刘念真 徐知忆 孙忆宁 朱望晴 胡念禾 沈怀玉 欧阳念慈 上官知恩' },
    { style: '韵味',
      male: '陈松 林泉 周越 李弦 王清朗 赵听雨 吴云深 刘云峥 徐青岳 孙林远 朱映川 胡清晏 高景初 沈砚清 欧阳清远 上官听川',
      female: '苏韵 林棠 陈盈 李筠 王清韵 赵疏影 周云裳 吴听雪 刘映秋 徐芷韵 孙月盈 朱雨韵 胡清漪 沈雪宁 欧阳清音 上官云锦' },
    { style: '品味',
      male: '陈璟 林序 周端 李俨 王景序 赵清衡 吴玉衡 刘砚之 徐子珩 孙嘉树 朱景辰 胡允衡 高书珩 沈云章 欧阳景澄 上官文衡',
      female: '苏琳 林璇 陈玥 李珺 王静璇 赵清玥 周芷珺 吴予珊 刘书锦 徐雅璇 孙锦宁 朱清琳 胡若珺 沈映璇 欧阳书瑾 上官雅珺' },
    { style: '气质',
      male: '陈朗 林逸 周卓 李昀 王清逸 赵云谦 吴逸辰 刘景谦 徐明轩 孙卓然 朱子谦 胡朗宁 高景逸 沈昀舟 欧阳清卓 上官逸宁',
      female: '苏清 林娴 陈姝 李韶 王清妍 赵雅娴 周静柔 吴韶华 刘若仪 徐知妍 孙婉仪 朱雅清 胡静姝 沈清娴 欧阳雅然 上官静宁' },
    { style: '风度',
      male: '陈霖 林钧 周豫 李修 王君和 赵彦清 吴谦宇 刘允谦 徐承礼 孙景谦 朱子昂 胡君泽 高文朗 沈清平 欧阳君宁 上官景礼',
      female: '苏宁 林容 陈仪 李宜 王君雅 赵容悦 周舒宁 吴安仪 刘雅容 徐和悦 孙景仪 朱温雅 胡端宁 沈君怡 欧阳容宁 上官舒仪' },
    { style: '涵养',
      male: '陈慎 林恺 周厚 李穆 王怀仁 赵谦和 吴仁礼 刘思敬 徐温良 孙承谦 朱德宁 胡允诚 高敬之 沈怀诚 欧阳仁和 上官修宁',
      female: '苏慈 林谧 陈娴 李淑 王静涵 赵若慈 周淑宁 吴雅慧 刘谨仪 徐涵之 孙温宁 朱善雅 胡慧仪 沈宜静 欧阳静仪 上官涵宁' }
  ];

  const entries = Object.freeze(groups.flatMap(group => ['male', 'female'].flatMap(gender =>
    group[gender].split(' ').map(name => Object.freeze({ name, gender, style: group.style }))
  )));
  const male = entries.filter(entry => entry.gender === 'male');
  const female = entries.filter(entry => entry.gender === 'female');
  const shuffle = values => {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  let bag = [];
  let index = 0;
  let lastGender = '';
  function next() {
    if (index === bag.length) {
      const men = shuffle(male), women = shuffle(female);
      const first = lastGender === 'male' ? women
        : lastGender === 'female' ? men : Math.random() < .5 ? men : women;
      const second = first === men ? women : men;
      bag = first.flatMap((entry, i) => [entry, second[i]]);
      index = 0;
    }
    const entry = bag[index++];
    lastGender = entry.gender;
    return entry.name;
  }
  globalThis.ChineseNameLibrary = Object.freeze({ entries, next });
})();
