import { useMemo, useState } from "react";
import { BackpackIcon, BarChartIcon, ChatBubbleIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, LightningBoltIcon, MoonIcon, PieChartIcon, ReaderIcon } from "@radix-ui/react-icons";
import { BottomSheet, MobileScroll, useKeyboard } from "./mobile";

type Mode = "learning" | "chat";
const weekBars = [35, 48, 62, 45, 58, 72, 44];
const weekLabels = ["4/14\n(月)", "4/15\n(火)", "4/16\n(水)", "4/17\n(木)", "4/18\n(金)", "4/19\n(土)", "4/20\n(日)"];
const monthBars = [2.1, 2.7, 3.6, 4.0];

function IconBubble({ tone = "green", children }: { tone?: "green" | "blue" | "yellow"; children: React.ReactNode }) {
  return <span className={`icon-bubble ${tone}`}>{children}</span>;
}

function Segments({ items, value, onChange }: { items: string[]; value: string; onChange: (value: string) => void }) {
  return <div className="segments" role="tablist" aria-label="レポート期間">{items.map((item) => <button key={item} className={value === item ? "active" : ""} onClick={() => onChange(item)} role="tab" aria-selected={value === item}>{item}</button>)}</div>;
}

function CardTitle({ icon, title, action, onAction }: { icon: React.ReactNode; title: string; action?: string; onAction?: () => void }) {
  return <div className="card-title-row"><div className="card-title-main">{icon}<h2>{title}</h2></div>{action ? <button className="soft-action" onClick={onAction}>{action}<ChevronRightIcon /></button> : null}</div>;
}

function LearningReport({ period, openDetails }: { period: string; openDetails: (kind: string) => void }) {
  const isDay = period === "1日";
  const isMonth = period === "1か月";
  const title = isDay ? "今日の学習のまとめ" : isMonth ? "今月の学習のまとめ" : "今週の学習のまとめ";
  return <div className="report-stack learning-report">
    <section className="report-card summary-card green-wash">
      <CardTitle icon={<IconBubble><ReaderIcon /></IconBubble>} title={title} />
      <p className="lead">あいくんの学習の取り組みをもとに、{isDay ? "今日" : isMonth ? "今月" : "今週"}の様子をまとめました。</p>
      <div className="metric-grid learning-metrics">
        <article className="metric-tile"><IconBubble><ClockIcon /></IconBubble><div><span>平均学習時間</span><strong>{isDay ? "58" : isMonth ? "49" : "52"}<small>分/日</small></strong></div></article>
        <article className="metric-tile"><IconBubble tone="yellow"><MoonIcon /></IconBubble><div><span>学習に取り組んだ時間帯</span><strong className="medium">19時〜20時ごろ</strong></div></article>
        <article className="metric-tile"><IconBubble><BarChartIcon /></IconBubble><div><span>取り組んだ教科</span><strong>3<small>教科</small></strong></div></article>
      </div>
    </section>

    <section className="report-card chart-card">
      <CardTitle icon={<IconBubble><BarChartIcon /></IconBubble>} title={isMonth ? "4週間の学習時間" : "1週間の学習時間"} action="詳しく見る" onAction={() => openDetails("学習時間の詳細")} />
      <p className="lead">{isMonth ? "週ごと" : "1日ごと"}の学習時間の推移です。</p>
      <div className="bar-chart learning-chart" aria-label="学習時間の棒グラフ">{(isMonth ? monthBars : weekBars).map((value, index) => {
        const max = isMonth ? 4.5 : 80;
        return <div className="bar-item" key={index}><span className="bar-value">{value}{isMonth ? "時間" : "分"}</span><div className="bar soft-green" style={{ height: `${Math.max(22, value / max * 92)}px` }} /><span className="bar-label">{isMonth ? `${index + 1}週目` : weekLabels[index]}</span></div>;
      })}</div>
    </section>

    <div className="two-column-cards">
      <section className="report-card compact-list-card">
        <CardTitle icon={<IconBubble tone="blue"><ReaderIcon /></IconBubble>} title="取り組んだ科目・単元" />
        <p className="lead">今週よく取り組んだ内容です。</p>
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
      <div className="hint-copy"><IconBubble><ReaderIcon /></IconBubble><p>今週は算数を重点的に勉強したようです。<br />がんばっている様子を褒めてあげるのもよいかもしれません。</p></div>
      <img className="thinking-parent" src="assets/muchimon/mother-thinking.png" alt="子どもへの声かけを考える保護者" />
    </section>
  </div>;
}

