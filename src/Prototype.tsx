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
const weekBars = [35, 48, 62, 45, 58, 72, 44];
const weekLabels = ["4/14\n(月)", "4/15\n(火)", "4/16\n(水)", "4/17\n(木)", "4/18\n(金)", "4/19\n(土)", "4/20\n(日)"];
const monthBars = [2.1, 2.7, 3.6, 4.0];
const dayBars = [18, 24, 16];
const dayLabels = ["算数", "国語", "理科"];
const chatWeekBars = [0.3, 0.4, 0.5, 0.2, 0.6, 0.9, 0.7];

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
  const title = `${periodLabel}の学習のまとめ`;
  const chartValues = isDay ? dayBars : isMonth ? monthBars : weekBars;
  const chartTitle = isDay ? "今日の学習時間" : isMonth ? "4週間の学習時間" : "1週間の学習時間";
  return <div className="report-stack learning-report">
    <section className="report-card summary-card green-wash">
      <CardTitle icon={<IconBubble><ReaderIcon /></IconBubble>} title={title} />
      <p className="lead">{child.name}さんの学習の取り組みをもとに、{periodLabel}の様子をまとめました。</p>
      <div className="metric-grid learning-metrics">
        <article className="metric-tile"><IconBubble><ClockIcon /></IconBubble><div><span>{isDay ? "今日の学習時間" : "平均学習時間"}</span><strong>{isDay ? "58" : isMonth ? "49" : "52"}<small>{isDay ? "分" : "分/日"}</small></strong></div></article>
        <article className="metric-tile"><IconBubble tone="yellow"><MoonIcon /></IconBubble><div><span>学習に取り組んだ時間帯</span><strong className="medium">19時〜20時ごろ</strong></div></article>
        <article className="metric-tile"><IconBubble><BarChartIcon /></IconBubble><div><span>取り組んだ教科</span><strong>3<small>教科</small></strong></div></article>
      </div>
    </section>

    <section className="report-card chart-card">
      <CardTitle icon={<IconBubble><BarChartIcon /></IconBubble>} title={chartTitle} action="詳しく見る" onAction={() => openDetails("学習時間の詳細")} />
      <p className="lead">{isDay ? "取り組んだ内容ごと" : isMonth ? "週ごと" : "1日ごと"}の学習時間です。</p>
      <div className="bar-chart learning-chart" aria-label="学習時間の棒グラフ">{chartValues.map((value, index) => {
        const max = isMonth ? 4.5 : 80;
        return <div className="bar-item" key={index}><span className="bar-value">{value}{isMonth ? "時間" : "分"}</span><div className="bar soft-green" style={{ height: `${Math.max(22, value / max * 92)}px` }} /><span className="bar-label">{isDay ? dayLabels[index] : isMonth ? `${index + 1}週目` : weekLabels[index]}</span></div>;
      })}</div>
    </section>

    <div className="two-column-cards">
      <section className="report-card compact-list-card">
        <CardTitle icon={<IconBubble tone="blue"><ReaderIcon /></IconBubble>} title="取り組んだ科目・単元" />
        <p className="lead">{periodLabel}取り組んだ内容です。</p>
        <ul className="topic-list">
          <li><span className="subject-icon math"><BackpackIcon /></span><b>算数：分数のたし算</b><em>4回</em></li>
          <li><span className="subject-icon japanese"><ReaderIcon /></span><b>国語：説明文</b><em>2回</em></li>
          <li><span className="subject-icon science"><LightningBoltIcon /></span><b>理科：電気</b><em>1回</em></li>
        </ul>
      </section>
      <section className="report-card compact-list-card unit-map">
        <CardTitle icon={<IconBubble><ReaderIcon /></IconBubble>} title="単元マップ" />
        <p className="lead">くり返し学習した回数です。</p>
        <ul className="topic-list dots-list">
          <li><b>分数のたし算</b><span className="dot-meter"><i /><i /><i /><i /><i className="muted" /></span><em>4回</em></li>
          <li><b>説明文の読み取り</b><span className="dot-meter"><i /><i /><i className="muted" /><i className="muted" /></span><em>2回</em></li>
          <li><b>電気のはたらき</b><span className="dot-meter"><i /><i className="muted" /><i className="muted" /></span><em>1回</em></li>
        </ul>
      </section>
    </div>

    <section className="report-card hint-card">
      <CardTitle icon={<IconBubble tone="yellow"><LightningBoltIcon /></IconBubble>} title="声かけのヒント" action="ほかのヒントを見る" onAction={() => openDetails("声かけのヒント")} />
      <div className="hint-copy"><IconBubble><ReaderIcon /></IconBubble><p>{periodLabel}は算数を重点的に勉強したようです。<br />がんばっている様子を褒めてあげるのもよいかもしれません。</p></div>
      <img className="thinking-parent" src="assets/muchimon/mother-thinking.png" alt="子どもへの声かけを考える保護者" />
    </section>
  </div>;
}

