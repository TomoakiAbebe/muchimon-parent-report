import { type PropsWithChildren, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { BackpackIcon, BarChartIcon, ChatBubbleIcon, CheckCircledIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, Cross2Icon, EnvelopeClosedIcon, ExitIcon, EyeClosedIcon, EyeOpenIcon, GearIcon, IdCardIcon, LightningBoltIcon, LockClosedIcon, MoonIcon, PersonIcon, PieChartIcon, PlusIcon, ReaderIcon, TrashIcon } from "@radix-ui/react-icons";
import { KeyboardInput, MobileScroll, useKeyboard, useKeyboardInsets, useScreenPortal } from "./mobile";
import PreviewViewportPicker, { type PreviewViewport } from "./PreviewViewportPicker";

type Mode = "learning" | "chat";
type View = "login" | "register" | "reset" | "children" | "overview" | "report";
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

function AppModal({ open, onOpenChange, title, description, children }: PropsWithChildren<{ open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string }>) {
  const keyboard = useKeyboard();
  const { bottomInset, availableHeight, isKeyboardVisible } = useKeyboardInsets();
  const { screenRef } = useScreenPortal();
  const portalContainer = screenRef.current ?? undefined;
  const close = () => { keyboard.hide(); onOpenChange(false); };
  return <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!nextOpen) close(); else onOpenChange(true); }}>
    <Dialog.Portal container={portalContainer} forceMount>
      <AnimatePresence>
        {open ? <>
          <Dialog.Overlay asChild forceMount><motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .16 }} /></Dialog.Overlay>
          <Dialog.Content asChild forceMount onOpenAutoFocus={(event) => event.preventDefault()}>
            <div className={`modal-layer${isKeyboardVisible ? " keyboard-visible" : ""}`} style={{ bottom: bottomInset }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
              <motion.div className="modal-card" style={{ maxHeight: Math.max(238, availableHeight - 76) }} initial={{ opacity: 0, scale: .94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .96, y: 8 }} transition={{ duration: .18 }}>
                <div className="modal-header"><div><Dialog.Title>{title}</Dialog.Title>{description ? <Dialog.Description>{description}</Dialog.Description> : null}</div><button className="modal-close" aria-label="閉じる" onClick={close}><Cross2Icon /></button></div>
                <div className="modal-content">{children}</div>
              </motion.div>
            </div>
          </Dialog.Content>
        </> : null}
      </AnimatePresence>
    </Dialog.Portal>
  </Dialog.Root>;
}
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