function ChatReport({ period, openDetails }: { period: string; openDetails: (kind: string) => void }) {
  const isWeek = period === "1週間";
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
        <article className="metric-tile blue-tint"><IconBubble tone="blue"><ClockIcon /></IconBubble><div><span>おしゃべり機能の利用時間</span><strong>12.4<small>時間/月</small></strong></div></article>
        <article className="metric-tile blue-tint"><IconBubble tone="blue"><BarChartIcon /></IconBubble><div><span>利用が多かった時間帯</span><strong className="medium">20時〜21時ごろ</strong></div><MoonIcon className="large-moon" /></article>
      </div>
      <h3 className="chart-subtitle">週ごとの利用時間の推移</h3>
      <div className="bar-chart chat-chart" aria-label="週ごとのおしゃべり利用時間">{monthBars.map((value, index) => <div className="bar-item" key={index}><span className="bar-value">{value}時間</span><div className="bar soft-blue" style={{ height: `${value / 4 * 62}px` }} /><span className="bar-label">{index + 1}週目</span></div>)}</div>
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

export default function Prototype() {
  const keyboard = useKeyboard();
  const [mode, setMode] = useState<Mode>(() => window.location.hash === "#chat" ? "chat" : "learning");
  const [period, setPeriod] = useState(() => window.location.hash === "#chat" ? "1か月" : "1週間");
  const [sheet, setSheet] = useState<string | null>(null);
  const periodItems = useMemo(() => mode === "learning" ? ["1日", "1週間", "1か月"] : ["1か月", "1週間"], [mode]);
  const switchMode = (next: Mode) => { keyboard.hide(); window.history.replaceState(null, "", next === "chat" ? "#chat" : "#learning"); setMode(next); setPeriod(next === "learning" ? "1週間" : "1か月"); };
  return <div className={`report-app ${mode}`}>
    <header className="app-header"><button className="back-button" aria-label="戻る"><ChevronLeftIcon /></button><div className="page-heading">{mode === "learning" ? <IconBubble><ReaderIcon /></IconBubble> : null}<h1>{mode === "learning" ? "学習レポート" : "おしゃべりレポート"}</h1></div><Segments items={periodItems} value={period} onChange={setPeriod} /></header>
    <MobileScroll key={mode} className="report-scroll"><main className="screen-content" data-testid="report-screen">{mode === "learning" ? <LearningReport period={period} openDetails={setSheet} /> : <ChatReport period={period} openDetails={setSheet} />}</main></MobileScroll>
    <nav className="bottom-nav" aria-label="レポート種別"><button type="button" tabIndex={-1} onPointerDown={(event) => event.preventDefault()} className={mode === "learning" ? "active" : ""} onClick={() => switchMode("learning")}><ReaderIcon /><span>学習</span></button><button type="button" tabIndex={-1} onPointerDown={(event) => event.preventDefault()} className={mode === "chat" ? "active" : ""} onClick={() => switchMode("chat")}><ChatBubbleIcon /><span>おしゃべり</span></button></nav>
    <BottomSheet open={Boolean(sheet)} onOpenChange={(open) => !open && setSheet(null)} title={sheet ?? "詳細"} description="レポートから分かることを、やさしくまとめています。" snap={0.55}><div className="detail-sheet-content"><IconBubble><ReaderIcon /></IconBubble><h3>取り組みを見つけるヒント</h3><p>結果だけでなく、始めたことや続けたことにも目を向けています。気になる話題も、お子さまの気持ちを断定せず、会話のきっかけとしてお伝えします。</p><button onClick={() => setSheet(null)}>レポートに戻る</button></div></BottomSheet>
  </div>;
}
