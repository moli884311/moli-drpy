const { stmts } = require('./database');

const demoData = [
  {
    id: 'demo1',
    title: '流浪地球2',
    category_id: 1,
    year: '2023',
    area: '中国',
    content: '太阳即将毁灭，人类在地球表面建造出巨大的推进器，寻找新的家园。然而宇宙之路危机四伏...',
    pic: 'https://img1.doubanio.com/view/photo/l/public/p2886368299.jpg',
    remarks: 'HD1080P',
    links: [
      { label: '夸克', url: 'https://pan.quark.cn/s/example-link-here' },
      { label: 'UC', url: 'https://drive.uc.cn/s/example-link-here' },
    ]
  },
  {
    id: 'demo2',
    title: '三体',
    category_id: 2,
    year: '2023',
    area: '中国',
    content: '纳米科学家汪淼被警官史强带入联合作战中心，潜入三体游戏世界...',
    pic: 'https://img9.doubanio.com/view/photo/l/public/p2887693544.jpg',
    remarks: '全30集',
    links: [
      { label: '百度', url: 'https://pan.baidu.com/s/example-link-here' },
    ]
  },
  {
    id: 'demo3',
    title: '铃芽之旅',
    category_id: 3,
    year: '2023',
    area: '日本',
    content: '生活在九州乡下的17岁少女铃芽，遇到了一名正在寻找"门"的神秘青年...',
    pic: 'https://img2.doubanio.com/view/photo/l/public/p2886365231.jpg',
    remarks: 'HD1080P',
    links: [
      { label: '阿里', url: 'https://www.alipan.com/s/example-link-here' },
    ]
  }
];

for (const v of demoData) {
  stmts.insertVideo.run(v.id, v.title, v.category_id, v.pic || '', v.content || '', v.year || '', v.area || '', v.remarks || '');
  v.links.forEach((l, i) => {
    stmts.insertVideoLink.run(v.id, l.label, l.url, i);
  });
}

console.log('Demo data inserted!');
process.exit(0);
