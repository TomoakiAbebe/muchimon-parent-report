import { useMemo, useState } from "react";
import { BackpackIcon, BarChartIcon, ChatBubbleIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, GearIcon, LightningBoltIcon, MoonIcon, PersonIcon, PieChartIcon, PlusIcon, ReaderIcon } from "@radix-ui/react-icons";
import { BottomSheet, MobileScroll, useKeyboard } from "./mobile";

type Mode = "learning" | "chat";
type View = "children" | "overview" | "report";
type Child = {
  id: string;
  name: string;
  grade: string;
  tone: "yellow" | "blue";
  learningDays: number;
  chatSummary: string;
};

const children: Child[] = [
  { id: "ai", name: "あい", grade: "小学3年生", tone: "yellow", learningDays: 5, chatSummary: "学校の話題が\n多く見られました" },
  { id: "makoto", name: "まこと", grade: "小学1年生", tone: "blue", learningDays: 3, chatSummary: "好きな遊びの話が\n増えてきたようです" },
];
function IconBubble({ tone = "green", children }: { tone?: "green" | "blue" | "yellow"; children: React.ReactNode }) {
  return <span className={`icon-bubble ${tone}`}>{children}</span>;
}

function Segments({ items, value, onChange }: { items: string[]; value: string; onChange: (value: string) => void }) {
  return <div className="segments" role="tablist" aria-label="レポート期間">{items.map((item) => <button key={item} className={value === item ? "active" : ""} onClick={() => onChange(item)} role="tab" aria-selected={value === item}>{item}</button>)}</div>;
}

function CardTitle({ icon, title, action, onAction }: { icon: React.ReactNode; title: string; action?: string; onAction?: () => void }) {
  return <div className="card-title-row"><div className="card-title-main">{icon}<h2>{title}</h2></div>{action ? <button className="soft-action" onClick={onAction}>{action}<ChevronRightIcon /></button> : null}</div>;
}

function ChildPictogram({ tone, compact = false }: { tone: Child["tone"] | "green"; compact?: boolean }) {
  return <span className={`child-pictogram ${tone}${compact ? " compact" : ""}`} aria-hidden="true"><PersonIcon /></span>;
}

function ChildrenScreen({ onSelect, openSheet }: { onSelect: (child: Child) => void; openSheet: (kind: string) => void }) {
  return <div className="children-app">
    <MobileScroll className="children-scroll">
      <main className="children-content" data-testid="children-screen">
        <section className="children-hero">
          <div className="children-hero-copy"><h1>お子さまを選ぶ</h1><p>レポートを見たいお子さまを選んでください</p></div>
          <div className="pictogram-family" aria-hidden="true"><ChildPictogram tone="green" compact /><ChildPictogram tone="blue" compact /><ChildPictogram tone="yellow" compact /></div>
        </section>
        <div className="child-card-list">
          {children.map((child) => <article className={`child-card child-tone-${child.tone}`} key={child.id}>
            <button className="child-settings" aria-label={`${child.name}の設定`} onClick={(event) => { event.stopPropagation(); openSheet(`${child.name}の設定`); }}><GearIcon /></button>
            <div className="child-card-main">
              <div className="child-portrait"><ChildPictogram tone={child.tone} /></div>
              <div className="child-profile"><h2>{child.name}</h2><p>{child.grade}</p><div className={`child-highlight ${child.id === "ai" ? "learning" : "chatting"}`}>{child.id === "ai" ? <BarChartIcon /> : <ChatBubbleIcon />}<span>{child.id === "ai" ? <>今週 <strong>{child.learningDays}日</strong><br />取り組みました</> : <><strong>学校の話題が</strong><br />多く見られました</>}</span><ChevronRightIcon /></div></div>
            </div>
            <button className="view-report-button" onClick={() => onSelect(child)}>レポートを見る<ChevronRightIcon /></button>
          </article>)}
        </div>
        <button className="add-child-button" onClick={() => openSheet("お子さまを追加")}><span><PlusIcon /></span>お子さまを追加</button>
        <p className="children-privacy">レポートは保護者の方だけが確認できます</p>
      </main>
    </MobileScroll>
  </div>;
}

