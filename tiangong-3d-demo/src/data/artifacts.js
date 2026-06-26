// 天工开物·3D 书 — 器物数据
// 内容基于《天工开物》(明·宋应星) 公有领域版本整理

export const artifacts = {
  tongche: {
    id: 'tongche',
    name: '筒车',
    pinyin: 'Tǒng Chē',
    chapter: '乃粒·农具',
    chapterEn: 'Grain',
    difficulty: 3,
    status: 'online',
    subtitle: '以水为力，自转提水',
    color: '#8B4513',
    summary: '筒车是一种利用水流冲击自动旋转提水的灌溉工具，无需人力，是古代水利工程的杰出代表。',
    modernCounterpart: '水轮机 / 水力发电机涡轮',
    // 古文原文（竖排右起展示），按段落切分，每段标注关联部件
    textSegments: [
      {
        id: 'seg-1',
        original: '凡水之利，自大河而外，有陂塘井泉之属。',
        translation: '凡是水利的利用，除了大河之外，还有池塘、水井、泉水之类。',
        partId: null,
      },
      {
        id: 'seg-2',
        original: '其用筒车以激水者，',
        translation: '其中使用筒车来借助水力的，',
        partId: 'wheel',
      },
      {
        id: 'seg-3',
        original: '因水势下落，推轮旋转，',
        translation: '借着水流往下落的势能，推动水轮旋转，',
        partId: 'blade',
      },
      {
        id: 'seg-4',
        original: '而水自下升上。',
        translation: '水便从低处被提升到高处。',
        partId: 'tube',
      },
      {
        id: 'seg-5',
        original: '筒皆以竹筒为之，缚于轮周，口皆向上，',
        translation: '竹筒都绑在轮子周围，筒口都朝上，',
        partId: 'tube',
      },
      {
        id: 'seg-6',
        original: '轮转至下，则筒入水而满；转至上，则水自倾出。',
        translation: '轮子转到下方时，竹筒没入水中装满水；转到上方时，水便自动倾倒出来。',
        partId: 'tube',
      },
    ],
    parts: [
      {
        id: 'wheel',
        name: '水轮主体',
        position: [0, 0, 0],
        hotspot: [0, 0, 1.5],
        explanation: {
          student: '水轮是筒车的"大转盘"，就像自行车的车轮。水流推着它转，整台机器就动起来了。',
          standard: '水轮是筒车的主体结构，由双层等大同心轮圈、径向辐条、多层X型交叉加固撑木与外圈挡水木片构成。水流冲击挡水板带动水轮整体旋转，是能量转换的核心部件。',
          expert: '水轮采用双层同心轮圈+多层X型交叉加固桁架结构，轮辐外缘安装挡水木片，内缘连接厚重鼓形轮毂。双层轮圈由12根连接方木固定为整体，兼顾结构强度与转动惯量，轮径决定了提水高度（一般可达数丈）。',
        },
        modern: '水轮机转轮',
        source: '乃粒·水利',
      },
      {
        id: 'blade',
        name: '卡扣挡水推板',
        position: [0, 0, 0],
        hotspot: [1.7, 0.3, 0.5],
        explanation: {
          student: '挡水板像风车的叶片，水冲到板上，就把轮子推着转起来。卡扣托住竹筒。',
          standard: '夹层挡水木片是筒车接收水流冲击的窄木片，垂直轮圈平面安装，增大水流推力。卡扣是托槽榫卯造型的木榫，下半托住竹筒筒身，上半卡住竹筒外壁，夹持双层轮圈连接木与竹筒。',
          expert: '挡水木片呈凸起窄板状，垂直安装于双层轮圈夹层之间，与竹筒交错均匀排布，可增大水流有效作用面积并减少溅射损失。卡扣采用传统木作托槽榫卯工艺，带倒角，牢固托住斜置竹筒。',
        },
        modern: '水轮机涡轮叶片',
        source: '乃粒·水利',
      },
      {
        id: 'tube',
        name: '汲水竹筒',
        position: [0, 0, 0],
        hotspot: [-1.7, 1.4, 0.4],
        explanation: {
          student: '竹筒像一个个小水桶，斜绑在大轮子边上。转到下面舀水，转到上面倒水。',
          standard: '竹筒是筒车的提水容器，用竹子制成，在轮平面内与径向呈45°斜绑在双层轮圈外侧，筒口朝CCW前进方向外侧下方。轮转至下方时入水装满，转至上方时自动倾倒出水。',
          expert: '竹筒以45°倾角斜绑于轮周卡扣上，带竹节分段纹路与空心开口。其安装角度经过设计：在最低点切入水面装水，在最高点越过顶点后因重力自动倾覆排水，巧妙利用了重力与几何位置的关系。',
        },
        modern: '斗式提升机料斗',
        source: '乃粒·水利',
      },
      {
        id: 'trough',
        name: '导水槽天池',
        position: [0, 0, 0],
        hotspot: [0, 0.8, 1.3],
        explanation: {
          student: '导水槽天池是接水的小水沟，竹筒倒出来的水顺着它流到田里。',
          standard: '导水槽天池在轮子侧面+Z侧，靠近竹筒筒口，沿Z方向延伸（和轮子平面垂直），向+Z倾斜导流。竹筒到最高点倒水时，水落入槽中，经导流尾槽送至农田。',
          expert: '导水槽天池位于水轮侧面，轮轴上方，沿垂直轮面方向延伸。槽体宽浅长斜，向+Z倾斜导流，末端有导流尾槽。竹筒越过顶点倾覆时，水落入槽中，再经导流渠送至田间。',
        },
        modern: '输水渡槽',
        source: '乃粒·水利',
      },
    ],
    simulation: {
      paramLabel: '水流速度',
      paramMin: 0,
      paramMax: 100,
      paramDefault: 50,
    },
  },

  longgu: {
    id: 'longgu',
    name: '龙骨水车',
    pinyin: 'Lóng Gǔ Shuǐ Chē',
    chapter: '乃粒·农具',
    chapterEn: 'Grain',
    difficulty: 4,
    status: 'online',
    subtitle: '人力踩踏，链板提水',
    color: '#6B3410',
    fitScale: 0.6,  // 龙骨水车较长，缩小适配视野
    summary: '龙骨水车是一种依靠人力踩踏驱动链板刮水上升的灌溉工具，因链条形似龙骨而得名，是古代最普及的提水机械。',
    modernCounterpart: '刮板输送机 / 链斗式提升机',
    textSegments: [
      {
        id: 'lg-1',
        original: '其湖池不流水，或以牛力转盘，或聚数人踏转。',
        translation: '湖池等不流动的水域，有的用牛力转动圆盘，有的由几个人一起踩踏转动。',
        partId: 'pedal',
      },
      {
        id: 'lg-2',
        original: '其车之长者，丈有二尺，',
        translation: '这种水车长的有一丈二尺，',
        partId: 'trough',
      },
      {
        id: 'lg-3',
        original: '中列槽，槽底施木板为道，',
        translation: '中间开有水槽，槽底铺木板作为通道，',
        partId: 'trough',
      },
      {
        id: 'lg-4',
        original: '贯之以链，联之以椔，',
        translation: '用链条贯穿，用椔（销轴）连接，',
        partId: 'chain',
      },
      {
        id: 'lg-5',
        original: '其椔各有齿，以拨水而上。',
        translation: '每个椔上都装有齿（刮板），把水刮着往上提。',
        partId: 'blade',
      },
      {
        id: 'lg-6',
        original: '人踏其轴，链转而水随之上矣。',
        translation: '人踩动轮轴，链条转动，水就跟着被提上来了。',
        partId: 'pedal',
      },
    ],
    parts: [
      {
        id: 'pedal',
        name: '踏轴',
        position: [0, 0, 0],
        hotspot: [0.5, 0.95, 1.1],
        explanation: {
          student: '踏轴像自行车的脚踏板，人踩上去转圈，水车就动起来了。',
          standard: '踏轴是龙骨水车的动力输入部件，位于水车顶部。踩踏者踩动踏板带动主轴旋转，将人力转化为链条运动的动力。',
          expert: '踏轴即主动链轮轴，轴上装拐木（踏板），由人力踩踏。其设计利用了杠杆原理与人力 ergonomics，多人协同踩踏可显著提升提水效率。',
        },
        modern: '链传动主动链轮',
        source: '乃粒·水利',
      },
      {
        id: 'chain',
        name: '龙骨链',
        position: [0, 0, 0],
        hotspot: [0.4, 0.36, 0.1],
        explanation: {
          student: '龙骨链像自行车的链条，把踩踏的力量传到刮板上。',
          standard: '龙骨链是龙骨水车的传动部件，由一连串木制链节用销轴连接而成，因形似龙骨得名。它将踏轴的动力传递到刮板。',
          expert: '龙骨链由椔（链节）与销轴铰接构成封闭环，绕过上下两个链轮。其结构是现代滚子链的雏形，体现了中国古代对链传动的早期掌握。',
        },
        modern: '滚子链条',
        source: '乃粒·水利',
      },
      {
        id: 'blade',
        name: '刮水板',
        position: [0, 0, 0],
        hotspot: [-0.4, 0.56, 0.2],
        explanation: {
          student: '刮水板像小铲子，把水从低处一铲一铲地刮到高处。',
          standard: '刮水板安装在龙骨链的每个链节上，随链条运动时将水槽中的水刮起并向上推送，是龙骨水车的提水工作部件。',
          expert: '刮水板（鹤膝）安装于链节，其宽度与水槽内壁贴合，形成近似密封。运动中将水槽底部的水分段刮升，原理类似现代刮板输送机。',
        },
        modern: '刮板输送机刮板',
        source: '乃粒·水利',
      },
      {
        id: 'trough',
        name: '水槽',
        position: [0, 0, 0],
        hotspot: [0, 0.15, -0.3],
        explanation: {
          student: '水槽是水往上走的"滑梯"，水在槽里被刮板推着往上爬。',
          standard: '水槽是龙骨水车的主体结构，为长条形木槽，斜置于水源与田间之间。槽底铺木板，龙骨链与刮水板在槽内运动，将水刮送上升。',
          expert: '水槽为长木槽，倾斜放置（倾角约20-30°），内宽与刮板匹配。槽内形成刮板与槽壁的滑动密封，是提水的"管道"。长度决定提水高度。',
        },
        modern: '输送机槽体',
        source: '乃粒·水利',
      },
    ],
    simulation: {
      paramLabel: '踩踏速度',
      paramMin: 0,
      paramMax: 100,
      paramDefault: 45,
    },
  },

  // ===== 水碓（粹精·攻稻）=====
  // 古籍原图来源：《天工开物》明崇祯十年(1637)涂绍煃刊本·粹精卷·水碓图
  // 现存明代原版木刻插图，公有领域
  shuidui: {
    id: 'shuidui',
    name: '水碓',
    pinyin: 'Shuǐ Duì',
    chapter: '粹精·攻稻',
    chapterEn: 'Grain Processing',
    difficulty: 3,
    status: 'online',
    subtitle: '水激轮转，杵臼舂米',
    color: '#8B5A2B',
    fitScale: 0.85,
    summary: '水碓是利用水流冲击立式水轮带动碓杵起落舂米的机械，山国之人多设于溪涧之侧，是古代粮食加工的自动化装置。',
    modernCounterpart: '水力驱动的冲压机 / 凸轮机构',
    textSegments: [
      {
        id: 'sd-1',
        original: '凡水碓，山国之人居山者之所为也。',
        translation: '水碓，是居住在山区的山国之人所制作的。',
        partId: 'wheel',
      },
      {
        id: 'sd-2',
        original: '为水所舂，故曰水碓。',
        translation: '因为靠水流来舂米，所以叫做水碓。',
        partId: 'hammer',
      },
      {
        id: 'sd-3',
        original: '中植一轴，水激轮旋，则轴亦旋。',
        translation: '中间立一根主轴，水流冲击水轮旋转，主轴也跟着旋转。',
        partId: 'wheel',
      },
      {
        id: 'sd-4',
        original: '轴上列横木，以拨碓杵之末。',
        translation: '主轴上排列着横木（拐木），用来拨动碓杵的末端。',
        partId: 'shaft',
      },
      {
        id: 'sd-5',
        original: '水激轮转，则横木拨杵，一起一落。',
        translation: '水流冲击水轮转动，横木拨动碓杵，使其一起一落。',
        partId: 'hammer',
      },
      {
        id: 'sd-6',
        original: '以杵臼米，米折而糠去，故曰攻稻。',
        translation: '用碓杵在石臼中舂米，米粒折开而糠皮脱落，所以称为攻稻。',
        partId: 'mortar',
      },
    ],
    parts: [
      {
        id: 'wheel',
        name: '立式水轮',
        position: [0, 0, 0],
        hotspot: [1.6, 0.1, 0.6],
        explanation: {
          student: '立式水轮像一个大风车，水流冲到叶片上，轮子就转起来了。',
          standard: '立式水轮是水碓的动力来源，垂直安装于主轴一端，水流冲击轮周挡水板带动轮和轴一起旋转。',
          expert: '立式水轮采用辐条+轮圈+挡水板结构，垂直安装（轴水平）。水流势能转化为轮的旋转动能，是水力凸轮机构的核心。轮径决定了转速与扭矩的权衡。',
        },
        modern: '水轮机转轮',
        source: '粹精·攻稻',
      },
      {
        id: 'shaft',
        name: '主轴拐木',
        position: [0, 0, 0],
        hotspot: [0, 0.5, 0.8],
        explanation: {
          student: '主轴是连接水轮和碓杵的棍子，上面的横木像拨子，转一圈拨一下碓杵。',
          standard: '主轴是水轮与碓杵之间的传动件，轴上沿圆周方向排列若干根横木（拐木），相当于凸轮，转动时拨动碓杵末端使其抬起。',
          expert: '主轴上的横木构成"多凸轮"机构，每根拐木相当于一个凸轮齿。轴转一周，每个碓杵被拨动次数等于拐木数量，这是凸轮传动的早期工程实例。',
        },
        modern: '凸轮轴',
        source: '粹精·攻稻',
      },
      {
        id: 'hammer',
        name: '碓杵',
        position: [0, 0, 0],
        hotspot: [-0.4, 0.7, 0.4],
        explanation: {
          student: '碓杵像一根长木槌，一头被拨起来，另一头就砸下去舂米。',
          standard: '碓杵是水碓的工作件，长木杆中部支于轴心（支点），一端被主轴拐木拨起，另一端装铁头或木杵落入石臼舂米。',
          expert: '碓杵是杠杆机构的工作臂，以中段为支点，长臂端被拐木拨起蓄能，短臂端装杵头下落冲击石臼。利用杠杆比与重力势能完成舂击。',
        },
        modern: '冲压头 / 杠杆式冲锤',
        source: '粹精·攻稻',
      },
      {
        id: 'mortar',
        name: '石臼',
        position: [0, 0, 0],
        hotspot: [-0.9, -0.55, 0.3],
        explanation: {
          student: '石臼是舂米的石碗，碓杵一下一下砸进去，米壳就掉了。',
          standard: '石臼是承接碓杵舂击的容器，以整块石料凿出凹坑，置于碓杵正下方，米粒在其中被反复冲击脱壳。',
          expert: '石臼以花岗岩或青石凿成，内壁光滑且具适度摩擦，凹形曲面使米粒在冲击下循环翻动，确保均匀脱壳。',
        },
        modern: '研磨容器',
        source: '粹精·攻稻',
      },
    ],
    simulation: {
      paramLabel: '水流速度',
      paramMin: 0,
      paramMax: 100,
      paramDefault: 50,
    },
  },

  // ===== 纺织机（乃服·花楼机）=====
  // 古籍原图来源：《天工开物》明崇祯十年(1637)涂绍煃刊本·乃服卷·花机图
  // 现存明代原版木刻插图，公有领域
  fangzhi: {
    id: 'fangzhi',
    name: '纺织机',
    pinyin: 'Fǎng Zhī Jī',
    chapter: '乃服·花楼',
    chapterEn: 'Weaving',
    difficulty: 5,
    status: 'online',
    subtitle: '花楼提花，穿梭织锦',
    color: '#A0522D',
    fitScale: 0.7,
    summary: '花楼机是明代最复杂的提花织机，机工坐于花楼之上提拽花本，下方织工穿梭打纬，可织造龙袍等繁复花纹。',
    modernCounterpart: '提花机 / Jacquard 织机（计算机前身）',
    textSegments: [
      {
        id: 'fz-1',
        original: '凡花机，通身度长一丈六尺。',
        translation: '花机的全长有一丈六尺。',
        partId: 'frame',
      },
      {
        id: 'fz-2',
        original: '隆起花楼，中托衢盘，下垂衢脚。',
        translation: '中部高耸起花楼，中间托着衢盘，下方垂着衢脚（综线）。',
        partId: 'heddle',
      },
      {
        id: 'fz-3',
        original: '织时，机工坐花楼之上，一手提衢盘，一手过管。',
        translation: '织造时，机工坐在花楼上方，一手提拽衢盘，一手穿过梭管。',
        partId: 'heddle',
      },
      {
        id: 'fz-4',
        original: '其人踏踏板，则衢脚起，经纬相错。',
        translation: '下方织工踩动踏板，衢脚（综片）升降，经纬线交错成纹。',
        partId: 'pedal',
      },
      {
        id: 'fz-5',
        original: '两手抛梭，往来不绝，则花纹成。',
        translation: '双手抛掷梭子，往复不停，花纹便织成了。',
        partId: 'shuttle',
      },
      {
        id: 'fz-6',
        original: '盖龙袍一类，皆自此机出。',
        translation: '龙袍一类的华服，都是从这种织机织出来的。',
        partId: 'frame',
      },
    ],
    parts: [
      {
        id: 'frame',
        name: '机架花楼',
        position: [0, 0, 0],
        hotspot: [0, 1.3, 0.5],
        explanation: {
          student: '机架是织机的骨架，中间高出来的"小楼"叫花楼，是机工坐着提花的地方。',
          standard: '机架是花楼机的主体木结构，中部隆起为花楼，供提花机工端坐操作；前后两端设经轴与卷布轴，张紧经线。',
          expert: '花楼机机架采用榫卯木结构，全长一丈六尺。中部花楼为提花操作台，悬吊衢盘衢脚构成"花本"记忆机构，是人类最早的程序控制装置雏形。',
        },
        modern: '织机机架',
        source: '乃服·花楼',
      },
      {
        id: 'heddle',
        name: '衢盘衢脚',
        position: [0, 0, 0],
        hotspot: [0.3, 0.8, 0.3],
        explanation: {
          student: '衢盘像一组线团，衢脚是垂下来的线，机工提哪根，哪根经线就升起来。',
          standard: '衢盘是花本（纹样程序）的载体，由提花线团组成；衢脚是垂下的牵引线，与下方综片相连，提拽时控制经线升降形成花纹开口。',
          expert: '衢盘-衢脚构成"花本"系统，相当于存储纹样程序的存储器。每一根衢脚对应一组经线升降动作，提花工按序提拽即"读取程序"，是数字编程思想的早期形态，直接启发了 Jacquard 打孔卡。',
        },
        modern: '提花综丝 / 程序存储器',
        source: '乃服·花楼',
      },
      {
        id: 'pedal',
        name: '踏板蹑',
        position: [0, 0, 0],
        hotspot: [-0.6, -0.9, 0.4],
        explanation: {
          student: '踏板在织机下面，织工用脚踩，控制经线一上一下分开，让梭子穿过去。',
          standard: '踏板（蹑）位于机架下方，织工用脚踏动，通过连杆带动综片升降，使经线分层形成梭口，是纬线穿梭的通道。',
          expert: '踏板-综片-连杆构成开口机构。多片综片对应多组踏板，不同踏板组合可形成不同梭口，与花楼提花配合，实现复杂纹样。',
        },
        modern: '织机开口踏板',
        source: '乃服·花楼',
      },
      {
        id: 'shuttle',
        name: '梭子',
        position: [0, 0, 0],
        hotspot: [0.5, -0.1, 0.5],
        explanation: {
          student: '梭子像一只小船，里面装着纬线，在经线之间来回穿梭，把布织出来。',
          standard: '梭子是引纬工具，内装纬线管（纡子），从经线开口中穿过，将纬线留在梭口内，再用筘打紧。',
          expert: '梭子以硬木削成流线型船形，内装纡子。其设计兼顾空气动力学与握持手感，往返抛掷的频率决定织造效率。',
        },
        modern: '织机引纬器',
        source: '乃服·花楼',
      },
    ],
    simulation: {
      paramLabel: '织造速度',
      paramMin: 0,
      paramMax: 100,
      paramDefault: 40,
    },
  },

  // ===== 鼓风炉（冶铸·鼎）=====
  // 古籍原图来源：《天工开物》明崇祯十年(1637)涂绍煃刊本·冶铸卷·铸鼎图
  // 现存明代原版木刻插图，公有领域
  gufeng: {
    id: 'gufeng',
    name: '鼓风炉',
    pinyin: 'Gǔ Fēng Lú',
    chapter: '冶铸·鼎',
    chapterEn: 'Smelting',
    difficulty: 5,
    status: 'online',
    subtitle: '土筑高炉，风箱鼓风',
    color: '#5C3A1E',
    fitScale: 0.8,
    summary: '鼓风炉是明代用于冶炼铸造大型器物的竖炉，以土筑成高炉，配风箱强制鼓风，可熔铜铁以铸鼎钟等重器。',
    modernCounterpart: '高炉 / 冲天炉',
    textSegments: [
      {
        id: 'gf-1',
        original: '凡铸鼎，其炉以土筑，高丈余。',
        translation: '铸造大鼎时，炉子用土筑成，高一丈多。',
        partId: 'furnace',
      },
      {
        id: 'gf-2',
        original: '炉底及旁，皆设风沟，以通风气。',
        translation: '炉底和炉侧都设有风沟，用来通风。',
        partId: 'tuyere',
      },
      {
        id: 'gf-3',
        original: '旁设风箱，用人拽挽，扇风入炉。',
        translation: '炉侧装设风箱，由人拉动鼓风，把风送入炉内。',
        partId: 'bellows',
      },
      {
        id: 'gf-4',
        original: '炉口置铁范，以受铜汁。',
        translation: '炉口放置铁范（模具），用来承接铜汁。',
        partId: 'furnace',
      },
      {
        id: 'gf-5',
        original: '铜铁既熔，撤去塞泥，则汁下注于范。',
        translation: '铜铁熔化后，撤去塞泥，铜汁便下注入范中。',
        partId: 'tuyere',
      },
      {
        id: 'gf-6',
        original: '烟气上腾，从烟囱出，故炉不窒。',
        translation: '烟气向上腾起，从烟囱排出，所以炉子不会窒塞。',
        partId: 'stack',
      },
    ],
    parts: [
      {
        id: 'furnace',
        name: '炉体',
        position: [0, 0, 0],
        hotspot: [0, 0.4, 0.7],
        explanation: {
          student: '炉体像个大烟囱，里面烧得很热，把铜铁化成水。',
          standard: '炉体是鼓风炉的主体，以耐火土筑成竖井形，高一丈余，内装铜铁矿石与木炭，是冶炼反应的容器。',
          expert: '炉体为竖式倒焰结构，耐火土夯筑，腰鼓形内腔利于炉料下行与气流上行。炉缸积聚熔液，炉身进行还原反应，是高炉的雏形。',
        },
        modern: '高炉炉体',
        source: '冶铸·鼎',
      },
      {
        id: 'tuyere',
        name: '风口风沟',
        position: [0, 0, 0],
        hotspot: [0.7, -0.3, 0.5],
        explanation: {
          student: '风口是炉子下面的洞，风从这儿吹进去，火才烧得旺。',
          standard: '风口是风箱送风进入炉内的接口，炉底设风沟布风，使空气均匀进入炉缸助燃。',
          expert: '风口位置与角度决定炉内气流分布，直接影响还原带与氧化带的温度场。明代已掌握多风口对称送风以提高冶炼效率。',
        },
        modern: '高炉风口',
        source: '冶铸·鼎',
      },
      {
        id: 'bellows',
        name: '风箱',
        position: [0, 0, 0],
        hotspot: [1.4, -0.2, 0.2],
        explanation: {
          student: '风箱像个大木抽屉，人拉来拉去，就把风打进炉子里了。',
          standard: '风箱是鼓风设备，木制长方形箱体，内设活塞（羽毛板），人力推拉将空气压入炉内，是冶炼的关键供风部件。',
          expert: '风箱为活塞式鼓风器，箱体两端设单向阀，推拉双向送风。其双向连续鼓风原理是近代往复式鼓风机的原型，显著提升了炉温。',
        },
        modern: '往复式鼓风机',
        source: '冶铸·鼎',
      },
      {
        id: 'stack',
        name: '烟囱炉口',
        position: [0, 0, 0],
        hotspot: [0, 1.5, 0.3],
        explanation: {
          student: '烟囱在炉子顶上，烟从这儿冒出去，炉子才不闷。',
          standard: '烟囱位于炉体顶部，兼作加料口与排烟口，利用烟囱效应形成自然抽风，排出烟气并加料。',
          expert: '炉口兼作装料口与排烟道，烟囱效应产生负压抽风，与底部风箱鼓风形成"下鼓上抽"的复合通风，是竖炉高效运行的关键。',
        },
        modern: '高炉炉顶 / 烟道',
        source: '冶铸·鼎',
      },
    ],
    simulation: {
      paramLabel: '鼓风强度',
      paramMin: 0,
      paramMax: 100,
      paramDefault: 55,
    },
  },

  // ===== 雕版印刷（丹青·松烟制墨与雕版印刷）=====
  // 古籍原图来源：《天工开物》明崇祯十年(1637)涂绍煃刊本·丹青卷·松烟制墨插图
  // 原刊本藏法国国家图书馆，书格(shuge.org)数字化，CC BY 4.0
  // 古文取自《天工开物·丹青·墨》，雕版印刷工艺为明代通行之法
  diaoban: {
    id: 'diaoban',
    name: '雕版印刷',
    pinyin: 'Diāo Bǎn Yìn Shuā',
    chapter: '丹青·雕版',
    chapterEn: 'Ink & Block Printing',
    difficulty: 4,
    status: 'online',
    subtitle: '松烟制墨，梨木雕版',
    color: '#7B4F2E',
    fitScale: 0.85,
    summary: '雕版印刷以梨木或枣木刻成反字印版，刷松烟墨覆纸擦印，一版可印万纸，是明代书籍生产的主流工艺，墨出丹青卷所载松烟。',
    modernCounterpart: '凸版印刷 / 现代印刷术',
    textSegments: [
      {
        id: 'db-1',
        original: '凡墨，烧烟凝质而为之。',
        translation: '凡是墨，都是烧烟凝结成的物质制成的。',
        partId: 'ink',
      },
      {
        id: 'db-2',
        original: '取松烟为者，十居九。',
        translation: '用松烟制成的墨，十成中占了九成。',
        partId: 'ink',
      },
      {
        id: 'db-3',
        original: '凡松烟造墨，入水久浸，以浮沉分精粗。',
        translation: '松烟造墨时，放入水中久浸，按浮沉来区分精粗。',
        partId: 'ink',
      },
      {
        id: 'db-4',
        original: '刻版以梨木、枣木为上，字画反刻。',
        translation: '刻印版以梨木、枣木为上品，字画需反刻于版上。',
        partId: 'block',
      },
      {
        id: 'db-5',
        original: '印时，以帚蘸墨，匀刷版面，覆纸其上。',
        translation: '印刷时，用棕刷蘸墨，均匀刷在版面上，再覆纸于其上。',
        partId: 'brush',
      },
      {
        id: 'db-6',
        original: '以棕刷顺擦，则字画尽透于纸，揭之成页。',
        translation: '用棕刷顺向擦拭，字画便完全透印到纸上，揭下即成印页。',
        partId: 'paper',
      },
    ],
    parts: [
      {
        id: 'block',
        name: '雕版',
        position: [0, 0, 0],
        hotspot: [0.1, 0.15, 0.5],
        explanation: {
          student: '雕版是一块刻着反字的木板，刷上墨盖张纸就能印出字来。',
          standard: '雕版是雕版印刷的核心，以梨木或枣木为材，匠人将字画反刻于版上，一版可反复刷印万次以上。',
          expert: '雕版选用纹理细密、质地均匀的梨木枣木，刻工以拳刀反向刻字，凸起为阳文。版面硬度与吸墨性均衡，是凸版印刷的早期形态。',
        },
        modern: '凸版印版',
        source: '丹青·墨',
      },
      {
        id: 'ink',
        name: '松烟墨',
        position: [0, 0, 0],
        hotspot: [-0.9, 0.2, 0.4],
        explanation: {
          student: '松烟墨是用烧松树冒的烟做的墨，刷在雕版上用来印字。',
          standard: '松烟墨是雕版印刷的着色剂，以松木烧烟取灰，入水浸洗分精粗，再和胶捣制而成，色黑而细。',
          expert: '松烟墨取松烟入水浮沉分选，浮者为精烟。其颗粒细微、色相纯正，覆纸擦印时转移率高，是明代印刷的主流用墨。',
        },
        modern: '印刷油墨',
        source: '丹青·墨',
      },
      {
        id: 'brush',
        name: '棕刷',
        position: [0, 0, 0],
        hotspot: [0.7, 0.25, 0.3],
        explanation: {
          student: '棕刷像一把大刷子，先蘸墨刷版，再在纸上擦，字就印上去了。',
          standard: '棕刷是雕版印刷的工具，以棕榈纤维扎成，既用于蘸墨匀刷版面，又用于覆纸后擦压使墨转印，一刷两用。',
          expert: '棕刷以棕榈丝束扎，硬度适中、含墨性好。上墨时匀刷版面凸起处，擦印时施压使纸嵌入凹槽，墨迹转移成型，是雕版印刷的关键工具。',
        },
        modern: '印刷上墨/压印工具',
        source: '丹青·墨',
      },
      {
        id: 'paper',
        name: '宣纸印页',
        position: [0, 0, 0],
        hotspot: [0.1, 0.75, 0.5],
        explanation: {
          student: '宣纸盖在刷好墨的版上，擦一刷揭下来，就是印好的一页书。',
          standard: '宣纸是雕版印刷的承印物，覆于上墨的雕版上，以棕刷擦压，墨迹转印成页，纸质柔韧吸墨。',
          expert: '印纸多用皮纸或竹纸（《天工开物·杀青》所载），纤维细长、吸墨均匀。覆纸擦印时纸张适度变形嵌入版面凹处，确保字画清晰完整。',
        },
        modern: '承印物',
        source: '丹青·墨 / 杀青',
      },
    ],
    simulation: {
      paramLabel: '刷印速度',
      paramMin: 0,
      paramMax: 100,
      paramDefault: 35,
    },
  },
}