function AuthScreen({ view, onNavigate, onLogin }: { view: "login" | "register" | "reset"; onNavigate: (view: "login" | "register" | "reset") => void; onLogin: () => void }) {
  const keyboard = useKeyboard();
  const { isKeyboardVisible } = useKeyboardInsets();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const go = (nextView: "login" | "register" | "reset") => { keyboard.hide(); setResetSent(false); onNavigate(nextView); };

  if (view === "reset") return <div className={`auth-app${isKeyboardVisible ? " keyboard-visible" : ""}`}>
    <MobileScroll className="auth-scroll"><main className="auth-content auth-reset-content" data-testid="reset-screen">
      <div className="auth-brand"><span><LockClosedIcon /></span><b>ムチモン</b><small>保護者モード</small></div>
      {resetSent ? <section className="auth-success" aria-live="polite"><CheckCircledIcon /><h1>メールをご確認ください</h1><p>パスワード再設定用のリンクを送信しました。</p><button className="auth-primary" onClick={() => go("login")}>ログインへ戻る</button></section> : <>
        <header className="auth-heading"><span className="auth-heading-icon"><LockClosedIcon /></span><p>ログインでお困りの方へ</p><h1>パスワードの再設定</h1><span>ご登録の保護者メールアドレスへ、再設定用のリンクをお送りします。</span></header>
        <div className="auth-form"><label>メールアドレス<div className="auth-field"><EnvelopeClosedIcon /><KeyboardInput type="email" inputMode="email" autoComplete="email" placeholder="parent@example.com" /></div></label><button className="auth-primary" onClick={() => { keyboard.hide(); setResetSent(true); }}>再設定メールを送信</button></div>
        <button className="auth-text-button" onClick={() => go("login")}><ChevronLeftIcon />ログインへ戻る</button>
        <aside className="auth-help"><b>メールアドレスが分からない場合</b><p>お子さまのユーザーIDを添えて、お問い合わせください。</p></aside>
      </>}
    </main></MobileScroll>
  </div>;

  if (view === "register") return <div className={`auth-app${isKeyboardVisible ? " keyboard-visible" : ""}`}>
    <MobileScroll className="auth-scroll"><main className="auth-content auth-register-content" data-testid="register-screen">
      <button className="auth-back" aria-label="ログインへ戻る" onClick={() => go("login")}><ChevronLeftIcon /></button>
      <div className="auth-brand compact"><span><PersonIcon /></span><b>ムチモン</b><small>保護者モード</small></div>
      <header className="auth-heading"><p>はじめてご利用の方</p><h1>保護者アカウント登録</h1><span>保護者のメールアドレスで登録します。登録後、お子さまを追加できます。</span></header>
      <div className="auth-form"><label>メールアドレス<div className="auth-field"><EnvelopeClosedIcon /><KeyboardInput type="email" inputMode="email" autoComplete="email" placeholder="parent@example.com" /></div></label><label>パスワード<div className="auth-field"><LockClosedIcon /><KeyboardInput type={passwordVisible ? "text" : "password"} autoComplete="new-password" placeholder="8文字以上" /><button type="button" aria-label={passwordVisible ? "パスワードを隠す" : "パスワードを表示"} onClick={() => setPasswordVisible((visible) => !visible)}>{passwordVisible ? <EyeClosedIcon /> : <EyeOpenIcon />}</button></div></label><p className="auth-password-help">大文字・小文字・数字と記号を含む8文字以上で設定してください。</p><label>パスワード（確認）<div className="auth-field"><LockClosedIcon /><KeyboardInput type="password" autoComplete="new-password" placeholder="もう一度入力" /></div></label><label className="auth-consent"><input type="checkbox" /><span><u>利用規約</u>と<u>プライバシーポリシー</u>に同意します</span></label><button className="auth-primary" onClick={onLogin}>登録してはじめる</button></div>
      <button className="auth-text-button" onClick={() => go("login")}>すでにアカウントをお持ちの方</button>
    </main></MobileScroll>
  </div>;

  return <div className={`auth-app${isKeyboardVisible ? " keyboard-visible" : ""}`}>
    <MobileScroll className="auth-scroll"><main className="auth-content auth-login-content" data-testid="login-screen">
      <div className="auth-brand"><span><PersonIcon /></span><b>ムチモン</b><small>保護者モード</small></div>
      <header className="auth-heading"><p>おかえりなさい</p><h1>ログイン</h1><span>お子さまの今週の様子を確認しましょう。</span></header>
      <div className="auth-form"><label>メールアドレス<div className="auth-field"><EnvelopeClosedIcon /><KeyboardInput type="email" inputMode="email" autoComplete="email" placeholder="parent@example.com" /></div></label><label>パスワード<div className="auth-field"><LockClosedIcon /><KeyboardInput type={passwordVisible ? "text" : "password"} autoComplete="current-password" placeholder="パスワードを入力" /><button type="button" aria-label={passwordVisible ? "パスワードを隠す" : "パスワードを表示"} onClick={() => setPasswordVisible((visible) => !visible)}>{passwordVisible ? <EyeClosedIcon /> : <EyeOpenIcon />}</button></div></label><button className="auth-forgot" onClick={() => go("reset")}>パスワードをお忘れですか？</button><button className="auth-primary" onClick={onLogin}>ログイン<ChevronRightIcon /></button><p className="auth-prototype-note">このデザイン確認用画面では、未入力のままログインできます。</p></div>
      <div className="auth-divider"><span>はじめてご利用の方</span></div><button className="auth-secondary" onClick={() => go("register")}><PersonIcon />保護者アカウントを新規登録</button>
      <p className="auth-privacy"><LockClosedIcon />保護者の情報は安全に管理されます</p>
    </main></MobileScroll>
  </div>;
}