function ChildOverview({ child, openReport, openDetails }: { child: Child; openReport: (mode: Mode, period: string) => void; openDetails: (kind: string) => void }) {
  const isAi = child.id === "ai";
  return <div className="child-overview-stack" data-testid="child-overview-screen">
    <section className="report-card parent-next-card">
      <div className="parent-next-heading"><IconBubble tone="yellow"><LightningBoltIcon /></IconBubble><div><span>まずはこちら</span><h2>今週の声かけを見てみましょう</h2></div></div>
      <p>{child.name}さんの頑張りと興味をもとに、今日から使える声かけを1つ選びました。</p>
      <button className="parent-next-action" onClick={() => openDetails("今週の声かけ")}>声かけのヒントを見る<ChevronRightIcon /></button>
    </section>

    <section className="report-card combined-summary-card">
      <div className="overview-section-heading"><div><span>学習とおしゃべり</span><h2>今週のまとめ</h2></div><small>4/14〜4/20</small></div>
      <div className="combined-summary-grid">
        <article className="summary-panel learning-panel"><div className="summary-panel-title"><IconBubble><ReaderIcon /></IconBubble><span>学習</span></div><strong>{child.learningDays}日</strong><small>取り組みました</small><p>{isAi ? "算数を中心に、3教科に取り組んだようです。" : "国語を中心に、続けて取り組む様子が見られました。"}</p></article>
        <article className="summary-panel chat-panel"><div className="summary-panel-title"><IconBubble tone="blue"><ChatBubbleIcon /></IconBubble><span>おしゃべり</span></div><strong>{isAi ? "学校 46%" : "遊びの話題"}</strong><small>{isAi ? "もっとも多い話題" : "少し増えました"}</small><p>{isAi ? "友だちや将来について話す場面も増えてきたようです。" : "好きな遊びについて楽しそうに話す様子が見られました。"}</p></article>
      </div>
    </section>

    <section className="report-card report-entry-card learning-entry-card">
      <div className="report-entry-heading"><IconBubble><ReaderIcon /></IconBubble><div><span>取り組みを知る</span><h2>学習レポート</h2></div></div>
      <p>いつ・どれくらい・何を勉強したかを確認できます。</p>
      <div className="entry-facts"><span><b>52分</b>/日</span><span><b>19〜20時</b>ごろ</span><span><b>3教科</b></span></div>
      <button className="report-entry-action" onClick={() => openReport("learning", "1週間")}>学習レポートを見る<ChevronRightIcon /></button>
    </section>

    <section className="report-card report-entry-card chat-entry-card">
      <div className="report-entry-heading"><IconBubble tone="blue"><ChatBubbleIcon /></IconBubble><div><span>興味や変化を知る</span><h2>おしゃべりレポート</h2></div></div>
      <p>よく話しているテーマや、関心の小さな変化を確認できます。</p>
      <div className="entry-facts chat-entry-facts"><span><b>学校 46%</b></span><span><b>20〜21時</b>ごろ</span></div>
      <button className="report-entry-action blue-action" onClick={() => openReport("chat", "1週間")}>おしゃべりレポートを見る<ChevronRightIcon /></button>
    </section>

    <section className="overview-guide" aria-label="レポートの見方"><b>おすすめの見方</b><p>まとめを知る → 気づきを見つける → 声をかける、の順で見ると活用しやすくなります。</p></section>
  </div>;
}

