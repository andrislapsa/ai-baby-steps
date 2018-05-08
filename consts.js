import { random } from './utils.js'

export const CREATURE_SIZE = 10
export const START_X = 250
export const START_Y = 250
export const TICK_LENGTH = 1
export const MAX_AGE = 2500 / TICK_LENGTH // ticks
export const MUTABILITY = .8
export const STREERING_AMPLITUDE = .01
export const FOOD_AMOUNT = 1
export const FOOD_SIZE = 20
// export const CREATURE_FACES = '💩'
export const CREATURE_FACES = '🐍🐬💩👻🤑🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐸🐵🙈🐔🐧🐦🐤🐣🐥🦆🦅🦉🦇🐺🐗🐴🦄🐝🐛🦋🐌🐚🐞🐜🦗🕷🦂🐢🦎🦖🦕🐙🦑🦐🦀🐡🐠🐟'
  .split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)
  .filter(Boolean)
export const APETITE = 15 // food that needs to be eaten for everyone to die
// debugger

// [[-1.9452892457134956,2.6601133476011514,2.268026050366465,-2.520060637872662,0.8774684124626227,4.1459257247857835,-2.938927148096262,-1.2916922487318472,1.6695967034436854,2.765356182679544],[0.5412943755276522,-0.08549415832385321,1.6895181035623104,0.245397462602705,-0.13016136577352305,0.1947500520385813,-5.309355403855445,-2.2074136216193425,1.7497559861280108,-0.6188619917258619],[1.4399024982936703,-0.03714826544746663,2.674111488834039,-0.723598501551896,-1.0352046164683943,1.357088255975397,-4.747539501823486,-1.331312817893921,1.9747226673178462,-1.9732404734939344],[2.0483553276397317,0.6751100012101244,2.3022048577666436,-0.3193066784180697,-0.9570863126777058,1.4399665751494481,-5.113311717845499,-1.595522509515284,2.227124520670631,-0.9236762737855321],[0.2729946621693692,3.150097761582587,2.2162988703698057,-0.9623896042816336,-1.743496830854558,0.16828757626936008,-0.26891425549983716,1.7793987052515168,1.4599450315348865,-0.6856148937717066],[2.3747182064689736,-0.1886288416571904,1.8208571875468036,2.0265661804936834,-2.773751357477154,0.5726611965335915,-1.6376630205661011,0.08426302429288812,2.3001686139963646,-1.1158622069284316],[2.459877024311576,0.2423341401852679,2.1095707744360106,0.9677441871725027,-3.0130851219408172,0.762343208026142,-1.1071543239057018,-1.2546491216868143,2.2182986414991404,-0.5453775580972429],[-4.520318115968257,0.1775942076928939,-0.32683815415948503,-2.3485791691578903,-0.5407066936604649,1.866615556087353,1.5010921204462657,-2.211987115629013,2.61668784553186,0.5956100234761906],[1.2889025223441446,-0.6394402357749631,2.1681293424219037,1.3344000979326665,-1.5211300837807302,0.63064756197855,-4.0313220841810145,-1.5653591191396106,1.9262050208635717,-1.4049968970939526],[2.3578420954756467,-0.6038187508471302,4.150433392263965,-0.01761319907382114,-1.0146232162602187,0.029488584306092414,-3.424630658887325,-3.2285285923629985,4.750638601277031,-3.2183314118534314],[-2.62147147478535,0.7369442430324912,1.8637480681762124,-3.299799252580848,0.19760287115350483,3.479736011382201,-1.9738909125328057,-0.5119579754769756,3.0754085131920985,2.65133134033532],[2.6128602164797505,-1.0459364197216914,0.7751382868737126,0.5534176276065412,-1.8427503525279412,1.0886251286603525,-5.055358461849394,-2.2268050676211697,2.9946458068676374,-1.79911658205092],[2.860972844529899,-0.8882287199608971,0.8537022475153352,0.20441354317590632,-1.009892145078624,0.5222754863090827,-4.793542376905682,-3.258089551329611,2.8557219560258176,-1.717361214756966],[-5.007940896134823,1.1449061327613923,0.4585908804088845,-2.0337071429006732,-1.0465288176201255,2.8115241915918965,0.7989454124122864,-2.047173018008466,2.265695525798956,0.9787513114512042],[1.983553143870088,0.6972280610352771,3.425846035033467,-1.8030815754085774,-0.640122476685791,0.27054135948419666,0.7632478914223632,1.3892636256292468,5.182091585453595,1.4483481533825464],[-0.04383569760247846,2.7562431733123995,2.3571843719110026,-1.2602586616761982,-1.2581740899942746,0.2210820768959837,-1.2475711779668903,1.6594061210751554,2.0835094016976714,-0.5548714382573947],[1.1995372851379256,-0.8431041820906093,3.0596794558689138,1.23306807326153,-2.803183949273076,1.9600014110095807,-1.677929902076717,-1.993502607196568,1.3170377320610056,-0.24941271785646624],[-0.04619234269484629,1.5364584803581258,3.370685891620817,-0.1934553755447258,-2.6222585557959954,0.12458873875439269,1.302140076924117,1.5530474698171024,5.919643022399391,0.26096052099019973],[1.7425067956559395,1.397698065359147,1.995146873965874,-1.4962349801324306,0.04655852681026412,1.4247670386917903,-3.831778350099921,-2.2572352718561874,2.6259892380796463,-2.3934580873698],[1.2664756820537177,-0.18583811530843292,2.719795478135363,0.9329497371800247,-1.4352676161564832,-0.1928038722835467,-3.685497043468057,-2.7733601825311767,4.249391727242626,-3.813659061677753],[-2.730838474351906,3.7280256380327104,1.6367605745792426,-2.617209720332172,1.692219628114255,2.6495329399593266,-1.8804618055000892,-2.0862580122426104,2.468655803520242,3.126027456671009],[0.064677891414615,0.5680927120149154,3.4287881497293737,0.006522371433676344,-2.537888186704365,-0.06180670280009409,1.2350191709585503,1.4289281362667685,5.81645335713401,0.5034746142104335],[-4.3337819301523215,-1.5501823595724975,1.8842398758977685,-0.6173156025819468,0.3170690928585844,2.1442778228782196,-0.38052319996058925,-3.2848336104303537,2.6160287321545286,2.6714054727926935],[2.978070377279078,2.2313218323513913,5.102514688856908,0.45642796996981116,-0.1868104671128063,-0.5914654808118948,-0.7665213051252053,1.7546947134658772,1.6934252317063607,2.6256767572835167],[-3.825614372175185,0.7115693871863208,0.8215206108987346,-1.797598847653715,-0.9110407561995063,2.2603942773304952,2.240652182884516,-1.8012879841029603,2.020845175627629,0.7382403859868715],[-3.8028118374757427,1.9794625303708053,-0.8048067577183233,-1.678496206458656,-3.547833929117765,3.487926147039988,-0.21633297242224198,-2.092386712878938,2.6359682061709573,0.4839937545359203],[-5.021117294486608,-0.876467905100432,2.6155112657696042,-0.946036013867705,0.7796290953643638,3.1908772501163267,0.03893618676811478,-3.141859025694424,2.237609800230722,2.878115089610227],[1.5091941731981962,0.018210988771171333,2.3968952368945033,0.1281644974835221,-0.9035630810074453,1.6826207053847626,-4.313864514231682,-1.566374040953813,1.311371622327723,-0.12246992327272932],[2.0119065404869643,-0.28235965417697934,3.020138369128123,-0.11676019141450511,-0.5630429732613209,0.5368005727417781,-3.1418840164318675,-1.502275792881845,4.302886584680534,-2.168363020196556],[-1.7060611047781928,0.8916064032353518,1.473886859044435,-3.3815675369463825,-0.016407065000384025,4.075674386788165,-2.1237167971208684,-0.22142590284347063,2.9140937230549864,2.794132964871834],[-4.802819868829101,1.1516841677017533,-0.11323296520858878,-1.9768234216608085,-0.408458305057135,1.6433745841495768,1.0229772588238126,-1.8673780698329168,2.9106487466953785,1.0225824315100982],[3.2283099540509332,1.5184976723045156,4.35527886059136,0.16046835780143942,-0.3925626573152809,-0.19623046834021884,-1.3657094857655454,2.254852406308063,2.105859876889745,3.2192314242944193],[-2.217364679370069,2.5844144583679793,1.6687322953715955,-2.9471704102121254,0.7313680238090462,3.4284362141974363,-2.605573152750729,-1.655042755231257,1.7622993727214729,3.519697591289888],[-4.432877831626681,2.0206800560466984,0.11912416145205618,-1.1652599903754872,-2.3722583324648405,3.2574352267198345,0.2490368774160746,-2.1414019335061263,2.6525817333720734,0.7573194483295155],[-3.746257699932898,-2.918708435166625,2.173108194023374,-0.5669062144123007,-0.4765461777336879,3.183772371429958,0.006805152818560811,-2.7376878421753585,1.2597750610672032,2.3437160994857638],[2.023798520769927,-0.9825039061717681,3.270504962652936,-0.8743954739533358,-1.1625221564434431,2.015559409651907,-2.9534977719187685,-1.4811346828937517,2.67871190337465,-0.7762917902320622],[-0.3436871311627313,-1.4816201001405709,3.4490950759500314,-0.596694252453744,-0.8245429701171804,-0.7347620738670222,0.656016785185786,2.2916400779038693,3.88121811067685,2.6691009553149434],[1.2052902559749814,-1.2141680852510026,3.3387918688357017,-1.431494739186018,-1.7460841472260622,1.6872962175868471,-2.838014989905054,-1.4342314669862377,2.437857666146018,-0.31574471108615376],[-0.07929926784708935,-0.7243126012384882,3.470255430042749,-0.6741988822817798,-0.44117856128141164,0.14065393954515548,0.890235533658417,1.6255019191652562,4.1818747109733465,2.6998501667752954],[1.2781719581224062,-0.7129547229968001,2.6785299530252953,1.1956910383887598,-2.249595405627039,1.254510155227036,-1.2344223594292956,-2.325918786786495,1.323259963188327,-0.517367916554212],[2.0187878127209875,0.9407305083237597,1.8000755207613262,-0.5074868951924142,-1.2429540709592346,1.3121080578304842,-3.921585232764482,-2.2232621284201723,2.0850379274226807,-1.5163366695865994],[1.2434716402553052,0.4549113983288421,3.132778693921868,1.392346106469632,0.11142577147111421,-0.44398938622325557,0.2538906631059962,0.7686089305207141,6.037761414516714,1.0156345093622874],[-5.59372505666688,1.6108851003460614,-0.5465654993429768,-2.0729757023043907,-0.8981912468560012,3.3963035828434007,1.5108866686001425,-2.2757372071966486,1.9694109133444822,0.4518214063718987],[1.112380334269258,0.31282899845391665,2.856384916417305,1.2994774542748941,0.4518730326555681,-0.08041685149073496,0.7912947260774689,1.2490600198507318,5.751019224803891,1.6440293669700696],[-0.7380616421811271,-0.47964231586083644,1.8606179395690678,-1.6053859102539718,-1.15124230282381,-2.8312315043993252,-0.3961171638220502,-0.3549942208453999,1.1163278714753773,3.3116955010220464],[0.7216151108033978,3.037843254860494,2.889145714603378,-0.6399396155960855,-1.6189703245647178,-0.3718804321251793,-0.9411658247932767,1.25691606923938,2.2501131075434446,0.3019300833344474],[1.2274562225677097,0.29609882030636225,4.661960284225643,-2.9211355358362185,-0.3791422638110804,-0.9397159684449424,1.0485313086770494,1.9713541449978953,4.314818959590043,1.3551811642944878],[-4.233625659067183,0.5347672072239246,-1.1128968516364681,-1.2906266779638809,-1.0717280163429646,1.837030914891519,1.7173837041482338,-1.3294928083196234,2.091875585448006,0.07130710128695494],[-4.199455357994882,1.5241500695236057,0.5013232598081245,-1.6277540638111514,-1.8892372570000564,2.582859490532435,1.1190012112259877,-1.4852824300527527,2.799247083906094,0.5910214155912469],[-4.936265022400762,-1.8156906298361695,2.975004117190841,-1.1684757427312422,-0.7870499714277669,3.017257621604957,0.09624764248728762,-2.6681198881938997,1.8878260861151017,2.100125018320986],[-2.127010928187513,2.885405848082161,2.1187094308435954,-3.019906603638079,1.1905396957881758,3.9249017336405907,-2.7244824890047297,-1.0561337569728448,1.7683587706647907,3.04745962433518],[0.5431219235993944,-0.23167418958619135,1.6841888491064458,-0.18866686476394506,-0.5343817434273603,0.2413990796543669,-5.027233358658853,-1.7506442153826343,1.8442231078632259,-0.6377965550869702],[1.2272439240478001,-0.11366430828347707,2.4802679326385415,-0.91813634308055,-0.6082791267894154,1.2893447234295325,-4.715763186290861,-1.2696829326450811,2.391964283492425,-1.5334560729563242],[1.946544924285266,0.7475935644470167,1.9119728347286733,0.33971469057723924,-1.182773222494865,1.1248343058861807,-4.493368651345372,-1.969606221839784,2.0884695920161986,-0.8279954044148332],[0.056589529756458756,2.9529813454486464,2.5387073798105257,-0.9941831202246243,-1.6825593031011454,-0.31135664274915886,-0.030174608528611424,1.5289009554311654,1.4869446718134047,-0.32511429898440686],[2.405204595159743,0.4333349001593899,1.6152300072834036,1.5011795003898452,-2.4095423356629864,0.2620262670330713,-1.498157496377821,-0.5542125994339566,1.7474469806067727,-1.0934817191213364],[2.2222024577669837,0.20299375327304114,1.9585134714841979,0.6272539705969397,-3.38091716477647,0.6168014506809424,-1.5128602504730178,-0.5113740673288684,2.3776013978757047,-0.7806639334186907],[-4.40534280994907,-0.017486350703981968,-0.08481203485280142,-2.3254661227576414,-0.66819029645994,2.4188346357084893,0.9855880094692119,-1.9728485595434861,2.8573441955261023,0.4401615396142079],[1.479707040917131,-0.5994952063076188,2.4890999790281203,1.0918599168770013,-1.9445684603415372,0.8925452304072689,-4.378227572329346,-1.6233820378780353,1.8972891676239758,-1.4929501989856369],[2.3762286585755676,-0.8839897762052706,3.6297337844968003,-0.1366008923389016,-0.9028227630071283,0.2766330719925477,-3.3357157802209243,-2.963415351137517,4.555366882402458,-2.472210752032696],[-3.2146664355881436,0.9499309630133269,1.5646427948027872,-3.59807819491252,-0.04685688512399683,4.204990718420603,-1.8237650344148268,-0.10885348040610088,3.087723019067209,3.1392336336895927],[2.6612302142195428,-1.0682601832784702,0.988983480446055,0.676386800501496,-1.829486844036723,0.6353068501688556,-4.55853342022747,-2.711901238001881,2.8646278680302286,-1.6900728736072783],[2.376374351512643,-0.804348958376794,0.9109430324286366,0.27114726593717964,-1.2982013731263526,0.5136042029596879,-5.128729441575708,-3.2664871672168356,3.115740623790779,-2.0675362432375555],[-5.059817069303244,0.9707230049185486,0.12497974466532602,-2.162567060720173,-0.6042072872631223,2.5973481236957094,1.490301645360888,-2.2559154151007488,1.9545314709656036,0.8034582277759986],[1.7542218352668013,0.604007104784252,3.7375517334789063,-1.2420668246224515,-0.374118503835051,0.23989940751344063,0.22935335850343297,1.748337452113629,5.501916044112289,1.5152027694508496],[-0.24664371153339526,2.598731464799497,2.3278527732938663,-1.4384198744781314,-0.8245820625685086,0.19141162475571205,-0.7980281043797707,1.4340983569622057,2.036215827893472,-0.6447134254500255],[0.9369884836487513,-0.9217537374235679,2.9338944155722997,1.5551028165034957,-2.6160103223286533,1.3936700654216119,-1.6702089002355893,-1.4753391830250604,1.9867723296396504,-0.652220861986279],[-0.013727927301076581,1.8874422660097498,3.843314212560656,-0.8407051401212802,-2.369041537027804,0.22756607662886474,1.1973453124053788,1.098129561170936,6.111451710108663,0.23796730004251687],[1.9075870661996341,0.7860569122247413,2.5432560896501095,-0.990174374449998,-0.06788077438249634,1.2225940494798135,-3.7571102103218434,-2.1384385852143155,2.8303694077767525,-2.73799723032862],[1.1892416874878133,0.21707493523135868,2.7564609790221013,1.5516719491221016,-1.1969805984757786,-0.5102119126357124,-3.837389613315462,-2.7540142567828285,4.465812428575016,-3.4894394723698485],[-2.412424110528075,3.3960069314576744,2.1644986668601667,-1.8385337599553133,1.4463162689469766,2.7374557682313116,-1.8691446511074892,-2.1166141565889074,3.043968624528507,3.529854154773066],[-0.16268083294853325,0.9076880428940076,3.9124978965148354,-0.450275731459259,-2.5122582291252886,0.21527551822364432,1.6089366472326234,1.207942850142718,5.961606236826624,0.2935935342684456],[-4.421913645323361,-1.136066410783676,2.3265618028119244,-0.8805223709903646,0.2852453066967444,2.028087293077268,0.09991875160485525,-3.140121553093189,2.762210634257655,2.292145576141783],[3.5742208891548266,2.428926960937684,5.476965292170652,0.23837395180016963,-0.3920767351053624,-1.037212313339115,-0.5327802968211458,2.0042517226189456,1.4579578571952978,2.4274589128792363],[-4.046936654765157,0.41680626040324786,0.15345676559955013,-1.246159423235802,-0.9732352494262132,2.390852574352182,2.5112084234133376,-1.7602881874889094,2.4183983555995026,0.7414220238104531],[-3.638293883856382,2.264463566709314,-0.4969607360661017,-1.9052265691570915,-2.9766463357023856,3.486954124178746,0.11786827910691522,-1.6887600304558825,2.3853209051303677,-0.059796010144048006],[-4.5402399315498725,-0.7903699713759095,2.5434032119810617,-1.0557983639650037,0.39928959561512045,3.262216480355718,-0.5432901280000805,-3.402033228054637,1.6156973849050802,2.8047205071896397],[1.0641131057404007,0.060383666213602805,2.29515166021885,0.7151505419053142,-0.8366781980730538,1.951709351036699,-4.18686384242028,-1.6277862217277268,1.451729174982764,-0.7444822628051047],[1.8392160844989145,0.13430424490943638,3.2909250743687304,0.26350311087444445,-0.8951338416896704,0.8954988728277399,-2.987061665952205,-1.8319816235452877,4.01968407584355,-2.7035694058984507],[-2.366010497603558,0.6756127119995711,1.761799734085801,-3.0643685950897597,0.251943703647704,4.008820099290467,-2.294486135803162,0.1061683645471978,3.0067923055030517,2.7235187325626713],[-4.9736861414276055,1.6947663531638706,-0.42864119373261805,-2.141915255691854,-0.44724026983603515,2.4083351244218725,0.7729456214234237,-2.040979991666968,3.3085396737791686,0.8353843230754211],[3.248879074025904,1.0029518187046098,4.391279330290862,0.1047243019565961,-0.1688762598670988,0.1411102322861545,-0.8915620478801416,2.344310387969025,2.116613280307511,2.889748308807619],[-2.1358253159560197,2.8621057243086456,2.394464639574293,-2.7244832727126735,0.9635471559129661,3.6361322968266996,-3.0085799654945715,-1.8951913697645026,2.03402784904466,3.211044999025772],[-4.896339515317229,1.971930581424389,-0.3451923763379443,-1.562944561894981,-1.7458563131280207,3.359738072846093,0.32369800060987497,-2.164122879318888,2.784380568284552,0.3226655827835272],[-3.699597358424211,-3.1482326542027272,2.29106159731746,-0.6682564818300296,-0.2564895278774185,3.1560218007303855,-0.07531355340033746,-2.586746549047524,1.0427379337139522,2.286312110722074],[1.494890456739816,-1.081720032077282,3.220984367840006,-0.8863348309881979,-0.9934552407823466,2.6867962102405745,-3.1838286450132673,-1.6041424470022307,2.5551232156343837,-1.2369856199249623],[-0.45059601282700734,-1.491542312875389,3.630004310421651,-0.4240046523511406,-0.5929975143633771,-0.34954656194895417,1.1432520275004228,2.3044124962762025,4.204009537119413,2.746782484650621],[1.86947432952002,-1.1230788567103436,3.5016838334500933,-1.0718829837627701,-0.9979857153259184,2.0114513547159754,-2.709358961321408,-1.7632654869928945,1.9738854820840137,-0.34016432724893075],[-0.0365944574587031,-0.8740211252123107,3.0652478966862016,-1.3288338378071782,-0.2576008290983724,-0.2089536413550368,0.6557020920328814,1.867942835576835,4.428669813554729,3.1206158030778264],[1.2939730848185755,-0.6706312828697254,2.846142675355091,0.9579493743367501,-1.8912396610714461,0.6196624309755868,-1.3053594220429616,-1.6118147425353513,1.315945950616158,-0.44850825238972847],[2.098184943851087,1.1324254612438391,1.2882252754643706,-0.15786580005660616,-0.686810062360013,0.839737672079356,-4.00318658221513,-2.208056913875042,2.1564185111783525,-1.493025547266007],[0.976530007366094,0.2365529248490944,2.5610334178432863,1.5973619818687448,0.24393619010225065,0.024259320646525473,0.03947593783959913,0.15293067116290404,6.315372873563316,1.0845554344356132],[-5.817083129379897,1.0553799395449484,-0.20342089068144437,-1.7430335036478914,-0.7205696410499485,3.427242718543865,1.683076696656645,-1.9107141871005253,2.2886479883454833,0.7754185438156201],[1.779562504496428,0.29246980249881893,2.841564195789401,1.2762755390256655,0.2701229280792189,-0.19382226523011822,0.7328295788727716,0.5843361839652068,5.783110482711342,1.6989589005708767],[-0.9653624703176309,-0.3667104977183031,2.132219145633292,-1.412706345040351,-1.1119526225142162,-2.8612918815575497,-1.036585440859194,-0.3015374973416314,0.9941859421320346,3.875122234225279],[0.7774578540585958,3.0552384129725434,3.1290250401944055,-0.16310373349115215,-0.9579009492881523,-0.3665040184743686,-1.3437911886721823,1.5781998053193114,1.8716099721379638,0.2064919844269767],[0.7481598337180936,-0.0273410657420739,4.390337845869363,-2.17826568558812,-1.0144417569972561,-0.9182002050802102,0.4133151953108628,1.8521585533395415,4.4712624615989585,0.7954091763123933],[-4.173695428762584,-0.12112169908359399,-0.8980905495583998,-1.553627619240431,-0.7831148416735202,1.8187514691613695,1.393784244917334,-1.708883734419937,2.476706022117296,0.14363990183920394],[-4.3169675598852315,1.3612411593087046,-0.025165877118705327,-1.7779370109550636,-1.6380503536201991,2.530836046021439,1.1960903387516746,-1.6949659945443227,2.9796936764381923,0.7149019351229141],[-5.455127074290062,-1.5887108487077035,2.845829815045002,-0.9645504568703462,-0.4617101618088766,2.569313537981369,0.43128577321767814,-2.2840267548337523,1.744301517959694,2.343419962003835]]
export const SERIALIZED_DATA = `
[[-2.0645738358609314,2.3254719858057857,2.2607344487682024,-2.7885570651851554,0.7586145839653916,4.471950425114491,-2.7269154880195843,-0.9246640859171704,1.7232799408026134,2.92312058955432]]
`

export const GENERATED_CREATURE_COUNT = 10
export const USE_SERIALIZED = true
export const CREATURE_WEIGHTS = USE_SERIALIZED ?
  JSON.parse(SERIALIZED_DATA) :
  [...Array(GENERATED_CREATURE_COUNT)].map(
    () => [...Array(10)].map(() => 2 * random() - 1)
  )
export const CREATURE_COUNT = CREATURE_WEIGHTS.length