function ChildrenScreen({ onSelect, onManage, openAddChild, onLogout }: { onSelect: (child: Child) => void; onManage: (child: Child) => void; openAddChild: () => void; onLogout: () => void }) {
  return <div className="children-app">
    <MobileScroll className="children-scroll">
      <main className="children-content" data-testid="children-screen">
        <div className="children-account-row"><button className="children-logout" onClick={onLogout}><ExitIcon />ログアウト</button></div>
        <section className="children-hero">
          <div className="children-hero-copy"><h1>お子さまを選ぶ</h1><p>レポートを見たいお子さまを選んでください</p></div>
          <div className="pictogram-family" aria-hidden="true"><ChildPictogram tone="green" compact /><ChildPictogram tone="blue" compact /><ChildPictogram tone="yellow" compact /></div>
        </section>
        <div className="child-card-list">
          {children.map((child) => <article className={`child-card child-tone-${child.tone}`} key={child.id}>
            <button className="child-settings" aria-label={`${child.name}の設定`} onClick={(event) => { event.stopPropagation(); onManage(child); }}><GearIcon /></button>
            <div className="child-card-main">
              <div className="child-portrait"><ChildPictogram tone={child.tone} /></div>
              <div className="child-profile"><h2>{child.name}</h2><p>{child.grade}</p><div className={`child-highlight ${child.id === "ai" ? "learning" : "chatting"}`}>{child.id === "ai" ? <BarChartIcon /> : <ChatBubbleIcon />}<span>{child.id === "ai" ? <>今週 <strong>{child.learningDays}日</strong><br />取り組みました</> : <><strong>学校の話題が</strong><br />多く見られました</>}</span><ChevronRightIcon /></div></div>
            </div>
            <button className="view-report-button" onClick={() => onSelect(child)}>今週の声かけを見る<ChevronRightIcon /></button>
          </article>)}
        </div>
        <button className="add-child-button" onClick={openAddChild}><span><PlusIcon /></span>お子さまを追加</button>
        <p className="children-privacy">レポートは保護者の方だけが確認できます</p>
      </main>
    </MobileScroll>
  </div>;
}

type SettingsStage = "menu" | "payment" | "password" | "delete";