function LearningReport({ period, openDetails, child }: { period: string; openDetails: (kind: string) => void; child: Child }) {
  const isDay = period === "1日";
  const isMonth = period === "1か月";
  const periodLabel = isDay ? "今日" : isMonth ? "今月" : "今週";
  return <div className="report-stack learning-report">
    <section className="report-card summary-card green-wash">
      <CardTitle icon={<IconBubble><ReaderIcon /></IconBubble>} title={`${periodLabel}の学習のまとめ`} />
      <p className="lead">{child.name}さんの学習の取り組みをもとに、{periodLabel}の様子をまとめました。</p>
      <div className="metric-grid learning-metrics">
        <article className="metric-tile"><IconBubble><ClockIcon /></IconBubble><div><span>{isDay ? "今日の学習時間" : "平均学習時間"}</span><strong>{isDay ? "58" : isMonth ? "49" : "52"}<small>{isDay ? "分" : "分/日"}</small></strong></div></article>
        <article className="metric-tile"><IconBubble tone="yellow"><MoonIcon /></IconBubble><div><span>{isDay ? "取り組んだ時間帯" : "よく取り組む時間帯"}</span><strong className="medium">19時〜20時ごろ</strong></div></article>
        <article className="metric-tile"><IconBubble><BarChartIcon /></IconBubble><div><span>取り組んだ教科</span><strong>3<small>教科</small></strong></div></article>
      </div>
    </section>

    <section className="report-card learning-content-card">
      <CardTitle icon={<IconBubble tone="blue"><ReaderIcon /></IconBubble>} title={isDay ? "今日取り組んだ内容" : "取り組んだ科目・単元"} />
      <p className="lead">{isDay ? "プリント・教材の写真から推定した内容です。" : `${periodLabel}に取り組んだ内容です。`}</p>
      <ul className="learning-topic-list">
        <li><span className="subject-icon math"><BackpackIcon /></span><div><b>算数</b><p>分数のたし算</p></div>{isDay ? <em>写真から推定</em> : <strong>4回</strong>}</li>
        <li><span className="subject-icon japanese"><ReaderIcon /></span><div><b>国語</b><p>説明文の読み取り</p></div>{isDay ? <em>写真から推定</em> : <strong>2回</strong>}</li>
        <li><span className="subject-icon science"><LightningBoltIcon /></span><div><b>理科</b><p>電気のはたらき</p></div>{isDay ? <em>写真から推定</em> : <strong>1回</strong>}</li>
      </ul>
    </section>

    <section className={`report-card learning-insight-card ${isMonth ? "month-change-card" : ""}`}>
      <CardTitle icon={<IconBubble><BarChartIcon /></IconBubble>} title={isDay ? "今日の取り組み" : isMonth ? "前月からの変化" : "今週特に取り組んだこと"} />
      {isDay ? <div className="learning-insight-copy"><strong>学習を始めて、3つの教科に取り組みました</strong><p>算数だけでなく、国語や理科の教材にも取り組んだ様子が見られました。</p></div> : isMonth ? <div className="month-change-grid"><div><small>先月</small><strong>41分/日</strong></div><ChevronRightIcon /><div className="current"><small>今月</small><strong>49分/日</strong></div><p>1日あたりの学習時間が先月より8分増えました。算数に続けて取り組む日も増えたようです。</p></div> : <div className="learning-insight-copy"><strong>算数の「分数のたし算」に4回取り組みました</strong><p>算数を中心にしながら、国語と理科にも取り組む様子が見られました。</p></div>}
    </section>

    <section className="report-card report-hint-card">
      <CardTitle icon={<IconBubble tone="yellow"><LightningBoltIcon /></IconBubble>} title="声かけのヒント" />
      <div className="report-hint-quote"><p>「{isDay ? "今日はいろいろな教科に取り組んでいたね" : isMonth ? "今月も続けて取り組んでいたね" : "今週は算数をよく頑張っていたね"}」</p><span>と伝えてみるのもよいかもしれません。</span></div>
      <button className="hint-detail-button" onClick={() => openDetails("声かけのヒント")}>声かけ例を詳しく見る<ChevronRightIcon /></button>
    </section>
  </div>;
}

