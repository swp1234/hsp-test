(() => {
    'use strict';

    const supported = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
    const triggerKeys = ['sound', 'light', 'social', 'touch', 'demands'];
    const placeKeys = ['work', 'school', 'public', 'home'];
    const capacityKeys = ['steady', 'strained', 'exit'];
    const sourceKeys = ['hsp_result', 'sensory_map', 'emotion_action', 'portal_tools_catalog', 'blog_sensory_bridge'];
    const query = new URLSearchParams(location.search);
    let savedLanguage = '';
    try { savedLanguage = localStorage.getItem('app_language') || ''; } catch (_) {}
    const browserLanguage = (navigator.language || 'en').slice(0, 2).toLowerCase();
    let language = supported.includes(query.get('lang')) ? query.get('lang')
        : supported.includes(savedLanguage) ? savedLanguage
        : supported.includes(browserLanguage) ? browserLanguage : 'en';
    let trigger = 'sound';
    let place = 'work';
    let capacity = 'strained';
    const source = sourceKeys.includes(query.get('source')) ? query.get('source') : 'direct';

    const translations = {
        en: {
            skip:'Skip to reset card',back:'← Back to HSP test',language:'Language',eyebrow:'PRIVATE IN-THE-MOMENT TOOL',title:'5-Minute Sensory Reset Card',subtitle:'Choose what feels too intense right now. Get a small plan for lowering input, orienting, and deciding one next action.',privacy:'No score · no account · selections stay on this device',setupEyebrow:'BUILD YOUR CARD',setupTitle:'What needs to feel smaller for five minutes?',triggerLabel:'Main source of input',placeLabel:'Where are you?',capacityLabel:'What is realistic now?',generate:'Build my 5-minute card',ad:'Advertisement',resultEyebrow:'YOUR RESET CARD',resultTitle:'Five minutes, one step at a time',timerLabel:'remaining',startTimer:'Start 5-minute timer',pauseTimer:'Pause timer',resumeTimer:'Resume timer',resetTimer:'Reset timer',copy:'Copy card',print:'Print pocket card',copied:'Reset card copied.',completed:'Five minutes complete. Check what changed before choosing your next step.',boundaryTitle:'What this card can and cannot do',boundaryCopy:'This is a planning aid, not a diagnosis or treatment. It cannot determine why you feel unwell. If symptoms are sudden, severe, unusual for you, or include trouble breathing, chest pain, fainting, or immediate danger, seek appropriate urgent help.',nextTitle:'Use the pattern later',nextCopy:'When you have more capacity, note which input mattered most and what reduced it. The goal is a repeatable observation, not proving that you are or are not highly sensitive.',testLink:'Open the HSP sensitivity profile',guideLink:'Read the sensory overload guide',privacyPolicy:'Privacy',moreTools:'More DopaBrain tools',
            triggers:{sound:'Sound',light:'Light or screens',social:'Social input',touch:'Touch or clothing',demands:'Too many demands'},places:{work:'Work',school:'School',public:'Public place',home:'Home'},capacities:{steady:'I can make one adjustment',strained:'I need fewer decisions',exit:'I need help leaving or pausing'},
            reduce:{sound:'Lower one sound source: mute a notification, move farther away, or use hearing protection you already tolerate.',light:'Lower one light source: dim a screen, face away, or move to softer light if safe.',social:'Pause one stream of social input: stop replying, step aside, or ask for one quiet minute.',touch:'Remove or loosen one avoidable source of touch only if it is safe and appropriate where you are.',demands:'Put all but one demand out of view. Write the next single task and ignore the rest for five minutes.'},
            orient:'Name three neutral things you can see. Let your eyes rest on the least intense one.',
            settle:'Unclench one area you notice. Breathe normally; do not force a deep breath if that feels worse.',
            capacity:{steady:'Make one reversible adjustment, then wait before adding another.',strained:'Choose the easiest option on this card. No extra optimization is required.',exit:'Contact a trusted person or responsible staff member and ask for help pausing or leaving safely.'},
            place:{work:'Use one short sentence: “I need five quiet minutes, then I will confirm the next step.”',school:'Use one short sentence: “I need a brief lower-input break, then I will check what comes next.”',public:'Move toward a familiar, lower-input, or staffed area if it is safe to do so.',home:'Reduce one controllable input and postpone one non-urgent demand.'},
            check:'At five minutes, ask: what is lower, unchanged, or worse? Choose the smallest safe next action.'
        },
        ko: {
            skip:'리셋 카드로 건너뛰기',back:'← HSP 테스트로 돌아가기',language:'언어',eyebrow:'지금 이 순간을 위한 개인 도구',title:'5분 감각 과부하 리셋 카드',subtitle:'지금 너무 강하게 느껴지는 자극을 고르세요. 입력을 줄이고 주변을 확인한 뒤 다음 행동 하나를 정하는 작은 계획을 만듭니다.',privacy:'점수 없음 · 가입 없음 · 선택은 이 기기에만 저장',setupEyebrow:'나의 카드 만들기',setupTitle:'5분 동안 무엇을 조금 줄여야 하나요?',triggerLabel:'가장 큰 자극',placeLabel:'지금 있는 곳',capacityLabel:'지금 가능한 수준',generate:'5분 리셋 카드 만들기',ad:'광고',resultEyebrow:'나의 리셋 카드',resultTitle:'5분 동안 한 단계씩',timerLabel:'남음',startTimer:'5분 타이머 시작',pauseTimer:'타이머 일시정지',resumeTimer:'타이머 계속',resetTimer:'타이머 초기화',copy:'카드 복사',print:'포켓 카드 인쇄',copied:'리셋 카드를 복사했습니다.',completed:'5분이 끝났습니다. 다음 행동을 정하기 전에 무엇이 달라졌는지 확인하세요.',boundaryTitle:'이 카드가 할 수 있는 것과 없는 것',boundaryCopy:'이 카드는 계획을 돕는 도구이며 진단이나 치료가 아닙니다. 불편함의 원인을 판단할 수 없습니다. 증상이 갑작스럽거나 심하거나 평소와 다르거나, 호흡곤란·가슴 통증·실신·즉각적인 위험이 있다면 적절한 긴급 도움을 받으세요.',nextTitle:'나중에 패턴으로 활용하기',nextCopy:'여유가 생기면 어떤 자극이 가장 컸고 무엇이 줄여 주었는지 기록하세요. 목표는 반복 가능한 관찰이지 HSP 여부를 증명하는 것이 아닙니다.',testLink:'HSP 감각 프로필 열기',guideLink:'감각 과부하 가이드 읽기',privacyPolicy:'개인정보',moreTools:'DopaBrain 도구 더 보기',
            triggers:{sound:'소리',light:'빛 또는 화면',social:'사람과 대화',touch:'촉감 또는 옷',demands:'너무 많은 요구'},places:{work:'직장',school:'학교',public:'공공장소',home:'집'},capacities:{steady:'조정 하나는 할 수 있음',strained:'결정을 줄여야 함',exit:'멈추거나 나가는 데 도움이 필요함'},
            reduce:{sound:'알림을 끄거나 거리를 두거나, 평소 견딜 수 있는 청각 보호 도구를 써서 소리 하나를 줄이세요.',light:'화면을 어둡게 하거나 시선을 돌리거나, 안전하다면 더 부드러운 빛으로 이동하세요.',social:'답장을 멈추거나 잠시 옆으로 이동하거나, 조용한 1분을 요청해 사람 자극 하나를 멈추세요.',touch:'안전하고 상황에 맞는 범위에서 피할 수 있는 촉감 하나를 제거하거나 느슨하게 하세요.',demands:'한 가지를 제외한 요구는 보이지 않게 두세요. 다음 할 일 하나만 적고 5분 동안 나머지는 미루세요.'},
            orient:'눈에 보이는 중립적인 것 세 가지를 말해 보세요. 가장 덜 강한 곳에 시선을 쉬게 하세요.',
            settle:'긴장한 부위 하나를 느슨하게 하세요. 깊은 호흡이 더 불편하다면 억지로 하지 말고 평소처럼 숨 쉬세요.',
            capacity:{steady:'되돌릴 수 있는 조정 하나만 하고, 다른 것을 더하기 전에 잠시 기다리세요.',strained:'이 카드에서 가장 쉬운 선택 하나만 하세요. 더 잘하려고 최적화할 필요는 없습니다.',exit:'믿을 수 있는 사람이나 담당자에게 연락해 안전하게 멈추거나 이동할 도움을 요청하세요.'},
            place:{work:'짧게 말하세요. “조용한 5분이 필요합니다. 그 뒤 다음 단계를 확인하겠습니다.”',school:'짧게 말하세요. “자극이 적은 짧은 휴식이 필요합니다. 그 뒤 다음 할 일을 확인하겠습니다.”',public:'안전하다면 익숙하거나 자극이 적거나 직원이 있는 곳으로 이동하세요.',home:'조절 가능한 자극 하나를 줄이고 급하지 않은 요구 하나를 미루세요.'},
            check:'5분 뒤 무엇이 줄었고, 그대로이고, 더 심해졌는지 확인하세요. 가장 작고 안전한 다음 행동을 고르세요.'
        },
        zh: {
            skip:'跳到重置卡',back:'← 返回 HSP 测试',language:'语言',eyebrow:'当下使用的私人工具',title:'5分钟感官过载重置卡',subtitle:'选择此刻过强的刺激，获得一个减少输入、确认环境并决定下一步的小计划。',privacy:'不评分 · 无需账号 · 选择仅保存在本设备',setupEyebrow:'制作你的卡片',setupTitle:'接下来5分钟，什么需要变弱一点？',triggerLabel:'主要刺激来源',placeLabel:'你在哪里？',capacityLabel:'现在什么是可行的？',generate:'制作5分钟重置卡',ad:'广告',resultEyebrow:'你的重置卡',resultTitle:'五分钟，一次一步',timerLabel:'剩余',startTimer:'开始5分钟计时',pauseTimer:'暂停计时',resumeTimer:'继续计时',resetTimer:'重置计时',copy:'复制卡片',print:'打印口袋卡',copied:'重置卡已复制。',completed:'五分钟结束。决定下一步前，先看看什么发生了变化。',boundaryTitle:'这张卡能做什么、不能做什么',boundaryCopy:'这是计划辅助工具，不是诊断或治疗，也不能判断不适原因。如果症状突然、严重、异常，或出现呼吸困难、胸痛、晕厥或即时危险，请寻求适当的紧急帮助。',nextTitle:'之后利用这个规律',nextCopy:'状态允许时，记下最明显的刺激以及什么帮助降低了它。目标是形成可重复观察，而不是证明自己是否为高敏感人群。',testLink:'打开 HSP 感官档案',guideLink:'阅读感官过载指南',privacyPolicy:'隐私',moreTools:'更多 DopaBrain 工具',
            triggers:{sound:'声音',light:'灯光或屏幕',social:'社交输入',touch:'触感或衣物',demands:'过多要求'},places:{work:'工作场所',school:'学校',public:'公共场所',home:'家中'},capacities:{steady:'我能做一项调整',strained:'我需要减少决定',exit:'我需要帮助暂停或离开'},
            reduce:{sound:'减少一个声音来源：关闭通知、拉开距离，或使用你平时能接受的听觉防护。',light:'减少一个光源：调暗屏幕、转开视线，或在安全时移到柔和光线处。',social:'暂停一股社交输入：停止回复、走到一旁，或请求安静一分钟。',touch:'在安全且合适的情况下，移除或放松一个可避免的触感来源。',demands:'除一项外，把其他要求移出视线。只写下下一件事，五分钟内先不管其余。'},
            orient:'说出眼前三个中性的东西，让视线停在刺激最小的一个上。',
            settle:'放松一个你注意到的紧绷部位。正常呼吸；如果深呼吸更不舒服，不要勉强。',
            capacity:{steady:'只做一项可撤销的调整，再等一会儿，不急着添加更多。',strained:'只选卡片上最容易的一项，不需要额外优化。',exit:'联系可信的人或现场负责人，请他们帮助你安全暂停或离开。'},
            place:{work:'用一句短话：“我需要安静五分钟，之后会确认下一步。”',school:'用一句短话：“我需要短暂减少刺激，之后会确认接下来做什么。”',public:'如果安全，移向熟悉、刺激较少或有工作人员的区域。',home:'减少一个可控刺激，并推迟一项不紧急的要求。'},
            check:'五分钟后确认：什么减轻了、没变或更严重？选择最小且安全的下一步。'
        },
        ja: {
            skip:'リセットカードへ移動',back:'← HSPテストに戻る',language:'言語',eyebrow:'今この瞬間のための個人ツール',title:'5分間 感覚過負荷リセットカード',subtitle:'今強すぎる刺激を選び、入力を減らし、周囲を確認して次の行動を一つ決める小さな計画を作ります。',privacy:'点数なし · 登録不要 · 選択はこの端末だけに保存',setupEyebrow:'カードを作る',setupTitle:'5分間、何を少し小さくしたいですか？',triggerLabel:'主な刺激',placeLabel:'今いる場所',capacityLabel:'今できそうなこと',generate:'5分カードを作る',ad:'広告',resultEyebrow:'あなたのリセットカード',resultTitle:'5分間、一つずつ',timerLabel:'残り',startTimer:'5分タイマー開始',pauseTimer:'一時停止',resumeTimer:'再開',resetTimer:'タイマーをリセット',copy:'カードをコピー',print:'ポケットカードを印刷',copied:'カードをコピーしました。',completed:'5分が終了しました。次を決める前に何が変わったか確認しましょう。',boundaryTitle:'このカードにできること・できないこと',boundaryCopy:'これは計画を助ける道具で、診断や治療ではありません。不調の原因は判断できません。突然・重度・普段と違う症状、呼吸困難、胸痛、失神、差し迫った危険がある場合は、適切な緊急支援を求めてください。',nextTitle:'あとでパターンとして使う',nextCopy:'余裕が戻ったら、どの刺激が大きく、何が減らしたかを記録します。HSPかどうかを証明するのではなく、繰り返せる観察が目標です。',testLink:'HSP感覚プロフィールを開く',guideLink:'感覚過負荷ガイドを読む',privacyPolicy:'プライバシー',moreTools:'DopaBrainの他のツール',
            triggers:{sound:'音',light:'光や画面',social:'人や会話',touch:'触感や衣服',demands:'多すぎる要求'},places:{work:'職場',school:'学校',public:'公共の場所',home:'自宅'},capacities:{steady:'一つ調整できる',strained:'決定を減らしたい',exit:'中断や退出の助けが必要'},
            reduce:{sound:'通知を消す、距離を取る、普段使える聴覚保護を使うなど、音源を一つ減らします。',light:'画面を暗くする、向きを変える、安全なら柔らかい光へ移るなど、光を一つ減らします。',social:'返信を止める、少し離れる、静かな1分を頼むなど、対人入力を一つ止めます。',touch:'安全で状況に合う範囲で、避けられる触感を一つ外すか緩めます。',demands:'一つ以外の要求を視界から外し、次の一件だけ書いて5分間は残りを保留します。'},
            orient:'見える中立的なものを三つ挙げ、最も刺激の少ないものに視線を休めます。',
            settle:'気づいた緊張部位を一つ緩めます。深呼吸で悪化するなら無理をせず、普段どおり呼吸します。',
            capacity:{steady:'元に戻せる調整を一つだけ行い、次を加える前に待ちます。',strained:'このカードで一番簡単な選択だけにします。最適化は不要です。',exit:'信頼できる人や担当者に連絡し、安全に中断・退出する助けを求めます。'},
            place:{work:'短く伝えます。「静かな5分が必要です。その後、次を確認します。」',school:'短く伝えます。「刺激の少ない短い休憩が必要です。その後、次を確認します。」',public:'安全なら、慣れた場所、刺激の少ない場所、スタッフのいる場所へ移ります。',home:'調整できる刺激を一つ減らし、急がない用事を一つ延期します。'},
            check:'5分後、減った・変わらない・悪化したものを確認し、最小で安全な次の行動を選びます。'
        },
        de: {
            skip:'Zur Reset-Karte',back:'← Zurück zum HSP-Test',language:'Sprache',eyebrow:'PRIVATES WERKZEUG FÜR DEN MOMENT',title:'5-Minuten-Karte bei Reizüberflutung',subtitle:'Wähle, was gerade zu intensiv ist. Erhalte einen kleinen Plan, um Reize zu senken, dich zu orientieren und einen nächsten Schritt zu wählen.',privacy:'Keine Punktzahl · kein Konto · Auswahl bleibt auf diesem Gerät',setupEyebrow:'KARTE ERSTELLEN',setupTitle:'Was soll für fünf Minuten etwas weniger werden?',triggerLabel:'Stärkster Reiz',placeLabel:'Wo bist du?',capacityLabel:'Was ist gerade realistisch?',generate:'Meine 5-Minuten-Karte erstellen',ad:'Werbung',resultEyebrow:'DEINE RESET-KARTE',resultTitle:'Fünf Minuten, Schritt für Schritt',timerLabel:'verbleibend',startTimer:'5-Minuten-Timer starten',pauseTimer:'Timer pausieren',resumeTimer:'Timer fortsetzen',resetTimer:'Timer zurücksetzen',copy:'Karte kopieren',print:'Taschenkarte drucken',copied:'Reset-Karte kopiert.',completed:'Fünf Minuten sind um. Prüfe zuerst, was sich verändert hat.',boundaryTitle:'Was diese Karte kann – und was nicht',boundaryCopy:'Diese Karte ist eine Planungshilfe, keine Diagnose oder Behandlung. Sie kann die Ursache von Beschwerden nicht bestimmen. Bei plötzlichen, starken oder ungewohnten Symptomen, Atemnot, Brustschmerz, Ohnmacht oder unmittelbarer Gefahr suche passende dringende Hilfe.',nextTitle:'Das Muster später nutzen',nextCopy:'Wenn du mehr Kapazität hast, notiere den stärksten Reiz und was ihn verringerte. Ziel ist eine wiederholbare Beobachtung, nicht der Beweis, ob du hochsensibel bist.',testLink:'HSP-Sensibilitätsprofil öffnen',guideLink:'Ratgeber zu Reizüberflutung lesen',privacyPolicy:'Datenschutz',moreTools:'Weitere DopaBrain-Werkzeuge',
            triggers:{sound:'Geräusche',light:'Licht oder Bildschirme',social:'Soziale Reize',touch:'Berührung oder Kleidung',demands:'Zu viele Anforderungen'},places:{work:'Arbeit',school:'Schule',public:'Öffentlicher Ort',home:'Zuhause'},capacities:{steady:'Ich kann eine Sache anpassen',strained:'Ich brauche weniger Entscheidungen',exit:'Ich brauche Hilfe beim Pausieren oder Gehen'},
            reduce:{sound:'Senke eine Geräuschquelle: Benachrichtigung stumm, mehr Abstand oder gewohnter Gehörschutz.',light:'Senke eine Lichtquelle: Bildschirm dimmen, wegdrehen oder sicher zu weicherem Licht wechseln.',social:'Pausiere einen sozialen Reiz: nicht antworten, kurz beiseitetreten oder um eine ruhige Minute bitten.',touch:'Entferne oder lockere eine vermeidbare Berührung, sofern es sicher und passend ist.',demands:'Blende alle Anforderungen bis auf eine aus. Notiere nur den nächsten Schritt und verschiebe den Rest fünf Minuten.'},
            orient:'Nenne drei neutrale Dinge, die du siehst. Lass den Blick auf dem am wenigsten intensiven ruhen.',
            settle:'Lockere eine angespannte Stelle. Atme normal; erzwinge keinen tiefen Atemzug, wenn das unangenehmer ist.',
            capacity:{steady:'Nimm eine rückgängig machbare Anpassung vor und warte, bevor du mehr veränderst.',strained:'Wähle die einfachste Option auf dieser Karte. Weitere Optimierung ist nicht nötig.',exit:'Kontaktiere eine vertraute Person oder zuständiges Personal und bitte um Hilfe für eine sichere Pause oder den Weg hinaus.'},
            place:{work:'Ein kurzer Satz: „Ich brauche fünf ruhige Minuten und bestätige danach den nächsten Schritt.“',school:'Ein kurzer Satz: „Ich brauche kurz weniger Reize und prüfe danach, was als Nächstes kommt.“',public:'Gehe, wenn sicher, zu einem vertrauten, reizärmeren oder betreuten Bereich.',home:'Reduziere einen kontrollierbaren Reiz und verschiebe eine nicht dringende Anforderung.'},
            check:'Prüfe nach fünf Minuten: Was ist weniger, gleich oder stärker? Wähle den kleinsten sicheren nächsten Schritt.'
        },
        es: {
            skip:'Ir a la tarjeta',back:'← Volver al test HSP',language:'Idioma',eyebrow:'HERRAMIENTA PRIVADA PARA EL MOMENTO',title:'Tarjeta de Reinicio Sensorial de 5 Minutos',subtitle:'Elige lo que se siente demasiado intenso y crea un pequeño plan para bajar estímulos y decidir un siguiente paso.',privacy:'Sin puntuación · sin cuenta · tus elecciones quedan en este dispositivo',setupEyebrow:'CREA TU TARJETA',setupTitle:'¿Qué necesita sentirse más pequeño durante cinco minutos?',triggerLabel:'Estímulo principal',placeLabel:'¿Dónde estás?',capacityLabel:'¿Qué es realista ahora?',generate:'Crear mi tarjeta',ad:'Publicidad',resultEyebrow:'TU TARJETA',resultTitle:'Cinco minutos, paso a paso',timerLabel:'restantes',startTimer:'Iniciar temporizador',pauseTimer:'Pausar',resumeTimer:'Continuar',resetTimer:'Reiniciar',copy:'Copiar tarjeta',print:'Imprimir tarjeta',copied:'Tarjeta copiada.',completed:'Cinco minutos completados. Comprueba qué cambió antes de elegir el siguiente paso.',boundaryTitle:'Lo que esta tarjeta puede y no puede hacer',boundaryCopy:'Es una ayuda de planificación, no un diagnóstico ni tratamiento. No determina la causa del malestar. Ante síntomas repentinos, graves o inusuales, dificultad para respirar, dolor de pecho, desmayo o peligro inmediato, busca ayuda urgente apropiada.',nextTitle:'Usa el patrón después',nextCopy:'Cuando tengas más capacidad, anota qué estímulo importó más y qué lo redujo. El objetivo es observar un patrón, no demostrar si eres altamente sensible.',testLink:'Abrir el perfil HSP',guideLink:'Leer la guía de sobrecarga sensorial',privacyPolicy:'Privacidad',moreTools:'Más herramientas DopaBrain',
            triggers:{sound:'Sonido',light:'Luz o pantallas',social:'Interacción social',touch:'Tacto o ropa',demands:'Demasiadas demandas'},places:{work:'Trabajo',school:'Estudios',public:'Lugar público',home:'Casa'},capacities:{steady:'Puedo ajustar una cosa',strained:'Necesito menos decisiones',exit:'Necesito ayuda para pausar o salir'},
            reduce:{sound:'Reduce una fuente de sonido: silencia una alerta, aléjate o usa protección auditiva que ya toleres.',light:'Reduce una fuente de luz: baja la pantalla, gira la vista o ve a una luz más suave si es seguro.',social:'Pausa una entrada social: deja de responder, apártate o pide un minuto de silencio.',touch:'Quita o afloja una fuente evitable de contacto si es seguro y apropiado.',demands:'Deja fuera de vista todas las demandas menos una. Escribe solo la siguiente tarea durante cinco minutos.'},
            orient:'Nombra tres cosas neutrales que ves y descansa la mirada en la menos intensa.',
            settle:'Afloja una zona tensa. Respira con normalidad; no fuerces una respiración profunda si empeora.',
            capacity:{steady:'Haz un ajuste reversible y espera antes de añadir otro.',strained:'Elige la opción más fácil de esta tarjeta. No hace falta optimizar.',exit:'Contacta a alguien de confianza o personal responsable y pide ayuda para pausar o salir con seguridad.'},
            place:{work:'Frase breve: “Necesito cinco minutos tranquilos y después confirmaré el siguiente paso.”',school:'Frase breve: “Necesito una pausa breve con menos estímulos y después revisaré qué sigue.”',public:'Si es seguro, ve a una zona conocida, con menos estímulos o con personal.',home:'Reduce un estímulo controlable y pospone una demanda no urgente.'},
            check:'A los cinco minutos pregunta: ¿qué bajó, siguió igual o empeoró? Elige el siguiente paso más pequeño y seguro.'
        },
        pt: {
            skip:'Ir para o cartão',back:'← Voltar ao teste HSP',language:'Idioma',eyebrow:'FERRAMENTA PRIVADA PARA O MOMENTO',title:'Cartão de Reset Sensorial de 5 Minutos',subtitle:'Escolha o que está intenso demais e crie um plano pequeno para reduzir estímulos e decidir um próximo passo.',privacy:'Sem pontuação · sem conta · escolhas ficam neste dispositivo',setupEyebrow:'CRIE SEU CARTÃO',setupTitle:'O que precisa ficar menor por cinco minutos?',triggerLabel:'Estímulo principal',placeLabel:'Onde você está?',capacityLabel:'O que é possível agora?',generate:'Criar meu cartão',ad:'Publicidade',resultEyebrow:'SEU CARTÃO',resultTitle:'Cinco minutos, um passo de cada vez',timerLabel:'restantes',startTimer:'Iniciar timer',pauseTimer:'Pausar',resumeTimer:'Continuar',resetTimer:'Reiniciar',copy:'Copiar cartão',print:'Imprimir cartão',copied:'Cartão copiado.',completed:'Cinco minutos completos. Verifique o que mudou antes do próximo passo.',boundaryTitle:'O que este cartão pode e não pode fazer',boundaryCopy:'É uma ajuda de planejamento, não diagnóstico ou tratamento. Não identifica a causa do mal-estar. Em sintomas repentinos, fortes ou incomuns, falta de ar, dor no peito, desmaio ou perigo imediato, procure ajuda urgente adequada.',nextTitle:'Use o padrão depois',nextCopy:'Quando tiver mais capacidade, anote qual estímulo pesou mais e o que o reduziu. O objetivo é observar um padrão, não provar se você é altamente sensível.',testLink:'Abrir perfil HSP',guideLink:'Ler guia de sobrecarga sensorial',privacyPolicy:'Privacidade',moreTools:'Mais ferramentas DopaBrain',
            triggers:{sound:'Som',light:'Luz ou telas',social:'Interação social',touch:'Toque ou roupa',demands:'Demandas demais'},places:{work:'Trabalho',school:'Estudos',public:'Lugar público',home:'Casa'},capacities:{steady:'Posso ajustar uma coisa',strained:'Preciso de menos decisões',exit:'Preciso de ajuda para pausar ou sair'},
            reduce:{sound:'Reduza uma fonte sonora: silencie um alerta, afaste-se ou use proteção auditiva que já tolera.',light:'Reduza uma luz: diminua a tela, vire-se ou vá para uma luz mais suave se for seguro.',social:'Pause uma entrada social: pare de responder, afaste-se ou peça um minuto quieto.',touch:'Remova ou afrouxe uma fonte evitável de toque se for seguro e apropriado.',demands:'Tire todas as demandas de vista menos uma. Anote só a próxima tarefa por cinco minutos.'},
            orient:'Nomeie três coisas neutras que vê e descanse o olhar na menos intensa.',
            settle:'Relaxe uma área tensa. Respire normalmente; não force respiração profunda se piorar.',
            capacity:{steady:'Faça um ajuste reversível e espere antes de adicionar outro.',strained:'Escolha a opção mais fácil do cartão. Não é preciso otimizar.',exit:'Contate alguém de confiança ou responsável e peça ajuda para pausar ou sair com segurança.'},
            place:{work:'Frase curta: “Preciso de cinco minutos tranquilos e depois confirmo o próximo passo.”',school:'Frase curta: “Preciso de uma pausa breve com menos estímulo e depois vejo o que vem.”',public:'Se for seguro, vá para uma área conhecida, menos intensa ou com funcionários.',home:'Reduza um estímulo controlável e adie uma demanda não urgente.'},
            check:'Após cinco minutos, veja o que diminuiu, ficou igual ou piorou. Escolha o menor próximo passo seguro.'
        },
        id: {
            skip:'Ke kartu reset',back:'← Kembali ke tes HSP',language:'Bahasa',eyebrow:'ALAT PRIBADI UNTUK SAAT INI',title:'Kartu Reset Sensorik 5 Menit',subtitle:'Pilih hal yang terasa terlalu kuat dan buat rencana kecil untuk mengurangi input serta menentukan satu langkah berikutnya.',privacy:'Tanpa skor · tanpa akun · pilihan tersimpan di perangkat ini',setupEyebrow:'BUAT KARTU',setupTitle:'Apa yang perlu dikecilkan selama lima menit?',triggerLabel:'Sumber input utama',placeLabel:'Di mana Anda?',capacityLabel:'Apa yang realistis sekarang?',generate:'Buat kartu 5 menit',ad:'Iklan',resultEyebrow:'KARTU RESET ANDA',resultTitle:'Lima menit, selangkah demi selangkah',timerLabel:'tersisa',startTimer:'Mulai timer',pauseTimer:'Jeda',resumeTimer:'Lanjutkan',resetTimer:'Atur ulang',copy:'Salin kartu',print:'Cetak kartu',copied:'Kartu disalin.',completed:'Lima menit selesai. Periksa perubahan sebelum memilih langkah berikutnya.',boundaryTitle:'Yang dapat dan tidak dapat dilakukan kartu ini',boundaryCopy:'Ini alat perencanaan, bukan diagnosis atau perawatan. Alat ini tidak menentukan penyebab keluhan. Jika gejala mendadak, berat, tidak biasa, disertai sulit bernapas, nyeri dada, pingsan, atau bahaya langsung, cari bantuan darurat yang sesuai.',nextTitle:'Gunakan polanya nanti',nextCopy:'Saat kapasitas lebih baik, catat input yang paling berpengaruh dan apa yang menguranginya. Tujuannya observasi yang bisa diulang, bukan membuktikan apakah Anda HSP.',testLink:'Buka profil HSP',guideLink:'Baca panduan beban sensorik',privacyPolicy:'Privasi',moreTools:'Alat DopaBrain lainnya',
            triggers:{sound:'Suara',light:'Cahaya atau layar',social:'Input sosial',touch:'Sentuhan atau pakaian',demands:'Terlalu banyak tuntutan'},places:{work:'Kerja',school:'Sekolah',public:'Tempat umum',home:'Rumah'},capacities:{steady:'Saya bisa mengubah satu hal',strained:'Saya perlu lebih sedikit keputusan',exit:'Saya perlu bantuan untuk berhenti atau pergi'},
            reduce:{sound:'Kurangi satu sumber suara: bisukan notifikasi, menjauh, atau gunakan pelindung yang sudah nyaman.',light:'Kurangi satu cahaya: redupkan layar, berpaling, atau pindah ke cahaya lembut jika aman.',social:'Jeda satu input sosial: berhenti membalas, menepi, atau minta satu menit tenang.',touch:'Lepas atau longgarkan satu sumber sentuhan yang bisa dihindari jika aman dan sesuai.',demands:'Sembunyikan semua tuntutan kecuali satu. Tulis hanya tugas berikutnya selama lima menit.'},
            orient:'Sebutkan tiga benda netral yang terlihat dan istirahatkan pandangan pada yang paling ringan.',
            settle:'Lemaskan satu area yang tegang. Bernapas normal; jangan paksa napas dalam jika terasa lebih buruk.',
            capacity:{steady:'Lakukan satu penyesuaian yang bisa dibatalkan, lalu tunggu sebelum menambah.',strained:'Pilih opsi termudah pada kartu. Tidak perlu mengoptimalkan.',exit:'Hubungi orang tepercaya atau petugas dan minta bantuan untuk berhenti atau pergi dengan aman.'},
            place:{work:'Kalimat singkat: “Saya perlu lima menit tenang, lalu saya akan memastikan langkah berikutnya.”',school:'Kalimat singkat: “Saya perlu jeda singkat dengan lebih sedikit input, lalu saya cek langkah berikutnya.”',public:'Jika aman, pindah ke area yang dikenal, lebih tenang, atau memiliki petugas.',home:'Kurangi satu input yang bisa dikendalikan dan tunda satu tuntutan yang tidak mendesak.'},
            check:'Setelah lima menit, periksa apa yang berkurang, tetap, atau memburuk. Pilih langkah aman terkecil.'
        },
        tr: {
            skip:'Sıfırlama kartına geç',back:'← HSP testine dön',language:'Dil',eyebrow:'ANLIK ÖZEL ARAÇ',title:'5 Dakikalık Duyusal Sıfırlama Kartı',subtitle:'Şu an fazla yoğun gelen uyaranı seçin; girdiyi azaltmak ve tek bir sonraki adımı belirlemek için küçük bir plan alın.',privacy:'Puan yok · hesap yok · seçimler bu cihazda kalır',setupEyebrow:'KARTINI OLUŞTUR',setupTitle:'Beş dakika boyunca ne biraz küçülmeli?',triggerLabel:'Ana uyaran',placeLabel:'Neredesiniz?',capacityLabel:'Şu an ne gerçekçi?',generate:'5 dakikalık kartı oluştur',ad:'Reklam',resultEyebrow:'SIFIRLAMA KARTIN',resultTitle:'Beş dakika, adım adım',timerLabel:'kaldı',startTimer:'Zamanlayıcıyı başlat',pauseTimer:'Duraklat',resumeTimer:'Sürdür',resetTimer:'Sıfırla',copy:'Kartı kopyala',print:'Kartı yazdır',copied:'Kart kopyalandı.',completed:'Beş dakika tamamlandı. Sonraki adımdan önce neyin değiştiğine bakın.',boundaryTitle:'Bu kart ne yapabilir ve yapamaz',boundaryCopy:'Bu bir planlama yardımcısıdır; tanı veya tedavi değildir. Rahatsızlığın nedenini belirleyemez. Ani, şiddetli veya alışılmadık belirtiler, nefes darlığı, göğüs ağrısı, bayılma ya da yakın tehlikede uygun acil yardım alın.',nextTitle:'Deseni daha sonra kullan',nextCopy:'Kapasiteniz arttığında en güçlü uyaranı ve neyin azalttığını not edin. Amaç, HSP olduğunuzu kanıtlamak değil, tekrarlanabilir gözlemdir.',testLink:'HSP profilini aç',guideLink:'Duyusal yük rehberini oku',privacyPolicy:'Gizlilik',moreTools:'Diğer DopaBrain araçları',
            triggers:{sound:'Ses',light:'Işık veya ekran',social:'Sosyal girdi',touch:'Dokunma veya giysi',demands:'Çok fazla talep'},places:{work:'İş',school:'Okul',public:'Kamusal alan',home:'Ev'},capacities:{steady:'Bir şeyi ayarlayabilirim',strained:'Daha az karar vermeliyim',exit:'Durmak veya çıkmak için yardım gerek'},
            reduce:{sound:'Bir ses kaynağını azaltın: bildirimi kapatın, uzaklaşın veya alışık olduğunuz korumayı kullanın.',light:'Bir ışığı azaltın: ekranı kısın, yönünüzü değiştirin veya güvenliyse yumuşak ışığa geçin.',social:'Bir sosyal girdiyi durdurun: yanıt vermeyin, kenara çekilin veya bir dakika sessizlik isteyin.',touch:'Güvenli ve uygunsa kaçınılabilir bir dokunma kaynağını çıkarın veya gevşetin.',demands:'Biri dışındaki talepleri görünmez yapın. Beş dakika için yalnızca sonraki işi yazın.'},
            orient:'Gördüğünüz üç nötr şeyi söyleyin ve gözünüzü en az yoğun olana dinlendirin.',
            settle:'Fark ettiğiniz gergin bir bölgeyi gevşetin. Normal nefes alın; kötü geliyorsa derin nefesi zorlamayın.',
            capacity:{steady:'Geri alınabilir tek bir ayar yapın ve yenisini eklemeden bekleyin.',strained:'Karttaki en kolay seçeneği seçin. Ek optimizasyon gerekmez.',exit:'Güvendiğiniz birine veya sorumlu personele ulaşıp güvenli mola ya da çıkış için yardım isteyin.'},
            place:{work:'Kısa cümle: “Beş sessiz dakikaya ihtiyacım var; sonra sonraki adımı doğrulayacağım.”',school:'Kısa cümle: “Kısa süre daha az uyarana ihtiyacım var; sonra sıradakini kontrol edeceğim.”',public:'Güvenliyse tanıdık, daha sakin veya personelli bir alana geçin.',home:'Kontrol edilebilir bir uyaranı azaltın ve acil olmayan bir talebi erteleyin.'},
            check:'Beş dakika sonra neyin azaldığını, aynı kaldığını veya kötüleştiğini kontrol edin. En küçük güvenli adımı seçin.'
        },
        fr: {
            skip:'Aller à la carte',back:'← Retour au test HSP',language:'Langue',eyebrow:'OUTIL PRIVÉ POUR LE MOMENT PRÉSENT',title:'Carte de Réduction Sensorielle en 5 Minutes',subtitle:'Choisissez ce qui semble trop intense et créez un petit plan pour réduire les stimuli et décider d’une prochaine action.',privacy:'Sans score · sans compte · choix conservés sur cet appareil',setupEyebrow:'CRÉEZ VOTRE CARTE',setupTitle:'Que faut-il réduire pendant cinq minutes ?',triggerLabel:'Stimulus principal',placeLabel:'Où êtes-vous ?',capacityLabel:'Qu’est-ce qui est réaliste maintenant ?',generate:'Créer ma carte',ad:'Publicité',resultEyebrow:'VOTRE CARTE',resultTitle:'Cinq minutes, une étape à la fois',timerLabel:'restantes',startTimer:'Démarrer le minuteur',pauseTimer:'Pause',resumeTimer:'Reprendre',resetTimer:'Réinitialiser',copy:'Copier la carte',print:'Imprimer la carte',copied:'Carte copiée.',completed:'Cinq minutes terminées. Vérifiez ce qui a changé avant la suite.',boundaryTitle:'Ce que cette carte peut et ne peut pas faire',boundaryCopy:'C’est une aide à la planification, pas un diagnostic ni un traitement. Elle ne détermine pas la cause d’un malaise. En cas de symptômes soudains, graves ou inhabituels, difficulté à respirer, douleur thoracique, évanouissement ou danger immédiat, cherchez une aide urgente adaptée.',nextTitle:'Réutilisez le schéma plus tard',nextCopy:'Quand vous aurez plus de capacité, notez le stimulus principal et ce qui l’a réduit. Le but est une observation répétable, pas de prouver si vous êtes hypersensible.',testLink:'Ouvrir le profil HSP',guideLink:'Lire le guide sur la surcharge sensorielle',privacyPolicy:'Confidentialité',moreTools:'Autres outils DopaBrain',
            triggers:{sound:'Son',light:'Lumière ou écrans',social:'Stimuli sociaux',touch:'Toucher ou vêtements',demands:'Trop de demandes'},places:{work:'Travail',school:'Études',public:'Lieu public',home:'Maison'},capacities:{steady:'Je peux ajuster une chose',strained:'J’ai besoin de moins de décisions',exit:'J’ai besoin d’aide pour faire une pause ou partir'},
            reduce:{sound:'Réduisez une source sonore : coupez une alerte, éloignez-vous ou utilisez une protection déjà tolérée.',light:'Réduisez une lumière : baissez l’écran, détournez-vous ou allez vers une lumière plus douce si c’est sûr.',social:'Mettez en pause un stimulus social : cessez de répondre, écartez-vous ou demandez une minute calme.',touch:'Retirez ou desserrez une source évitable de contact si cela est sûr et approprié.',demands:'Cachez toutes les demandes sauf une. Notez seulement la prochaine tâche pendant cinq minutes.'},
            orient:'Nommez trois choses neutres visibles et posez le regard sur la moins intense.',
            settle:'Relâchez une zone tendue. Respirez normalement ; ne forcez pas une grande inspiration si elle aggrave.',
            capacity:{steady:'Faites un seul ajustement réversible puis attendez avant d’en ajouter un autre.',strained:'Choisissez l’option la plus simple de la carte. Aucune optimisation supplémentaire.',exit:'Contactez une personne de confiance ou un responsable et demandez de l’aide pour faire une pause ou partir en sécurité.'},
            place:{work:'Phrase courte : « J’ai besoin de cinq minutes calmes, puis je confirmerai la suite. »',school:'Phrase courte : « J’ai besoin d’une courte pause avec moins de stimuli, puis je vérifierai la suite. »',public:'Si c’est sûr, allez vers un espace connu, moins stimulant ou avec du personnel.',home:'Réduisez un stimulus contrôlable et reportez une demande non urgente.'},
            check:'Après cinq minutes, vérifiez ce qui a diminué, n’a pas changé ou a empiré. Choisissez la plus petite action sûre.'
        },
        hi: {
            skip:'रीसेट कार्ड पर जाएँ',back:'← HSP टेस्ट पर लौटें',language:'भाषा',eyebrow:'अभी के लिए निजी टूल',title:'5-मिनट सेंसरी रीसेट कार्ड',subtitle:'जो चीज़ अभी बहुत तेज़ लग रही है उसे चुनें और इनपुट घटाने व अगला छोटा कदम तय करने की योजना पाएँ।',privacy:'कोई स्कोर नहीं · कोई खाता नहीं · चुनाव इसी डिवाइस पर',setupEyebrow:'अपना कार्ड बनाएँ',setupTitle:'पाँच मिनट के लिए क्या कम होना चाहिए?',triggerLabel:'मुख्य इनपुट',placeLabel:'आप कहाँ हैं?',capacityLabel:'अभी क्या संभव है?',generate:'5-मिनट कार्ड बनाएँ',ad:'विज्ञापन',resultEyebrow:'आपका रीसेट कार्ड',resultTitle:'पाँच मिनट, एक-एक कदम',timerLabel:'बाकी',startTimer:'टाइमर शुरू करें',pauseTimer:'रोकें',resumeTimer:'जारी रखें',resetTimer:'रीसेट करें',copy:'कार्ड कॉपी करें',print:'कार्ड प्रिंट करें',copied:'कार्ड कॉपी हो गया।',completed:'पाँच मिनट पूरे हुए। अगला कदम चुनने से पहले बदलाव देखें।',boundaryTitle:'यह कार्ड क्या कर सकता है और क्या नहीं',boundaryCopy:'यह योजना बनाने का टूल है, निदान या इलाज नहीं। यह अस्वस्थता का कारण नहीं बता सकता। अचानक, गंभीर या असामान्य लक्षण, साँस की दिक्कत, सीने में दर्द, बेहोशी या तुरंत खतरे में उचित आपात मदद लें।',nextTitle:'बाद में पैटर्न का उपयोग करें',nextCopy:'क्षमता लौटने पर सबसे असरदार इनपुट और उसे घटाने वाली चीज़ लिखें। लक्ष्य दोहराई जा सकने वाली समझ है, HSP होना साबित करना नहीं।',testLink:'HSP प्रोफ़ाइल खोलें',guideLink:'सेंसरी ओवरलोड गाइड पढ़ें',privacyPolicy:'गोपनीयता',moreTools:'और DopaBrain टूल',
            triggers:{sound:'आवाज़',light:'रोशनी या स्क्रीन',social:'सामाजिक इनपुट',touch:'स्पर्श या कपड़े',demands:'बहुत अधिक माँगें'},places:{work:'काम',school:'स्कूल',public:'सार्वजनिक जगह',home:'घर'},capacities:{steady:'मैं एक बदलाव कर सकता/सकती हूँ',strained:'मुझे कम फैसले चाहिए',exit:'रुकने या निकलने में मदद चाहिए'},
            reduce:{sound:'एक आवाज़ घटाएँ: सूचना बंद करें, दूरी बढ़ाएँ या पहले से सहनीय सुरक्षा उपयोग करें।',light:'एक रोशनी घटाएँ: स्क्रीन मंद करें, दिशा बदलें या सुरक्षित हो तो नरम रोशनी में जाएँ।',social:'एक सामाजिक इनपुट रोकें: जवाब रोकें, अलग हटें या एक शांत मिनट माँगें।',touch:'सुरक्षित और उचित हो तो टालने योग्य स्पर्श का एक स्रोत हटाएँ या ढीला करें।',demands:'एक को छोड़कर बाकी माँगें नज़र से हटाएँ। पाँच मिनट केवल अगला काम लिखें।'},
            orient:'दिख रही तीन तटस्थ चीज़ें बोलें और सबसे कम तीव्र चीज़ पर नज़र टिकाएँ।',
            settle:'एक तनाव वाले हिस्से को ढीला करें। सामान्य साँस लें; बुरा लगे तो गहरी साँस मजबूर न करें।',
            capacity:{steady:'एक वापस बदला जा सकने वाला समायोजन करें और अगला जोड़ने से पहले रुकें।',strained:'कार्ड का सबसे आसान विकल्प चुनें। अतिरिक्त सुधार ज़रूरी नहीं।',exit:'भरोसेमंद व्यक्ति या जिम्मेदार स्टाफ से सुरक्षित विराम या बाहर जाने में मदद माँगें।'},
            place:{work:'छोटा वाक्य: “मुझे पाँच शांत मिनट चाहिए, फिर मैं अगला कदम बताऊँगा/बताऊँगी।”',school:'छोटा वाक्य: “मुझे थोड़ी देर कम इनपुट चाहिए, फिर मैं अगला काम देखूँगा/देखूँगी।”',public:'सुरक्षित हो तो परिचित, कम-उत्तेजक या स्टाफ वाली जगह जाएँ।',home:'एक नियंत्रित इनपुट घटाएँ और एक गैर-ज़रूरी माँग टालें।'},
            check:'पाँच मिनट बाद देखें क्या कम, समान या खराब है। सबसे छोटा सुरक्षित अगला कदम चुनें।'
        },
        ru: {
            skip:'К карточке',back:'← Назад к тесту HSP',language:'Язык',eyebrow:'ЛИЧНЫЙ ИНСТРУМЕНТ НА СЕЙЧАС',title:'5-минутная карточка снижения сенсорной нагрузки',subtitle:'Выберите слишком сильный стимул и получите короткий план снижения нагрузки и выбора следующего шага.',privacy:'Без баллов · без аккаунта · выбор остаётся на устройстве',setupEyebrow:'СОЗДАЙТЕ КАРТОЧКУ',setupTitle:'Что нужно уменьшить на пять минут?',triggerLabel:'Главный стимул',placeLabel:'Где вы?',capacityLabel:'Что сейчас реально?',generate:'Создать карточку',ad:'Реклама',resultEyebrow:'ВАША КАРТОЧКА',resultTitle:'Пять минут, шаг за шагом',timerLabel:'осталось',startTimer:'Запустить таймер',pauseTimer:'Пауза',resumeTimer:'Продолжить',resetTimer:'Сбросить',copy:'Копировать',print:'Печать',copied:'Карточка скопирована.',completed:'Пять минут завершены. Проверьте изменения перед следующим шагом.',boundaryTitle:'Что эта карточка может и не может',boundaryCopy:'Это помощь в планировании, не диагноз и не лечение. Она не определяет причину плохого самочувствия. При внезапных, сильных или необычных симптомах, затруднении дыхания, боли в груди, обмороке или непосредственной опасности обратитесь за срочной помощью.',nextTitle:'Используйте наблюдение позже',nextCopy:'Когда сил станет больше, отметьте главный стимул и что его снизило. Цель — повторяемое наблюдение, а не доказательство высокой чувствительности.',testLink:'Открыть профиль HSP',guideLink:'Читать о сенсорной перегрузке',privacyPolicy:'Конфиденциальность',moreTools:'Другие инструменты DopaBrain',
            triggers:{sound:'Звук',light:'Свет или экраны',social:'Социальные стимулы',touch:'Прикосновения или одежда',demands:'Слишком много требований'},places:{work:'Работа',school:'Учёба',public:'Общественное место',home:'Дом'},capacities:{steady:'Могу изменить одну вещь',strained:'Нужно меньше решений',exit:'Нужна помощь, чтобы остановиться или уйти'},
            reduce:{sound:'Уменьшите один звук: отключите уведомление, отойдите или используйте привычную защиту слуха.',light:'Уменьшите один свет: приглушите экран, отвернитесь или безопасно перейдите к мягкому свету.',social:'Поставьте на паузу один социальный поток: не отвечайте, отойдите или попросите минуту тишины.',touch:'Уберите или ослабьте один избегаемый источник прикосновения, если это безопасно и уместно.',demands:'Уберите из поля зрения все требования, кроме одного. Запишите только следующую задачу на пять минут.'},
            orient:'Назовите три нейтральных предмета, которые видите, и задержите взгляд на наименее интенсивном.',
            settle:'Расслабьте одну напряжённую область. Дышите обычно; не заставляйте себя глубоко дышать, если хуже.',
            capacity:{steady:'Сделайте одно обратимое изменение и подождите перед следующим.',strained:'Выберите самый простой вариант карточки. Больше ничего оптимизировать не нужно.',exit:'Свяжитесь с доверенным человеком или ответственным сотрудником и попросите помочь безопасно сделать паузу или уйти.'},
            place:{work:'Короткая фраза: «Мне нужно пять тихих минут, затем я подтвержу следующий шаг».',school:'Короткая фраза: «Мне нужен короткий перерыв с меньшей нагрузкой, затем я уточню следующий шаг».',public:'Если безопасно, перейдите в знакомую, менее интенсивную зону или к персоналу.',home:'Уменьшите один контролируемый стимул и отложите одно несрочное требование.'},
            check:'Через пять минут отметьте, что уменьшилось, не изменилось или усилилось. Выберите самый маленький безопасный шаг.'
        }
    };

    const elements = {
        language: document.getElementById('language-select'),
        trigger: document.getElementById('trigger-select'),
        place: document.getElementById('place-select'),
        capacity: document.getElementById('capacity-select'),
        result: document.getElementById('result-card'),
        steps: document.getElementById('step-list'),
        timerDisplay: document.getElementById('timer-display'),
        timerToggle: document.getElementById('timer-toggle'),
        resultTitle: document.getElementById('result-title'),
        status: document.getElementById('status')
    };
    const times = ['0:00–0:30', '0:30–1:30', '1:30–3:00', '3:00–4:00', '4:00–5:00', '5:00'];
    let remaining = 300;
    let deadline = 0;
    let interval = 0;
    let running = false;
    let generated = false;

    const t = key => translations[language]?.[key] ?? translations.en[key] ?? key;
    const track = (eventName, params = {}) => {
        if (typeof gtag !== 'function') return;
        gtag('event', eventName, Object.assign({
            app_name: 'hsp-test',
            content_group: 'sensory_reset',
            content_locale: language,
            entry_source: source,
            revenue_goal: 'daily_0_10'
        }, params));
    };

    function planSteps() {
        const data = translations[language] || translations.en;
        return [
            data.reduce[trigger],
            data.orient,
            data.settle,
            data.capacity[capacity],
            data.place[place],
            data.check
        ];
    }

    function fillSelect(element, keys, values) {
        element.replaceChildren(...keys.map(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = values[key];
            return option;
        }));
    }

    function setLinks() {
        const testUrl = `./?lang=${language}&source=sensory_reset`;
        document.getElementById('test-link-top').href = testUrl;
        document.getElementById('test-link-bottom').href = testUrl;
        document.getElementById('guide-link').href = `/portal/blog/${language}/sensory-overload-hsp-coping.html?source=sensory_reset`;
    }

    function translatePage() {
        document.documentElement.lang = language;
        document.querySelectorAll('[data-t]').forEach(node => {
            const value = t(node.dataset.t);
            if (value) node.textContent = value;
        });
        document.title = `${t('title')} | DopaBrain`;
        document.querySelector('meta[name="description"]').content = t('subtitle');
        elements.language.value = language;
        const data = translations[language] || translations.en;
        fillSelect(elements.trigger, triggerKeys, data.triggers);
        fillSelect(elements.place, placeKeys, data.places);
        fillSelect(elements.capacity, capacityKeys, data.capacities);
        elements.trigger.value = trigger;
        elements.place.value = place;
        elements.capacity.value = capacity;
        elements.timerToggle.textContent = running ? t('pauseTimer') : remaining > 0 && remaining < 300 ? t('resumeTimer') : t('startTimer');
        setLinks();
        if (generated) renderPlan(false);
    }

    function updateUrl() {
        const next = new URL(location.pathname, location.origin);
        next.searchParams.set('lang', language);
        if (source !== 'direct') next.searchParams.set('source', source);
        history.replaceState({}, '', `${next.pathname}${next.search}${location.hash}`);
    }

    function persist() {
        try { localStorage.setItem('sensory-reset-settings', JSON.stringify({ trigger, place, capacity })); } catch (_) {}
    }

    function loadSaved() {
        try {
            const saved = JSON.parse(localStorage.getItem('sensory-reset-settings') || 'null');
            if (!saved) return;
            if (triggerKeys.includes(saved.trigger)) trigger = saved.trigger;
            if (placeKeys.includes(saved.place)) place = saved.place;
            if (capacityKeys.includes(saved.capacity)) capacity = saved.capacity;
        } catch (_) {}
    }

    function renderPlan(shouldTrack = true) {
        elements.steps.replaceChildren(...planSteps().map((copy, index) => {
            const item = document.createElement('li');
            item.className = 'reset-step';
            const time = document.createElement('span');
            time.className = 'step-time';
            time.textContent = times[index];
            const text = document.createElement('span');
            text.className = 'step-copy';
            text.textContent = copy;
            item.append(time, text);
            return item;
        }));
        elements.result.hidden = false;
        elements.status.textContent = '';
        generated = true;
        persist();
        updateUrl();
        if (shouldTrack) track('sensory_reset_generate');
        if (shouldTrack) requestAnimationFrame(() => {
            elements.resultTitle.focus({ preventScroll: true });
            elements.result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        });
    }

    function updateTimer() {
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        elements.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        elements.timerToggle.textContent = running ? t('pauseTimer') : remaining > 0 && remaining < 300 ? t('resumeTimer') : t('startTimer');
    }

    function clearTimerInterval() {
        window.clearInterval(interval);
        interval = 0;
    }

    function stopTimer({ sync = true } = {}) {
        if (sync && running && deadline) {
            remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
        }
        clearTimerInterval();
        running = false;
        deadline = 0;
        updateTimer();
    }

    function completeTimer() {
        if (!running) return;
        remaining = 0;
        stopTimer({ sync: false });
        elements.status.textContent = t('completed');
        track('sensory_reset_timer_complete');
    }

    function syncTimerToClock() {
        if (!running || !deadline) return;
        const now = Date.now();
        remaining = Math.max(0, Math.ceil((deadline - now) / 1000));
        updateTimer();
        if (now >= deadline) completeTimer();
    }

    function toggleTimer() {
        if (running) {
            syncTimerToClock();
            if (!running) return;
            stopTimer({ sync: false });
            track('sensory_reset_timer_pause', { seconds_remaining: remaining });
            return;
        }
        if (!generated) renderPlan();
        if (remaining <= 0) remaining = 300;
        running = true;
        deadline = Date.now() + remaining * 1000;
        elements.status.textContent = '';
        updateTimer();
        track(remaining === 300 ? 'sensory_reset_timer_start' : 'sensory_reset_timer_resume', { seconds_remaining: remaining });
        interval = window.setInterval(syncTimerToClock, 250);
    }

    function resetTimer() {
        stopTimer({ sync: false });
        remaining = 300;
        elements.status.textContent = '';
        updateTimer();
        track('sensory_reset_timer_reset');
    }

    function cardText() {
        const data = translations[language] || translations.en;
        return [
            t('title'),
            `${t('triggerLabel')}: ${data.triggers[trigger]}`,
            `${t('placeLabel')}: ${data.places[place]}`,
            `${t('capacityLabel')}: ${data.capacities[capacity]}`,
            '',
            ...planSteps().map((step, index) => `${times[index]} — ${step}`),
            '',
            t('boundaryCopy'),
            'https://dopabrain.com/hsp-test/reset.html'
        ].join('\n');
    }

    async function copyCard() {
        const value = cardText();
        try {
            await navigator.clipboard.writeText(value);
        } catch (_) {
            const area = document.createElement('textarea');
            area.value = value;
            area.style.position = 'fixed';
            area.style.opacity = '0';
            document.body.appendChild(area);
            area.select();
            document.execCommand('copy');
            area.remove();
        }
        elements.status.textContent = t('copied');
        track('sensory_reset_copy');
    }

    function bind() {
        elements.language.addEventListener('change', event => {
            language = supported.includes(event.target.value) ? event.target.value : 'en';
            try { localStorage.setItem('app_language', language); } catch (_) {}
            translatePage();
            updateUrl();
            track('sensory_reset_language_change');
        });
        [
            [elements.trigger, 'trigger'],
            [elements.place, 'place'],
            [elements.capacity, 'capacity']
        ].forEach(([element, field]) => element.addEventListener('change', event => {
            if (field === 'trigger') trigger = event.target.value;
            if (field === 'place') place = event.target.value;
            if (field === 'capacity') capacity = event.target.value;
            if (generated) renderPlan(false);
            persist();
            updateUrl();
            track('sensory_reset_customize');
        }));
        document.getElementById('generate-button').addEventListener('click', () => renderPlan());
        elements.timerToggle.addEventListener('click', toggleTimer);
        document.getElementById('timer-reset').addEventListener('click', resetTimer);
        document.getElementById('copy-button').addEventListener('click', copyCard);
        document.getElementById('print-button').addEventListener('click', () => {
            track('sensory_reset_print');
            window.print();
        });
        [document.getElementById('test-link-top'), document.getElementById('test-link-bottom')].forEach((link, index) => {
            link.addEventListener('click', () => track('sensory_reset_hsp_click', { link_surface: index ? 'footer' : 'header' }));
        });
        document.getElementById('guide-link').addEventListener('click', () => track('sensory_reset_guide_click'));
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) syncTimerToClock();
        });
        window.addEventListener('pageshow', syncTimerToClock);
    }

    function init() {
        loadSaved();
        translatePage();
        bind();
        updateUrl();
        updateTimer();
        track('sensory_reset_view');
    }

    init();
})();