function ChildSettingsSheet({ child, stage, setStage, onOpenReport, onClose }: { child: Child; stage: SettingsStage; setStage: (stage: SettingsStage) => void; onOpenReport: () => void; onClose: () => void }) {
  const keyboard = useKeyboard();
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const goBack = () => { keyboard.hide(); setPasswordSaved(false); setDeleteConfirmed(false); setStage("menu"); };
  if (stage === "payment") return <div className="account-sheet account-subview">
    <button className="sheet-back-link" onClick={goBack}><ChevronLeftIcon />設定に戻る</button>
    <div className="account-section-icon payment"><IdCardIcon /></div><h3>お支払いの管理</h3><p className="account-lead">現在のプランと次回更新日を確認できます。</p>
    <div className="plan-card"><div><span>現在のプラン</span><strong>プレミアムプラン</strong></div><b>加入中</b><dl><dt>次回更新日</dt><dd>2026年12月28日</dd><dt>お支払い方法</dt><dd>カード末尾 4242</dd></dl></div>
    <button className="primary-sheet-button" onClick={onClose}>お支払い方法を変更</button>
  </div>;
  if (stage === "password") return <div className="account-sheet account-subview">
    <button className="sheet-back-link" onClick={goBack}><ChevronLeftIcon />設定に戻る</button>
    {passwordSaved ? <div className="sheet-success"><CheckCircledIcon /><h3>パスワードを変更しました</h3><p>次回から新しいパスワードをご利用ください。</p><button className="primary-sheet-button" onClick={goBack}>設定に戻る</button></div> : <><div className="account-section-icon password"><LockClosedIcon /></div><h3>パスワードを変更</h3><p className="account-lead">安全のため、現在のパスワードと新しいパスワードを入力してください。</p><div className="mobile-form"><label>現在のパスワード<KeyboardInput type="password" placeholder="現在のパスワード" autoComplete="current-password" /></label><label>新しいパスワード<KeyboardInput type="password" placeholder="8文字以上" autoComplete="new-password" /></label><p className="form-help">大文字・小文字・数字を含む8文字以上で設定してください。</p><button className="primary-sheet-button" onClick={() => { keyboard.hide(); setPasswordSaved(true); }}>変更内容を保存</button></div></>}
  </div>;
  if (stage === "delete") return <div className="account-sheet account-subview danger-subview">
    <button className="sheet-back-link" onClick={goBack}><ChevronLeftIcon />設定に戻る</button><div className="account-section-icon danger"><TrashIcon /></div><h3>アカウントを削除（退会）</h3><p className="account-lead">退会すると、すべてのお子さまのレポートと登録情報を確認できなくなります。</p>
    <div className="danger-note"><b>削除前にご確認ください</b><p>この操作は取り消せません。必要なレポートがある場合は、退会前にご確認ください。</p></div>
    {!deleteConfirmed ? <button className="danger-outline-button" onClick={() => setDeleteConfirmed(true)}>退会手続きへ進む</button> : <div className="delete-confirm"><p>本当に退会手続きを進めますか？</p><button className="danger-button" onClick={onClose}>アカウントを削除する</button><button className="cancel-sheet-button" onClick={() => setDeleteConfirmed(false)}>キャンセル</button></div>}
  </div>;
  return <div className="account-sheet">
    <div className="managed-child"><ChildPictogram tone={child.tone} compact /><div><h3>{child.name}さん</h3><p>{child.grade}</p></div><span>プレミアム加入中</span></div>
    <p className="renewal-date">次回更新日：2026年12月28日</p>
    <div className="account-action-list">
      <button onClick={() => setStage("payment")}><span className="account-action-icon payment"><IdCardIcon /></span><span><b>お支払いの管理</b><small>プラン・お支払い方法を確認</small></span><ChevronRightIcon /></button>
      <button onClick={onOpenReport}><span className="account-action-icon report"><ReaderIcon /></span><span><b>レポートを見る</b><small>{child.name}さんの今週の声かけを開く</small></span><ChevronRightIcon /></button>
      <button onClick={() => setStage("password")}><span className="account-action-icon password"><LockClosedIcon /></span><span><b>パスワードを変更</b><small>ログイン情報を更新</small></span><ChevronRightIcon /></button>
    </div>
    <button className="withdraw-link" onClick={() => setStage("delete")}><TrashIcon />ご自身のアカウントを削除（退会）<ChevronRightIcon /></button>
  </div>;
}