function ChatReport({ period, openDetails }: { period: string; openDetails: (kind: string) => void }) {
  const isWeek = period === "1週間";
  const periodLabel = isWeek ? "今週" : "今月";
  return <div className="report-stack chat-report">
    <section className="report-card chat-overview-card warm-wash">
      <CardTitle icon={<IconBubble><ReaderIcon /></IconBubble>} title={`${periodLabel}の概要`} />
      <ul className="overview-points">
        <li><i className="blue" />学校に関する話題が<strong>46%</strong>と多く見られました。</li>
        <li><i className="green" />趣味や日常に関する会話も見られました。</li>
        <li><i className="yellow" />{isWeek ? "週の後半" : "前月と比べて"}、友だちや将来の話題が少し増えた様子があります。</li>
      </ul>
    </section>

    <section className="report-card chat-data-card">
      <CardTitle icon={<IconBubble tone="blue"><PieChartIcon /></IconBubble>} title="話題と利用状況" />
      <p className="lead">どのような話題について話していたかをまとめました。</p>
      <div className="genre-layout"><div className="donut" aria-label="学校46%、趣味27%、人間関係15%、その他12%"><span>合計<br /><strong>100%</strong></span></div><ul className="genre-legend">
        <li><i className="blue" /><span>学校</span><strong>46%</strong></li><li><i className="green" /><span>趣味・好きなこと</span><strong>27%</strong></li><li><i className="yellow" /><span>人間関係</span><strong>15%</strong></li><li><i className="lavender" /><span>その他</span><strong>12%</strong></li>
      </ul></div>
      <div className="metric-grid chat-metrics">
        <article className="metric-tile blue-tint"><IconBubble tone="blue"><ClockIcon /></IconBubble><div><span>おしゃべりの利用時間</span><strong>{isWeek ? "3.6" : "12.4"}<small>{isWeek ? "時間/週" : "時間/月"}</small></strong></div></article>
        <article className="metric-tile blue-tint"><IconBubble tone="blue"><MoonIcon /></IconBubble><div><span>よく利用した時間帯</span><strong className="medium">20時〜21時ごろ</strong></div></article>
      </div>
    </section>

    <section className="report-card chat-change-card">
      <CardTitle icon={<IconBubble><ReaderIcon /></IconBubble>} title="興味・関心と小さな変化" />
      <div className="trend-grid">
        <article><div className="mini-title"><ReaderIcon /><b>興味・関心</b></div><p>{periodLabel}は学校の授業や行事について話す場面が多く見られました。好きな遊びについて話す場面もあり、興味の広がりが見られました。</p></article>
        <article><div className="mini-title blue-text"><ChatBubbleIcon /><b>少し気になった様子</b></div><p>友だちとの出来事について、何度か話題にする場面がありました。気持ちを断定せず、会話のきっかけとしてお伝えしています。</p></article>
        <article><div className="mini-title green-text"><BarChartIcon /><b>小さな変化</b></div><p>{isWeek ? "週の前半は学校の話題が中心でしたが、後半には将来について話す場面も少し増えました。" : "前月と比べて、友だちや将来について話す場面が少し増えた様子があります。"}</p></article>
      </div>
    </section>

    <section className="report-card report-hint-card chat-report-hint">
      <CardTitle icon={<IconBubble tone="yellow"><LightningBoltIcon /></IconBubble>} title="声かけのヒント" />
      <div className="report-hint-quote"><p>「最近、学校ではどんなことが楽しい？」</p><span>と軽く聞いてみるのもよいかもしれません。</span></div>
      <div className="report-hint-quote secondary"><p>「{periodLabel}はこんなことを話していたんだね」</p><span>と伝えてみるのもよいかもしれません。</span></div>
      <button className="hint-detail-button blue-button" onClick={() => openDetails("声かけのヒント")}>声かけ例を詳しく見る<ChevronRightIcon /></button>
    </section>
  </div>;
}