function ChatReport({ period, openDetails }: { period: string; openDetails: (kind: string) => void }) {
  const isWeek = period === "1週間";
  const usageBars = isWeek ? chatWeekBars : monthBars;
  return <div className="report-stack chat-report">
    <section className="report-card overview-card warm-wash">
      <CardTitle icon={<IconBubble><ReaderIcon /></IconBubble>} title={isWeek ? "今週の概要" : "今月の概要"} />
      <ul className="overview-points">
        <li><i className="blue" />学校に関する話題が<strong>46%</strong>と多く見られました。</li>
        <li><i className="green" />趣味や日常に関する会話も見られました。</li>
        <li><i className="yellow" />{isWeek ? "週の後半" : "月の後半"}にかけて将来や友だちの話題が増えてきた様子があります。</li>
      </ul>
      <img className="family-illustration" src="assets/muchimon/mother-and-child.png" alt="会話を楽しむ保護者と子ども" />
    </section>

    <section className="report-card genre-card">
      <CardTitle icon={<IconBubble tone="blue"><PieChartIcon /></IconBubble>} title="ジャンル別" action="詳しく見る" onAction={() => openDetails("話題ジャンルの詳細")} />
      <div className="genre-layout"><div className="donut" aria-label="学校46%、趣味27%、人間関係15%、その他12%"><span>合計<br /><strong>100%</strong></span></div><ul className="genre-legend">
        <li><i className="blue" /><span>学校</span><strong>46%</strong></li><li><i className="green" /><span>趣味・好きなこと</span><strong>27%</strong></li><li><i className="yellow" /><span>人間関係</span><strong>15%</strong></li><li><i className="lavender" /><span>その他</span><strong>12%</strong></li>
      </ul></div>
    </section>

    <section className="report-card usage-card">
      <CardTitle icon={<IconBubble><BarChartIcon /></IconBubble>} title="おしゃべり機能の利用状況" />
      <div className="metric-grid chat-metrics">
        <article className="metric-tile blue-tint"><IconBubble tone="blue"><ClockIcon /></IconBubble><div><span>おしゃべり機能の利用時間</span><strong>{isWeek ? "3.6" : "12.4"}<small>{isWeek ? "時間/週" : "時間/月"}</small></strong></div></article>
        <article className="metric-tile blue-tint"><IconBubble tone="blue"><BarChartIcon /></IconBubble><div><span>利用が多かった時間帯</span><strong className="medium">20時〜21時ごろ</strong></div><MoonIcon className="large-moon" /></article>
      </div>
      <h3 className="chart-subtitle">{isWeek ? "1日ごとの利用時間" : "週ごとの利用時間の推移"}</h3>
      <div className="bar-chart chat-chart" aria-label={isWeek ? "1日ごとのおしゃべり利用時間" : "週ごとのおしゃべり利用時間"}>{usageBars.map((value, index) => <div className="bar-item" key={index}><span className="bar-value">{value}時間</span><div className="bar soft-blue" style={{ height: `${value / (isWeek ? 1 : 4) * 62}px` }} /><span className="bar-label">{isWeek ? ["月", "火", "水", "木", "金", "土", "日"][index] : `${index + 1}週目`}</span></div>)}</div>
    </section>

    <section className="report-card trends-card">
      <CardTitle icon={<IconBubble><ReaderIcon /></IconBubble>} title={isWeek ? "今週のようす" : "今月のようす"} />
      <div className="trend-grid">
        <article><div className="mini-title"><ReaderIcon /><b>興味・関心</b></div><p>{isWeek ? "今週" : "今月"}は学校に関する話題が中心で、授業や行事のことなどをよく話していました。</p></article>
        <article><div className="mini-title blue-text"><ChatBubbleIcon /><b>気になった様子</b></div><p>趣味や日常の話題も見られ、好きなことについて楽しそうに話す様子がありました。</p></article>
        <article><div className="mini-title green-text"><BarChartIcon /><b>小さな変化</b></div><p>{isWeek ? "週" : "月"}の後半にかけて、友だちや将来に関する話題が増えてきた様子が見られました。</p></article>
      </div>
    </section>

    <section className="report-card hint-card chat-hint">
      <CardTitle icon={<IconBubble tone="yellow"><LightningBoltIcon /></IconBubble>} title="声かけのヒント" action="ほかのヒントを見る" onAction={() => openDetails("声かけのヒント")} />
      <div className="hint-copy"><IconBubble><ReaderIcon /></IconBubble><p>「{isWeek ? "今週" : "今月"}こんなことを話していたんだね」と伝えてみるのもよいかもしれません。</p></div>
      <img className="thinking-parent" src="assets/muchimon/mother-thinking.png" alt="子どもへの声かけを考える保護者" />
    </section>
  </div>;
}