function AddChildSheet({ onClose }: { onClose: () => void }) {
  const keyboard = useKeyboard();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const idValid = /^[A-Za-z0-9]+$/.test(userId);
  const passwordValid = password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
  const submit = () => { if (!idValid || !passwordValid) { setSubmitted(true); return; } keyboard.hide(); setSubmitted(true); };
  const success = submitted && idValid && passwordValid;
  if (success) return <div className="add-child-sheet sheet-success"><CheckCircledIcon /><h3>お子さまを追加しました</h3><p>ユーザーID「{userId}」を、次回からお子さまのログインに使用できます。</p><button className="primary-sheet-button" onClick={onClose}>一覧に戻る</button></div>;
  return <div className="add-child-sheet"><div className="add-child-intro"><span><PlusIcon /></span><div><h3>お子さまを追加</h3><p>お子さまがログインに使うIDとパスワードを設定します。</p></div></div>
    <div className="mobile-form"><label>ユーザーID<KeyboardInput value={userId} onChange={(event) => setUserId(event.target.value)} autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="半角英数字で入力" aria-invalid={submitted && !idValid} /></label>{submitted && !idValid ? <p className="form-error">半角英数字で入力してください。</p> : <p className="form-help">例：makoto123</p>}
      <label>パスワード<KeyboardInput type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" placeholder="8文字以上" aria-invalid={submitted && !passwordValid} /></label>{submitted && !passwordValid ? <p className="form-error">8文字以上で、大文字・小文字・数字をすべて含めてください。</p> : <p className="form-help">8文字以上で、大文字・小文字・数字をすべて含めてください。</p>}
      <div className="password-checks"><span className={password.length >= 8 ? "met" : ""}>8文字以上</span><span className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? "met" : ""}>大文字・小文字</span><span className={/\d/.test(password) ? "met" : ""}>数字</span></div>
      <button className="primary-sheet-button" onClick={submit}>IDを発行して追加</button>
    </div>
  </div>;
}

function WeeklyUsageChart() {
  const usage = [{ day: "月", minutes: 35 }, { day: "火", minutes: 48 }, { day: "水", minutes: 62 }, { day: "木", minutes: 45 }, { day: "金", minutes: 58 }, { day: "土", minutes: 72 }, { day: "日", minutes: 44 }];
  return <section className="report-card weekly-usage-card" aria-labelledby="weekly-usage-title">
    <div className="weekly-usage-heading"><div><IconBubble><BarChartIcon /></IconBubble><div><span>学習・おしゃべり</span><h2 id="weekly-usage-title">今週の利用時間</h2></div></div><strong>合計 6.1時間</strong></div>
    <div className="weekly-usage-chart" aria-label="月曜日35分、火曜日48分、水曜日62分、木曜日45分、金曜日58分、土曜日72分、日曜日44分">
      {usage.map((item) => <div className="usage-bar-item" key={item.day}><span>{item.minutes}分</span><i style={{ height: `${Math.round(item.minutes * .62)}px` }} /><b>{item.day}</b></div>)}
    </div>
  </section>;
}

function ChildOverview({ child, openReport, openDetails }: { child: Child; openReport: (mode: Mode, period: string) => void; openDetails: (kind: string) => void }) {
  const isAi = child.id === "ai";
  return <div className="child-overview-stack" data-testid="child-overview-screen">
    <WeeklyUsageChart />
    <section className="report-card parent-next-card">
      <div className="parent-next-heading"><IconBubble tone="yellow"><LightningBoltIcon /></IconBubble><div><span>まずはこちら</span><h2>今週はこんな声かけから</h2></div></div>
      <p>{child.name}さんの頑張りと興味をもとに、今日から使える声かけを選びました。</p>
      <div className="weekly-prompt-preview"><small>続けたことを伝える</small><strong>「今週もよく続けていたね」</strong></div>
      <button className="parent-next-action" onClick={() => openDetails("今週の声かけ")}>声かけ例を詳しく見る<ChevronRightIcon /></button>
    </section>

    <section className="report-card combined-summary-card">
      <div className="overview-section-heading"><div><span>学習とおしゃべり</span><h2>今週のまとめ</h2></div><small>4/14〜4/20</small></div>
      <div className="combined-summary-grid">
        <article className="summary-panel learning-panel"><div className="summary-panel-title"><IconBubble><ReaderIcon /></IconBubble><span>学習</span></div><div className="summary-panel-copy"><strong>{child.learningDays}日</strong><small>平均52分/日</small><p>{isAi ? "算数を中心に3教科" : "国語を中心に継続"}</p></div><button className="summary-detail-action" onClick={() => openReport("learning", "1週間")}>詳細を見る<ChevronRightIcon /></button></article>
        <article className="summary-panel chat-panel"><div className="summary-panel-title"><IconBubble tone="blue"><ChatBubbleIcon /></IconBubble><span>おしゃべり</span></div><div className="summary-panel-copy"><strong>{isAi ? "学校 46%" : "遊びの話題"}</strong><small>20〜21時ごろ</small><p>{isAi ? "友だちや将来の話も増えました" : "好きな遊びの話が増えました"}</p></div><button className="summary-detail-action blue" onClick={() => openReport("chat", "1週間")}>詳細を見る<ChevronRightIcon /></button></article>
      </div>
    </section>
  </div>;
}