function VoiceHintDetail({ child, mode, period, combined, onClose }: { child: Child; mode: Mode; period: string; combined: boolean; onClose: () => void }) {
  const isAi = child.id === "ai";
  const periodLabel = period === "1日" ? "今日" : period === "1か月" ? "今月" : "今週";
  const learningObservation = period === "1日" ? "3教科の教材に取り組んだ様子が見られました。" : period === "1か月" ? "先月より学習時間が増え、算数に続けて取り組む日も増えたようです。" : isAi ? "5日間、算数を中心に3教科へ取り組んだようです。" : "3日間、国語を中心に続けて取り組む様子が見られました。";
  const chatObservation = period === "1か月" ? "前月と比べて、友だちや将来について話す場面が少し増えた様子があります。" : isAi ? "学校の話題が多く、友だちや将来の話も少し増えた様子があります。" : "好きな遊びについて、楽しそうに話す場面が増えたようです。";
  return <div className="detail-sheet-content voice-hint-detail">
    <div className="voice-hint-intro">
      <IconBubble tone="yellow"><LightningBoltIcon /></IconBubble>
      <h3>{combined || mode === "learning" ? <>まずは、頑張った過程を<br />そのまま伝えてみましょう</> : <>気づいた興味や変化を<br />会話のきっかけにしてみましょう</>}</h3>
      <p>{child.name}さんの{periodLabel}の様子から、会話を始めやすい声かけをまとめました。</p>
    </div>

    <section className="voice-hint-section" aria-labelledby="voice-hint-observations">
      <div className="voice-hint-section-title"><span>1</span><h4 id="voice-hint-observations">{periodLabel}に見られたこと</h4></div>
      {combined || mode === "learning" ? <div className="voice-hint-observation learning-observation"><ReaderIcon /><p><b>学習</b>{learningObservation}</p></div> : null}
      {combined || mode === "chat" ? <div className="voice-hint-observation chat-observation"><ChatBubbleIcon /><p><b>おしゃべり</b>{chatObservation}</p></div> : null}
    </section>

    <section className="voice-hint-section" aria-labelledby="voice-hint-examples">
      <div className="voice-hint-section-title"><span>2</span><h4 id="voice-hint-examples">声かけの例</h4></div>
      {combined || mode === "learning" ? <><div className="voice-hint-example"><small>続けたことを伝える</small><p>「{periodLabel}もよく続けていたね」</p></div><div className="voice-hint-example"><small>取り組みを具体的に伝える</small><p>「{period === "1日" ? "今日は、いろいろな教科に取り組んでいたね" : isAi ? "算数に何度も取り組んでいたね" : "国語を続けていたね"}」</p></div></> : null}
      {combined || mode === "chat" ? <div className="voice-hint-example"><small>興味を会話につなげる</small><p>「最近、{isAi ? "学校ではどんなことが楽しい？" : "どんな遊びが楽しい？"}」</p></div> : null}
    </section>

    <section className="voice-hint-section voice-hint-points" aria-labelledby="voice-hint-points">
      <div className="voice-hint-section-title"><span>3</span><h4 id="voice-hint-points">伝えるときのポイント</h4></div>
      <ul>
        <li>{combined || mode === "learning" ? "結果ではなく、始めたことや続けたことをそのまま伝えます。" : "会話の内容だけで気持ちを決めつけず、見られた変化をやさしく伝えます。"}</li>
        <li>答えを求めすぎず、会話のきっかけとして軽く聞いてみます。</li>
      </ul>
      <p className="voice-hint-note">お子さまの気持ちを決めつけず、反応に合わせて無理なく使ってみてください。</p>
    </section>

    <div className="voice-hint-close-wrap"><button onClick={onClose}>レポートに戻る</button></div>
  </div>;
}