function VoiceHintDetail({ child, onClose }: { child: Child; onClose: () => void }) {
  const isAi = child.id === "ai";
  return <div className="detail-sheet-content voice-hint-detail">
    <div className="voice-hint-intro">
      <IconBubble tone="yellow"><LightningBoltIcon /></IconBubble>
      <h3>まずは、頑張った過程を<br />そのまま伝えてみましょう</h3>
      <p>{child.name}さんの今週の様子から、会話を始めやすい声かけをまとめました。</p>
    </div>

    <section className="voice-hint-section" aria-labelledby="voice-hint-observations">
      <div className="voice-hint-section-title"><span>1</span><h4 id="voice-hint-observations">今週見られたこと</h4></div>
      <div className="voice-hint-observation learning-observation"><ReaderIcon /><p><b>学習</b>{isAi ? "5日間、算数を中心に3教科へ取り組んだようです。" : "3日間、国語を中心に続けて取り組む様子が見られました。"}</p></div>
      <div className="voice-hint-observation chat-observation"><ChatBubbleIcon /><p><b>おしゃべり</b>{isAi ? "学校の話題が多く、友だちや将来の話も少し増えた様子があります。" : "好きな遊びについて、楽しそうに話す場面が増えたようです。"}</p></div>
    </section>

    <section className="voice-hint-section" aria-labelledby="voice-hint-examples">
      <div className="voice-hint-section-title"><span>2</span><h4 id="voice-hint-examples">声かけの例</h4></div>
      <div className="voice-hint-example"><small>続けたことを伝える</small><p>「今週もよく続けていたね」</p></div>
      <div className="voice-hint-example"><small>取り組みを具体的に伝える</small><p>「{isAi ? "算数に何度も取り組んでいたね" : "国語を続けていたね"}」</p></div>
      <div className="voice-hint-example"><small>興味を会話につなげる</small><p>「最近、{isAi ? "学校ではどんなことが楽しい？" : "どんな遊びが楽しい？"}」</p></div>
    </section>

    <section className="voice-hint-section voice-hint-points" aria-labelledby="voice-hint-points">
      <div className="voice-hint-section-title"><span>3</span><h4 id="voice-hint-points">伝えるときのポイント</h4></div>
      <ul>
        <li>結果ではなく、始めたことや続けたことをそのまま伝えます。</li>
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

  return <div className={`report-app ${view === "children" ? "children-view" : mode}`}>
    {view === "children" ? <ChildrenScreen onSelect={openOverview} openSheet={setSheet} /> : <>
      <header className={`app-header ${view === "overview" ? "overview-app-header" : ""}`}><button className="back-button" aria-label={view === "overview" ? "お子さま一覧に戻る" : "まとめに戻る"} onClick={view === "overview" ? returnToChildren : returnToOverview}><ChevronLeftIcon /></button><div className="page-heading">{view === "report" && mode === "learning" ? <IconBubble><ReaderIcon /></IconBubble> : view === "overview" ? <ChildPictogram tone={selectedChild.tone} compact /> : null}<div><span className="report-child-name">{selectedChild.name}さん</span><h1>{view === "overview" ? "レポート" : mode === "learning" ? "学習レポート" : "おしゃべりレポート"}</h1></div></div>{view === "report" ? <Segments items={periodItems} value={period} onChange={setPeriod} /> : null}</header>
      <MobileScroll key={`${selectedChild.id}-${view}-${mode}`} className={`report-scroll ${view === "overview" ? "overview-scroll" : ""}`}><main className="screen-content" data-testid="report-screen">{view === "overview" ? <ChildOverview child={selectedChild} openReport={openReport} openDetails={setSheet} /> : mode === "learning" ? <LearningReport period={period} openDetails={setSheet} child={selectedChild} /> : <ChatReport period={period} openDetails={setSheet} />}</main></MobileScroll>
      <nav className="bottom-nav" aria-label="レポート種別"><button type="button" tabIndex={-1} onPointerDown={(event) => event.preventDefault()} className={view === "overview" ? "active" : ""} onClick={returnToOverview}><PersonIcon /><span>まとめ</span></button><button type="button" tabIndex={-1} onPointerDown={(event) => event.preventDefault()} className={view === "report" && mode === "learning" ? "active" : ""} onClick={() => switchMode("learning")}><ReaderIcon /><span>学習</span></button><button type="button" tabIndex={-1} onPointerDown={(event) => event.preventDefault()} className={view === "report" && mode === "chat" ? "active" : ""} onClick={() => switchMode("chat")}><ChatBubbleIcon /><span>おしゃべり</span></button></nav>
    </>}
    <BottomSheet open={Boolean(sheet)} onOpenChange={(open) => !open && setSheet(null)} title={sheet ?? "詳細"} description={sheetIsChildAction ? "保護者の方が管理する情報です。" : sheetIsVoiceHint ? "今週の様子をもとに、使いやすい声かけ例をまとめました。" : "レポートから分かることを、やさしくまとめています。"} snap={sheetIsVoiceHint ? 0.82 : 0.55}>
      {sheetIsVoiceHint ? <VoiceHintDetail child={selectedChild} onClose={() => setSheet(null)} /> : <div className="detail-sheet-content">{sheetIsChildAction ? <PersonIcon className="sheet-person-icon" /> : <IconBubble><ReaderIcon /></IconBubble>}<h3>{sheetIsChildAction ? sheet : "取り組みを見つけるヒント"}</h3><p>{sheet === "お子さまを追加" ? "お子さまのプロフィール追加は、次のステップで設定できます。" : sheet?.includes("設定") ? "学年や表示名などのプロフィール情報を確認・変更できます。" : "結果だけでなく、始めたことや続けたことにも目を向けています。気になる話題も、お子さまの気持ちを断定せず、会話のきっかけとしてお伝えします。"}</p><button onClick={() => setSheet(null)}>{sheetIsChildAction ? "閉じる" : "レポートに戻る"}</button></div>}
    </BottomSheet>
  </div>;
}