function LearningReport({ period, child }: { period: string; child: Child }) {
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

  </div>;
}

function ChatReport({ period }: { period: string }) {
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
  const [previewViewport, setPreviewViewport] = useState<PreviewViewport>("iphone");
  const [view, setView] = useState<View>(() => window.location.hash === "#chat" || window.location.hash === "#learning" ? "report" : window.location.hash === "#overview" ? "overview" : window.location.hash === "#children" ? "children" : window.location.hash === "#register" ? "register" : window.location.hash === "#reset" ? "reset" : "login");
  const [selectedChild, setSelectedChild] = useState<Child>(children[0]);
  const [mode, setMode] = useState<Mode>(() => window.location.hash === "#chat" ? "chat" : "learning");
  const [period, setPeriod] = useState(() => window.location.hash === "#chat" ? "1か月" : "1週間");
  const [sheet, setSheet] = useState<string | null>(null);
  const [managedChild, setManagedChild] = useState<Child>(children[0]);
  const [settingsStage, setSettingsStage] = useState<SettingsStage>("menu");
  const periodItems = useMemo(() => mode === "learning" ? ["1日", "1週間", "1か月"] : ["1か月", "1週間"], [mode]);
  const openOverview = (child: Child) => { keyboard.hide(); setSelectedChild(child); setView("overview"); window.history.replaceState(null, "", "#overview"); };
  const openReport = (nextMode: Mode, nextPeriod: string) => { keyboard.hide(); setMode(nextMode); setPeriod(nextPeriod); setView("report"); window.history.replaceState(null, "", nextMode === "chat" ? "#chat" : "#learning"); };
  const returnToOverview = () => { keyboard.hide(); setView("overview"); setSheet(null); window.history.replaceState(null, "", "#overview"); };
  const returnToChildren = () => { keyboard.hide(); setView("children"); setSheet(null); window.history.replaceState(null, "", "#children"); };
  const logout = () => { keyboard.hide(); setSheet(null); setSettingsStage("menu"); setView("login"); window.history.replaceState(null, "", "#login"); };
  const navigateAuth = (nextView: "login" | "register" | "reset") => { keyboard.hide(); setView(nextView); window.history.replaceState(null, "", `#${nextView}`); };
  const sheetIsChildAction = sheet === "お子さまの管理" || sheet === "お子さまを追加";
  const sheetIsVoiceHint = sheet === "今週の声かけ";
  const sheetPeriodLabel = "今週";
  const isAuthenticatedView = view === "children" || view === "overview" || view === "report";

  return <div className={`report-app preview-${previewViewport} ${view === "children" ? "children-view" : view === "login" || view === "register" || view === "reset" ? "auth-view" : mode}`}>
    <PreviewViewportPicker value={previewViewport} onChange={(nextViewport) => { keyboard.hide(); setPreviewViewport(nextViewport); }} />
    {isAuthenticatedView ? <aside className="desktop-sidebar" aria-label="保護者モードのナビゲーション">
      <div className="desktop-brand"><span><PersonIcon /></span><div><b>ムチモン</b><small>保護者モード</small></div></div>
      <div className="desktop-child-switcher"><ChildPictogram tone={selectedChild.tone} compact /><div><small>表示中のお子さま</small><b>{selectedChild.name}さん</b></div></div>
      <nav>
        <button className={view === "children" ? "active" : ""} onClick={returnToChildren}><PersonIcon /><span>お子さま一覧</span></button>
        <button className={view === "overview" ? "active" : ""} onClick={() => openOverview(selectedChild)}><LightningBoltIcon /><span>今週の声かけ</span></button>
        <button className={view === "report" && mode === "learning" ? "active" : ""} onClick={() => openReport("learning", "1週間")}><ReaderIcon /><span>学習レポート</span></button>
        <button className={view === "report" && mode === "chat" ? "active" : ""} onClick={() => openReport("chat", "1週間")}><ChatBubbleIcon /><span>おしゃべりレポート</span></button>
      </nav>
      <button className="desktop-logout" onClick={logout}><ExitIcon />ログアウト</button>
    </aside> : null}
    {view === "login" || view === "register" || view === "reset" ? <AuthScreen view={view} onNavigate={navigateAuth} onLogin={returnToChildren} /> : view === "children" ? <ChildrenScreen onSelect={openOverview} onManage={(child) => { setManagedChild(child); setSettingsStage("menu"); setSheet("お子さまの管理"); }} openAddChild={() => setSheet("お子さまを追加")} onLogout={logout} /> : <>
      <header className={`app-header ${view === "overview" ? "overview-app-header" : ""}`}><button className="back-button" aria-label={view === "overview" ? "お子さま一覧に戻る" : "今週の声かけに戻る"} onClick={view === "overview" ? returnToChildren : returnToOverview}><ChevronLeftIcon /></button><div className="page-heading">{view === "report" && mode === "learning" ? <IconBubble><ReaderIcon /></IconBubble> : view === "overview" ? <ChildPictogram tone={selectedChild.tone} compact /> : null}<div><span className="report-child-name">{selectedChild.name}さん</span><h1>{view === "overview" ? "今週の声かけ" : mode === "learning" ? "学習レポート" : "おしゃべりレポート"}</h1></div></div>{view === "report" ? <Segments items={periodItems} value={period} onChange={setPeriod} /> : null}</header>
      {view === "overview" ? <main className="screen-content overview-fixed-content" data-testid="report-screen"><ChildOverview child={selectedChild} openReport={openReport} openDetails={setSheet} /></main> : <MobileScroll key={`${selectedChild.id}-${view}-${mode}-${period}`} className="report-scroll"><main className="screen-content" data-testid="report-screen">{mode === "learning" ? <LearningReport period={period} child={selectedChild} /> : <ChatReport period={period} />}</main></MobileScroll>}
    </>}
    <AppModal open={Boolean(sheet)} onOpenChange={(open) => { if (!open) { keyboard.hide(); setSheet(null); setSettingsStage("menu"); } }} title={sheet ?? "詳細"} description={sheetIsChildAction ? "保護者の方が管理する情報です。" : sheetIsVoiceHint ? `${sheetPeriodLabel}の様子をもとに、使いやすい声かけ例をまとめました。` : "レポートから分かることを、やさしくまとめています。"}>
      {sheetIsVoiceHint ? <VoiceHintDetail child={selectedChild} mode={mode} period="1週間" combined onClose={() => setSheet(null)} /> : sheet === "お子さまの管理" ? <ChildSettingsSheet child={managedChild} stage={settingsStage} setStage={setSettingsStage} onOpenReport={() => { setSheet(null); openOverview(managedChild); }} onClose={() => setSheet(null)} /> : sheet === "お子さまを追加" ? <AddChildSheet onClose={() => setSheet(null)} /> : <div className="detail-sheet-content"><IconBubble><ReaderIcon /></IconBubble><h3>取り組みを見つけるヒント</h3><p>結果だけでなく、始めたことや続けたことにも目を向けています。気になる話題も、お子さまの気持ちを断定せず、会話のきっかけとしてお伝えします。</p><button onClick={() => setSheet(null)}>レポートに戻る</button></div>}
    </AppModal>
  </div>;
}