// 未上线器物（目录展示用，目前为空）
export const upcomingArtifacts = []

// AI 问答预设回答（Demo 模拟，非真实大模型调用）
export const qaPresets = {
  '筒车和龙骨水车有什么区别？': '筒车与龙骨水车都是古代提水工具，但有本质区别：\n\n1️⃣ 动力来源不同\n筒车利用水流冲击自动旋转，无需人力；龙骨水车则需人力踩踏（或牛力）驱动。\n\n2️⃣ 工作原理不同\n筒车靠竹筒在轮周随转，到高处自动倾倒出水；龙骨水车靠刮板在槽内将水刮送上升。\n\n3️⃣ 适用场景不同\n筒车需建在水流湍急的河边；龙骨水车可用于静止的湖池塘堰。\n\n4️⃣ 技术传承\n筒车原理演变为现代水轮机；龙骨水车的链传动则是现代滚子链条的雏形。\n\n📖 来源：《天工开物·乃粒》',
  '古人为什么能想到这样的设计？': '古人的设计智慧源于对自然的长期观察与实践：\n\n1️⃣ 顺势而为\n筒车的设计核心是"借水之力"——观察到水流下落有冲击力，便用受水板承接，将直线水流转化为旋转运动，体现了"因势利导"的工程哲学。\n\n2️⃣ 巧用重力\n竹筒在低处装水、高处倾倒，巧妙利用了重力与圆周运动的几何关系，无需任何阀门或开关。\n\n3️⃣ 因地制宜\n筒车用于流水，龙骨水车用于静水——古人针对不同水文条件发展出不同工具，是"具体问题具体分析"的典范。\n\n4️⃣ 简约而不简单\n用竹、木等易得材料，实现复杂的能量转换与提水功能，体现了"大道至简"的造物理念。\n\n📖 来源：《天工开物·乃粒》',
  '筒车的效率有多高？': '据《天工开物》记载与现代研究估算：\n\n1️⃣ 提水高度\n筒车直径通常2-6米，可提水至数丈（约3-10米）高。\n\n2️⃣ 连续性\n筒车可昼夜不停运转，"日夕不息"，是真正的自动化机械。\n\n3️⃣ 灌溉面积\n一架大筒车可灌溉数十亩农田，效率远超人力挑水。\n\n4️⃣ 能量利用率\n筒车直接将水流动能转化为提水势能，无中间转换，能量路径极短，与现代水轮机原理一致。\n\n5️⃣ 局限性\n需稳定水流，枯水期效率下降；建造受地形限制。\n\n📖 来源：《天工开物·乃粒》',
  '这些器物现在还在用吗？': '部分仍在使用，且原理被广泛应用：\n\n1️⃣ 传统用途\n在南方山区（如云南、广西、江西），至今仍可见筒车用于灌溉，成为"活着的文物"。\n\n2️⃣ 原理传承\n筒车的"水流驱动叶轮"原理，直接演变为现代水轮发电机——三峡、白鹤滩等巨型水电站的核心机组，与筒车一脉相承。\n\n3️⃣ 链传动应用\n龙骨水车的链传动原理，广泛应用于现代自行车、摩托车、工业输送带。\n\n4️⃣ 文化价值\n这些器物已被列入非物质文化遗产，是中华科技文明的实物见证。\n\n📖 来源：《天工开物》及相关研究',
}

export const recommendedQuestions = [
  '筒车和龙骨水车有什么区别？',
  '古人为什么能想到这样的设计？',
  '筒车的效率有多高？',
  '这些器物现在还在用吗？',
]