export default function Prototype() {
  const keyboard = useKeyboard();
  const [view, setView] = useState<View>(() => window.location.hash === "#chat" || window.location.hash === "#learning" ? "report" : window.location.hash === "#overview" ? "overview" : "children");
  const [selectedChild, setSelectedChild] = useState<Child>(children[0]);
  const [mode, setMode] = useState<Mode>(() => window.location.hash === "#chat" ? "chat" : "learning");
  const [period, setPeriod] = useState(() => window.location.hash === "#chat" ? "1か月" : "1週間");
  const [sheet, setSheet] = useState<string | null>(null);
  const periodItems = useMemo(() => mode === "learning" ? ["1日", "1週間", "1か月"] : ["1か月", "1週間"], [mode]);
  const switchMode = (next: Mode) => { keyboard.hide(); window.history.replaceState(null, "", next === "chat" ? "#chat" : "#learning"); setMode(next); setPeriod(next === "learning" ? "1週間" : "1か月"); setView("report"); };
  const openOverview = (child: Child) => { keyboard.hide(); setSelectedChild(child); setView("overview"); window.history.replaceState(null, "", "#overview"); };
  const openReport = (nextMode: Mode, nextPeriod: string) => { keyboard.hide(); setMode(nextMode); setPeriod(nextPeriod); setView("report"); window.history.replaceState(null, "", nextMode === "chat" ? "#chat" : "#learning"); };
  const returnToOverview = () => { keyboard.hide(); setView("overview"); setSheet(null); window.history.replaceState(null, "", "#overview"); };
  const returnToChildren = () => { keyboard.hide(); setView("children"); setSheet(null); window.history.replaceState(null, "", "#children"); };
  const sheetIsChildAction = sheet?.includes("設定") || sheet === "お子さまを追加";
  const sheetIsVoiceHint = sheet === "今週の声かけ" || sheet === "声かけのヒント";
  const sheetPeriodLabel = sheet === "今週の声かけ" || period === "1週間" ? "今週" : period === "1日" ? "今日" : "今月";

  return <div className={`report-app ${view === "children" ? "children-view" : mode}`}>
    {view === "children" ? <ChildrenScreen onSelect={openOverview} openSheet={setSheet} /> : <>
      <header className={`app-header ${view === "overview" ? "overview-app-header" : ""}`}><button className="back-button" aria-label={view === "overview" ? "お子さま一覧に戻る" : "まとめに戻る"} onClick={view === "overview" ? returnToChildren : returnToOverview}><ChevronLeftIcon /></button><div className="page-heading">{view === "report" && mode === "learning" ? <IconBubble><ReaderIcon /></IconBubble> : view === "overview" ? <ChildPictogram tone={selectedChild.tone} compact /> : null}<div><span className="report-child-name">{selectedChild.name}さん</span><h1>{view === "overview" ? "レポート" : mode === "learning" ? "学習レポート" : "おしゃべりレポート"}</h1></div></div>{view === "report" ? <Segments items={periodItems} value={period} onChange={setPeriod} /> : null}</header>
      <MobileScroll key={`${selectedChild.id}-${view}-${mode}-${period}`} className={`report-scroll ${view === "overview" ? "overview-scroll" : ""}`}><main className="screen-content" data-testid="report-screen">{view === "overview" ? <ChildOverview child={selectedChild} openReport={openReport} openDetails={setSheet} /> : mode === "learning" ? <LearningReport period={period} openDetails={setSheet} child={selectedChild} /> : <ChatReport period={period} openDetails={setSheet} />}</main></MobileScroll>
      <nav className="bottom-nav" aria-label="レポート種別"><button type="button" tabIndex={-1} onPointerDown={(event) => event.preventDefault()} className={view === "overview" ? "active" : ""} onClick={returnToOverview}><PersonIcon /><span>まとめ</span></button><button type="button" tabIndex={-1} onPointerDown={(event) => event.preventDefault()} className={view === "report" && mode === "learning" ? "active" : ""} onClick={() => switchMode("learning")}><ReaderIcon /><span>学習</span></button><button type="button" tabIndex={-1} onPointerDown={(event) => event.preventDefault()} className={view === "report" && mode === "chat" ? "active" : ""} onClick={() => switchMode("chat")}><ChatBubbleIcon /><span>おしゃべり</span></button></nav>
    </>}
    <BottomSheet open={Boolean(sheet)} onOpenChange={(open) => !open && setSheet(null)} title={sheet ?? "詳細"} description={sheetIsChildAction ? "保護者の方が管理する情報です。" : sheetIsVoiceHint ? `${sheetPeriodLabel}の様子をもとに、使いやすい声かけ例をまとめました。` : "レポートから分かることを、やさしくまとめています。"} snap={sheetIsVoiceHint ? 0.82 : 0.55}>
      {sheetIsVoiceHint ? <VoiceHintDetail child={selectedChild} mode={mode} period={sheet === "今週の声かけ" ? "1週間" : period} combined={sheet === "今週の声かけ"} onClose={() => setSheet(null)} /> : <div className="detail-sheet-content">{sheetIsChildAction ? <PersonIcon className="sheet-person-icon" /> : <IconBubble><ReaderIcon /></IconBubble>}<h3>{sheetIsChildAction ? sheet : "取り組みを見つけるヒント"}</h3><p>{sheet === "お子さまを追加" ? "お子さまのプロフィール追加は、次のステップで設定できます。" : sheet?.includes("設定") ? "学年や表示名などのプロフィール情報を確認・変更できます。" : "結果だけでなく、始めたことや続けたことにも目を向けています。気になる話題も、お子さまの気持ちを断定せず、会話のきっかけとしてお伝えします。"}</p><button onClick={() => setSheet(null)}>{sheetIsChildAction ? "閉じる" : "レポートに戻る"}</button></div>}
    </BottomSheet>
  </div>;
}
